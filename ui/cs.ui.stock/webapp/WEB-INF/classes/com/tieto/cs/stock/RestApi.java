package com.tieto.cs.stock;

import com.fasterxml.jackson.databind.MapperFeature;
import com.tieto.cs.jpa.ContextHolder;

import com.tieto.cs.stock.dto.configuration.Field;
import com.tieto.cs.stock.dto.status.post.terminal.PostTerminalStatus;
import com.tieto.cs.stock.mapper.TerminalMapper;
import com.tieto.cs.stock.model.Terminal;
import com.tieto.cs.stock.services.TerminalStockService;
import com.tieto.cs.stock.utils.*;
import com.tieto.cs.stock.dto.events.EventData;
import com.tieto.cs.stock.dto.status.common.Status;
import com.tieto.cs.stock.dto.groups.GroupStatistics;

import com.tieto.tlms_services_non_spring.service.TlmsService;
import com.tieto.tlms_services_non_spring.service.terminal.TerminalService;
import com.tieto.tlms_services_non_spring.service.MediaTypeStatusService;

import com.tieto.mda_services.parameters.Sorting;

import com.tieto.mda_services_non_spring.service.lcm.LcmService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.*;
import java.util.Date;

import java.text.SimpleDateFormat;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.ws.rs.BadRequestException;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.json.*;

@Slf4j
@Path("stock")
public final class RestApi {
    private static final String PERSISTENCE_CONTEXT = "stock";
    private static final String INSUFFICIENT_RIGHTS_ERROR_MESSAGE = "Insufficient rights for the Terminal Stock";
    private static final String DTABLE_OWNER = "cs.ui.tlms";
    private static final String DTABLE_SCOPE = "DEFAULT";
    private static final String ASSEMBLE_ACTION = "ASSEMBLE";
    private static final String SUSPEND_STATUS = "0002";
    private static final String DATE_FORMAT_PATTERN = "yyyyMMddHHmmss";
    private static final String INPRODUCTION_STATE = "INPRODUCTION";
    private static final String VIEW_ALL_TERMINALS_RSQL = "type==**";
    private static final String FIND_ATTR_REF_NAME_RSQL_OP = "mediaRef==";
    private static final String ENTITY_ALL_TERMINALS_RSQL = "mediaType.mediaType==**";

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private boolean accessAllowed(final HttpSession session) {
        StockRights rights = new StockRights(session);
        return !rights.applicationAllowed() ? false : true;
    }

    private EntityManager getEntityManager() throws Exception {
        return ContextHolder.getManager(PERSISTENCE_CONTEXT)
                .orElseThrow(() -> new Exception("Failed to get persistence context!"));
    }

    private JSONObject prepareErrorResponse(String errorMessage) throws JsonProcessingException {
        JSONObject json = new JSONObject();
        json.put("data", new JSONArray());

        Status status = new Status(Constant.StatusType.ERROR, errorMessage);
        json.put("status", new JSONObject(MAPPER.writeValueAsString(status)));

        return json;
    }

    private JSONObject prepareResponse(Status status, Object jsonObj) throws JsonProcessingException {
        JSONObject json = new JSONObject();
        json.put("data", jsonObj);

        json.put("status", new JSONObject(MAPPER.writeValueAsString(status)));

        return json;
    }

    private JSONObject prepareResponse(PostTerminalStatus status) throws JsonProcessingException {
        JSONObject json = new JSONObject();
        json.put("status", new JSONObject(status));
        return json;
    }

    private JSONObject prepareResponse(Object jsonObj) throws JsonProcessingException {
        return prepareResponse(new Status(), jsonObj);
    }


