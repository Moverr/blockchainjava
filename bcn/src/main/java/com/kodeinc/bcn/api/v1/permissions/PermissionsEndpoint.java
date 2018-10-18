/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.permissions;
 
import com.kodeinc.bcn.api.v1.abstracts.AbstractEndpoint;
import com.kodeinc.bcn.api.v1.accounts.entities.AuthenticationResponse;
import com.kodeinc.bcn.api.v1.permissions.entities.PermissionsResponse;
import com.kodeinc.bcn.api.v1.permissions.entities._Permission;
import com.kodeinc.bcn.api.v1.users.UserService;
import java.util.List;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author mover 5/19/2018
 */
public class PermissionsEndpoint extends AbstractEndpoint<_Permission, PermissionsResponse> {

    private static final Logger LOG = Logger.getLogger(PermissionsEndpoint.class.getName());
    @Context
    private ContainerRequestContext context;
    private AuthenticationResponse authentication = null;
    private PermissionsService service;

    public PermissionsEndpoint() {
        service = new PermissionsService();
    }

    @Override
    public void validate(String authentication) throws Exception {
        this.authentication = UserService.getInstance().validateAuthentication( authentication);
    }

    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Override
    public List<PermissionsResponse> list(
            @DefaultValue("0") @QueryParam("offset") int offset,
            @DefaultValue("50") @QueryParam("limit") int limit,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest
    ) throws Exception {
        try {
            validate( authentication);
            String logId = context.getProperty("logId").toString();
            return service.list( offset, limit, this.authentication);
        } catch (WebApplicationException er) {
            throw er;
        } catch (Exception er) {
            er.printStackTrace();
            throw er;
        }
    }

}
