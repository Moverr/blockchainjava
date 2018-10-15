package com.kodeinc.bcn.db.helper.logfilters;

 
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.Priority;
import javax.ws.rs.ProcessingException;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import org.glassfish.jersey.server.ContainerRequest;

@Priority(100)
public class LogInputRequestFilter implements ContainerRequestFilter {

    private static final Logger LOG = Logger.getLogger(LogInputRequestFilter.class.getName());

    public SchoolData schoolData = null;
    @Context
    private UriInfo uriInfo;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        try {
            LOG.log(Level.INFO, "------------------------------ session start -----------------------------------");
            String logId = Utilities.getLogId();

            if (requestContext.getHeaderString("schoolname") != null) {
                LOG.log(Level.INFO, "------------------------------ MOVER KIOLO -----------------------{0}------------", requestContext.getHeaderString("schoolname"));

                schoolData = Utilities.getSchoolData(requestContext.getHeaderString("schoolname"), null, logId);
                //todo: make sure that the school data exists
                LOG.log(Level.INFO, "------------------------------ pass pass me -----------------------{0}------------", schoolData.getExternalId());

                // validate school_data
                logId = requestContext.getHeaderString("schoolname") + "_" + logId;
            } else {
                logId = "unknown_shool" + logId;
            }

            requestContext.setProperty("logId", logId);
            String logString = logId + " ::";

            ContainerRequest request = (ContainerRequest) requestContext;

            logString += "\n\tPath=" + uriInfo.getAbsolutePath();
            logString += "\n\tMethod=" + request.getMethod();

            if (!requestContext.getHeaders().isEmpty()) {
                logString += "\n\tHeaders=" + requestContext.getHeaders();
            }
            if (!uriInfo.getPathParameters().isEmpty()) {
                logString += "\n\tPathParameters=" + uriInfo.getPathParameters().toString();
            }
            if (!uriInfo.getQueryParameters().isEmpty()) {
                logString += "\n\tQueryParameters=" + uriInfo.getQueryParameters().toString();
            }

            if (requestContext.hasEntity() && request.getLength() > 2) {
                request.bufferEntity();
                logString += "\n\tbody=" + Utilities.readAsString(request.getEntityStream());
            } else {
                logString += "\n\tBody=<none>";
            }
            LOG.log(Level.INFO, logString);
        } catch (IOException | ProcessingException er) {

            throw er;
        }

    }

}