    @GET
    @Path("terminals")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTerminal(@Context HttpServletRequest request,
                                   @QueryParam("filters") String queryFilters,
                                   @QueryParam("sorting") String querySorting,
                                   @QueryParam("start") int start,
                                   @QueryParam("size") int size) throws Exception {

        if (!accessAllowed(request.getSession())) {
            return Response.status(Response.Status.FORBIDDEN).entity(INSUFFICIENT_RIGHTS_ERROR_MESSAGE).build();
        }

        EntityManager em = getEntityManager();

        try {
            if (start < 0 || size <= 0) {
                throw new BadRequestException("Incorrect paging parameters!");
            }

            List<Terminal> terminals;

            var sorting = Stream.of(MAPPER.readValue(querySorting, Sorting[].class))
                    .findFirst()
                    .orElse(null);

            if (queryFilters.equals(VIEW_ALL_TERMINALS_RSQL)
                    && (sorting == null || Constant.TerminalMedia.PROPERTIES.containsKey(sorting.getId()))) {
                // If all terminal retrieval is requested (w/ Media specific sorting and w/o filtering)
                // then query data using Media entity (findTerminalMedias service).
                // This is faster than using R_STOCK_TERMINALS view (findTerminals service).
                TerminalService service = new TerminalService(em);
                if (sorting != null) {
                    sorting.setId(Constant.TerminalMedia.PROPERTIES.get(sorting.getId()));
                }
                var medias = service.findTerminalMedias(ENTITY_ALL_TERMINALS_RSQL, start, size, sorting);
                terminals = medias.stream().map(m -> TerminalMapper.mapToTerminal(m)).collect(Collectors.toList());
            } else {
                // If filtering and/or sorting is applied then retrieve data via R_STOCK_TERMINALS view (findTerminals service).
                TerminalStockService service = new TerminalStockService(em);
                terminals = service.findTerminals(queryFilters, start, size, sorting);
            }

            return Response.ok(prepareResponse(new JSONArray(terminals)).toString()).build();

        } catch (Exception e) {
            log.error("RestApi::GET::terminals::returnResponse::err: " + e.toString());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error calling GET domains").build();
        } finally {
            em.close();
        }
    }

    @POST
    @Path("terminals")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response registerTerminals(@Context HttpServletRequest request, String body) throws Exception {
        if (!accessAllowed(request.getSession())) {
            return Response.status(Response.Status.FORBIDDEN).entity(INSUFFICIENT_RIGHTS_ERROR_MESSAGE).build();
        }

        EntityManager em = getEntityManager();
        var status = new PostTerminalStatus();

        try {
            MAPPER.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
            var newTerminals = MAPPER.readValue(body, Terminal[].class);
            MAPPER.disable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);

            // All terminals within the batch will have the same registration date/time
            SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_PATTERN);
            var registrationDateTime = sdf.format(new Date());

            TlmsService tlmsService = null;
            MediaTypeStatusService mediaTypeStatusService = null;
            var terminalService = new TerminalService(em);

