/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.codemovers.scholar.engine.api.v1.roles.entities;

import com.codemovers.scholar.engine.api.v1.permissions.entities._Permission;
import com.codemovers.scholar.engine.annotation.Mandatory;
import com.codemovers.scholar.engine.api.v1.abstracts.AbstractEntity;
import static com.codemovers.scholar.engine.helper.Utilities.validateMandatoryFields;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Arrays;
import java.util.Date;
import java.util.Objects;

/**
 *
 * @author Mover 11/20/2017
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class _Role extends AbstractEntity {

    private @Mandatory
    String name;
    private @Mandatory
    String code;
    private @Mandatory
    String description;
    private @Mandatory
    boolean isSystem;
    private @Mandatory
    _Permission[] permissions;
    private Date date_created;
    private Integer author_id;
    private Integer id;

    public _Role() {
    }

    public _Role(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isIsSystem() {
        return isSystem;
    }

    public void setIsSystem(boolean isSystem) {
        this.isSystem = isSystem;
    }

    public _Permission[] getPermissions() {
        return permissions;
    }

    public void setPermissions(_Permission[] permissions) {
        this.permissions = permissions;
    }

    public Date getDate_created() {
        return date_created;
    }

    public void setDate_created(Date date_created) {
        this.date_created = date_created;
    }

    public Integer getAuthor_id() {
        return author_id;
    }

    public void setAuthor_id(Integer author_id) {
        this.author_id = author_id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 73 * hash + Objects.hashCode(this.name);
        hash = 73 * hash + Objects.hashCode(this.code);
        hash = 73 * hash + Objects.hashCode(this.description);
        hash = 73 * hash + (this.isSystem ? 1 : 0);
        hash = 73 * hash + Arrays.deepHashCode(this.permissions);
        hash = 73 * hash + Objects.hashCode(this.date_created);
        hash = 73 * hash + Objects.hashCode(this.author_id);
        hash = 73 * hash + Objects.hashCode(this.id);
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
        final _Role other = (_Role) obj;
        if (this.isSystem != other.isSystem) {
            return false;
        }
        if (!Objects.equals(this.name, other.name)) {
            return false;
        }
        if (!Objects.equals(this.code, other.code)) {
            return false;
        }
        if (!Objects.equals(this.description, other.description)) {
            return false;
        }
        if (!Arrays.deepEquals(this.permissions, other.permissions)) {
            return false;
        }
        if (!Objects.equals(this.date_created, other.date_created)) {
            return false;
        }
        if (!Objects.equals(this.author_id, other.author_id)) {
            return false;
        }
        return Objects.equals(this.id, other.id);
    }

    @Override
    public void validate() {
        validateMandatoryFields(this.getClass(), this);

    }

    @Override
    public String toString() {
        return "_Role{"
                + "name=" + name
                + ", code=" + code
                + ", description=" + description
                + ", isSystem=" + isSystem
                + ", permissions=" + Arrays.toString(permissions)
                + ", date_created=" + date_created
                + ", author_id=" + author_id
                + ", id=" + id
                + '}';
    }

}
