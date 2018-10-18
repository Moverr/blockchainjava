/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.roles;

import com.kodeinc.bcn.api.v1.abstracts.AbstractService;
import com.kodeinc.bcn.api.v1.accounts.entities.AuthenticationResponse;
import com.kodeinc.bcn.api.v1.permissions.entities._Permission;
import com.kodeinc.bcn.api.v1.roles.entities.RoleResponse;
import com.kodeinc.bcn.api.v1.roles.entities._Role;
import com.kodeinc.bcn.db.entities.Roles;
import java.security.Permissions;
import java.util.ArrayList;
import java.util.Date;

import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.BadRequestException;

/**
 *
 * @author mover 3/6/2018
 */
public class RolesService extends AbstractService<_Role, RoleResponse> {

    private static final Logger LOG = Logger.getLogger(RolesService.class.getName());

//    private final RolesJpaController controller;
    private static RolesService service = null;

    public RolesService() {
//        controller = RolesJpaController.getInstance();
    }

    public static RolesService getInstance() {
        if (service == null) {
            service = new RolesService();
        }
        return service;
    }

    public RoleResponse create(_Role entity, AuthenticationResponse authentication) throws Exception {

        entity.validate();
        Roles role = populateBasicRole(entity);
        role.setDateCreated(new Date());
//        role.setAuthor(new Users(authentication.getId().longValue()));
        CheckIfRoleExistsInTheSystem(entity.getName(), entity.getCode());

        //todo: create role via controller
//        role = controller.create(role);
        AttachPermissions(entity, role);

        return populateResponse(role, true);
    }

    public void AttachPermissions(_Role entity, Roles role) {
        //todo: attach the permissions to the Roles
        if (entity.getPermissions() != null) {
//            RolePermissionJpaController.getInstance().deleteRolePermission(role.getId());
            for (_Permission permission : entity.getPermissions()) {

//                Permissions permissions = new Permissions();
//                permissions.setId(permission.getId().longValue());
//
//                RolePermission rolePermission = new RolePermission();
//                rolePermission.setPermission(permissions);
//                rolePermission.setRole(role);
//
//                RolePermissionJpaController.getInstance().create(rolePermission);
            }

        }
    }

    public void CheckIfRoleExistsInTheSystem(String name, String code) throws BadRequestException {
        //todo: check to see that the role does not exist by name and or code;
        List<Roles> roles = null;
//                controller.findByNameOrCode(name, code);
        if (roles != null && roles.size() > 0) {
            throw new BadRequestException("Role name or Code exists in the system");
        }
    }

    /**
     *
     * @param schoolData
     * @param name
     * @return
     * @throws Exception
     */
    public Roles getRoleByName(String name) throws Exception {

        Roles r = null;
        try {
            List<Roles> list = null;
//                    controller.findByName(name);

            if (list != null) {
                r = list.get(0);
            }
        } catch (Exception er) {
            LOG.log(Level.INFO, er.toString());
            throw er;
        }

        return r;

    }

    /**
     *
     * @param data
     * @param Id
     * @param authentication
     * @return
     * @throws Exception
     */
    public RoleResponse getById(Integer Id, AuthenticationResponse authentication) throws Exception {
        //todo:  make sure the user has permissions to make this function 
        Roles role = null;
//                controller.findRole(Id);
        return populateResponse(role, false);
    }

    /**
     *
     * @param data
     * @param ofset
     * @param limit
     * @param authentication
     * @return
     * @throws Exception
     */
    public List<RoleResponse> list(Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {

        //todo:  make sure the user has permissions to make this function
        List<Roles> list = null;
//                controller.findRoles(limit, ofset);
        List<RoleResponse> roleResponses = new ArrayList();
        if (list != null) {
            for (Roles role : list) {
                roleResponses.add(populateResponse(role, true));
            }
        }
        return roleResponses;
    }

    /**
     *
     * @param role
     * @param extended
     * @return
     */
    public RoleResponse populateResponse(Roles role, Boolean extended) {
//        RoleResponse roleResponse = new RoleResponse();
//
//        if (role != null) {
//            roleResponse.setDescription(role.getDescription());
//            roleResponse.setIsSystem(role.getIsSystem() == 1);
//            roleResponse.setName(role.getName());
//            roleResponse.setId(role.getId().intValue());
//            roleResponse.setCode(role.getCode());
//            if (role.getAuthor() != null) {
//                roleResponse.setAuthor(role.getAuthor().getUsername());
//            }
//
//            if (role.getDateCreated() != null) {
//                roleResponse.setDateCreated(role.getDateCreated().getTime());
//            }
//            if (role.getAuthor() != null) {
//                roleResponse.setAuthor(role.getAuthor().getUsername());
//            }
//            if (extended == true) {
//
//                if (role.getPermissions() != null) {
//                    List<PermissionsResponse> permissionsResponses = new ArrayList<>();
//                    role.getPermissions().forEach((permission) -> {
//                        permissionsResponses.add(PermissionsService.getInstance().getResponse(permission));
//                    });
//                    PermissionsResponse[] prs = new PermissionsResponse[permissionsResponses.size()];
//                    roleResponse.setPermissions(permissionsResponses.toArray(prs));
//                }
//            }
//        }
//
//        return roleResponse;

        return null;
    }

    /**
     *
     * @param entity
     * @return
     */
    public static Roles populateBasicRole(_Role entity) {

        Roles role = new Roles();
        if (entity != null) {
            role.setName(entity.getName());
            role.setCode(entity.getCode());
            role.setDescription(entity.getDescription());
            role.setIsSystem(Short.valueOf((entity.isIsSystem() == true ? "1" : "0")));

        }

        return role;
    }

    public static Set<Permissions> getPermissions(_Role entity, Roles role) {
//        Set<Permissions> permisions = new HashSet<>();
//        if (entity.getPermissions() != null && entity.getPermissions().length > 0) {
//
//            for (_Permission permission : entity.getPermissions()) {
//                Permissions permision = new Permissions();
//                permision.setId(permission.getId().longValue());
//                permisions.add(permision);
//            }
//            role.setPermissions(permisions);
//        }
//
//        return permisions;

        return null;
    }

}
