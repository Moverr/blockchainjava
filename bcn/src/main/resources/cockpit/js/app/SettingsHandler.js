/*
 *  manage Personal Passwords, Manage ROles, Manage Permissions, Manage Users, manage issues related to system Settings
 */

/* global printData, handlers, host, AlertTypes, body, url, headers */


'use strict';
var userCreationBodyDetails;
var userEditBodyDetails;
var SettingsHandler = function () {
    SettingsHandler.self = this;
};
SettingsHandler.prototype.system_users_list = null;
SettingsHandler.prototype.init = function () {
    // Initialize Users of the System :: 
    SettingsHandler.self.fetch_system_users();

};

SettingsHandler.prototype.fetch_system_users = function () {
    // TODO : SOme one with Permissions to do so , will be able to download the users list of the system

    var headers = getAuthenticationHeader();

    $.ajax({
        url: host + '/user/v1d/list',
        dataType: 'json',
        headers: headers,
        type: 'GET',
        beforeSend: function () {
        },
        success: function (data) {

            // console.log("System Users");
            SettingsHandler.self.system_users_list = data;
            // console.log(SettingsHandler.self.system_users_list);
            return;
        },
        complete: function () {
            // console.log("System Users Fetching Complete ");

        }
    }).fail(function (Response) {


        if (Response.status === 403) {
            // console.log("Fetch User Error 403 ");
        } else if (Response.status === 500) {
            // console.log("No Internent error 500 ");
        } else
        {
            // console.log("Unknown Error Contact Administrator ");
        }

    });


};

SettingsHandler.prototype.rowClickHandler = function () {
    var action = $(this).data('id');
    var handler = $(this).data('object');
    $('li[data-parent~="settings"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

/* external */
SettingsHandler.prototype.overview = function () {

    addHistory('Settings overview', '#settingsOverview', '#settings');
    initDefaultContent('Settings');
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    currentTable = 'settings';

    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});


    addRow($rowContainer, {type: 'Offices & Branches'/*, number: 7*/}, 'Settings', SettingsHandler.self.rowClickHandler, 'offices_sub_menu');
    addRow($rowContainer, {type: 'Roles & Permissions '/*, number: 1*/}, 'Settings', SettingsHandler.self.rowClickHandler, 'roles_sub_menu');
    addRow($rowContainer, {type: 'Users'/*, number: 1*/}, 'Settings', SettingsHandler.self.rowClickHandler, 'users_sub_menu');

};

SettingsHandler.prototype.roles_sub_menu = function () {
    addHistory('Settings Roles Overview', '#settingsRolesOverview', getSidebarSubitemSelector('settings', 'Settings', 'roles_sub_menu'));
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    initDefaultContent('Roles & Permissions ');
    currentTable = 'rolesMenu';
    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});

    // Create Role
    addRow($rowContainer, {type: 'Create Role '/*, number: 7*/}, 'Settings', SettingsHandler.self.add_role, '_create_role');

    // Manage Roles
    addRow($rowContainer, {type: 'Manage Roles'/*, number: 7*/}, 'Settings', SettingsHandler.self.manage_roles, '_manage_roles');


};

SettingsHandler.prototype.offices_sub_menu = function () {
    addHistory('Settings Offices Overview', '#settingsOfficesOverview', getSidebarSubitemSelector('settings', 'Settings', 'offices_sub_menu'));
    initDefaultContent('Offices');
    currentTable = 'officesMenu';
    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});
    // Create Office
    addRow($rowContainer, {type: 'Create Office '/*, number: 7*/}, 'Settings', SettingsHandler.self.create_office, '_create_office');
    // Manage Offices
    addRow($rowContainer, {type: 'Manage Offices'/*, number: 7*/}, 'Settings', SettingsHandler.self.manage_offices, '_manage_offices');
};

SettingsHandler.prototype.users_sub_menu = function () {
    addHistory('Settings Users Overview', '#settingsUsersOverview', getSidebarSubitemSelector('settings', 'Settings', 'users_sub_menu'));
    initDefaultContent('Users');
    currentTable = 'usersMenu';
    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});


    // Create User
    addRow($rowContainer, {type: 'Create User '/*, number: 7*/}, 'Settings', SettingsHandler.self.add_user, '_create_user');

    // Manage Users
    addRow($rowContainer, {type: 'Edit User'/*, number: 7*/}, 'Settings', SettingsHandler.self.manage_users, '_manage_users');

}
;

// Manage Offices 
SettingsHandler.prototype.manage_offices = function () {
    currentTable = 'offices';

    // Lookup in the Offices  Handler and Manage DIsplay the OFfices View 
    handlers['Offices'].display_offices();
};
SettingsHandler.prototype.create_office = function () {
    handlers['Offices'].add_office();
};

// Manage Users 
SettingsHandler.prototype.manage_users = function () {
    // addHistory('All clients', '#clients', getSidebarSubitemSelector('manageClients', 'Client', 'manageClientsGetAll'));
    currentTable = 'SystemUsers';
    // SettingsHandler.self.previousPage = ClientHandler.self.manageClientsGetAll;    
    SettingsHandler.self.display_users();
};

SettingsHandler.DISPLAY_USER_TITLES = {
    // client image
    //awamoId: 'awamo ID',
    fullname: 'Name',
    gender: 'Office',
    birthdate: 'Role'

};

