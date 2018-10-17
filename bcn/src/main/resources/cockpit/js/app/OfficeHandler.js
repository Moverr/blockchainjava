/*
 * Handler for Managing Offices and Branches
 */
/* global printData, AlertTypes, handlers, host, getAuthenticationHeader */

//Author:  MOver
var manageOfficeCreationDate;
var OfficeHandler = function () {
    OfficeHandler.self = this;
};

OfficeHandler.prototype.system_offices = null;
OfficeHandler.prototype.init = function (callback) {
    ajax('/offices/v1d/getAllOffices/', 'GET', function (roles) {
        OfficeHandler.self.system_offices = roles;
        // console.log(" System Offices  ");
        // console.log(OfficeHandler.self.system_offices);

        if (undefined !== callback && null !== callback)
            callback();

    }, null, getAuthenticationHeader());
};

OfficeHandler.prototype.get_system_offices = function () {
    return OfficeHandler.self.system_offices;
};

OfficeHandler.DISPLAY_OFFICE_TITLES = {
    fullname: 'Name',
    parentOffice: 'Parent Office ',
    date_created: ' Date Opened '
};

OfficeHandler.prototype.add_office = function () {
    hideContent();

    $("#officeFormPanelHeading").html("New Office");
    OfficeHandler.prototype.enableOfficeFieldsForCreateAndEdit();
    OfficeHandler.prototype.showOfficeCreationButtons();
    var offices = OfficeHandler.self.get_system_offices();
    var offices_select_options = "";
    offices_select_options += "<option   value=''  >  Select Office  </option>";

    if (offices != undefined && offices != null) {
        for (var office = 0; office < offices.length; office++) {
            offices_select_options += "<option  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + offices[office].nameDecorated + "'   value='" + offices[office].id + "' id='" + offices[office].id + "' data-description='" + offices[office].name + "'> " + offices[office].name + " </option>";
        }

    }

    $("#systemOffices").html(offices_select_options);

    $('#createOfficeButtom').off('click touch').on('click touch', OfficeHandler.self.handleOfficeCreateButton);
    $('#back_to_offices').off('click').on('click', handlers['Settings'].manage_offices);

    document.getElementById("createOffficeForm").reset();
    clearFormValidators($('#createOffficeForm'));
    registerKeyPressValidators($('#createOffficeForm'));
    showContent($('#add_office_page'));
    $("#office_date_opened").prop('disabled', false);
};

