/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.users;

import com.kodeinc.bcn.api.v1.abstracts.AbstractService;
import com.kodeinc.bcn.api.v1.accounts.entities.AuthenticationResponse;
import com.kodeinc.bcn.api.v1.permissions.entities.PermissionsResponse;
import com.kodeinc.bcn.api.v1.users.entities.Login;
import com.kodeinc.bcn.api.v1.users.entities.UserResponse;
import com.kodeinc.bcn.api.v1.users.entities._User;
import com.kodeinc.bcn.db.controllers.UserProfileJpaController;
import com.kodeinc.bcn.db.controllers.UserRoleJpaController;
import com.kodeinc.bcn.db.controllers.UsersJpaController;
import com.kodeinc.bcn.db.entities.Profile;
import com.kodeinc.bcn.db.entities.Roles;
import com.kodeinc.bcn.db.entities.UserProfile;
import com.kodeinc.bcn.db.entities.UserRole;
import com.kodeinc.bcn.db.entities.Users;
import static com.kodeinc.bcn.helper.Utilities.encryptPassword_md5;
import com.kodeinc.bcn.helper.enums.StatusEnum;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Base64;
import java.util.Collection;
import javax.ws.rs.BadRequestException;

/**
 *
 * @author MOver 11/19/2017
 */
public class UserService extends AbstractService<_User, UserResponse> {

    private static final Logger LOG = Logger.getLogger(UserService.class.getName());

    private final UsersJpaController controller;

    private static UserService service = null;

    public UserService() {
        controller = UsersJpaController.getInstance();
    }

    public static UserService getInstance() {
        if (service == null) {
            service = new UserService();
        }
        return service;
    }

    public UserResponse create(_User entity, AuthenticationResponse authentication) throws BadRequestException, Exception {
        entity.validate();
        Users USER = getUser(entity);

        //todo: check to see if there is a user with this this username
        List<Users> list = controller.findByUserName(USER.getUsername());
        if (!list.isEmpty()) {
            throw new BadRequestException("User with username " + USER.getUsername() + " exists in the system");
        }

        System.out.println("USERS" + entity.toString());

        USER = controller.create(USER);

        AttachRoles(entity, USER);
        return null;
    }

    //todo: retrieve authentication 
    /**
     *
     * @param schoolData
     * @param Id
     * @return
     * @throws Exception
     */
    public UserResponse getById(Integer Id) throws Exception {

        Users _user = controller.findUser(Id);
        if (_user == null) {
            throw new BadRequestException("USER DOES NOT EXIST");
        }
        return  null;
//                populateResponse(_user, true);

    }

    /**
     *
     * @param username
     * @param Password
     * @return
     */
    public String convertToBasicAuth(String username, String Password) {
        String authString = username + ":" + Password;
        byte[] authEncBytes = Base64.getEncoder().encode(authString.getBytes());
        String authStringEnc = new String(authEncBytes);
        return ("Basic:" + authStringEnc);
    }

    //todo: validate authenticaton
    /**
     *
     * @param schoolData
     * @param authentication
     * @return
     * @throws Exception
     */
    public AuthenticationResponse validateAuthentication(String authentication) throws BadRequestException, Exception {
        LOG.log(Level.INFO, "AUTHENTICATION STRING " + authentication);
        authentication = authentication.replace("Basic:", "");
        String usernamePassword = new String(Base64.getDecoder().decode(authentication));
        String[] parts = usernamePassword.split(":");

        if (parts.length != 2) {
            LOG.log(Level.WARNING, "{0} :: invalid security credentials");
            throw new BadRequestException("invalid security credentials");
        }

        Login login = getLogin(parts);

        return login(login, "LOGID");

    }