SettingsHandler.prototype.display_users = function () {
    SettingsHandler.self.currentClient = null;

    initDefaultContent('System Users ');

    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');

    $('#printNow').off('click touch');
    $('#printNow').on('click touch', printData);
    $('#printableTitle').text('Users');
    $('#printNow').show();


    $('#create_object').off('click touch');
    $('#create_object').text("Create User ");
    $('#create_object').on('click touch', SettingsHandler.self.add_user);
    $('#create_object').show();

    var dataList = SettingsHandler.self.system_users_list;

    var $rowContainer = getDefaultRowContainer(SettingsHandler.DISPLAY_USER_TITLES, true);
    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++) {
        var rowdata = {};
        var formattedValue = dataList[i];

        rowdata['name'] = formattedValue.firstname + " " + formattedValue.lastname;
        rowdata['officename'] = formattedValue.officeName;
        rowdata['satff_role'] = formattedValue.selectedRoles[0].name;

        //  rowdata[key] = formattedValue
        addRow($rowContainer, rowdata, dataList[i], SettingsHandler.self.view_user, dataList[i].id);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: {sorter: 'awamoDateSorter'},
        4: {sorter: 'awamoDateSorter'}
    };
    // $table.tablesorter(tableSorter);
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
        fileName: "Users" + (new Date().toJSON().slice(0, 10).replace(/-/g, '_')),
        headings: true
    });

    $("#hiddenPrintedTitle").val("Users Report");

};

SettingsHandler.prototype.user_details = null;
SettingsHandler.prototype.view_user = function () {
    var object = $(this).data('object');
    clearFormValidators($('#userCreationForm'));
    SettingsHandler.self.user_details = object;
    hideContent();
    SettingsHandler.prototype.disableUserFieldsForUpdate();
    SettingsHandler.prototype.showUpdateUserButtons();

    initDefaultContent('Edit User ');

    //reset the form 
    document.getElementById("userCreationForm").reset();

    // Load the Roles List
    var roles = handlers['Roles'].get_system_roles();
    var role_select_options = "";
    role_select_options += "<option value=''>  Select User Role  </option>";

    if (roles != undefined && roles != null) {
        for (var role = 0; role < roles.length; role++) {
            role_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + roles[role].description + "'   value='" + roles[role].id + "' id='" + roles[role].id + "' data-description='" + roles[role].description + "'> " + roles[role].name + " </option>";
        }
    }
    $("#userRole").html(role_select_options);

    var offices = handlers['Offices'].get_system_offices();
    var offices_select_options = "";
    offices_select_options += "<option value=''>  Select Office  </option>";

    if (offices != undefined && offices != null) {
        for (var office = 0; office < offices.length; office++) {
            offices_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + offices[office].nameDecorated + "'   value='" + offices[office].id + "' id='" + offices[office].id + "' data-description='" + offices[office].name + "'> " + offices[office].name + " </option>";
        }

    }
    $("#userOffice").html(offices_select_options);
    // Data Actions
    $("[data-toggle='tooltip']").tooltip({
        placement: $(this).data("placement") || 'top'
    });
    $('#userCreationForm').off('submit');
    $('#userCreationForm').on('submit', SettingsHandler.self.addUser);
    $('#auto_generate_password').off('click');
    $('#auto_generate_password').on('click', SettingsHandler.prototype.auto_generate_password);
    $('#backtoUsersButton').off('click');
    $('#backtoUsersButton').on('click', SettingsHandler.self.manage_users);

    $('#createUserButtom').html('<i class="mdl-color-text--white material-icons" role="presentation">create</i>Update User').val("update");

    $(".create_staff_panel").fadeIn('fast');

    $("#userFirstName").attr("required", "required");
    $(".userFirstName_panel").show();

    $("#userOffice").attr("required", "required");
    $(".userOffice_panel").show();

    $("#userFirstName").attr("required", "required");
    $(".userFirstName_panel").show();

    $("#userLastName").attr("required", "required");
    $(".userLastName_panel").show();

    $("#userEmailAddress").attr("required", "required");
    $(".userEmailAddress_panel").show();

    $("#userRole").attr("required", "required");
    $(".userRole_panel").show();

    showContent($('#add_user_page'));

    $("#userFirstName").val(object.firstname);
    $("#userLastName").val(object.lastname);
    $("#userRole").val(object.selectedRoles[0].id);
    $("#userOffice").val(object.officeId);
    $("#userEmailAddress").val(object.email);
    $("#user_username").val(object.username);

    $("#user_username").removeAttr("required");
    $(".username_panel").hide();

    $("#user_password").removeAttr("required");
    $(".userpassword_panel").hide();

    $("#user_re_password").removeAttr("required");
    $(".user_re_password_panel").hide();

    $(".auto_generate_password_panel").hide();


    var header_text = 'Update User' + '<a class="btn customCancelButton pull-right" id="_update_user_password_btn" data-target="profile">Update Password</a>';
    $('#add_user_page .panel-heading').html(header_text);

    $("#_update_user_password_btn").off();
    $("#_update_user_password_btn").on('click touch', SettingsHandler.self.init_password_update);


    $("#deactivateUsersButton").fadeIn('fast');
    $("#deactivateUsersButton").off();
    $("#deactivateUsersButton").val("deactivate");

    var deactivate_html = ' <i class="mdl-color-text--white material-icons" role="presentation">person</i> Deactivate User ';
    $("#deactivateUsersButton").html(deactivate_html);
    $("#deactivateUsersButton").off().on('click touch', SettingsHandler.self.deactivateUser);
    $("#editUserButton").off('click touch').on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleEditUserButton();
    });
    $("#updateUserButton").off('click touch').on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleUpdateUserDetailsButton();
    });
    $("#cancelEditButton").off('click touch').on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleCancelEditUserButton();
    });
};

