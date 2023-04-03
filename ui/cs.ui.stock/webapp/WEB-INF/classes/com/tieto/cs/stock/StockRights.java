package com.tieto.cs.stock;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lv.tietoenator.cs.auth.CsUser;
import lv.tietoenator.cs.opaa.OpaaConnector;

import org.apache.log4j.Logger;

import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;

/**
 * Class for managing access rights for STOCK solution.
 */
 @Slf4j
public class StockRights {
    private OpaaConnector opaa;
    private CsUser user;

    /**
     * Operational workplace STOCK OPAA action.
     */
    public static final String opaaAction = "SELF";

    /**
     * Operational workplace STOCK OPAA application identifier.
     */
    public static final String opaaApplication = "CS.STOCK";

    /**
     * Creates access rights class for current user and CS.STOCK application.
     *
     * @param session       Current HTTP session
     */
    public StockRights(final HttpSession session) {
        try {
            user = (CsUser) session.getAttribute("user");
            opaa = new OpaaConnector(opaaApplication, user);
        } catch (Exception e) {
            log.error("Failed to get OPAA permissions", e);
        }
    }

    /**
     * Checks if given object is allowed for current user.
     *
     * @param opaaObjectId  OPAA object identifier to check
     * @return {@code true} in case if object is allowed; {@code false} if object is not allowed
     */
    public boolean objectExists(final String opaaObjectId) {
        boolean allowed = false;
        try {
            allowed = opaa.checkPermissions(opaaObjectId, opaaAction);
            log.debug("    object=" + opaaObjectId + ", action=" + opaaAction + ", result=" + (allowed ? "allowed" : "NOT allowed"));
        } catch (Exception e) {
            log.error("Failed to check OPAA permissions", e);
        }
        return allowed;
    }

    /**
     * Gets list of all allowed OPAA objects for current user.
     *
     * @return List of all allowed OPAA objects for current user
     */
    public List<String> allowedObjects() {
        final List<String> result = new ArrayList<String>();
        try {
            final List<Map<String, String>> userPermissions = opaa.getUserPermissions();
            if (userPermissions != null) {
                for (final Map<String, String> userPermission : userPermissions) {
                    result.add(userPermission.get(OpaaConnector.OBJ_ID));
                }
            }
        } catch (Exception e) {
            log.error("Failed to get OPAA user permissions", e);
        }
        log.debug("Returning allowed OPAA objects: " + result);
        return result;
    }

    /**
     * Checks if application is allowed for current user.
     *
     * @return {@code true} in case if application is allowed; {@code false} if application is not allowed
     */
    public boolean applicationAllowed() {
        if (!objectExists(opaaApplication)) {
            log.warn("No sufficient access rights for showing STOCK management WEB GUI");
            return false;
        }
        return true;
    }
}