            for (var terminal : newTerminals) {
                var terminalTypeName = terminal.getType();

                //
                var terminalTypeData = CacheUtils.TYPE_CACHE.get(terminalTypeName);

                if (terminalTypeData == null) {
                    tlmsService = tlmsService == null ? new TlmsService(em) : tlmsService;

                    var typeOpt = tlmsService.getTerminalType(terminalTypeName);
                    if (!typeOpt.isPresent()) { // no type found failed statistics
                        log.error("RestApi::POST::terminals: No terminal type found: " + terminalTypeName);
                        status.addFailed(terminalTypeName, "No terminal type found");
                        continue;
                    } else {
                        terminalTypeData = new CacheUtils.TerminalTypeData(typeOpt.get().getRefAttrName().toUpperCase());
                        CacheUtils.TYPE_CACHE.put(terminalTypeName, terminalTypeData);
                    }
                }
                var tlmsAttributes = EntityUtils.getTerminalAttributeFields(terminal);
                var refAttrName = terminalTypeData.getRefAttrName();
                var refAttrValue = tlmsAttributes.get(refAttrName).trim();

                if (!StringUtils.isBlank(terminal.getTlms_terminal_id())) {
                    log.error("RestApi::POST::terminals: Terminal registration with terminal id: {} is not allowed", terminal.getTlms_terminal_id());
                    status.addFailed(terminalTypeName, "Terminal id attribute is not allowed");
                    continue;
                }

                if (StringUtils.isBlank(tlmsAttributes.get(refAttrName))) {
                    log.error("RestApi::POST::terminals: No or invalid REF_ATTR_NAME provided");
                    status.addFailed(terminalTypeName, "No or invalid REF_ATTR_NAME", EntityUtils.toAttributeList(tlmsAttributes));
                    continue;
                }

                if (!terminalService.findTerminalMedias(FIND_ATTR_REF_NAME_RSQL_OP + refAttrValue, 0, 1, null).isEmpty()) {
                    log.warn("RestApi::POST::terminals: Media with such reference already exist " + refAttrValue);
                    status.addSkipped(terminalTypeName, "Media with such reference already exist", EntityUtils.toAttributeList(tlmsAttributes));
                    continue;
                }
                //

                var key = new CacheUtils.TypeStatusKey(terminalTypeName, INPRODUCTION_STATE, ASSEMBLE_ACTION);
                var terminalAssembleStatus = CacheUtils.TYPE_STATUS_CACHE.get(key);
                String assembleStatus = SUSPEND_STATUS;

                if (terminalAssembleStatus != null) {
                    assembleStatus = terminalAssembleStatus;
                } else {
                    mediaTypeStatusService = mediaTypeStatusService == null ? new MediaTypeStatusService(em, DTABLE_OWNER, DTABLE_SCOPE) : mediaTypeStatusService;

                    var typeStatus = mediaTypeStatusService.getMediaTypeStatus(terminalTypeName).get();
                    assembleStatus = typeStatus.getAttrs().stream()
                            .filter(attr -> attr.getAction().equals(ASSEMBLE_ACTION))
                            .map(attr -> attr.getNextStatus())
                            .findFirst()
                            .orElse(SUSPEND_STATUS);
                    CacheUtils.TYPE_STATUS_CACHE.put(key, assembleStatus);
                }

                var res = TuxUtils.mediaNew(terminal, assembleStatus, registrationDateTime, tlmsAttributes);

                String error = res.getString("MEDIA_STRERROR");
                if (!error.equals("Success")) {
                    log.error("RestApi::POST::terminals::returnResponse::err: " + error);
                    status.addFailed(terminalTypeName, "Failed to register terminal", EntityUtils.toAttributeList(tlmsAttributes));
                    continue;
                }

                status.addSucceeded();
            }

