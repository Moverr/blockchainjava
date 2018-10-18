/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.accounts;
 
import com.kodeinc.bcn.api.v1.users.UserService;
import java.util.logging.Logger;
import javax.ws.rs.Path;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.core.Context;

/**
 *
 * @author mover 11/15/2017
 */
@Path("/")
public class AccountsEndpoint {

    private static final Logger LOG = Logger.getLogger(AccountsEndpoint.class.getName());

    @Context
    private ContainerRequestContext context;

    private AccountsService service = null;

    public AccountsEndpoint() {
        service = new AccountsService();
    }

    //todo: find if the user is ligerly in 
    //todo: check permission to perform a given operation 
    public void validate( String authentication) throws Exception {
        UserService.getInstance().validateAuthentication( authentication);
    }

}
