'use strict';
var manageClientEditedBirthDate;
var clientImage;

/* global clientList, savingsAccountList, handlers, currencyCode, Options, loanList, MessageType */

var ClientHandler = function() {
    ClientHandler.self = this;

    clientList.addEntityChangedEventListenerCallback(ClientHandler.prototype.entityChanged);
    //clientList.notifyEntityChangedListener(function(){});

    $('#manageClientIdDocumentType').on('input', ClientHandler.prototype.clientDocumentTypeSelectHandler);
    $('#manageClientEditBtn').on('click', ClientHandler.prototype.handleManageClientEditClientDataButton);
    $('#manageClientBackEditBtn').on('click', ClientHandler.prototype.manageClientsGetAll);
    $('#manageClientCancelEditBtn').on('click', ClientHandler.prototype.handleManageClientCancelEditClientDataButton);
    $('#manageClientPrintFormBtn').on('click', ClientHandler.prototype.printClientInfomation);

    $('#manageClientSubmitEditBtn').off('click');
    $('#manageClientSubmitEditBtn').on('click', ClientHandler.prototype.handleManageClientSubmitEditClientDataButton);
    $('#manageClientCancelSubmitEditBtn').on('click', ClientHandler.prototype.handleManageClientCancelSubmitEditClientDataButton);

    $('#manageClientConfirmSubmitEditBtn').on('click', ClientHandler.prototype.handleManageClientConfirmSubmitEditClientDataButton);
    $('#manageClientEditImageIDSelector').on('change', ClientHandler.prototype.manageClientEditClientImageUpload);

    $('#singleClientActions a').on('click touch', ClientHandler.self._singleClientActionHandler);
};

ClientHandler.prototype.clientDocumentTypeSelectHandler = function() {
    if (document.getElementById("manageClientIdDocumentType").value === "NONE") {
        document.getElementById("manageClientIdDocument").required = false;
        document.getElementById("manageClientIdDocument").disabled = true;
        document.getElementById("manageClientIdDocument").value = "";
    } else {
        document.getElementById("manageClientIdDocument").required = true;
        document.getElementById("manageClientIdDocument").disabled = false;
    }
    registerKeyPressValidators($('#manageClientForm'));
};

ClientHandler.ALL_CLIENTS_TITLES = {
    // client image
    //awamoId: 'awamo ID',
    fullname: 'Name',
    gender: 'Sex',
    birthdate: 'Birthdate',
    submitDate: 'Registration',
    phone1: 'Phone',
    account: 'Balance',
    loan: 'Loan'
};

ClientHandler.ACCOUNTS_TITLES = {
    accountNo: 'Account',
    type: 'Type',
    status: 'Status',
    interestRate: 'Interest rate p.a.',
    balance: 'Balance'
};

// <editor-fold defaultstate="collapsed" desc=" public methods ">
ClientHandler.prototype.getAll = function() {
    addHistory('All clients', '#clients', getSidebarSubitemSelector('reporting', 'Client', 'getAll'));
    currentTable = 'allClients';
    ClientHandler.self.previousPage = ClientHandler.self.getAll;
    ClientHandler.self.displayClients();
};


ClientHandler.prototype.manageClientsGetAll = function() {
    addHistory('All Clients', '#clients', getSidebarSubitemSelector('manageClients', 'Client', 'manageClientsGetAll'));
    currentTable = 'allClients';
    ClientHandler.self.previousPage = ClientHandler.self.manageClientsGetAll;
    ClientHandler.self.manageClientsDisplayClients();
};

ClientHandler.prototype.loadClients = function() {
    clientList.reload();
};
// </editor-fold>

ClientHandler.prototype.printClientInfomation = function(e) {
    e.preventDefault();
    //    var reader = new FileReader();
    //    reader.onload = function(event) {
    //                   clientImage  = "<img src=\"" + event.target.result + "\"/>";
    //                };
    //    reader.readAsDataURL(fileElem);
    var clientFirstName = $('#manageClientFirstName').val();
    var clientLastName = $('#manageClientLastName').val();
    var clientMiddleName = $('#manageClientMiddleName').val();
    var clientBirthDate = $('#manageClientBirthdate').val();
    var nationality = $('#manageClientNationality').val();
    var idDocumentType = $('#manageClientIdDocumentType').val();
    var idDocument = $('#manageClientIdDocument').val();
    var phone1 = $('#manageClientPhone1').val();
    var phone2 = $('#manageClientPhone2').val();
    var gender = $('#manageClientGender').val();
    var awamoId = $('#manageClientAwamoId').val();
    if (clientImage === undefined) {
        clientImage = 'images/personPlaceholderNoText.png';
    }
    var printableContent = '<div class="panel panel-default" id="printClientPanel">\n\
								<div class="panel-heading" id="printClientPanelHeading">Client Information</div>\n\
								<div class="panel-body" id="printClientPanelBody">\n\
									<div class="col-xs-12">\n\
										<div class="col-xs-4" id="printClientImageDiv"> <img class="manImg" id="printClientImage" src="' + clientImage + '" height="250px" width="100%" alt="pic"> </div>\n\
										<div class="col-xs-8" id="printClientInformationDiv">\n\
											<table>\n\
												<tbody>\n\
													<tr>\n\
														<td><strong>First name</strong></td>\n\
														<td>' + clientFirstName + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Last name</strong></td>\n\
														<td>' + clientLastName + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Middle name</strong></td>\n\
														<td>' + clientMiddleName + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Birthdate</strong></td>\n\
														<td>' + clientBirthDate + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Nationality</strong></td>\n\
														<td>' + nationality + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Id type</strong></td>\n\
														<td>' + idDocumentType + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Id Number</strong> </td>\n\
														<td>' + idDocument + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Phone</strong></td>\n\
														<td>' + phone1 + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Phone(2)</strong></td>\n\
														<td>' + phone2 + '</td>\n\
													</tr>\n\
													<tr>\n\
														<td><strong>Gender</strong></td>\n\
														<td>' + gender + '</td>\n\
													</tr>\n\
												</tbody>\n\
											</table>\n\
										</div>\n\
									</div>\n\
								</div>\n\
							</div>';
    var printableTable = '<table>\n\
							<tr><td rowspan="11" style="padding:0 15px 0 15px;"><img class="manImg" id="clientImage" src="' + clientImage + '" height="320px" width="240px" style="padding-bottom:3px;" alt="pic"></td></tr>\n\
							<tr><td>First name : </td><td>' + clientFirstName + '</td></tr>\n\
							<tr><td>Last name : </td><td>' + clientLastName + '</td></tr>\n\
							<tr><td>Middle name : </td><td>' + clientMiddleName + '</td></tr>\n\
							<tr><td>Birthdate : </td><td>' + clientBirthDate + '</td></tr>\n\
							<tr><td>Nationality : </td><td>' + nationality + '</td></tr>\n\
							<tr><td>Id Document type : </td><td>' + idDocumentType + '</td></tr>\n\
							<tr><td>Id Document : </td><td>' + idDocument + '</td></tr>\n\
							<tr><td>Phone : </td><td>' + phone1 + '</td></tr>\n\
							<tr><td>Phone(2) : </td><td>' + phone2 + '</td></tr>\n\
							<tr><td>Gender : </td><td>' + gender + '</td></tr>\n\
						  </table>';
    var newWin = window.open('', 'Print-Window');
    newWin.document.open();
    //    newWin.document.write('<html>\n\
    //                                <head></head>\n\
    //                                <body onload="window.print()">\n\
    //                                    ' + printableTable + '\
    //                                </body>\n\
    //                           </html>');

    newWin.document.write('<html>\n\
							<head>\n\
								<title>Print Client</title>\n\
								<link href="css/libs/bootstrap.min.css" rel="stylesheet">\n\
								<link href="css/printClientCss.css" rel="stylesheet">\n\
								<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">\n\
								<link href="css/libs/theme.bootstrap.min.css" rel="stylesheet" media="print">\n\
								<link rel="icon" type="image/png" sizes="16x16" href="favicon.png">\n\
							</head>\n\
							<body onload="window.focus(); window.print();">\n\
								' + printableContent + '\
							</body>\n\
						   </html>');
    newWin.document.close();
};