            return Response.ok(prepareResponse(status).toString()).build();

        } catch (Exception e) {
            log.error("RestApi::POST::terminals::returnResponse::err: " + e.toString());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error calling POST domains").build();
        } finally {
            em.close();
        }
    }

    @PATCH
    @Path("terminals")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTerminalAttributes(@Context HttpServletRequest request, String body) throws Exception {
        if (!accessAllowed(request.getSession())) {
            return Response.status(Response.Status.FORBIDDEN).entity(INSUFFICIENT_RIGHTS_ERROR_MESSAGE).build();
        }

        EntityManager em = getEntityManager();
        var status = new PostTerminalStatus();

        try {
            MAPPER.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
            var terminal = MAPPER.readValue(body, Terminal.class);
            MAPPER.disable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);

            var terminalTypeName = terminal.getType();

            if (StringUtils.isBlank(terminalTypeName) || terminal.getId() == null) {
                log.error("RestApi::PATCH::terminals: Missing mandatory mediaId or mediaType attributes");
                status.addFailed(terminalTypeName, "Missing mandatory attributes");
                return Response.ok(prepareResponse(status).toString()).build();
            }

            var tlmsAttributes = EntityUtils.getTerminalAttributeFields(terminal);

            if (terminal.getTlms_terminal_id() != null || terminal.getTlms_serial_no() != null) {
                log.error("RestApi::PATCH::terminals: Update isn't allowed if new terminal id or serial number is provided");
                status.addFailed(terminalTypeName, "Update with forbidden attributes");
                return Response.ok(prepareResponse(status).toString()).build();
            }

            var res = TuxUtils.mediaUpdate(terminal, tlmsAttributes);
            String error = res.getString("MEDIA_STRERROR");
            if (!error.equals("Success")) {
                log.error("RestApi::PATCH::terminals::returnResponse::err: " + error);
                status.addFailed(terminalTypeName, "Failed to update terminal", EntityUtils.toAttributeList(tlmsAttributes));
                return Response.ok(prepareResponse(status).toString()).build();
            }

            status.addSucceeded();
            return Response.ok(prepareResponse(status).toString()).build();

        } catch (Exception e) {
            log.error("RestApi::PATCH::terminals::returnResponse::err: " + e.toString());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error calling PATCH domains").build();
        } finally {
            em.close();
        }
    }

    @GET
    @Path("groups")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTerminalGroups(@Context HttpServletRequest request) throws Exception {

        if (!accessAllowed(request.getSession())) {
            return Response.status(Response.Status.FORBIDDEN).entity(INSUFFICIENT_RIGHTS_ERROR_MESSAGE).build();
        }

        EntityManager em = getEntityManager();

        try {

            TerminalStockService service = new TerminalStockService(em);
            List<GroupStatistics> groups = service.getTerminalGroupStatistics();

            return Response.ok(prepareResponse(new JSONArray(groups)).toString()).build();

        } catch (Exception e) {
            log.error("RestApi::GET::groups::returnResponse::err: " + e.toString());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error calling GET domains").build();
        } finally {
            em.close();
        }
    }

    @GET
    @Path("configuration/fields")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFieldConfiguration(@Context HttpServletRequest request) throws Exception {

        if (!accessAllowed(request.getSession())) {
            return Response.status(Response.Status.FORBIDDEN).entity(INSUFFICIENT_RIGHTS_ERROR_MESSAGE).build();
        }

        EntityManager em = getEntityManager();

        try {
            LcmService lcmService = new LcmService(em);

            var refData = lcmService.getRefDataItemsByType(Constant.RefData.Type.STOCK_ATTRIBUTE);

            var fields = refData
                    .stream()
                    .map(rd -> new Field(rd.getCode().toLowerCase(), rd.getName())).collect(Collectors.toSet());

            return Response.ok(prepareResponse(new JSONArray(fields)).toString()).build();

        } catch (Exception e) {
            log.error("RestApi::GET::configuration::fields::returnResponse::err: " + e.toString());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error calling GET domains").build();
        } finally {
            em.close();
        }
    }

    @POST
    @Path("events")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postEvent(@Context HttpServletRequest request, String body) throws Exception {
        if (!accessAllowed(request.getSession())) {
            return Response.status(Response.Status.FORBIDDEN).entity(INSUFFICIENT_RIGHTS_ERROR_MESSAGE).build();
        }

        EntityManager em = getEntityManager();
        var status = new PostTerminalStatus();

        try {
            var mediaTypeStatusService = new MediaTypeStatusService(em, DTABLE_OWNER, DTABLE_SCOPE);

            MAPPER.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);
            var events = MAPPER.readValue(body, EventData[].class);
            MAPPER.disable(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES);

            String nextSatus;

            for (var event : events) {
                var key = new CacheUtils.TypeStatusKey(event.getType(), event.getCurrentState(), event.getEvent());
                var ns = CacheUtils.TYPE_STATUS_CACHE.get(key);
                if (ns != null) {
                    nextSatus = ns;
                } else {
                    var typeStatus = mediaTypeStatusService.getMediaTypeStatus(event.getType()).get();
                    nextSatus = typeStatus.getAttrs().stream()
                            .filter(attr -> attr.getAction().equals(event.getEvent()) && attr.getCurrentState().equals(event.getCurrentState()))
                            .map(attr -> attr.getNextStatus())
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException(String.format("No status for %s - %s - %s)", event.getType(), event.getCurrentState(), event.getEvent())));
                    CacheUtils.TYPE_STATUS_CACHE.put(key, nextSatus);
                }

                var res = TuxUtils.mediaEvent(event, nextSatus);

                String error = res.getString("MEDIA_STRERROR");
                if (!error.equals("Success")) {
                    log.error("RestApi::POST::events::returnResponse::err: " + error);
                    status.addFailed(event.getType(), "Failed to post event " + event.getEvent());
                } else {
                    status.addSucceeded();
                }
            }

            return Response.ok(prepareResponse(status).toString()).build();

        } catch (Exception e) {
            log.error("RestApi::POST::events::returnResponse::err: " + e.toString());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Internal server error calling POST domains").build();
        } finally {
            em.close();
        }
    }
}