//Deactivate User 
SettingsHandler.prototype.deactivateUser = function () {
    var confirmDialogHeader = 'Confirm User Deactivate';
    var confirmDialogBody = 'Are you sure you want to deactivate this user ?';
    var confirmDialogPositiveText = 'Yes';
    var confirmDialogNegativeText = 'No';
    showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText,
            function ()
            {
                //yes deactivate
                var user_id = SettingsHandler.self.user_details.id;
                var url = host + '/user/v1d/deactiveUser/' + user_id;
                var headers = getAuthenticationHeader();
                $.ajax({
                    url: url,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: headers,
                    type: 'POST',
                    beforeSend: function () {
                        showLoader();
                    },
                    success: function (data) {
                        // console.log(data);
                        var deactivate_html = ' <i class="mdl-color-text--white material-icons" role="presentation">person</i> Deactivate User ';
                        $("#deactivateUsersButton").html(deactivate_html);
                        $("#deactivateUsersButton").off();
                        SettingsHandler.prototype.deactivateLocalUser(user_id);
                        SettingsHandler.self.manage_users();
                        hideLoader();
                        showAlertMessage("User Deactivated Succesfully", AlertTypes.success);
                    },
                    complete: function () {

                    }
                }).fail(function (Response) {
                    // console.log(Response);
                });
            },
            confirmDialogNegativeText,
            function ()
            {
                //no dont deactivate
            });
};

SettingsHandler.prototype.deactivateLocalUser = function (user_id)
{
    var dataList = SettingsHandler.self.system_users_list;
    for (var i = 0; i < dataList.length; i++) {
        if (dataList[i].id === user_id) {
            SettingsHandler.self.system_users_list.splice(i, 1);
            break;
        }
    }
};

SettingsHandler.prototype.showUpdatePasswordButtons = function ()
{
    $("#cancelPasswordEditButton").show();
    $("#updateUserPasswordButton").show();

    $("#createUserButtom").hide();
    $("#backtoUsersButton").hide();
    $("#deactivateUsersButton").hide();
    $("#editUserButton").hide();
    $("#updateUserButton").hide();
    $("#cancelEditButton").hide();
};

SettingsHandler.prototype.hideUpdatePasswordButtons = function ()
{
    $("#cancelPasswordEditButton").hide();
    $("#updateUserPasswordButton").hide();

    $("#createUserButtom").hide();
    $("#backtoUsersButton").show();
    $("#deactivateUsersButton").show();
    $("#editUserButton").show();
    $("#updateUserButton").hide();
    $("#cancelEditButton").hide();
};

SettingsHandler.prototype.handleCancelPasswordUpdateButton = function ()
{
    SettingsHandler.prototype.hideUpdatePasswordButtons();

    clearFormValidators($('#userCreationForm'));
    var object = SettingsHandler.self.user_details;
    hideContent();
    SettingsHandler.prototype.disableUserFieldsForUpdate();
    SettingsHandler.prototype.showUpdateUserButtons();

    initDefaultContent('Edit User ');

    //reset the form 
    document.getElementById("userCreationForm").reset();

    // Load the Roles List
    var roles = handlers['Roles'].get_system_roles();
    var role_select_options = "";
    role_select_options += "<option value=''>  Select User Role  </option>";

    if (roles != undefined && roles != null) {
        for (var role = 0; role < roles.length; role++) {
            role_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + roles[role].description + "'   value='" + roles[role].id + "' id='" + roles[role].id + "' data-description='" + roles[role].description + "'> " + roles[role].name + " </option>";
        }
    }
    $("#userRole").html(role_select_options);

    var offices = handlers['Offices'].get_system_offices();
    var offices_select_options = "";
    offices_select_options += "<option value=''>  Select Office  </option>";

    if (offices != undefined && offices != null) {
        for (var office = 0; office < offices.length; office++) {
            offices_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + offices[office].nameDecorated + "'   value='" + offices[office].id + "' id='" + offices[office].id + "' data-description='" + offices[office].name + "'> " + offices[office].name + " </option>";
        }

    }
    $("#userOffice").html(offices_select_options);
    // Data Actions
    $("[data-toggle='tooltip']").tooltip({
        placement: $(this).data("placement") || 'top'
    });
    $('#userCreationForm').off('submit');
    $('#userCreationForm').on('submit', SettingsHandler.self.addUser);
    $('#auto_generate_password').off('click');
    $('#auto_generate_password').on('click', SettingsHandler.prototype.auto_generate_password);
    $('#backtoUsersButton').off('click');
    $('#backtoUsersButton').on('click', SettingsHandler.self.manage_users);

    $('#createUserButtom').html('<i class="mdl-color-text--white material-icons" role="presentation">create</i>Update User').val("update");

    $(".create_staff_panel").fadeIn('fast');

    $("#userFirstName").attr("required", "required");
    $(".userFirstName_panel").show();

    $("#userOffice").attr("required", "required");
    $(".userOffice_panel").show();

    $("#userFirstName").attr("required", "required");
    $(".userFirstName_panel").show();

    $("#userLastName").attr("required", "required");
    $(".userLastName_panel").show();

    $("#userEmailAddress").attr("required", "required");
    $(".userEmailAddress_panel").show();

    $("#userRole").attr("required", "required");
    $(".userRole_panel").show();

    showContent($('#add_user_page'));

    $("#userFirstName").val(object.firstname);
    $("#userLastName").val(object.lastname);
    $("#userRole").val(object.selectedRoles[0].id);
    $("#userOffice").val(object.officeId);
    $("#userEmailAddress").val(object.email);
    $("#user_username").val(object.username);

    $("#user_username").removeAttr("required");
    $(".username_panel").hide();

    $("#user_password").removeAttr("required");
    $(".userpassword_panel").hide();

    $("#user_re_password").removeAttr("required");
    $(".user_re_password_panel").hide();

    $(".auto_generate_password_panel").hide();


    var header_text = 'Update User' + '<a class="btn customCancelButton pull-right" id="_update_user_password_btn" data-target="profile">Update Password</a>';
    $('#add_user_page .panel-heading').html(header_text);

    $("#_update_user_password_btn").off();
    $("#_update_user_password_btn").on('click touch', SettingsHandler.self.init_password_update);


    $("#deactivateUsersButton").fadeIn('fast');
    $("#deactivateUsersButton").off();
    $("#deactivateUsersButton").val("deactivate");

    var deactivate_html = ' <i class="mdl-color-text--white material-icons" role="presentation">person</i> Deactivate User ';
    $("#deactivateUsersButton").html(deactivate_html);
    $("#deactivateUsersButton").off().on('click touch', SettingsHandler.self.deactivateUser);
    $("#editUserButton").off('click touch').on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleEditUserButton();
    });
    $("#updateUserButton").off('click touch').on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleUpdateUserDetailsButton();
    });
    $("#cancelEditButton").off('click touch').on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleCancelEditUserButton();
    });
};