// <editor-fold defaultstate="collapsed" desc=" private methods ">
ClientHandler.prototype.displayClients = function() {
    $('body').scrollTop(0);
    ClientHandler.self.currentClient = null;

    initDefaultContent('All clients');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', ClientHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync Clients List');
    $('#syncNow').show();

    $('#sendclientEmailReportBotton').off('click touch');
    $('#sendclientEmailReportBotton').on('click touch', ClientHandler.self.sendEmailLoanReportRequest);
    $('#sendclientEmailReportBotton').show();

    var dataList = clientList.getEntities();
    var $rowContainer = getDefaultRowContainer(ClientHandler.ALL_CLIENTS_TITLES, true, "reportingClientsTable");
    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++) {
        var rowdata = {};

        for (var key in ClientHandler.ALL_CLIENTS_TITLES) {
            var formattedValue = dataList[i][key];
            if ('birthdate' === key || 'submitDate' === key) {
                formattedValue = formatDate(formattedValue);
            }
            if ('account' === key) {
                var savingsAccounts = savingsAccountList.getByClient(dataList[i]['awamoId']);
                var len = savingsAccounts.length;

                if (len > 0) {
                    var sum = 0;
                    for (var j = 0; j < len; j++) {
                        var savingsAccount = savingsAccounts[j];
                        sum = sum + savingsAccount['balance'];

                    }
                    formattedValue = formatCurrency(sum) + " " + currencyCode;
                } else {
                    formattedValue = 0 + " " + currencyCode;
                }
            }
            if ('loan' === key) {
                var loans = loanList.getByClient(dataList[i]['awamoId']);
                var len = loans.length;

                if (len > 0) {
                    var sum = 0;
                    for (var j = 0; j < len; j++) {
                        var loan = loans[j];
                        if (loan.status === "ACTIVE") {
                            sum = sum + loan['principal'];
                        }
                    }
                    formattedValue = formatCurrency(sum) + " " + currencyCode;
                } else {
                    formattedValue = 0 + " " + currencyCode;
                }
            }
            if (formattedValue === ' ') {
                formattedValue = 'n.a.';
            }
            rowdata[key] = formattedValue;
        }

        addRow($rowContainer, rowdata, dataList[i], ClientHandler.self.rowClickHandler, dataList[i].accountId);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: { sorter: 'awamoDateSorter' },
        4: { sorter: 'awamoDateSorter' }
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

    if (handlers['Permissions'].check_access('_EXPORT_CLIENT_DATA')) {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "Clients",
            headings: true
        });
    }

    $("#hiddenPrintedTitle").val("Clients Report");
    showPrintButton(exportListName.clients, exportListFilter.all, ClientHandler.ALL_CLIENTS_TITLES);
    showExcelButton(exportListName.clients, exportListFilter.all, ClientHandler.ALL_CLIENTS_TITLES);
};

