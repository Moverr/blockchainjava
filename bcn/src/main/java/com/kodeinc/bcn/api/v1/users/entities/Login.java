/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.api.v1.users.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kodeinc.bcn.annotation.Mandatory;
import com.kodeinc.bcn.api.v1.abstracts.AbstractEntity;
import static com.kodeinc.bcn.helper.Utilities.validateMandatoryFields;
import java.util.Objects;

/**
 *
 * @author mover
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Login extends AbstractEntity {

    private @Mandatory
    String username;
    private @Mandatory
    String password;

    public Login() {
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

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 29 * hash + Objects.hashCode(this.username);
        hash = 29 * hash + Objects.hashCode(this.password);
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
        final Login other = (Login) obj;
        if (!Objects.equals(this.username, other.username)) {
            return false;
        }
        return Objects.equals(this.password, other.password);
    }

    @Override
    public void validate() {
        validateMandatoryFields(this.getClass(), this);
    }

    @Override
    public String toString() {
        return "_login{"
                + "username=" + username
                + ", password=" + password
                + "}";
    }

}
