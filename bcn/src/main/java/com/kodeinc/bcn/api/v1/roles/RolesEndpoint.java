/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.roles;

import com.codemovers.scholar.engine.api.v1.abstracts.AbstractEndpoint;
import com.codemovers.scholar.engine.api.v1.accounts.entities.AuthenticationResponse;
import com.codemovers.scholar.engine.api.v1.roles.entities.RoleResponse;
import com.codemovers.scholar.engine.api.v1.roles.entities._Role;
import com.codemovers.scholar.engine.api.v1.users.UserService;
import com.codemovers.scholar.engine.api.v1.users.UsersEndpoint;
import com.codemovers.scholar.engine.db.entities.SchoolData;
import static com.codemovers.scholar.engine.helper.Utilities.tenantdata;
import com.codemovers.scholar.engine.helper.exceptions.BadRequestException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author mover 3/06/2018
 */
@Path("/")
public class RolesEndpoint extends AbstractEndpoint<_Role, RoleResponse> {

    private static final Logger LOG = Logger.getLogger(RolesEndpoint.class.getName());
    @Context
    private ContainerRequestContext context;

    private RolesService service = null;
    private AuthenticationResponse authentication = null;

    public RolesEndpoint() {
        service = new RolesService();
    }

    @Override
    public void validate(SchoolData schoolData, String authentication) throws Exception {
        this.authentication = UserService.getInstance().validateAuthentication(schoolData, authentication);
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    @Override
    public RoleResponse create(_Role entity, @HeaderParam("authentication") String authentication, @Context HttpServletRequest httpRequest) throws Exception {
        try {
            validate(tenantdata, authentication);
            return service.create(tenantdata, entity, this.authentication);
        } catch (BadRequestException exception) {
            throw exception;
        } catch (Exception ex) {
            Logger.getLogger(UsersEndpoint.class.getName()).log(Level.SEVERE, null, ex);
            ex.printStackTrace();
            throw ex;
        }
    }

    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Override
    public List<RoleResponse> list(
            @DefaultValue("0") @QueryParam("offset") int offset,
            @DefaultValue("50") @QueryParam("limit") int limit,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest
    ) throws Exception {
        try {
            validate(tenantdata, authentication);
            String logId = context.getProperty("logId").toString();
            return service.list(tenantdata, offset, limit, this.authentication);
        } catch (WebApplicationException er) {
            throw er;
        } catch (Exception er) {
            er.printStackTrace();
            throw er;
        }
    }

    @Path("{id}")
    @Override
    public RoleResponse get(
            @QueryParam("id") Integer id,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest) throws Exception {
        try {
            validate(tenantdata, authentication);
            String logId = context.getProperty("logId").toString();
            return service.getById(tenantdata, id, this.authentication);
        } catch (WebApplicationException er) {
            throw er;
        } catch (Exception er) {
            er.printStackTrace();
            throw er;
        }
    }

    @Override
    public RoleResponse update(_Role entity,
            @HeaderParam("authentication") String authentication,
            @Context HttpServletRequest httpRequest) throws Exception {
        try {
            validate(tenantdata, authentication);
            String logId = context.getProperty("logId").toString();

            return null;
        } catch (WebApplicationException er) {
            throw er;
        } catch (Exception er) {
            er.printStackTrace();
            throw er;
        }

    }

    @Override
    public RoleResponse archive(Integer id, String authentication, HttpServletRequest httpRequest) throws Exception {
        return super.archive(id, authentication, httpRequest); //To change body of generated methods, choose Tools | Templates.
    }

}
