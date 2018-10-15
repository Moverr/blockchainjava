package com.kodeinc.bcn.db.helper;

import java.io.IOException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.MultivaluedMap;

/**
 * TODO: remove when only operation within the process engine
 *
 * @author podolak
 */
public class CORSResponseFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {
        // TODO: check if this is really needed in production
        // I think it is needed I cockpit development is done on the MIS repository, but not in prod
        MultivaluedMap<String, Object> headers = responseContext.getHeaders();

        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET,POST,PUT");
        headers.add("Access-Control-Allow-Headers", "tenantId, username, password, authentication,officeId, Content-Type, data");
        headers.add("Access-Control-Expose-Headers", "ETag");
    }

}