SettingsHandler.prototype.handleSubmitPasswordButton = function (e)
{
    if ($("#user_username").val().length > 4 && $("#user_re_password").val().length > 7 && $("#user_password").val().length > 7) {
        console.log("reached here 1");
        var user_username = $("#user_username").val();
        var user_rpt_password = $("#user_re_password").val();
        var user_password = $("#user_password").val();
        if (user_rpt_password === user_password)
        {
            console.log("reached here 2");
            var confirmDialogHeader = 'Confirm Password Update';
            var confirmDialogBody = "Are you sure you want to edit this user's credentials with the provided details";
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText,
                    function () {
                        //yes update password
                        var user_detail = SettingsHandler.self.user_details;
                        var url = host + '/user/v1d/updatePassword/' + user_detail.id;
                        var body = '{"password":"' + user_password + '","repeatPassword":"' + user_password + '","username":"' + user_username + '"}';
                        $.ajax({
                            url: url,
                            data: body,
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            headers: getAuthenticationHeader(),
                            type: 'POST',
                            beforeSend: function () {
                                showLoader();
                            },
                            success: function (data) {
                                // TODO : Redirect to Manage Users Page 
                                console.log('Successful user password update');
                                SettingsHandler.prototype.updateLocalUserUserName(user_detail.id, user_username);
                                SettingsHandler.self.user_details = null;
                                $('#createUserButtom').html(' <i class="mdl-color-text--white material-icons" role="presentation">create</i> Submit').val("save");
                                document.getElementById("userCreationForm").reset();
                                hideLoader();
                                showAlertMessage("User credentials successfully updated", AlertTypes.success);
                                SettingsHandler.self.manage_users();
                            },
                            complete: function () {
                                //   showFadingMessage("complete");
                                hideLoader();
                            }
                        }).fail(function (Response) {
                            // console.log(Response);
                            // console.log("Response ");
                            // console.log(Response.status);
                            hideLoader();
                            if (Response.status === 403) {
                                showAlertMessage("User with Username or Email Already Exists in the databse ", AlertTypes.warning);
                            } else if (Response.status === 500) {
                                showAlertMessage("Server Not Reacheable, Check Your Internet Connectivity ", AlertTypes.danger);
                            } else {
                                showAlertMessage("Something went wrong contact customer support ", AlertTypes.danger);
                            }
                        });
                    }, confirmDialogNegativeText,
                    function () {
                        //no dont update password
                    });
        } else
        {
            console.log("reached here 3");
            showAlertMessage("Please ensure that both passwords match.", AlertTypes.danger);
        }
    } else
    {
        console.log("reached here 4");
        showAlertMessage('Please ensure that all fields are filled in correctly', AlertTypes.danger);
    }
};

