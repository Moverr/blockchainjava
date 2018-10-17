/* 
 Author: Muyinda Rogers
 Handler. to lookup ROles Handling 
 */

/* global printData, AlertTypes, host, handlers */

var RolesHandler = function () {
    RolesHandler.self = this;
};

RolesHandler.DISPLAY_ROLE_TITLES = {
    // client image
    //awamoId: 'awamo ID',
    name: 'Name',
    description: 'Description',
    permissions: '#Permissions'

};


RolesHandler.prototype.SystemRoles = null;
RolesHandler.prototype.init = function () {
    // CHeck Permissions Available :: 
    ajax('/roles/v1d/getAllRoles/', 'GET', function (roles) {
        RolesHandler.self.SystemRoles = roles;
        // console.log("System Level Roles ");
        // console.log(RolesHandler.self.SystemRoles);
    }, null, getAuthenticationHeader());
};


RolesHandler.prototype.get_system_roles = function () {
    return  RolesHandler.self.SystemRoles;
};

RolesHandler.prototype.add_role = function () {
    hideContent();
    $('#createRolePage').off('submit');
    $('#createRolePage').on('submit', RolesHandler.self.submitRole);
    $('#backtoRolesButton').off('click touch');
    $('#backtoRolesButton').on('click touch', RolesHandler.self.display_roles);
    clearFormValidators($('#createRolePage'));
    registerKeyPressValidators($('#createRolePage'));
    showContent($('#add_role_page'));
};

RolesHandler.prototype.selected_role;
//Give me Roles Details  :: 
RolesHandler.prototype.manage_role = function (role) {
    // Show me the manage payment Panel
    RolesHandler.self.selected_role_permissions = [];
    $("#permissions_list_roles_assignment").html("");

    RolesHandler.self.selected_role = role;
    // console.log(role);
    hideContent();
    $("#view_roleName").val(role.name);
    $('#manage_role_page .panel-heading span').text(role.name);
    $("#view_roleDescription").val(role.description);

    // GEt Roles Grouping :: 
    var permission_grouping = handlers['Permissions'].get_groupings();
    // console.log("Permissiong Grouping");

    var permission_group = "";
    for (var i = 0; i < permission_grouping.length; i++) {
        // var permission_group = permission_grouping[i].grouping.replace(/_/g, ' ');
        permission_group += "<li data-id='" + permission_grouping[i].grouping + "'><a data-id='" + permission_grouping[i].grouping + "' href='javascript:void(0);'>" + (permission_grouping[i].grouping.replace(/_/g, ' ').toUpperCase()) + "</a></li>";
    }

    // get the selected permission and add them to the list already 

    var permission_count = 0;
    if (role.rolePermissions != undefined || role.rolePermissions != null) {

        while (permission_count < role.rolePermissions.length) {
            if (role.rolePermissions[permission_count].selected) {
                RolesHandler.self.selected_role_permissions.push(role.rolePermissions[permission_count].code);
            }
            permission_count++;
        }
    }

    $("#authorization_grouping").html(permission_group);
    // console.log(permission_grouping);

    // add a data handler to the system  :: 
    $('#authorization_grouping a').off('click touch');
    $('#authorization_grouping a').on('click touch', RolesHandler.self.display_permission_based_on_grouping);
    $('#submit_permissions').off('click touch');
    $('#submit_permissions').on('click touch', RolesHandler.self.assign_permission);
    $('#back_to_roles').off('click touch');
    $('#back_to_roles').on('click touch', RolesHandler.self.display_roles);

    showContent($('#permission_role_assignment'));
    $(".permissions_list_roles_assignment").html("");
};

