package com.kodeinc.bcn.helper.logfilters;

import com.kodeinc.bcn.helper.Utilities;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Priority;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.ext.Provider;
import org.glassfish.jersey.server.ContainerResponse;

/**
 *
 * @author mover
 */
@Provider
@Priority(100)
public class LogOutputResponseFilter implements ContainerResponseFilter {

    private static final Logger LOG = Logger.getLogger(LogOutputResponseFilter.class.getName());

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        try {
            String userAgent = requestContext.getHeaderString("User-Agent");
            if (userAgent != null && userAgent.contains("ELB-HealthChecker")) {
                return;
            }

//            requestContext.getPropertyNames().stream().forEach((propertyName) -> {
//                System.out.println(propertyName + " :: " + requestContext.getProperty(propertyName));
//            });
            Object logIdObject = requestContext.getProperty("logId");
            String logId = logIdObject == null ? "unknown tenant" : logIdObject.toString();
            String logString = logId + " :: logging outgoing response\n\tStatus=" + responseContext.getStatus();
            if (responseContext instanceof ContainerResponse) {
                ContainerResponse response = (ContainerResponse) responseContext;

                if (responseContext.hasEntity() && response.getLength() > 2) {
                    logString += "\n\tbody=" + response.getEntity();
                } else {
                    logString += "\n\tBody=<none>";
                }
            }
            LOG.log(Level.INFO, logString);
            LOG.log(Level.INFO, "{0} ::\n------------------------------ session end -------------------------------------", new Object[]{logId});
        } catch (Exception e) {
            LOG.log(Level.SEVERE, "unexpected exception\n{0}", new Object[]{Utilities.getStackTrace(e)});
        }

    }

}