ClientHandler.prototype.manageClientsDisplayClients = function() {
    ClientHandler.self.currentClient = null;

    initDefaultContent('All Clients');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', ClientHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync Clients List');
    $('#syncNow').show();

    $('#sendclientEmailReportBotton').off('click touch');
    $('#sendclientEmailReportBotton').on('click touch', ClientHandler.self.sendEmailLoanReportRequest);
    $('#sendclientEmailReportBotton').show();

    var dataList = clientList.getEntities();
    var $rowContainer = getDefaultRowContainer(ClientHandler.ALL_CLIENTS_TITLES, true, "manageClientsTable");
    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++) {
        var rowdata = {};

        for (var key in ClientHandler.ALL_CLIENTS_TITLES) {
            var formattedValue = dataList[i][key];
            if ('birthdate' === key || 'submitDate' === key) {
                formattedValue = formatDate(formattedValue);
            }
            if ('account' === key) {
                var savingsAccounts = savingsAccountList.getByClient(dataList[i]['awamoId']);
                var len = savingsAccounts.length;
                if (len > 0) {
                    var sum = 0;
                    for (var j = 0; j < len; j++) {
                        var savingsAccount = savingsAccounts[j];
                        sum = sum + savingsAccount['balance'];

                    }
                    formattedValue = formatCurrency(sum) + " " + currencyCode;
                } else {
                    formattedValue = 0 + " " + currencyCode;
                }
            }
            if ('loan' === key) {
                var loans = loanList.getByClient(dataList[i]['awamoId']);
                var len = loans.length;

                if (len > 0) {
                    var sum = 0;
                    for (var j = 0; j < len; j++) {
                        var loan = loans[j];
                        if (loan.status === "ACTIVE") {
                            sum = sum + loan['principal'];
                        }
                    }
                    formattedValue = formatCurrency(sum) + " " + currencyCode;
                } else {
                    formattedValue = 0 + " " + currencyCode;
                }
            }
            if (formattedValue === ' ') {
                formattedValue = 'n.a.';
            }
            rowdata[key] = formattedValue;
        }
        addRow($rowContainer, rowdata, dataList[i], ClientHandler.self.manageClientRowClickHandler, dataList[i].accountId);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: { sorter: 'awamoDateSorter' },
        4: { sorter: 'awamoDateSorter' }
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

    if (handlers['Permissions'].check_access('_EXPORT_CLIENT_DATA')) {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "Clients",
            headings: true
        });
    }

    showPrintButton(exportListName.clients, exportListFilter.all, ClientHandler.ALL_CLIENTS_TITLES);
    showExcelButton(exportListName.clients, exportListFilter.all, ClientHandler.ALL_CLIENTS_TITLES);

    $("#hiddenPrintedTitle").val("Clients Report");
};

ClientHandler.prototype.rowClickHandler = function() {
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    ClientHandler.self.displayOneClient($(this).data('object'));
};

ClientHandler.prototype.manageClientRowClickHandler = function() {
    ClientHandler.self.manageClientDisplayOneClient($(this).data('object'));
};

ClientHandler.prototype.manageClientDisplayOneClient = function(client) {
    // check parameter
    if (!exists(client)) {
        return;
    }

    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    // store current client
    ClientHandler.self.client = client;

    initDefaultContent('Edit Client');
    ClientHandler.self.manageClientDisplayClientData(client);

    // show necessary content
    showContent($('#manageClientDiv'));
};

ClientHandler.prototype.displayClientData = function(client) {
    clearFormValidators($('#manageClientForm'));
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    // client
    $('#mainClientFormBackBtn').off('click touch');
    $('#mainClientFormBackBtn').on('click touch', ClientHandler.prototype.getAll);
    document.getElementById("clientImageID").src = "images/personPlaceholderNoText.png";
    $('#client .panel-heading').text(client.fullname);
    $('#clientAwamoId').val(client.awamoId);
    $('#clientFirstName').val(client.firstname);
    $('#clientMiddleName').val(client.middlename);
    $('#clientLastName').val(client.lastname);
    $('#clientBirthdate').val(formatDate(client.birthdate) + ' (' + client.age + ' years)');
    $('#clientNationality').val(client.nationality);
    $('#clientSubmitdate').val(formatDate(client.submitDate));

    $.ajax({
            url: host + '/client/v1d/find?' +
                'awamoId=' + client.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
            type: 'GET',
            headers: getAuthenticationHeader(),
            xhrFields: {
                responseType: 'arraybuffer'
            }
        })
        .done(function(e) {
            var blob = new Blob([e], { type: 'image/jpg' });
            var fr = new FileReader();
            fr.onload = function(e) {
                document.getElementById("clientImageID").src = e.target.result;
            };
            fr.readAsDataURL(blob);
        })
        .fail(function(e) {
            document.getElementById("clientImageID").src = "images/personPlaceholderNoText.png";
            console.log('fail');
            console.log(e);
        });

    $('#clientIdDocumentType').val(client.iddocumenttype);
    $('#clientIdDocument').val(client.iddocument);
    $('#clientPhone1').val(client.phone1);
    $('#clientPhone2').val(client.phone2);
    $('#clientGender').val(client.gender);
    $('#clientLocation').val(client.site);
};

ClientHandler.prototype.displayOneClient = function(client) {
    // check parameter
    if (!exists(client)) {
        return;
    }

    // store current client
    ClientHandler.self.client = client;

    initDefaultContent('Client');
    ClientHandler.self.displayClientData(client);
    ClientHandler.self.displayAccountsData(client);

    // show necessary content
    showContent($('#accountsTableContainer'));
    showContent($('#client'));
};