SettingsHandler.prototype.init_password_update = function () {
    showContent($('#add_user_page'));
    SettingsHandler.prototype.showUpdatePasswordButtons();
    $("#updateUserPasswordButton").on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleSubmitPasswordButton();
    });
    $("#cancelPasswordEditButton").on('click touch', function () {
        $('#userCreationForm').off('submit');
        $('#userCreationForm').on('submit', function (e) {
            e.preventDefault();
        });
        SettingsHandler.prototype.handleCancelPasswordUpdateButton();
    });
    $(".create_staff_panel").hide();
    $("#userFirstName").removeAttr("required");
    $(".userFirstName_panel").hide();
    $("#userOffice").removeAttr("required");
    $(".userOffice_panel").hide();
    $("#userFirstName").removeAttr("required");
    $(".userFirstName_panel").hide();
    $("#userLastName").removeAttr("required");
    $(".userLastName_panel").hide();
    $("#userEmailAddress").removeAttr("required");
    $(".userEmailAddress_panel").hide();
    $("#userRole").removeAttr("required");
    $(".userRole_panel").hide();
    $("#user_username").attr("required", "required");
    $(".username_panel").show();
    $(".userpassword_panel").show();
    $("#user_password").attr("required", "required").show();
    $(".user_re_password_panel").show();
    $("#user_re_password").attr("required", "required").show();
    $(".auto_generate_password_panel").show();
};

SettingsHandler.prototype.showCreateUserButtons = function ()
{
    $("#createUserButtom").show();
    $("#backtoUsersButton").show();
    $("#deactivateUsersButton").hide();
    $("#editUserButton").hide();
    $("#updateUserButton").hide();
    $("#cancelEditButton").hide();
    $("#cancelPasswordEditButton").hide();
    $("#updateUserButton").hide();
    $("#cancelPasswordEditButton").hide();
    $("#updateUserPasswordButton").hide();
};

SettingsHandler.prototype.showUpdateUserButtons = function ()
{
    $("#createUserButtom").hide();
    $("#backtoUsersButton").show();
    $("#deactivateUsersButton").show();
    $("#editUserButton").show();
    $("#updateUserButton").hide();
    $("#cancelEditButton").hide();
    $("#updateUserButton").hide();
    $("#cancelPasswordEditButton").hide();
    $("#updateUserPasswordButton").hide();
};

SettingsHandler.prototype.disableUserFieldsForUpdate = function ()
{
    document.getElementById("userFirstName").disabled = true;
    document.getElementById("userOffice").disabled = true;
    document.getElementById("userLastName").disabled = true;
    document.getElementById("userRole").disabled = true;
    document.getElementById("userEmailAddress").disabled = true;
};

SettingsHandler.prototype.enableUserFieldsForUpdate = function ()
{
    document.getElementById("userFirstName").disabled = false;
    document.getElementById("userOffice").disabled = false;
    document.getElementById("userLastName").disabled = false;
    document.getElementById("userRole").disabled = false;
    document.getElementById("userEmailAddress").disabled = false;
};

SettingsHandler.prototype.handleEditUserButton = function ()
{
    SettingsHandler.prototype.enableUserFieldsForUpdate();
    $("#cancelEditButton").show();
    $("#updateUserButton").show();
    $("#editUserButton").hide();
    $("#createUserButtom").hide();
    $("#backtoUsersButton").hide();
    $("#deactivateUsersButton").hide();
};

SettingsHandler.prototype.handleCancelEditUserButton = function ()
{
    SettingsHandler.prototype.disableUserFieldsForUpdate();
    SettingsHandler.prototype.showUpdateUserButtons();
    $("#userFirstName").val(SettingsHandler.self.user_details.firstname);
    $("#userLastName").val(SettingsHandler.self.user_details.lastname);
    $("#userRole").val(SettingsHandler.self.user_details.selectedRoles[0].id);
    $("#userOffice").val(SettingsHandler.self.user_details.officeId);
    $("#userEmailAddress").val(SettingsHandler.self.user_details.email);
    $("#user_username").val(SettingsHandler.self.user_details.username);
    //SettingsHandler.prototype.view_user(SettingsHandler.self.user_details);
};

SettingsHandler.prototype.handleUpdateUserDetailsButton = function ()
{
    if (validateForm($('#userCreationForm'))) {
        var userFirstName = $("#userFirstName").val();
        var userLastName = $("#userLastName").val();
        var userRole = $("#userRole").val();
        var roleName = $("#userRole option:selected").text();
        var userOffice = $("#userOffice").val();
        var officeName = $("#userOffice option:selected").text();
        var userEmailAddress = $("#userEmailAddress").val();
        var user_username = $("#user_username").val();
        userEditBodyDetails = [];
        userEditBodyDetails.firstname = userFirstName;
        userEditBodyDetails.lastname = userLastName;
        userEditBodyDetails.roleid = userRole;
        userEditBodyDetails.rolename = roleName;
        userEditBodyDetails.officeid = userOffice;
        userEditBodyDetails.officename = officeName;
        userEditBodyDetails.email = userEmailAddress;
        userEditBodyDetails.username = user_username;
        userEditBodyDetails.userid = SettingsHandler.self.user_details.id;

        var user_detail = SettingsHandler.self.user_details;

        var confirmDialogHeader = 'Confirm User Update';
        var confirmDialogBody = 'Are you sure you want to edit this user with the provided details';
        var confirmDialogPositiveText = 'Yes';
        var confirmDialogNegativeText = 'No';
        showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, SettingsHandler.prototype.sendUserUpdateDataHandler, confirmDialogNegativeText, SettingsHandler.prototype.handleNoConfirmUserOption);
    } else
    {
        showAlertMessage('Please ensure that all fields are filled in correctly', AlertTypes.danger);
    }
};

SettingsHandler.prototype.handleNoConfirmUserOption = function ()
{

};

