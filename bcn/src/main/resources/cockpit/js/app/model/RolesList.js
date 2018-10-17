'use strict';

/* global Storage, DEV_NO_MODEL_INIT, AbstractList */

var RolesList = function() {
    AbstractList.call(this);
    this.rootPath = '/roles/v1d/';
    this.entityName = 'roles';
    this.storagePrefix = this.entityName + '_';
    RolesList.self = this;
};

RolesList.prototype = Object.create(AbstractList.prototype, {
    constructor: RolesList,
    
    enrich: { value: function(object) {
        object.mainId = object.id;
        object.roleName = object.name;
        object.details = object.description;
        object.permissions = object.rolePermissions;
        return object;
    }, enumerable: true }
});
