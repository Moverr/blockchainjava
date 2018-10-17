/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.users.entities;

import com.codemovers.scholar.engine.annotation.Mandatory;
import com.codemovers.scholar.engine.api.v1.abstracts.AbstractEntity;
import com.codemovers.scholar.engine.api.v1.profile.entities.Profiles;
import com.codemovers.scholar.engine.api.v1.staff.entities._Staff;
import static com.codemovers.scholar.engine.helper.Utilities.validateMandatoryFields;
import com.codemovers.scholar.engine.helper.enums.StatusEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Arrays;
import java.util.Objects;

/**
 *
 * @author MOver 11/19/2017
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class _User extends AbstractEntity {

    private Integer id;
    private @Mandatory
    String username;
    private @Mandatory
    String password;
    private String emailaddress;
    private StatusEnum status;
    private String externalid;
    private Long date_created;
    private @Mandatory
    String[] roles;
    Profiles profile;
    _Staff staff;

    public _User() {
    }

    public _User(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmailaddress() {
        return emailaddress;
    }

    public void setEmailaddress(String emailaddress) {
        this.emailaddress = emailaddress;
    }

    public StatusEnum getStatus() {
        return status;
    }

    public void setStatus(StatusEnum status) {
        this.status = status;
    }

    public String getExternalid() {
        return externalid;
    }

    public void setExternalid(String externalid) {
        this.externalid = externalid;
    }

    public Long getDate_created() {
        return date_created;
    }

    public void setDate_created(Long date_created) {
        this.date_created = date_created;
    }

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }

    public Profiles getProfile() {
        return profile;
    }

    public void setProfile(Profiles profile) {
        this.profile = profile;
    }

    public _Staff getStaff() {
        return staff;
    }

    public void setStaff(_Staff staff) {
        this.staff = staff;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 67 * hash + Objects.hashCode(this.id);
        hash = 67 * hash + Objects.hashCode(this.username);
        hash = 67 * hash + Objects.hashCode(this.password);
        hash = 67 * hash + Objects.hashCode(this.emailaddress);
        hash = 67 * hash + Objects.hashCode(this.status);
        hash = 67 * hash + Objects.hashCode(this.externalid);
        hash = 67 * hash + Objects.hashCode(this.date_created);
        hash = 67 * hash + Arrays.deepHashCode(this.roles);
        hash = 67 * hash + Objects.hashCode(this.profile);
        hash = 67 * hash + Objects.hashCode(this.staff);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final _User other = (_User) obj;
        if (!Objects.equals(this.username, other.username)) {
            return false;
        }
        if (!Objects.equals(this.password, other.password)) {
            return false;
        }
        if (!Objects.equals(this.emailaddress, other.emailaddress)) {
            return false;
        }
        if (!Objects.equals(this.externalid, other.externalid)) {
            return false;
        }
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        if (this.status != other.status) {
            return false;
        }
        if (!Objects.equals(this.date_created, other.date_created)) {
            return false;
        }
        if (!Arrays.deepEquals(this.roles, other.roles)) {
            return false;
        }
        if (!Objects.equals(this.profile, other.profile)) {
            return false;
        }
        if (!Objects.equals(this.staff, other.staff)) {
            return false;
        }
        return true;
    }

    @Override
    public void validate() {
        validateMandatoryFields(this.getClass(), this);

    }

    @Override
    public String toString() {
        return "_User{"
                + "id=" + id
                + ", username=" + username
                + ", password=" + password
                + ", emailaddress=" + emailaddress
                + ", status=" + status
                + ", externalid=" + externalid
                + ", date_created=" + date_created
                + ", roles=" + Arrays.asList(roles)
                + ", staff=" + staff
                + ", profile=" + profile
                + "}";
    }

}