RolesHandler.prototype.assign_permission = function () {

    if (RolesHandler.self.selected_role_permissions.length < 0)
    {
        showAlertMessage("Select Permissions to Assign to this Role", AlertTypes.warning);
        return;
    }
    if (RolesHandler.self.selected_role_permissions.length <= 0)
    {
        showAlertMessage("Select Permissions", AlertTypes.warning);
        return;
    }
    var permissions_body = '{"code":"ALL_FUNCTIONS"},';
    var role_permission_array = [{code: "ALL_FUNCTIONS", selected: true}];
    var count = 0;
    do {
        permissions_body += '{"code":"' + RolesHandler.self.selected_role_permissions[count] + '"}';
        count++;
        if (count < RolesHandler.self.selected_role_permissions.length)
            permissions_body += ',';

        role_permission_array.push(
                {
                    code: RolesHandler.self.selected_role_permissions[count],
                    selected: true
                }
        );

    } while (count < RolesHandler.self.selected_role_permissions.length);
    permissions_body += '';
    var body = '{"id":"' + RolesHandler.self.selected_role.id + '","rolePermissions":[' + permissions_body + ']}';
    headers = getAuthenticationHeader();
    var $body = $("body");
    // console.log("Bod Request ");
    // console.log(body);

    var confirmDialogHeader = 'Confirm Role Update';
    var confirmDialogBody = 'Are you sure you want to update this role with the provided details';
    var confirmDialogPositiveText = 'Yes';
    var confirmDialogNegativeText = 'No';
    showDialogPopupWithHandlers(confirmDialogHeader
            , confirmDialogBody
            , confirmDialogPositiveText
            , function ()
            {
                //yes am sure
                $.ajax({
                    url: host + '/roles/v1d/updateRole',
                    data: body,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: headers,
                    type: 'POST',
                    beforeSend: function () {
                        showLoader();
                    },
                    success: function (data) {
                        // TODO : Redirect to Manage Users Page 
                        showAlertMessage("Record Saved Successfully", AlertTypes.success);
                        hideLoader();
                        //Update the ROles with permissions :: 
                        var _roles = RolesHandler.self.SystemRoles;
                        $.each(_roles, function (index, value) {
                            if (value.id === RolesHandler.self.selected_role.id) {
                                // console.log(index + " : " + value);
                                // console.log(value);
                                _roles[index].rolePermissions = role_permission_array;
                                // console.log(_roles[index]);
                            }
                        });
                        RolesHandler.self.SystemRoles = _roles;
                        RolesHandler.self.resetRolesForm();
                        RolesHandler.self.display_roles();
                    },
                    complete: function () {
                        hideLoader();
                    }
                }).fail(function (Response) {

                    if (Response.status === 403) {
                        showAlertMessage("Record was not saved Correctly ", AlertTypes.warning);
                    } else if (Response.status === 500) {
                        showAlertMessage("Something went wrong, if persists contact Server Admin", AlertTypes.danger);
                    } else if (Response.status === 404) {
                        showAlertMessage("Check Your Network Connection", AlertTypes.danger);
                    } else
                    {
                        showAlertMessage("Something went Wrong contact Administrator ", AlertTypes.danger);
                    }
                    hideLoader();
                });
            }
    , confirmDialogNegativeText
            , function ()
            {
                //no am not
            });
};

RolesHandler.prototype.display_permission_based_on_grouping = function () {
    var group_id = $(this).attr('data-id');

    // Remove all attr;
    $(".authorization_grouping li").removeAttr('class');
    $(this).closest('li').attr('class', 'active_list_selection');

    var permission_array = handlers['Permissions'].filter_permission_by_groupe(group_id);

    var display_permission = "";

    if (permission_array.length > 0) {

        var x = 0;
        do {
            var status = "";

            for (var count = 0; count < RolesHandler.self.selected_role_permissions.length; count++) {


                if (permission_array[x].code === RolesHandler.self.selected_role_permissions[count])
                {
                    status = "checked";
                    break;
                }

            }

            display_permission += ' <div class="form-group">'
                    + '<div class="checkbox">'
                    + '<label> <input  class="check_box_permissions" ' + status + ' name="permission_list" value="' + permission_array[x].code + '" type="checkbox">' + (permission_array[x].code.replace(/_/g, ' ').toUpperCase()) + '</label>'
                    + '</div> </div>';
            x++;
        } while (x < permission_array.length);
    }

    // Display  to the index
    $(".permissions_list_roles_assignment").html(display_permission);

    $('.permissions_list_roles_assignment .check_box_permissions').on('click touch', RolesHandler.self.handle_permission_assignment);

    // console.log(permission_array);

};

RolesHandler.prototype.selected_role_permissions = [];
RolesHandler.prototype.handle_permission_assignment = function () {
    var selected_permission = $(this).val();
    var count_assigned_permissions = RolesHandler.self.selected_role_permissions.length;
    var status = false;
    var index = 0;
    if (count_assigned_permissions > 0)
    {
        status = false;
        var x = 0;
        do {
            if (selected_permission === RolesHandler.self.selected_role_permissions[x])
            {
                status = true;
                index = x;
                break;
            }
            x++;
        } while (x < count_assigned_permissions);
    }

    if ($(this).is(":checked")) {
        if (status === false)
            RolesHandler.self.selected_role_permissions.push(selected_permission);
    } else {
        if (status === true) {
            // remove 
            if (index > -1) {
                RolesHandler.self.selected_role_permissions.splice(index, 1);
            }


        }
    }

    // console.log(" Current Array Selection ");
    // console.log(RolesHandler.self.selected_role_permissions);

};

RolesHandler.prototype.resetRolesForm = function () {
    $("#roleName").val('');
    $("#roleDescription").val('');
};