ClientHandler.prototype.manageClientDisplayClientData = function(client) {
    // client
    clientImage = 'images/personPlaceholderNoText.png';
    clearFormValidators($('#manageClientForm'));

    handlers['Countries'].display_nationality_options("manageClientNationality");
    document.getElementById("manageClientImageID").src = "images/personPlaceholderNoText.png";
    $('#manageClientPanelHeaderText').val(client.fullname);
    $('#manageClientFirstName').val(client.firstname);
    $('#manageClientLastName').val(client.lastname);
    $('#manageClientMiddleName').val(client.middlename);
    $('#manageClientAge').val('');
    var clientAge = '' + client.age;
    clientAge = clientAge.toString();
    if (clientAge.indexOf('NaN') > -1) {
        $('#manageClientBirthdate').val('Select valid date');
    } else {
        $('#manageClientBirthdate').val(formatDate(client.birthdate));
        $('#manageClientBirthdate').tooltip({ placement: 'bottom' });
        $('#manageClientBirthdate').attr('title', client.age + ' years');
        $('#manageClientAge').val(client.age + ' Years');
    }
    $('#manageClientBirthdate').on('change', function() {
        var selectedDate = $('#manageClientBirthdate').val();
        if (Date.parse(selectedDate)) {
            var selectedDateFormat = Date.parse(selectedDate);
            var age = calculateAge(selectedDateFormat.getMonth(), selectedDateFormat.getDate(), selectedDateFormat.getFullYear());
            $('#manageClientAge').val(age + " Years");
            $('#manageClientBirthdate').attr('title', age + ' Years');
        }
    });
    if (client.nationality) {
        var clientCountry = client.nationality.toString();
        clientCountry = clientCountry.toUpperCase();
    }
    $('#manageClientNationality').val(clientCountry);
    $('#manageClientAwamoId').val(client.awamoId);
    $('#manageClientIdDocumentType').val(client.iddocumenttype);
    $('#manageClientIdDocument').val(client.iddocument);
    $('#manageClientPhone1').val(client.phone1);
    populatePhoneInputFlagAddon($('#manageClientPhone1'), $('#manageClientPhone1CountryBtn'), $('#manageClientPhone1CountryList'));
    $('#manageClientPhone2').val(client.phone2);
    populatePhoneInputFlagAddon($('#manageClientPhone2'), $('#manageClientPhone2CountryBtn'), $('#manageClientPhone2CountryList'));
    $('#manageClientGender').val(client.gender);
    document.getElementById("manageClientEditImageIDSelector").value = "";

    clientImage = 'images/personPlaceholderNoText.png';
    $.ajax({
            url: host + '/client/v1d/find?' +
                'awamoId=' + client.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
            type: 'GET',
            headers: getAuthenticationHeader(),
            xhrFields: {
                responseType: 'arraybuffer'
            }
        })
        .done(function(e) {
            var blob = new Blob([e], { type: 'image/jpg' });
            var fr = new FileReader();
            fr.onload = function(e) {
                clientImage = e.target.result;
                document.getElementById("manageClientImageID").src = e.target.result;
            };
            fr.readAsDataURL(blob);
        })
        .fail(function(e) {
            document.getElementById("manageClientImageID").src = "images/personPlaceholderNoText.png";
        });

    document.getElementById("manageClientCancelSubmitEditBtn").disabled = false;
    document.getElementById("manageClientConfirmSubmitEditBtn").disabled = false;
};

ClientHandler.prototype.manageClientEditClientImageUpload = function(event) {
    var reader = new FileReader();
    var file = event.target.files[0];
    var resizedImage = "";
    var dataUrl = "";

    reader.onload = function(e) {
        var image = new Image();
        image.onload = function() {

            var canvas = document.createElement('canvas');

            image.width = 240;
            image.height = 320;



            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            canvas.width = image.width;
            canvas.height = image.height;

            var scale = Math.min(image.width, image.height);

            ctx.drawImage(image, 0, 0, image.width, image.height);
            dataUrl = canvas.toDataURL('image/jpeg', 1.0);

            document.getElementById("manageClientImageID").src = canvas.toDataURL();
            clientimagecreateformData = new FormData(canvas.toDataURL("image/jpeg", 1.0));

        };
        image.src = e.target.result;


        // get loaded data and render thumbnail.
        //$('#manageClientImageID').attr("src", e.target.result);
    };
    // read the image file as a data URL.
    reader.readAsDataURL(file);
};

ClientHandler.prototype.handleManageClientCancelEditClientDataButton = function() {
    $('#manageClientEditBtn').show();
    $('#manageClientBackEditBtn').show();
    $('#manageClientCancelEditBtn').hide();
    $('#manageClientSubmitEditBtn').hide();

    $('#manageClientBrowseImageBtn').hide();
    document.getElementById("manageClientEditImageIDSelector").disabled = true;
    document.getElementById("manageClientFirstName").disabled = true;
    document.getElementById("manageClientLastName").disabled = true;
    document.getElementById("manageClientMiddleName").disabled = true;
    document.getElementById("manageClientBirthdate").disabled = true;
    document.getElementById("manageClientNationality").disabled = true;
    document.getElementById("manageClientIdDocumentType").disabled = true;
    document.getElementById("manageClientIdDocument").disabled = true;
    document.getElementById("manageClientPhone1").disabled = true;
    document.getElementById("manageClientPhone2").disabled = true;
    document.getElementById("manageClientGender").disabled = true;
};

ClientHandler.prototype.handleManageClientEditClientDataButton = function() {
    $('#manageClientEditBtn').hide();
    $('#manageClientBackEditBtn').hide();
    $('#manageClientCancelEditBtn').show();
    $('#manageClientSubmitEditBtn').show();

    $('#manageClientBrowseImageBtn').show();
    document.getElementById("manageClientBrowseImageBtn").style.margin = "auto";
    document.getElementById("manageClientBrowseImageBtn").style.display = "block";
    document.getElementById("manageClientEditImageIDSelector").disabled = false;
    document.getElementById("manageClientFirstName").disabled = false;
    document.getElementById("manageClientLastName").disabled = false;
    document.getElementById("manageClientMiddleName").disabled = false;
    document.getElementById("manageClientBirthdate").disabled = false;
    document.getElementById("manageClientNationality").disabled = false;
    document.getElementById("manageClientIdDocumentType").disabled = false;
    document.getElementById("manageClientIdDocument").disabled = false;
    document.getElementById("manageClientPhone1").disabled = false;
    document.getElementById("manageClientPhone2").disabled = false;
    document.getElementById("manageClientGender").disabled = false;
    clearFormValidators($('#manageClientForm'));
    registerKeyPressValidators($('#manageClientForm'));
};

