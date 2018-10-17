/* This Handler is mearnt to handle permissions gotten from the server as json list  */
/* global AlertTypes */

//TODO: Not fully implemented pending json data from the server 

var PermissionHandler = function() {
    PermissionHandler.self = this;

};
//initialize the permissions 
PermissionHandler.prototype.System_permission_list = [];


PermissionHandler.prototype.escape_grouping = ["LOAN_PROVISIONING", "loan_reschedule", "loan_provisioning", "accounting", "account_transfer", "authorisation", "cash_mgmt", "collection_sheet", "configuration", "datatable", "externalservices", "infrastructure", "jobs", "loan_provisioning", "loan reschedule", "organisation", "portfolio", "portfolio_center", "portfolio_group", "report", "survey", "transaction_client", "transaction_loan", "transaction_savings", "xbrlmapping", "special", "ssbeneficiarytpt", "shareaccount", "shareproduct"];

PermissionHandler.prototype.loged_in_user_permission_list = [];




PermissionHandler.prototype.init = function() {
    ajax('/roles/v1d/getAllPermissions/', 'GET', function(permissions) {


        var _permissions = permissions;
        var count_permissions = 0;

        do {
            var exists = false;
            var data_grouping = _permissions[count_permissions].grouping;
            var x = 0;
            while (x < PermissionHandler.self.escape_grouping.length) {

                if (data_grouping.toLowerCase() === PermissionHandler.self.escape_grouping[x]) {
                    exists = true;
                    break;
                }
                x++;
            }
            if (exists === false)
                PermissionHandler.self.System_permission_list.push(_permissions[count_permissions]);

            count_permissions++;
        }
        while (count_permissions < _permissions.length);

        // console.log("Permissions List INitiated "); 
        // console.log(PermissionHandler.self.System_permission_list);

        // PermissionHandler.self.System_permission_list = permissions; 

    }, null, getAuthenticationHeader());
};


PermissionHandler.prototype.assign_user_permissions = function(permissions_details) {

    PermissionHandler.self.loged_in_user_permission_list = permissions_details;

    // console.log("USER VERIFIDE LIST PERMISSIONS ");
    // console.log(PermissionHandler.self.loged_in_user_permission_list);

};



PermissionHandler.prototype.System_permission_list_grouping = [];
PermissionHandler.prototype.get_groupings = function() {

    var count = 0;
    do {
        var grouping = { grouping: PermissionHandler.self.System_permission_list[count].grouping };

        if (PermissionHandler.self.System_permission_list_grouping.length > 0) {
            var x = 0;
            var exists = false;
            while (x < PermissionHandler.self.System_permission_list_grouping.length) {

                if (PermissionHandler.self.System_permission_list_grouping[x].grouping === PermissionHandler.self.System_permission_list[count].grouping) {
                    exists = true;
                    break;
                }
                x++;
            }
            if (exists === false)
                PermissionHandler.self.System_permission_list_grouping.push(grouping);

        } else {
            PermissionHandler.self.System_permission_list_grouping.push(grouping);
        }

        count++;
    }
    while (count < PermissionHandler.self.System_permission_list.length);

    return (PermissionHandler.self.System_permission_list_grouping);

};


PermissionHandler.prototype.filter_permission_by_groupe = function(group_id) {
    var permission_array = [];
    var count = 0;
    var x = 0;

    do {
        if (group_id === PermissionHandler.self.System_permission_list[count].grouping) {
            permission_array[x] = PermissionHandler.self.System_permission_list[count];
            x++;
        }

        count++;
    }
    while (count < PermissionHandler.self.System_permission_list.length);

    return permission_array;

};

PermissionHandler.prototype.check_access = function (permission, redirect) {
    // if redirect is true:: 
    if (($.inArray(permission, PermissionHandler.self.loged_in_user_permission_list) !== -1) || ($.inArray("_ALL_FUNCTIONS", PermissionHandler.self.loged_in_user_permission_list) !== -1)) {
        if (undefined !== redirect && redirect === true) {
            showAlertMessage("You Dont Have Permission to Access this Page or Action", AlertTypes.warning);
        }
        return true;
    } else {
        return false;
    }
};

PermissionHandler.prototype.singlePermissionActionHandler = function(event) {
    event.preventDefault();
    hideContent();
};