RolesHandler.prototype.submitRole = function (event) {
    event.preventDefault();

    if (validateForm($('#createRolePage')))
    {
        var confirmDialogHeader = 'Confirm role creation';
        var confirmDialogBody = 'Are you sure you want to create this role with the provided details';
        var confirmDialogPositiveText = 'Yes';
        var confirmDialogNegativeText = 'No';
        showDialogPopupWithHandlers(confirmDialogHeader
                , confirmDialogBody
                , confirmDialogPositiveText
                , function () {
                    //yes create role
                    var role_name = $("#roleName").val().trim();
                    var role_description = $("#roleDescription").val().trim();
                    // Check to see that role name and description are not empty
                    if (role_name === undefined || role_name.length <= 0 || role_name === '' || role_name === ' ') {
                        showAlertMessage("Enter Role Name", AlertTypes.warning);
                        return;
                    }
                    if (role_description === undefined || role_description.length <= 0 || role_description === '' || role_description === ' ') {
                        showAlertMessage("Enter Role Description", AlertTypes.warning);
                        return;
                    }
                    var body = '{"name":"' + role_name + '","description":"' + role_description + '"}';
                    var headers = getAuthenticationHeader();
                    var $body = $("body");
                    $.ajax({
                        url: host + '/roles/v1d/createRole',
                        data: body,
                        dataType: 'json',
                        contentType: "application/json; charset=utf-8",
                        headers: headers,
                        type: 'POST',
                        beforeSend: function () {

                            showLoader();
                        },
                        success: function (data) {
                            // console.log(data);
                            var role = {
                                id: data.resourceId,
                                name: "" + role_name,
                                description: "" + role_description,
                                rolePermissions: {}
                            };
                            // Add this to the System Roles List
                            RolesHandler.self.SystemRoles.push(role);
                            // TODO : Redirect to Manage Users Page 
                            showAlertMessage("Record Saved Successfully", AlertTypes.success);
                            hideLoader();
                            RolesHandler.self.resetRolesForm();
                            // Assign Permissions 
                            RolesHandler.self.manage_role(role);
                        },
                        complete: function () {
                            hideLoader();
                        }
                    }).fail(function (Response) {

                        if (Response.status === 403) {
                            showAlertMessage("Record not saved ", AlertTypes.warning);
                        } else if (Response.status === 404) {
                            showAlertMessage("Server Not Reacheable, Check Your Internet Connectivity ", AlertTypes.danger);
                        } else
                        {
                            showAlertMessage("Something went Wrong contact Administrator ", AlertTypes.danger);
                        }
                        hideLoader();
                    });
                }
        , confirmDialogNegativeText
                , function ()
                {
                    //no dont create role
                });
    } else
    {
        showAlertMessage("Please ensure all the fields are filled in correctly.", AlertTypes.warning);
    }
};

RolesHandler.prototype.display_roles = function () {

    RolesHandler.self.currentClient = null;
    initDefaultContent('System Roles ');

    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');

    $('#printNow').off('click touch');
    $('#printNow').on('click touch', printData);
    $('#printableTitle').text('Roles');
    $('#printNow').show();


    $('#create_object').off('click touch');
    $('#create_object').text("Create Role ");
    $('#create_object').on('click touch', RolesHandler.self.add_role);
    $('#create_object').show();


    var dataList = RolesHandler.self.SystemRoles;


    var $rowContainer = getDefaultRowContainer(RolesHandler.DISPLAY_ROLE_TITLES, true);
    var $table = $rowContainer.parent();

    if (dataList.length > 0) {
        for (var i = 0; i < dataList.length; i++) {
            var rowdata = {};
            var formattedValue = dataList[i];

            rowdata['name'] = formattedValue.name;
            rowdata['description'] = formattedValue.description;

            var permission_count = 0;
            var permission = 0;
            if (formattedValue.rolePermissions != undefined || formattedValue.rolePermissions != null) {
                while (permission < formattedValue.rolePermissions.length) {
                    if (formattedValue.rolePermissions[permission].selected) {
                        permission_count++;
                    }
                    permission++;
                }
                ;
            }

            rowdata['num_permissions'] = permission_count;
            addRow($rowContainer, rowdata, dataList[i], RolesHandler.self.rowClickHandler, dataList[i]);


        }
    }


    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: {sorter: 'awamoDateSorter'},
        4: {sorter: 'awamoDateSorter'}
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);

    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++) {
        els[i].style.textAlign = "right";
    }

    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));

    var tables = $('#defaultTableContainer').tableExport();
    tables.tableExport.update({
        formats: ["xls", "xlsx"],
        fileName: "System_roles" + (new Date().toJSON().slice(0, 10).replace(/-/g, '_')),
        headings: true
    });

    $("#hiddenPrintedTitle").val("Users Report");

};

RolesHandler.prototype.rowClickHandler = function () {
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    RolesHandler.self.manage_role($(this).data('object'));
};