ClientHandler.prototype.submitManageClientDataToServer = function() {
    var validateClientRequest = '{"' + 'idDocument":"' + $('#manageClientIdDocument').val() + '","idDocumentType":"' + $('#manageClientIdDocumentType').val() + '","awamoId":"' + $('#manageClientAwamoId').val() + '"}';
    validateClientDocument(validateClientRequest, function(data) {
        if (!data) {
            clearExportButtons();
            $('#syncNow').off('click touch');
            $('#syncNow').attr('title', 'Nothing to sync');
            $('#printNow').off('click touch');
            $('#printNow').hide();
            if (document.getElementById("manageClientFirstName").checkValidity() &&
                document.getElementById("manageClientLastName").checkValidity() &&
                document.getElementById("manageClientBirthdate").checkValidity() &&
                document.getElementById("manageClientNationality").checkValidity() &&
                document.getElementById("manageClientIdDocumentType").checkValidity() &&
                document.getElementById("manageClientIdDocument").checkValidity() &&
                document.getElementById("manageClientPhone1").checkValidity() &&
                document.getElementById("manageClientGender").checkValidity()) {
                if (!($('#manageClientIdDocumentType').val().toString() === "NONE") && $('#manageClientIdDocument').val().toString().length < 3) {
                    console.log('valid client form invalid id doc stuff');
                    showAlertMessage('Please provide a valid ID document number', AlertTypes.danger);
                } else {
                    var confirmDialogHeader = 'Confirm Client Update';
                    var confirmDialogBody = 'Are you sure you want to edit this client with the provided details';
                    var confirmDialogPositiveText = 'Yes';
                    var confirmDialogNegativeText = 'No';
                    showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, function() {
                        //yes am sure
                        ClientHandler.prototype.handleManageClientConfirmSubmitEditClientDataButton();
                    }, confirmDialogNegativeText, function() {
                        //no am not
                        $('#manageClientEditBtn').hide();
                        $('#manageClientBackEditBtn').hide();
                        $('#manageClientCancelEditBtn').show();
                        $('#manageClientSubmitEditBtn').show();
                        $('#manageClientConfirmSubmitEditBtn').hide();
                        $('#manageClientCancelSubmitEditBtn').hide();

                        $('#manageClientBrowseImageBtn').show();
                        document.getElementById("manageClientBrowseImageBtn").style.margin = "auto";
                        document.getElementById("manageClientBrowseImageBtn").style.display = "block";
                        document.getElementById("manageClientEditImageIDSelector").disabled = false;
                        document.getElementById("manageClientFirstName").disabled = false;
                        document.getElementById("manageClientLastName").disabled = false;
                        document.getElementById("manageClientBirthdate").disabled = false;
                        document.getElementById("manageClientNationality").disabled = false;
                        document.getElementById("manageClientIdDocumentType").disabled = false;
                        document.getElementById("manageClientIdDocument").disabled = false;
                        document.getElementById("manageClientPhone1").disabled = false;
                        document.getElementById("manageClientPhone2").disabled = false;
                        document.getElementById("manageClientGender").disabled = false;
                    });
                }
            } else {
                console.log('outside not okay client form');
                showAlertMessage('Some of the fields have invalid data, Please verify them and try again', AlertTypes.warning);
                $('#manageClientEditBtn').hide();
                $('#manageClientBackEditBtn').hide();
                $('#manageClientCancelEditBtn').show();
                $('#manageClientSubmitEditBtn').show();
                $('#manageClientConfirmSubmitEditBtn').hide();
                $('#manageClientCancelSubmitEditBtn').hide();

                $('#manageClientBrowseImageBtn').show();
                document.getElementById("manageClientBrowseImageBtn").style.margin = "auto";
                document.getElementById("manageClientBrowseImageBtn").style.display = "block";
                document.getElementById("manageClientEditImageIDSelector").disabled = false;
                document.getElementById("manageClientFirstName").disabled = false;
                document.getElementById("manageClientLastName").disabled = false;
                document.getElementById("manageClientBirthdate").disabled = false;
                document.getElementById("manageClientNationality").disabled = false;
                document.getElementById("manageClientIdDocumentType").disabled = false;
                document.getElementById("manageClientIdDocument").disabled = false;
                document.getElementById("manageClientPhone1").disabled = false;
                document.getElementById("manageClientPhone2").disabled = false;
                document.getElementById("manageClientGender").disabled = false;
            }
        } else {
            showAlertMessage('Provide another ID Document, this one has already been used by another client', AlertTypes.danger);
        }
    });
};

ClientHandler.prototype.handleManageClientSubmitEditClientDataButton = function() {
    if (validateForm($('#manageClientForm'))) {
        if ($('#manageClientPhone1').val() === $('#manageClientPhone2').val()) {
            showAlertMessage("Phone number 1 and 2 should not be the same", AlertTypes.danger);
        } else {
            showLoader("Validating Phone1 input");
            validatePhoneInput(('#manageClientPhone1'),
                function() {
                    //function called on success of valid phone1 validation
                    hideLoader();
                    if ($('#manageClientPhone2').val().length > 0) {
                        showLoader("Validating Phone2 input");
                        validatePhoneInput(('#manageClientPhone2'), function() {
                                //function called on success of valid phone2 validation
                                hideLoader();
                                ClientHandler.prototype.submitManageClientDataToServer();
                            },
                            function() {
                                //function called on failed of valid phone2 validation
                                hideLoader();
                                showAlertMessage("Invalid Phone 2 input", AlertTypes.danger);
                            });
                    } else {
                        ClientHandler.prototype.submitManageClientDataToServer();
                    }
                },
                function() {
                    //function called on fail of valid phone1 validation
                    hideLoader();
                    showAlertMessage("Invalid Phone 1 input", AlertTypes.danger);
                });
        }
    } else {
        showAlertMessage('Please ensure all the elements are filled in correctly', AlertTypes.danger);
    }
};