SettingsHandler.prototype.sendUserUpdateDataHandler = function ()
{
    var url = host + '/user/v1d/editUser/' + userEditBodyDetails.userid;
    var body = '{"firstname":"' + userEditBodyDetails.firstname + '"\n\
                ,"lastname":"' + userEditBodyDetails.lastname + '"\n\
                ,"email":"' + userEditBodyDetails.email + '"\n\
                ,"officeId":"' + userEditBodyDetails.officeid + '"\n\
                ,"roleId":"' + userEditBodyDetails.roleid + '"}';
    $.ajax({
        url: url,
        data: body,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: getAuthenticationHeader(),
        type: 'POST',
        beforeSend: function ()
        {
            showLoader();
        },
        success: function (data)
        {
            console.log("successful user edit");
            console.log(data);
            SettingsHandler.prototype.handleSuccessfulUserEdit();
        },
        complete: function ()
        {

        }
    }).fail(function (Response)
    {
        SettingsHandler.prototype.handleFailedUserEdit();
    });
};

SettingsHandler.prototype.handleSuccessfulUserEdit = function ()
{
    var id = userEditBodyDetails.userid,
            firstName = userEditBodyDetails.firstname,
            lastName = userEditBodyDetails.lastname,
            username = userEditBodyDetails.username,
            email = userEditBodyDetails.email,
            officeId = userEditBodyDetails.officeid,
            officeName = userEditBodyDetails.officename,
            roleId = userEditBodyDetails.roleid,
            roleName = userEditBodyDetails.rolename,
            awamoId = "",
            staffId = ""
            ;
    SettingsHandler.prototype.updateLocalUser(id, firstName, lastName, username, email, officeId, officeName, roleId, roleName, awamoId, staffId);
    document.getElementById("userCreationForm").reset();
    hideLoader();
    showAlertMessage("User details successfully updated", AlertTypes.success);
    SettingsHandler.self.user_details = null;
    SettingsHandler.self.manage_users();
};

SettingsHandler.prototype.handleFailedUserEdit = function ()
{
    hideLoader();
    showAlertMessage("Failed to update user details, Please try again", AlertTypes.info);
};

// Add User 
SettingsHandler.prototype.add_user = function () {
    hideContent();
    initDefaultContent('Create User');

    SettingsHandler.prototype.enableUserFieldsForUpdate();
    SettingsHandler.prototype.showCreateUserButtons();
    //reset the form 
    document.getElementById("userCreationForm").reset();
    clearFormValidators($('#userCreationForm'));
    registerKeyPressValidators($('#userCreationForm'));
    // Load the Roles List
    var roles = handlers['Roles'].get_system_roles();
    var role_select_options = "";
    role_select_options += "<option value=''>  Select User Role  </option>";

    if (undefined != roles || null != roles) {
        for (var role = 0; role < roles.length; role++) {
            role_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + roles[role].description + "'   value='" + roles[role].id + "' id='" + roles[role].id + "' data-description='" + roles[role].description + "'> " + roles[role].name + " </option>";
        }
    }

    $("#userRole").html(role_select_options);

    var offices = handlers['Offices'].get_system_offices();
    var offices_select_options = "";
    offices_select_options += "<option   value=''  >  Select Office  </option>";

    if (undefined != offices || null != offices) {
        for (var office = 0; office < offices.length; office++) {
            offices_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + offices[office].nameDecorated + "'   value='" + offices[office].id + "' id='" + offices[office].id + "' data-description='" + offices[office].name + "'> " + offices[office].name + " </option>";
        }
    }

    $("#userOffice").html(offices_select_options);

    // Data Actions
    $("[data-toggle='tooltip']").tooltip({
        placement: $(this).data("placement") || 'top'
    });
    $('#userCreationForm').off('submit');
    $('#userCreationForm').on('submit', SettingsHandler.self.addUser);
    $('#auto_generate_password').off('click');
    $('#auto_generate_password').on('click', SettingsHandler.prototype.auto_generate_password);
    $('#backtoUsersButton').off('click');
    $('#backtoUsersButton').on('click', SettingsHandler.self.manage_users);

    showContent($('#add_user_page'));
    $('#add_user_page .panel-heading').text("Add User");
    $('#createUserButtom').html('<i class="mdl-color-text--white material-icons" role="presentation">create</i> Submit').val("save");

    $("#user_username").attr("required", "required");
    $(".username_panel").show();

    $("#user_password").attr("required", "required");
    $(".userpassword_panel").show();

    $("#user_re_password").attr("required", "required");
    $(".user_re_password_panel").show();

    $(".auto_generate_password_panel").show();

    $(".create_staff_panel").show();

    $("#userFirstName").attr("required", "required");
    $(".userFirstName_panel").show();

    $("#userOffice").attr("required", "required");
    $(".userOffice_panel").show();

    $("#userFirstName").attr("required", "required");
    $(".userFirstName_panel").show();

    $("#userLastName").attr("required", "required");
    $(".userLastName_panel").show();

    $("#userEmailAddress").attr("required", "required");
    $(".userEmailAddress_panel").show();

    $("#userRole").attr("required", "required");
    $(".userRole_panel").show();

    $("#userpassword").attr("required", "required").fadeIn('fast');
    $(".userpassword_panel").show();

    $("#user_re_password").attr("required", "required").fadeIn('fast');
    $(".user_re_password_panel").show();

    $("#deactivateUsersButton").hide();
};