OfficeHandler.prototype.handleOfficeCreateButton = function (event) {
    event.preventDefault();
    if (validateForm($('#createOffficeForm'))) {
        var formEl = $(this);
        var submitButton = $('input[type=submit]', formEl);
        var officeName = $("#officeName").val();
        var parent_office = $("#systemOffices").val();
        var date_created = manageOfficeCreationDate;
        if (date_created === null || date_created === '' || date_created === "undefined") {
            showAlertMessage("Enter Date Created ", AlertTypes.warning);
            return;
        }
        if (officeName === null || officeName === '' || officeName === undefined || officeName.length === 0) {
            showAlertMessage("Enter Office Name", AlertTypes.warning);
            return;
        }
        var confirmDialogHeader = 'Confirm Office Creation';
        var confirmDialogBody = 'Are you sure you want to create this office with the provided details';
        var confirmDialogPositiveText = 'Yes';
        var confirmDialogNegativeText = 'No';
        showDialogPopupWithHandlers(confirmDialogHeader
                , confirmDialogBody
                , confirmDialogPositiveText
                , function ()
                {
                    //yes am sure
                    // Send Data to the ENd Point
                    var date = new Date(manageOfficeCreationDate);
                    var officeCreationDate = date.toString("dd MMM yyyy");
                    var body = '{"name":"' + officeName + '"';
                    if (parent_office > 0)
                        body += ',"parentId":"' + parent_office + '"';
                    body += ',"openingDate":"' + officeCreationDate + '"}';
                    // console.log('request body');
                    // console.log(body);
                    var headers = getAuthenticationHeader();
                    var $body = $("body");
                    $.ajax({
                        url: host + '/offices/v1d/createOffice',
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
                            OfficeHandler.self.init(function () {
                                showAlertMessage("Office Saved Successfully", AlertTypes.success);
                                hideLoader();
                                handlers['Settings'].manage_offices();
                            });
                        },
                        complete: function () {
                            //   showFadingMessage("complete");
                            hideLoader();
                            submitButton.prop('disabled', false);
                        }
                    }).fail(function (Response) {
                        // console.log(Response);
                        // console.log("Response ");
                        // console.log(Response.status);
                        if (Response.status === 403) {
                            showAlertMessage("Office was not Saved Correctlty", AlertTypes.danger);
                        } else if (Response.status === 404) {
                            showAlertMessage("Server Not Reacheable, Check Your Internet Connectivity ", AlertTypes.danger);
                        } else {
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
    } else {
        showAlertMessage('Please ensure that all the fields are filled in correctly', AlertTypes.danger);
    }
};

OfficeHandler.prototype.get_officeParent_id = function (hierarchy, current_office_id) {
    var dataList = OfficeHandler.self.get_system_offices();
    var targets = hierarchy.split('.');
    var parent_office_ids = [];
    if (targets.length > 1) {
        parent_office_ids[0] = 1;
    }
    var count = 1;
    $.each(targets, function (index, item) {
        // console.log("targets");
        // console.log(targets[index]);
        if (targets[index] != current_office_id && targets[index] != "") {
            parent_office_ids[count] = parseInt(targets[index]);
            count = count + 1;
        }
    });
    return parent_office_ids;
};

OfficeHandler.prototype.get_officeParent = function (hierarchy, current_office_id) {
    var dataList = OfficeHandler.self.get_system_offices();
    var targets = hierarchy.split('.');
    var parent_offices = " ";
    if (targets.length > 1) {
        parent_offices += " Head Office , ";
    }
    $.each(targets, function (index, item) {
        if (item !== "") {
            var i = 0;
            var count = 0;
            while (i < dataList.length - 1) {
                // && (item !== current_office_id)
                if (("" + dataList[i].id === item) && ("" + item !== "" + current_office_id)) {
                    parent_offices += dataList[i].name;
                    if ((count - i) > 0)
                        parent_offices += " , ";
                    count = i;
                }
                i++;
            }
        }
    });
    return parent_offices;
};

OfficeHandler.prototype.display_offices = function () {
    OfficeHandler.self.currentOffice = null;
    initDefaultContent('Offices ');
    $('#printNow').off('click touch');
    $('#printNow').on('click touch', printData);
    $('#printNow').show();
    $('#create_object').off('click touch');
    $('#create_object').text("Create Office ");
    $('#create_object').on('click touch', OfficeHandler.self.add_office);
    $('#create_object').show();
    // Get the OFfices List from
    var dataList = OfficeHandler.self.get_system_offices();
    var $rowContainer = getDefaultRowContainer(OfficeHandler.DISPLAY_OFFICE_TITLES, true);
    var $table = $rowContainer.parent();
    for (var i = 0; i < dataList.length; i++) {
        var rowdata = {};
        var formattedValue = dataList[i];
        rowdata['name'] = formattedValue.name;
        var offices = OfficeHandler.self.get_officeParent(dataList[i].hierarchy, dataList[i].id);
        rowdata['parent_offices'] = offices;
        var openingDate = dataList[i].openingDate;
        if (openingDate !== null || openingDate !== undefined) {
            rowdata['date_created'] = " " + getMonth(openingDate[1]) + "  " + openingDate[2] + " " + openingDate[0];
        } else {
            rowdata['date_created'] = " N/A";
        }
        addRow($rowContainer, rowdata, dataList[i], OfficeHandler.self.rowClickHandler, dataList[i].id);
    }
    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: {
            sorter: 'awamoDateSorter'
        },
        4: {
            sorter: 'awamoDateSorter'
        }
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
        fileName: "Offices" + (new Date().toJSON().slice(0, 10).replace(/-/g, '_')),
        headings: true
    });
    $("#hiddenPrintedTitle").val("Users Report");
};

OfficeHandler.prototype.rowClickHandler = function () {
    OfficeHandler.self.manage_office($(this).data('object'));
};

OfficeHandler.prototype.selected_office_id = 0;
OfficeHandler.prototype.manage_office = function (office_detail) {
    OfficeHandler.self.selected_office_id = office_detail.id;
    OfficeHandler.prototype.disableOfficeFieldsForEdit();
    $("#cancelOfficeEditButton").off("click touch").on('click touch',function(e){
        e.preventDefault();
        OfficeHandler.prototype.handleOfficeCancelUpdateButton();
    });
    $("#editOfficeButtom").off("click touch").on('click touch',function(e){
        e.preventDefault();
        OfficeHandler.prototype.handleOfficeEditButton();
    });
    document.getElementById("createOffficeForm").reset();
    clearFormValidators($('#createOffficeForm'));
    registerKeyPressValidators($('#createOffficeForm'));
    $("#officeFormPanelHeading").html("View/Edit " + office_detail.name);
    hideContent();
    var offices = OfficeHandler.self.get_system_offices();
    var offices_select_options = "";
    offices_select_options += "<option   value=''  >  Select Office  </option>";

    var office_parent = OfficeHandler.self.get_officeParent_id(office_detail.hierarchy, office_detail.id);

    var office_parent_id = 0;
    office_parent_id = office_parent[office_parent.length - 1];

    if (offices != undefined && offices != null) {
        for (var office = 0; office < offices.length; office++) {
            var selected = "";
            if (offices[office].id === office_detail.id)
                continue;
            {
                if (offices[office].id === office_parent_id)
                    selected = "selected";

                var office_parent_id = office_parent[office_parent.length - 1];
                offices_select_options += "<option  " + selected + "  data-toggle='tooltip' data-trigger='focus' data-placement='top' title=' DESCRIPTION :  " + offices[office].nameDecorated + "'   value='" + offices[office].id + "' id='" + offices[office].id + "' data-description='" + offices[office].name + "'> " + offices[office].name + " </option>";

            }
        }
    }

    $("#systemOffices").html(offices_select_options);
    $('#officeName').val(office_detail.name);
    $("#office_date_opened").val(office_detail.openingDate[2] + " " + getMonth(office_detail.openingDate[1]) + " " + office_detail.openingDate[0]);
    $("#office_date_opened").prop('disabled', true);
    $('#updateOfficeButtom').off('click touch').on('click touch', OfficeHandler.self.handleOfficeUpdateButton);
    $('#back_to_offices').off('click').on('click', handlers['Settings'].manage_offices);
    manageOfficeCreationDate = $("#office_date_opened").val();
    showContent($('#add_office_page'));
    OfficeHandler.prototype.showOfficeUpdateButtons();
};

OfficeHandler.prototype.handleOfficeCancelUpdateButton = function ()
{
    OfficeHandler.prototype.disableOfficeFieldsForEdit();
    $.each(OfficeHandler.self.get_system_offices(), function (index, office_detail) {
        if (office_detail.id === OfficeHandler.self.selected_office_id)
        {
            OfficeHandler.prototype.manage_office(office_detail);
        }
    });
};

OfficeHandler.prototype.handleOfficeEditButton = function ()
{
    OfficeHandler.prototype.showOfficeEditButtons();
    OfficeHandler.prototype.enableOfficeFieldsForCreateAndEdit();
};

OfficeHandler.prototype.showOfficeCreationButtons = function ()
{
    $("#editOfficeButtom").hide();
    $("#updateOfficeButtom").hide();
    $("#createOfficeButtom").show();
    $("#back_to_offices").show();
    $("#cancelOfficeEditButton").hide();
};

OfficeHandler.prototype.disableOfficeFieldsForEdit = function ()
{
    document.getElementById("systemOffices").disabled = true;
    document.getElementById("officeName").disabled = true;
    document.getElementById("office_date_opened").disabled = true;
};

OfficeHandler.prototype.enableOfficeFieldsForCreateAndEdit = function ()
{
    document.getElementById("systemOffices").disabled = false;
    document.getElementById("officeName").disabled = false;
    document.getElementById("office_date_opened").disabled = false;
};

OfficeHandler.prototype.showOfficeUpdateButtons = function ()
{
    $("#editOfficeButtom").show();
    $("#updateOfficeButtom").hide();
    $("#createOfficeButtom").hide();
    $("#back_to_offices").show();
    $("#cancelOfficeEditButton").hide();
};

OfficeHandler.prototype.showOfficeEditButtons = function()
{
    $("#editOfficeButtom").hide();
    $("#updateOfficeButtom").show();
    $("#createOfficeButtom").hide();
    $("#back_to_offices").hide();
    $("#cancelOfficeEditButton").show();
};

// update the office details ::
OfficeHandler.prototype.handleOfficeUpdateButton = function (event) {
    event.preventDefault();
    if (validateForm($('#createOffficeForm'))) {
        var officeName = $("#officeName").val();
        var parent_office = $("#systemOffices").val();
        var date_created = manageOfficeCreationDate;

        if (date_created === null || date_created === '' || date_created === undefined) {
            showAlertMessage("Enter Date Created ", AlertTypes.warning);
            return;
        }
        if (officeName === null || officeName === '' || officeName === undefined || officeName.length === 0) {
            showAlertMessage("Enter Office Name", AlertTypes.warning);
            return;
        }
        // Send Data to the ENd Point
        var confirmDialogHeader = 'Confirm Office Update';
        var confirmDialogBody = 'Are you sure you want to edit this office with the provided details';
        var confirmDialogPositiveText = 'Yes';
        var confirmDialogNegativeText = 'No';
        showDialogPopupWithHandlers(confirmDialogHeader
                , confirmDialogBody
                , confirmDialogPositiveText
                , function ()
                {
                    var body = '{"name":"' + officeName + '"';
                    var date = new Date(manageOfficeCreationDate);
                    var officeCreationDate = date.toString("dd MMM yyyy");
                    if (parent_office > 0)
                        body += ',"parentId":"' + parent_office + '"}';

                    var headers = {
                        tenantId: getAuthenticationHeader().tenantId,
                        authentication: getAuthenticationHeader().authentication,
                        officeId: OfficeHandler.self.selected_office_id
                    };
                    $.ajax({
                        url: host + '/offices/v1d/updateOffice/' + OfficeHandler.self.selected_office_id,
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
                            document.getElementById("createOffficeForm").reset();

                            OfficeHandler.self.init(function () {
                                showAlertMessage("Office Updated Successfully", AlertTypes.success);
                                hideLoader();
                                handlers['Settings'].manage_offices();
                            });


                        },
                        complete: function () {
                            //   showFadingMessage("complete");
                            hideLoader();
                        }
                    }).fail(function (Response) {
                        // console.log(Response);
                        // console.log("Response ");
                        // console.log(Response.status);
                        if (Response.status === 403) {
                            showAlertMessage("Challenge from the server", AlertTypes.warning);
                        } else if (Response.status === 500) {
                            showAlertMessage("Server Not Reacheable, Check Your Internet Connectivity ", AlertTypes.danger);
                        } else {
                            showAlertMessage("Something went Wrong contact Administrator ", AlertTypes.danger);
                        }
                        hideLoader();
                    });
                }
        , confirmDialogNegativeText
                , function ()
                {

                });
    } else {
        showAlertMessage('Please ensure that all the fields are filled in correctly', AlertTypes.danger);
    }
};