ClientHandler.prototype.handleManageClientCancelSubmitEditClientDataButton = function() {
    initDefaultContent('Edit Client');
    showContent($('#manageClientDiv'));

    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();

    $('#manageClientEditBtn').hide();
    $('#manageClientBackEditBtn').hide();
    $('#manageClientCancelEditBtn').show();
    $('#manageClientSubmitEditBtn').show();
    $('#manageClientConfirmSubmitEditBtn').hide();
    $('#manageClientCancelSubmitEditBtn').hide();

    $('#manageClientBrowseImageBtn').show();
    document.getElementById("manageClientBrowseImageBtn").style.margin = "auto";
    document.getElementById("manageClientBrowseImageBtn").style.display = "block";
    document.getElementById("manageClientEditImageIDSelector").disabled = false;
    document.getElementById("manageClientFirstName").disabled = false;
    document.getElementById("manageClientLastName").disabled = false;
    document.getElementById("manageClientBirthdate").disabled = false;
    document.getElementById("manageClientNationality").disabled = false;
    document.getElementById("manageClientIdDocumentType").disabled = false;
    document.getElementById("manageClientIdDocument").disabled = false;
    document.getElementById("manageClientPhone1").disabled = false;
    document.getElementById("manageClientPhone2").disabled = false;
    document.getElementById("manageClientGender").disabled = false;
};

ClientHandler.prototype.handleManageClientConfirmSubmitEditClientDataButton = function() {
    var headers = getAuthenticationHeader();
    var uri = '/client/v1d/update';
    var body = '{"' +
        'firstname":"' + $('#manageClientFirstName').val() +
        '","lastname":"' + $('#manageClientLastName').val() +
        '","nationality":"' + $('#manageClientNationality').val() +
        '","iddocumenttype":"' + $('#manageClientIdDocumentType').val() +
        '","iddocument":"' + $('#manageClientIdDocument').val() +
        '","phone1":"' + $('#manageClientPhone1').val() +
        '","gender":"' + $('#manageClientGender').val() +
        '","awamoId":"' + $('#manageClientAwamoId').val() +
        '","site":"' + "MFI_OFFICE" +
        '"}';
    var jsonBody = JSON.parse(body);
    if (!(typeof manageClientEditedBirthDate === 'undefined')) {
        jsonBody.birthdate = manageClientEditedBirthDate;
    } else {
        jsonBody.birthdate = ClientHandler.self.client.birthdate;
    }
    if ($('#manageClientPhone2').val().toString().length > 1) {
        jsonBody.phone2 = $('#manageClientPhone2').val();
    }
    if ($('#manageClientMiddleName').val().toString().length > 1) {
        jsonBody.middlename = $('#manageClientMiddleName').val();
    }
    body = JSON.stringify(jsonBody);
    //console.log('body obj');
    //console.log(body);
    showLoader();
    $.ajax({
        url: host + uri,
        data: body,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function() {
            document.getElementById("manageClientCancelSubmitEditBtn").disabled = true;
            document.getElementById("manageClientConfirmSubmitEditBtn").disabled = true;
        },
        success: function(data) {
            //for cases where the user has chosen another profile pic
            if (!($('#manageClientEditImageIDSelector').get(0).files.length === 0)) {
                var file_data = $('#manageClientEditImageIDSelector').prop("files")[0];
                var fd = new FormData();
                fd.append("payload", file_data);
                fd.append("datatype", "PHOTOGRAPHY");
                fd.append("deviceId", "CockpitUI");
                fd.append("authentication", authentication);
                fd.append("tenantId", tenantId);
                fd.append("awamoId", $('#manageClientAwamoId').val());
                $.ajax({
                    url: host + "/client/v1d/upload",
                    data: fd,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data) {
                        //console.log('new profile pic success');
                        showAlertMessage('The client has been successfully updated', AlertTypes.success);
                        ClientHandler.prototype.handleManageClientSuccessfulEditOperation();
                        //hideLoader();
                    }
                }).fail(function(Response) {
                    //console.log(Response);
                    showAlertMessage('Client information updated, but failed to upload the Profile Image', AlertTypes.warning);
                    ClientHandler.prototype.handleManageClientFailedImageUploadOperation();
                });
            }
            //for cases where the user has NOT chosen another profile pic
            else {
                showAlertMessage('The client has been successfully updated', AlertTypes.success);
                ClientHandler.prototype.handleManageClientSuccessfulEditOperation();
            }
        },
        complete: function() {
            document.getElementById("manageClientCancelSubmitEditBtn").disabled = false;
            document.getElementById("manageClientConfirmSubmitEditBtn").disabled = false;
        }
    }).fail(function(Response) {
        showAlertMessage('Client update failed, please contact support', AlertTypes.danger);
        ClientHandler.prototype.handleManageClientFailedEditOperation();
    });
};

ClientHandler.prototype.updatedLocalClientObjectWithNewProperties = function() {
    ClientHandler.self.client.firstname = $('#manageClientFirstName').val();
    ClientHandler.self.client.middlename = $('#manageClientMiddleName').val();
    ClientHandler.self.client.lastname = $('#manageClientLastName').val();
    if (!(typeof manageClientEditedBirthDate === 'undefined')) {
        ClientHandler.self.client.birthdate = manageClientEditedBirthDate;
    }
    ClientHandler.self.client.nationality = $('#manageClientNationality').val();
    ClientHandler.self.client.awamoId = $('#manageClientAwamoId').val();
    ClientHandler.self.client.iddocumenttype = $('#manageClientIdDocumentType').val();
    ClientHandler.self.client.iddocument = $('#manageClientIdDocument').val();
    ClientHandler.self.client.phone2 = $('#manageClientPhone2').val();
    ClientHandler.self.client.phone1 = $('#manageClientPhone1').val();
    ClientHandler.self.client.gender = $('#manageClientGender').val();
    clientList.put(clientList, ClientHandler.self.client);
};