    /**
     *
     * @param tenantData
     * @param login
     * @param logId
     * @return
     * @throws Exception
     */
    public AuthenticationResponse login(Login login, String logId) throws BadRequestException, Exception {

        AuthenticationResponse response = new AuthenticationResponse();

        login.validate();
        try {
            LOG.log(Level.INFO, " School User Login ");
            String authentication = null;

            {
                if (login.getPassword() != null && login.getUsername() != null) {
                    // todo : encrypt password

                    String username = login.getUsername();
                    String password = login.getPassword();

                    password = encryptPassword_md5(password);

                    Users users = controller.login(username, password);

                    if (users == null) {
                        throw new BadRequestException("INVALID USERNAME AND OR PASSWORD ");
                    } else {
                        // createProfile response ::
                        authentication = convertToBasicAuth(login.getUsername(), login.getPassword());

                        Set<Roles> roleslist = null;

                        List<PermissionsResponse> permissionsResponses = new ArrayList<>();

                        Collection<UserRole> arolesList = null;
                        //users.getUserRoleCollection();

                        if (arolesList == null) {
                            LOG.log(Level.INFO, " RESPONSE S  EMPTY ");
                        }

                        for (Roles r : roleslist) {

//                            Set<Permissions> _permissionset = r.getPermissions();
//                            PermissionsResponse permissionsResponse = new PermissionsResponse();
//                            permissionsResponse.setName(r.getName());
//                            permissionsResponses.add(permissionsResponse);
                        }

                        response.setId(users.getId().intValue());
                        response.setAuthentication(authentication);
                        response.setPermissions(permissionsResponses);
                        response.setIsLoggedIn(true);

                    }
                    //todo : check username and password
                } else {
                    throw new BadRequestException(" USERNAME AND OR PASSWORD IS MANDATORY  ");
                }

            }

        } catch (BadRequestException er) {
            throw er;
        }

        return response;
    }

    public List<UserResponse> list(Integer ofset, Integer limit, AuthenticationResponse authentication) throws Exception {

        List<Users> _users = controller.findUsers(ofset, limit);
        List<UserResponse> userResponses = new ArrayList<>();
        if (_users != null) {
            for (Users users : _users) {
                UserResponse userResponse = null;
                userResponses.add(userResponse);
            }
        }

        return userResponses;
    }

    /**
     *
     * @param tenantData
     * @param account_id
     */
    public void deactivate(Integer account_id) throws Exception {
        Users _user = controller.findUser(account_id);
        if (_user == null) {
            throw new BadRequestException("USER DOES NOT EXIST");

        }
        _user.setStatus("DISABLED");

    }

    public void activate(Integer account_id) throws Exception {
        Users _user = controller.findUser(account_id);
        if (_user == null) {
            throw new BadRequestException("USER DOES NOT EXIST");

        }
        _user.setStatus("ACTIVE");

    }

    public void AttachRoles(_User entity, Users USER) throws Exception {
        UserRole userRole = new UserRole();
        String[] rs = entity.getRoles();
        List<Roles> roleses = getRoles(rs);
        Roles[] _roles = new Roles[roleses.size()];

        userRole.setUser(USER);
        if (roleses != null) {
            for (Roles r : roleses) {
                userRole.setRole(r);
                UserRoleJpaController.getInstance().create(userRole);
            }
        }
    }

    public void AttachUserProfile(Users USER, Profile profile) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUser(USER);
        userProfile.setProfile(profile);

        userProfile = UserProfileJpaController.getInstance().create(userProfile);
    }

    public Users getUser(_User entity) throws Exception {
        Users USER = new Users();
        USER.setUsername(entity.getUsername());
        String encryptedPassword = encryptPassword_md5(entity.getPassword());
        USER.setPassword(encryptedPassword);
        System.out.println("USER : " + USER.getPassword());
        USER.setStatus(StatusEnum.ACTIVE.toString());

        //    USER.setUserRoles(roles);
        USER.setDateCreated(new Date());

        return USER;
    }

    public List<Roles> getRoles(String[] rs) throws BadRequestException, Exception {
        List<Roles> roleses = new ArrayList<>();
        if (rs != null) {
            for (String rolename : rs) {
                Roles _role = null;
//                        RolesService.getInstance().getRoleByName( rolename);
                if (_role != null) {
                    roleses.add(_role);
                }
            }
        }
        if (roleses.isEmpty()) {
            throw new BadRequestException(" Roles do not exist");
        }
        return roleses;
    }

    public Login getLogin(String[] parts) {
        String username = parts[0];
        String password = parts[1];
        Login login = new Login();
        login.setUsername(username);
        login.setPassword(password);
        return login;
    }

}