SettingsHandler.prototype.auto_generate_password = function (event) {

    if ($(this)[0].checked) {
        $("#user_password").removeAttr("required").fadeOut('slow');
        //$("#user_username").removeAttr( "required" ).fadeOut('slow');
        $("#user_re_password").removeAttr("required").fadeOut('slow');


        //Make Email Address Mandatory
        $("#userEmailAddress").attr("required", "required");

        // $(".username_panel").fadeOut('slow');
        $(".userpassword_panel").fadeOut('slow');
        $(".user_re_password_panel").fadeOut('fast');

    } else {
        $("#user_password").attr("required", "required").fadeIn('slow');
        //$("#user_username").attr( "required","required").fadeIn('slow');
        $("#user_re_password").attr("required", "required").fadeIn('slow');

        // Email Address May not be Mandatory Depending
        $("#userEmailAddress").removeAttr("required");

        // $(".username_panel").fadeIn('slow');
        $(".userpassword_panel").fadeIn('slow');
        $(".user_re_password_panel").fadeIn('fast');
    }
};

// Add User
SettingsHandler.prototype.addUser = function (event) {
    event.preventDefault();
    if (validateForm($('#userCreationForm'))) {
        var formEl = $(this);
        var submitButton = $('input[type=submit]', formEl);
        var creat_staff = true;
        var auto_generate_password = $("#auto_generate_password").is(":checked");
        var userFirstName = $("#userFirstName").val();
        var userLastName = $("#userLastName").val();
        var userRole = $("#userRole").val();
        var roleName = $("#userRole option:selected").text();
        var userOffice = $("#userOffice").val();
        var officeName = $("#userOffice option:selected").text();
        var userEmailAddress = $("#userEmailAddress").val();
        var user_username = $("#user_username").val();
        var user_password = "";
        var user_re_password = "";
        var submit_button_status = $("#createUserButtom").val();
        // Check Validation for Madantories
        var mandatory_fields = null;
        if (submit_button_status === "save")
        {
            mandatory_fields = ['firstname', 'lastname', 'role', 'office', 'username'];
        }
        if (submit_button_status === "update_password")
        {
            mandatory_fields = ['username'];
        }
        var x = 0;
        if (mandatory_fields !== null) {
            while (x < mandatory_fields.length) {
                switch (mandatory_fields[x]) {
                    case 'username':
                        if (user_username.length === 0 || user_username === '' || user_username === undefined) {
                            showAlertMessage("Enter First Name", AlertTypes.warning);
                            return;
                        }
                        break;
                    case 'firstname':
                        if (userFirstName.length === 0 || userFirstName === '' || userFirstName === undefined) {
                            showAlertMessage("Enter First Name", AlertTypes.warning);
                            return;
                        }
                        break;
                    case 'lastname':
                        if (userFirstName.length === 0 || userFirstName === '' || userFirstName === undefined) {
                            showAlertMessage("Enter First Name", AlertTypes.warning);
                            return;
                        }
                        break;
                    case 'role':
                        if (userRole.length === 0 || userRole === '' || userRole === undefined) {
                            showAlertMessage("Select Role", AlertTypes.warning);
                            return;
                        }
                        break;
                    case 'office':
                        if (userOffice.length === 0 || userOffice === '' || userOffice === undefined) {
                            showAlertMessage("Select Office ", AlertTypes.warning);
                            return;
                        }
                        break;
                    default:
                        break;
                }
                x++;
            }
        }
        // Specific Validations
        if (auto_generate_password === true) {
            user_password = user_re_password = generatePassword();
        } else {

            user_password = $("#user_password").val();
            user_re_password = $("#user_re_password").val();

            // Test User Credentials ::
            if (user_password !== user_re_password) {
                showAlertMessage("Passwords Do not Match ", AlertTypes.warning);
                return;
            }

        }
        var body = '';
        var headers = getAuthenticationHeader();
        var url = "";
        if (submit_button_status === "save")
        {
            url = host + '/user/v1d/createUser';
            body = '{"firstname":"' + userFirstName + '","lastname":"' + userLastName + '","password":"' + user_password + '","repeatPassword":"' + user_password + '","email":"' + userEmailAddress + '","officeId":"' + userOffice + '","roleId":"' + userRole + '","username":"' + user_username + '","creat_staff":"' + (creat_staff ? true : false) + '"}';
            var confirmDialogHeader = 'Confirm User Details';
            var confirmDialogBody = 'Are you sure you want to create this user with the provided details';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText,
                    function () {
                        //yes create user with specified details
                        $.ajax({
                            url: url,
                            data: body,
                            dataType: 'json',
                            contentType: "application/json; charset=utf-8",
                            headers: headers,
                            type: 'POST',
                            beforeSend: function () {
                                showLoader();
                                submitButton.prop('disabled', 'disabled');
                            },
                            success: function (data) {
                                // TODO : Redirect to Manage Users Page 
                                console.log('Successful user creation');
                                console.log(data);
                                SettingsHandler.prototype.populateNewLocalUser(data.resourceId, userFirstName, userLastName, user_username, userEmailAddress, userOffice, officeName, userRole, roleName, data.awamoId, data.staffId);
                                SettingsHandler.self.user_details = null;
                                $('#createUserButtom').html(' <i class="mdl-color-text--white material-icons" role="presentation">create</i> Submit').val("save");
                                document.getElementById("userCreationForm").reset();
                                hideLoader();
                                showAlertMessage("Record Saved Successfully", AlertTypes.success);
                                SettingsHandler.self.manage_users();
                            },
                            complete: function () {
                                hideLoader();
                                submitButton.prop('disabled', false);
                            }
                        }).fail(function (Response) {
                            // console.log(Response);
                            // console.log("Response ");
                            // console.log(Response.status);
                            hideLoader();
                            if (Response.status === 403) {
                                showAlertMessage("User with Username or Email Already Exists in the databse ", AlertTypes.warning);
                            } else if (Response.status === 500) {
                                showAlertMessage("Server Not Reacheable, Check Your Internet Connectivity ", AlertTypes.danger);
                            } else {
                                showAlertMessage("Something went Wrong contact Administrator ", AlertTypes.danger);
                            }
                        });
                    }
            , confirmDialogNegativeText,
                    function () {
                        //no dont create user with specified details
                    });
        }
    } else {
        showAlertMessage('Please ensure that all fields are filled in correctly', AlertTypes.danger);
    }
};

