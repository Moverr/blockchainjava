package com.kodeinc.bcn.api.v1.accounts.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Objects;

/**
 *
 * @author Mover 11/21/2017
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {

    private String authentication;

    public LoginResponse() {
    }

    public LoginResponse(String authentication) {
        this.authentication = authentication;
    }

    public String getAuthentication() {
        return authentication;
    }

    public void setAuthentication(String authentication) {
        this.authentication = authentication;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 97 * hash + Objects.hashCode(this.authentication);
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
        final LoginResponse other = (LoginResponse) obj;
        return Objects.equals(this.authentication, other.authentication);
    }

    @Override
    public String toString() {
        return this.getClass().getCanonicalName()
                + "{"
                + "authentication=" + authentication
                + "}";
    }

}