ClientHandler.prototype.insertNewLocalClientObject = function(awamoId, clientSelectedDate) {
    var client = new Object();
    console.log('in insert mtd');
    console.log('in insert mtd ' + awamoId);
    client.awamoId = awamoId;
    client.firstname = $('#clientCreateF').val();
    client.lastname = $('#clientCreateL').val();
    client.middlename = $('#clientCreateM').val();
    client.nationality = $('#clientCreateN').val();
    client.iddocumenttype = $('#clientCreateIdDocumentType').val();
    client.iddocument = $('#clientCreateIdDocument').val();
    client.phone1 = $('#clientCreateP1').val();
    client.phone2 = $('#clientCreateP2').val();
    client.gender = $('#clientCreateG').val();
    console.log('in insert mt3');
    if (!(typeof clientSelectedDate === 'undefined')) {
        console.log('in insert mtd3 : ' + clientSelectedDate);
        client.birthdate = clientSelectedDate;
    }
    if (exists(clientList)) {
        console.log('in store mtd');
        clientList.store(client);
    }
};

ClientHandler.prototype.handleManageClientFailedImageUploadOperation = function() {
    ClientHandler.self.manageClientsDisplayClients();
    $('#manageClientEditBtn').show();
    $('#manageClientBackEditBtn').show();
    $('#manageClientCancelEditBtn').hide();
    $('#manageClientSubmitEditBtn').hide();
    $('#manageClientConfirmSubmitEditBtn').hide();
    $('#manageClientCancelSubmitEditBtn').hide();

    $('#manageClientBrowseImageBtn').hide();
    document.getElementById("manageClientEditImageIDSelector").disabled = true;
    document.getElementById("manageClientFirstName").disabled = true;
    document.getElementById("manageClientLastName").disabled = true;
    document.getElementById("manageClientBirthdate").disabled = true;
    document.getElementById("manageClientNationality").disabled = true;
    document.getElementById("manageClientIdDocumentType").disabled = true;
    document.getElementById("manageClientIdDocument").disabled = true;
    document.getElementById("manageClientPhone1").disabled = true;
    document.getElementById("manageClientGender").disabled = true;
    hideLoader();
};

ClientHandler.prototype.handleManageClientSuccessfulEditOperation = function() {
    ClientHandler.prototype.updatedLocalClientObjectWithNewProperties();
    ClientHandler.self.manageClientsDisplayClients();
    $('#manageClientEditBtn').show();
    $('#manageClientBackEditBtn').show();
    $('#manageClientCancelEditBtn').hide();
    $('#manageClientSubmitEditBtn').hide();
    $('#manageClientConfirmSubmitEditBtn').hide();
    $('#manageClientCancelSubmitEditBtn').hide();

    $('#manageClientBrowseImageBtn').hide();
    document.getElementById("manageClientEditImageIDSelector").disabled = true;
    document.getElementById("manageClientFirstName").disabled = true;
    document.getElementById("manageClientLastName").disabled = true;
    document.getElementById("manageClientBirthdate").disabled = true;
    document.getElementById("manageClientNationality").disabled = true;
    document.getElementById("manageClientIdDocumentType").disabled = true;
    document.getElementById("manageClientIdDocument").disabled = true;
    document.getElementById("manageClientPhone1").disabled = true;
    document.getElementById("manageClientGender").disabled = true;
    hideLoader();
};

ClientHandler.prototype.handleManageClientFailedEditOperation = function() {
    showContent($('#manageClientDiv'));
    $('#manageClientEditBtn').show();
    $('#manageClientBackEditBtn').show();
    $('#manageClientCancelEditBtn').hide();
    $('#manageClientSubmitEditBtn').hide();
    $('#manageClientConfirmSubmitEditBtn').hide();
    $('#manageClientCancelSubmitEditBtn').hide();

    $('#manageClientBrowseImageBtn').hide();
    document.getElementById("manageClientEditImageIDSelector").disabled = true;
    document.getElementById("manageClientFirstName").disabled = true;
    document.getElementById("manageClientLastName").disabled = true;
    document.getElementById("manageClientBirthdate").disabled = true;
    document.getElementById("manageClientNationality").disabled = true;
    document.getElementById("manageClientIdDocumentType").disabled = true;
    document.getElementById("manageClientIdDocument").disabled = true;
    document.getElementById("manageClientPhone1").disabled = true;
    document.getElementById("manageClientGender").disabled = true;
    hideLoader();
};

