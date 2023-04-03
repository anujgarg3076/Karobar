package com.tieto.cs.stock.utils;

import com.tieto.cs.stock.model.Terminal;
import org.apache.log4j.Logger;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import lv.tietoenator.cs.util.CsTuxedoHTTPCaller;
import lv.tietoenator.cs.util.Environment;

import com.tieto.cs.stock.dto.events.EventData;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * Class for calling Tuxedo services from Administration workplace.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TuxUtils {
    public static final String MEDIA_ID = "MEDIA_ID";
    public static final String MEDIA_NEW = "MEDIA_NEW";
    public static final String MEDIA_EVENT = "MEDIA_EVENT";
    public static final String MEDIA_EVENT_NOTE = "MEDIA_EVENT_NOTE";
    public static final String MEDIA_TYPE = "MEDIA_TYPE";
    public static final String TLMS_STATUS = "TLMS_STATUS";
    public static final String TLMS_PURCHASE_DATE = "TLMS_PURCHASE_DATE";
    private static final Logger log = Logger.getLogger(TuxUtils.class);
    private static final String httpUrl = Environment.getParameter("TUXEDO_HTTP_URL");

    /**
     * Calls Tuxedo with given XML data and returns response in JSON format
     *
     * @param service Tuxedo service name to call
     * @param xml     XML input data (will be wrapped in XML root tag named -FML- before sending
     * @return Json object with result
     */
    public static JSONObject callTuxedo(final String service, final String xml) throws Exception {
        final String requestXml = "<FML>" + xml + "</FML>";

        log.debug("Request: " + requestXml); // TODO: move to TRACE level when finished developing
        final String responseXml = CsTuxedoHTTPCaller.excutePost(httpUrl + service, requestXml);
        log.debug("Response: " + responseXml); // TODO: move to TRACE level when finished developing
        if (responseXml == null) {
            throw new Exception();
        }
        try {
            JSONObject response = XML.toJSONObject(responseXml, true);
            // keepStrings=true because JSON-java was designed by a bunch of doped up squirrels.
            //
            // * optLong - performs automatic conversion, returns default if failed or value not exists
            // * getLong - performs automatic conversion, throws if failed or value not exists
            // * optString - performs automatic conversion (via Object.toString), returns default if value not exists
            // * getString - throws if value is not a String!!!
            //
            // So forcing JSONObjects parsed from XML to store all stuff as strings still gives us
            // sensible get/optLong, and working getString, while default magic behavior completely
            // breaks getString.
            if (response.has("FML")) {
                return response.getJSONObject("FML");
            } else {
                throw new Exception();
            }
        } catch (Exception ex) {
            log.error("Exception calling tuxedo: ", ex);
            throw new Exception();
        }
    }

    /**
     * Create new media
     *
     * @throws JSONException
     */
    public static JSONObject mediaNew(Terminal terminal, String assembleStatus, String registrationDateTime, Map<String, String> tlmsAttributes) throws Exception {
        JSONObject xml = new JSONObject();
        xml.put(MEDIA_TYPE, terminal.getType());

        tlmsAttributes.put(TLMS_STATUS, assembleStatus);
        tlmsAttributes.put(TLMS_PURCHASE_DATE, registrationDateTime);

        tlmsAttributes.forEach((name, value) -> xml.put(name, value));

        log.debug("MEDIA_NEW xml: " + XML.toString(xml));
        return callTuxedo(MEDIA_NEW, XML.toString(xml));
    }

    /**
     * Post change state media event
     *
     * @throws JSONException
     */
    public static JSONObject mediaEvent(EventData event, String status) throws Exception {
        JSONObject xml = new JSONObject();
        xml.put(MEDIA_ID, event.getId());
        xml.put(MEDIA_EVENT, event.getEvent());
        xml.put(MEDIA_EVENT_NOTE, event.getNote());
        xml.put(TLMS_STATUS, status);

        log.debug("MEDIA_EVENT xml: " + XML.toString(xml));
        return callTuxedo(MEDIA_EVENT, XML.toString(xml));
    }

    /**
     * Post update attributes media event
     *
     * @throws JSONException
     */
    public static JSONObject mediaUpdate(Terminal terminal, Map<String, String> tlmsAttributes) throws Exception {
        JSONObject xml = new JSONObject();
        xml.put(MEDIA_ID, terminal.getId());
        xml.put(MEDIA_EVENT, "NOUPDATE");
        xml.put(MEDIA_EVENT_NOTE, "REST API UPDATE");

        tlmsAttributes.forEach((name, value) -> xml.put(name, value));

        log.debug("MEDIA_EVENT xml: " + XML.toString(xml));
        return callTuxedo(MEDIA_EVENT, XML.toString(xml));
    }
}
