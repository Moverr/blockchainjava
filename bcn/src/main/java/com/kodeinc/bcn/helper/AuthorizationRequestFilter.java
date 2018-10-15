package com.kodeinc.bcn.helper;

import static com.kodeinc.bcn.helper.Utilities.getStackTrace;
import com.kodeinc.bcn.helper.exceptions.UnauthorizedException;
import java.lang.annotation.Annotation;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Priority;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;

/**
 * This must be evaluated BEFORE the cache kicks in! => @Priority(200), cache
 * uses priority 300
 *
 * @author Mover
 */
@Priority(200)
public class AuthorizationRequestFilter implements ContainerRequestFilter {

    private static final Logger LOG = Logger.getLogger(AuthorizationRequestFilter.class.getName());

    @Context
    private ResourceInfo info;

    final String skippedPaths
            = "/tenant/v1c/mis/login,method:login"
            + "/tenant/v1c/mis/logout,method:logout"
            + "/tenant/v1c/mis/user,method:user"
            + "/tenant/v1c/mis/forgotPassword,method:forgotPassword"
            + "/tenant/v1c/mis/updatePassword,method:updatePassword"
            + "/loan/v1c,method:apply"
            + "/loan/v1c/,method:apply"
            + "/loan/v1c/upload,method:upload"
            + "/loan/v1c/upload/,method:upload"
            + "/client/masterdata/v1c,method:create"
            + "/client/masterdata/v1c/,method:create"
            + "/client/masterdata/v1c/update,method:update"
            + "/officer/masterdata/v1c,method:create"
            + "/officer/masterdata/v1c/,method:create"
            + "/officer/masterdata/v1c/update,method:update"
            + "/client/binarydata/v1c/upload,method:upload"
            + "/client/binarydata/v1c/findByIMG,method:findByIMG"
            + "/officer/binarydata/v1c/upload,method:upload"
            ///////////////////////////////////////////////////////
            + "/tenant/v1d/mis/login,method:login"
            + "/tenant/v1d/mis/reportEmail,method:reportEmail"
            + "/tenant/v1d/mis/logout,method:logout"
            + "/tenant/v1d/checkTenant,method:checkTenant"
            + "/tenant/v1d/mis/user,method:getUser"
            + "/tenant/v1d/mis/forgotPassword,method:forgotPassword"
            + "/tenant/v1d/mis/updatePassword,method:updatePassword"
            + "/tenant/v1d/mis/contactForm,method:contactForm"
            + "/tenant/v1d/dailyReport,method:dailyReport"
            + "/officer/v1d,method:create"
            + "/officer/v1d/,method:create"
            + "/client/v1d/upload,method:upload"
            + "/client/v1d/findByIMG,method:findByIMG"
            + "/officer/v1d/findByFMD,method:findByFMD"
            + "/officer/v1d/upload,method:upload"
            + "/status/v1d/health,method:health"
            + "/status/v1d/cockpitRestart,method:cockpitRestart"
            + "/health/v1d/full,method:fullHealthCheck" //this is the health check url
            + "/mobileofficeupdate/v1d/upload,method:upload"
            + "/user/v1d/login,method:login";

    @Override
    public void filter(ContainerRequestContext requestContext) {
        try {
            String logId = requestContext.getProperty("logId").toString();

            if (info == null || info.getResourceMethod() == null) {
                return;
            }

            for (Annotation annotation : info.getResourceMethod().getDeclaredAnnotations()) {
                if (annotation instanceof GET || annotation instanceof PUT || annotation instanceof POST) {
                    String path = requestContext.getUriInfo().getRequestUri().getPath();
                    String name = info.getResourceMethod().getName();
                    String identifier = path + ",method:" + name;
                    if (name != "activation") {
                        if (!skippedPaths.contains(identifier)) {

                            String tenantId = null;
                            String authentication = null;
                            String token = null;

                            MultivaluedMap<String, String> headerMap = requestContext.getHeaders();
                            MultivaluedMap<String, String> qParametersMap = requestContext.getUriInfo().getQueryParameters();
                            if (!headerMap.isEmpty()) {

                                if (headerMap.containsKey("authentication")) {
                                    if (headerMap.get("authentication").size() > 0) {
                                        authentication = headerMap.get("authentication").get(0);
                                    }
                                }

                                if (headerMap.containsKey("token")) {
                                    if (headerMap.get("token").size() > 0) {
                                        token = headerMap.get("token").get(0);
                                    }
                                } else if (qParametersMap.containsKey("token")) {
                                    // TODO, this should be deleted and its only to handle current LoanEndpoint
                                    if (qParametersMap.get("token").size() > 0) {
                                        token = qParametersMap.get("token").get(0);
                                    }
                                }

                                if (headerMap.containsKey("tenantId")) {
                                    if (headerMap.get("tenantId").size() > 0) {
                                        tenantId = headerMap.get("tenantId").get(0);
                                    }
                                }
                            }
//                        Tenantdata tenantdata = Utilities.getSchoolData(token, tenantId, authentication, logId);
//                        requestContext.setProperty("tenantdata", tenantdata);
//
//                        if (tenantdata != null && logId.contains("_")) {
//                            String[] parts = logId.split("_");
//                            String pureLogId = parts[parts.length - 1];
//                            requestContext.setProperty("logId", tenantdata.getTenantId() + "_" + pureLogId);
//                        }
                        }
                    }
                }
            }
        } catch (UnauthorizedException e) {
            throw e;
        } catch (WebApplicationException e) {
            if (e.getResponse().getStatus() == 401) {
                throw new UnauthorizedException();
            } else {
                throw e;
            }
        } catch (Exception e) {
            LOG.log(Level.SEVERE, "unexpected exception\n{0}", new Object[]{
                getStackTrace(e)
            });
        }

    }

}