ClientHandler.prototype.custManageClientsMenuRowClickHandler = function() {
    var action = $(this).data('id');
    var handler = $(this).data('object');
    $('li[data-parent~="manageClients"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

ClientHandler.prototype.displayAccountsData = function(client) {
    var $rowContainer = getRowContainer('#accountsTableContainer', ClientHandler.ACCOUNTS_TITLES, true);
    var $table = $rowContainer.parent();
    var savingsAccounts = savingsAccountList.getByClient(client.awamoId);
    if (!exists(savingsAccounts) || savingsAccounts.length === 0) {
        //alert('hit')
        $('#defaultDataTable', $('#accountsTableContainer')).css('display', 'none');
        $('#accountsTableContainer').siblings('.no-info-to-display').removeClass('hidden');
        return;
    } else {
        //$('#defaultDataTable', $('#accountsTableContainer')).css('display', 'block');
        $('#accountsTableContainer').siblings('.no-info-to-display').addClass('hidden');
    }
    var len = savingsAccounts.length;

    for (var i = 0; i < len; i++) {
        var savingsAccount = savingsAccounts[i];
        var formattedRowData = ClientHandler.prototype._getAccountsRowData(savingsAccount);
        addRow($rowContainer, formattedRowData, savingsAccount, ClientHandler.self._accountsRowClickHandler, savingsAccount.accountId);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: { sorter: 'awamoPercentageSorter' },
        4: { sorter: 'awamoCurrencySorter' }
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);

    addClassToTableColumn($table, 3, 'percentage');
    addClassToTableColumn($table, 4, 'currency');


};

ClientHandler.prototype._getAccountsRowData = function(savingsAccount) {
    var rowdata = {};

    for (var key in ClientHandler.ACCOUNTS_TITLES) {
        var formattedValue = savingsAccount[key];

        switch (key) {
            case 'type':
                formattedValue = 'savings account';
                break;
            case 'interestRate':
                formattedValue = formatPercentage(formattedValue) + ' %';
                break;
            case 'balance':
                formattedValue = formatCurrency(formattedValue) + ' ' + currencyCode;
                break;
            default:
                break;
        }

        rowdata[key] = String(formattedValue);
    }

    return rowdata;
};

ClientHandler.prototype._accountsRowClickHandler = function() {
    var savingsAccount = $(this).data('object');
    var savingsAccountHandler = handlers['SavingsAccount'];
    var event = { currentTarget: {} };
    $(event.currentTarget).data('object', savingsAccount);
    savingsAccountHandler.rowClickHandler(event, function() {
        ClientHandler.self.displayOneClient(ClientHandler.self.client);
    });
};

ClientHandler.prototype._singleClientActionHandler = function(event) {
    event.preventDefault();
    hideContent();

    switch ($(this).data('action')) {
        case 'back':
            ClientHandler.self.previousPage();
            break;
        default:
            // noop
            break;
    }
};

ClientHandler.prototype.outputClient = function(client) {
    var $row = null;
    // update badges
    var clientNumber = clientList.getTotalCount();

    // update GUI
    if ('allClients' === currentTable) {
        //$row = ClientHandler.self.addToTable(client);
    } else {
        // noop
    }

    return $row;
};

ClientHandler.prototype.entityChanged = function(client) {
    ClientHandler.self.outputClient(client);
};

ClientHandler.prototype.synchronizeNow = function() {
    clientList.reload();
};

ClientHandler.prototype.sendEmailLoanReportRequest = function() {
    // not using default ajax call here because user handling is done against a different endpoint
    var headers = {
        tenantId: tenantId
    };

    var uri = '/tenant/v1d/mis/reportEmail';
    var body = '{"startTime":"' + '0' +
        '","endTime":"' + '0' +
        '","reportEmailEntity":"' + "CLIENT" +
        '","reportEmailType":"' + "ALL" +
        '","email":"' + $('#emailReportC').val() +
        '"}';
    ajax(uri, 'POST', ClientHandler.prototype.emailReportResponseHandler, body, headers, ClientHandler.prototype.emailReportFailedResponseHandler);

};

ClientHandler.prototype.emailReportResponseHandler = function(response) {
    message('Success',
        'Message Sent Successfully',
        MessageType.SUCCESS);
};

ClientHandler.prototype.emailReportFailedResponseHandler = function(response) {
    message('Error', response.responseJSON.message, MessageType.WARNING);
};

//client loan application list
ClientHandler.prototype.getAllClientsForLoanApplication = function() {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    addHistory('All clients', '#clients', getSidebarSubitemSelector('individualLoans', 'Client', 'getAllClientsForLoanApplication'));
    currentTable = 'allClientsLoanApplication';
    ClientHandler.self.previousPage = ClientHandler.self.getAll;
    ClientHandler.self.displayClientsForLoanApplication();
};

ClientHandler.prototype.displayClientsForLoanApplication = function() {
    ClientHandler.self.currentClient = null;

    initDefaultContent('Select a client to start creating a loan application');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', ClientHandler.self.synchronizeNow);
    $('#syncNow').show();

    var dataList = clientList.getEntities();
    var $rowContainer = getDefaultRowContainer(ClientHandler.ALL_CLIENTS_TITLES, true, "manageClientsTable");
    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++) {
        var rowdata = {};

        for (var key in ClientHandler.ALL_CLIENTS_TITLES) {
            var formattedValue = dataList[i][key];
            if ('birthdate' === key || 'submitDate' === key) {
                formattedValue = formatDate(formattedValue);
            }
            if ('account' === key) {
                var savingsAccounts = savingsAccountList.getByClient(dataList[i]['awamoId']);
                var len = savingsAccounts.length;

                if (len > 0) {
                    var sum = 0;
                    for (var j = 0; j < len; j++) {
                        var savingsAccount = savingsAccounts[j];
                        sum = sum + savingsAccount['balance'];

                    }
                    formattedValue = formatCurrency(sum) + " " + currencyCode;
                } else {
                    formattedValue = 0 + " " + currencyCode;
                }
            }
            if ('loan' === key) {
                var loans = loanList.getByClient(dataList[i]['awamoId']);
                var len = loans.length;

                if (len > 0) {
                    var sum = 0;
                    for (var j = 0; j < len; j++) {
                        var loan = loans[j];
                        if (loan.status === "ACTIVE") {
                            sum = sum + loan['principal'];
                        }
                    }
                    formattedValue = formatCurrency(sum) + " " + currencyCode;
                } else {
                    formattedValue = 0 + " " + currencyCode;
                }
            }
            if (formattedValue === ' ') {
                formattedValue = 'n.a.';
            }
            rowdata[key] = formattedValue;
        }

        addRow($rowContainer, rowdata, dataList[i], ClientHandler.self.rowClickHandlerClientsForLoanApplication, dataList[i].accountId);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: { sorter: 'awamoDateSorter' },
        4: { sorter: 'awamoDateSorter' }
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


    $("#hiddenPrintedTitle").val("Select a client to start creating a loan application");
};

ClientHandler.prototype.rowClickHandlerClientsForLoanApplication = function() {
    // Protect the scope of this
    var client = $(this).data('object');

    // Check loan application status
    var uri = "/loan/v1d/getClientLoanApplicationStatus/" + client.awamoId;
    $.ajax({
        url: host + uri,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: getAuthenticationHeader(),
        type: 'GET',
        beforeSend: function() {
            showLoader();
        },
        success: function(ok) {
            if (ok) {
                Options.prototype.createLoanApplication(client, "INDIVIDUAL");
            } else {
                showAlertMessage('Sorry, the customer has already made a loan application.', AlertTypes.danger);
            }
        },
        complete: function() {
            hideLoader();
        }
    }).fail(function(Response) {
        // Request failure
    });
    // Options.prototype.createLoanApplication($(this).data('object'), "INDIVIDUAL");
};