SettingsHandler.prototype.handleCreateUserEvent = function (url, body, headers, submitButton)
{
    $.ajax({
        url: url,
        data: body,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function () {
            showLoader();
            submitButton.prop('disabled', 'disabled');
        },
        success: function (data) {
            // TODO : Redirect to Manage Users Page 
            console.log('Successful user creation');
            console.log(data);
            SettingsHandler.prototype.populateNewLocalUser(data.resourceId, userFirstName, userLastName, user_username, userEmailAddress, userOffice, officeName, userRole, roleName, data.awamoId, data.staffId);
            SettingsHandler.self.user_details = null;
            $('#createUserButtom').html(' <i class="mdl-color-text--white material-icons" role="presentation">create</i> Submit').val("save");
            document.getElementById("userCreationForm").reset();
            hideLoader();
            showAlertMessage("Record Saved Successfully", AlertTypes.success);
            SettingsHandler.self.manage_users();
        },
        complete: function () {
            hideLoader();
            submitButton.prop('disabled', false);
        }
    }).fail(function (Response) {
        // console.log(Response);
        // console.log("Response ");
        // console.log(Response.status);
        hideLoader();
        if (Response.status === 403) {
            showAlertMessage("User with Username or Email Already Exists in the databse ", AlertTypes.warning);
        } else if (Response.status === 500) {
            showAlertMessage("Server Not Reacheable, Check Your Internet Connectivity ", AlertTypes.danger);
        } else {
            showAlertMessage("Something went Wrong contact Administrator ", AlertTypes.danger);
        }
    });
};

SettingsHandler.prototype.populateNewLocalUser = function (id, firstName, lastName, username, email, officeId, officeName, roleId, roleName, awamoId, staffId)
{
    var newCreatedUser = [];
    var selectedRoles = [];
    var selectedRole = [];
    selectedRole.id = roleId;
    selectedRole.name = roleName;
    newCreatedUser.id = id;
    newCreatedUser.firstname = firstName;
    newCreatedUser.lastname = lastName;
    newCreatedUser.selectedRoles = selectedRoles;
    newCreatedUser.selectedRoles[0] = selectedRole;
    newCreatedUser.officeId = officeId;
    newCreatedUser.officeName = officeName;
    newCreatedUser.email = email;
    newCreatedUser.username = username;
    newCreatedUser.awamoId = awamoId;
    newCreatedUser.staffId = staffId;
    SettingsHandler.self.system_users_list.push(newCreatedUser);
};

//the implementation of this method should change, it should follow the abstract list methods
SettingsHandler.prototype.updateLocalUser = function (id, firstName, lastName, username, email, officeId, officeName, roleId, roleName, awamoId, staffId)
{
    var editedUser = [];
    var selectedRoles = [];
    var selectedRole = [];
    selectedRole.id = roleId;
    selectedRole.name = roleName;
    editedUser.id = id;
    editedUser.firstname = firstName;
    editedUser.lastname = lastName;
    editedUser.selectedRoles = selectedRoles;
    editedUser.selectedRoles[0] = selectedRole;
    editedUser.officeId = officeId;
    editedUser.officeName = officeName;
    editedUser.email = email;
    editedUser.username = username;
    editedUser.awamoId = awamoId;
    editedUser.staffId = staffId;
    $.each(SettingsHandler.self.system_users_list, function (index, userObject) {
        if (userObject.id === id)
        {
            SettingsHandler.self.system_users_list[index] = editedUser;
        }
    });
};

SettingsHandler.prototype.updateLocalUserUserName = function (id, username)
{
    $.each(SettingsHandler.self.system_users_list, function (index, userObject) {
        if (userObject.id === id)
        {
            SettingsHandler.self.system_users_list[index].username = username;
        }
    });
};

// Manage Roles 
SettingsHandler.prototype.manage_roles = function () {
    // addHistory('All clients', '#clients', getSidebarSubitemSelector('manageClients', 'Client', 'manageClientsGetAll'));
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    currentTable = 'SystemRoles';
    // SettingsHandler.self.previousPage = ClientHandler.self.manageClientsGetAll;
    handlers['Roles'].display_roles();
};

// Add Role
SettingsHandler.prototype.add_role = function () {
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    currentTable = 'SystemRoles';
    handlers['Roles'].add_role();
};
