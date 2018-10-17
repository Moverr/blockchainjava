/* global shareList, clientList, sharesAccountList, MessageType, currencyCode, SavingsAccountHandler, handlers, ClientHandler, transactionType, shareProductList, AlertTypes, SettingsHandler, confirmDialogNegativeText, host, ShareList, savingsAccountList */

var ShareHandler = function() {
    ShareHandler.self = this;
    
    this.commandStack = [];
    this.argumentStack = [];

};

ShareHandler.APPLICATION_TITLES = {
    clientName: 'Client name',
    numberOfShares: 'Number of shares',
    valueOfShares: 'Value of shares'
};


ShareHandler.APPLICATION_PENDING_TITLES = {
    accountNo: 'Account #',
    shareAccount: 'Share Account',
    clientName: 'Client name',
    totalPendingShares: 'Pending Shares'
};


ShareHandler.ALL_ACCOUNTS_TITLES = {
    clientName: 'Name',
    accountNo: 'Account',
    status: 'Status',
    totalPendingShares: 'Total Pending Shares',
    totalApprovedShares: 'Total Approved  Shares',
    shareAccount: 'Share Account'
};


ShareHandler.CURRENT_MARKET_PRICE = 50000;

ShareHandler.CLIENT_TITLES = {
    fullname: 'Name',
    gender: 'Sex',
    birthdate: 'Birth date',
    submitDate: 'Registration',
    phone1: 'Phone'
};



ShareHandler.prototype.overview = function () {

    addHistory('Bankings Services Savings Account', '#bankingServicesSavingsAccountOverview', getSidebarSubitemSelector('bankingServices', 'SavingsAccount', 'sharesAccountMainMenuOverview'));
    initDefaultContent('Shares Accounts');
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    currentTable = 'options';

    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});
    if (handlers['Permissions'].check_access('_CREATE_NEW_SHARE'))
        addRow($rowContainer, {type: 'Create New Account'}, 'SharesAccount', ShareHandler.self.showAllClientsForSharesAccountApplication, 'showAllClientsForSharesAccountApplication');

    if (handlers['Permissions'].check_access('_MANAGE_SHARES'))
        addRow($rowContainer, {type: 'Use Existing Account'}, 'SharesAccount', SavingsAccountHandler.prototype.getAllForCloseDepositAndWithdraw, 'getAllForCloseDepositAndWithdraw');

};

ShareHandler.prototype.getApplications = function ()
{
    ShareHandler.forReporting = false;
    addHistory('Shares Account Applications', '#sharesAccountApplications', getSidebarSubitemSelector('actionRequired', 'Share', 'getApplications'));
    currentTable = 'sharesAccountApplications';
    ShareHandler.self.previousPage = ShareHandler.self.getApplications;
    ShareHandler.self.displaySavingsAccountApplications();
};


ShareHandler.prototype.approveApplications = function ()
{
    ShareHandler.forReporting = false;
    addHistory('Shares Account Applications', '#sharesAccountApplications', getSidebarSubitemSelector('actionRequired', 'Share', 'getApplications'));
    currentTable = 'sharesAccountApplications';
    ShareHandler.self.previousPage = ShareHandler.self.approveApplications;
    ShareHandler.self.displayPendingSharesApplications();
};

ShareHandler.prototype.activateApplications = function ()
{
    ShareHandler.forReporting = false;
    addHistory('Shares Account Applications', '#sharesAccountApplications', getSidebarSubitemSelector('actionRequired', 'Share', 'getApplications'));
    currentTable = 'sharesAccountApplications';
    ShareHandler.self.previousPage = ShareHandler.self.activateApplications;
    ShareHandler.self.displayApprovedSharesApplications();
};



ShareHandler.prototype.share_status = 'ALL';

ShareHandler.prototype.getListByStatus = function (status) {
    var select_option = ShareHandler.self.share_status;
    if (undefined !== status && status !== select_option)
        select_option = status;
    switch (select_option) {
        case 'ALL':
            return shareList.getEntities();
            break;
        case 'REJECTED':
            return shareList.getListByStatus('REJECTED');
            break;
        case 'ACTIVE':
            return shareList.getListByStatus('ACTIVE');
            break;
        case 'PENDING':
            return shareList.getListByStatus('PENDING');
            break;
        case 'APPROVED':
            return shareList.getListByStatus('APPROVED');
            break;
        case 'CLOSED':
            return shareList.getListByStatus('CLOSED');
            break;

        default:
            break;
    }
};
ShareHandler.prototype.approveApplication = function () {

    var shareaAccount = ShareHandler.self.currentshareAccount;
    if (shareaAccount == null)
        return;

    var shareaAccountId = shareaAccount.id;
    var url = host + '/share/v1d/' + shareaAccountId + '/approve';
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
            alert("Success");
            hideLoader();
        },
        complete: function () {
            hideLoader();
        }
    }).fail(function (Response) {
        console.log(Response);
        alert("Something went wrong");
        hideLoader();
    });

};


ShareHandler.prototype.rejectApplication = function () {

    var shareaAccount = ShareHandler.self.currentshareAccount;
    if (shareaAccount == null)
        return;

    var shareaAccountId = shareaAccount.id;
    var url = host + '/share/v1d/' + shareaAccountId + '/reject';
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
            alert("Success");
            hideLoader();
        },
        complete: function () {
            hideLoader();
        }
    }).fail(function (Response) {
        console.log(Response);
        alert("Something went wrong");
        hideLoader();
    });

};


ShareHandler.prototype.activateApplication = function () {

    var shareaAccount = ShareHandler.self.currentshareAccount;
    if (shareaAccount == null)
        return;

    var confirmDialogHeader = 'Confirm  Account Activation';
    var confirmDialogBody = 'Are you sure you want to activate this application ?';
    var confirmDialogPositiveText = 'Yes';
    var confirmDialogNegativeText = 'No';
    showDialogPopupWithHandlers(confirmDialogHeader
            , confirmDialogBody
            , confirmDialogPositiveText
            , function ()
            {
                var shareaAccountId = shareaAccount.id;
                var url = host + '/share/v1d/' + shareaAccountId + '/activate';
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
                        alert("Success");
                        hideLoader();
                    },
                    complete: function () {
                        hideLoader();
                    }
                }).fail(function (Response) {
                    console.log(Response);
                    alert("Something went wrong");
                    hideLoader();
                });

            }
    , confirmDialogNegativeText
            , function ()
            {

            });



};





ShareHandler.prototype.singleObjectActionHandler = function (event)
{



    event.preventDefault();
    switch ($(this).data('action'))
    {
        case 'back':
            hideContent();
            SavingsAccountHandler.self.previousPage();
            hideControlsForReporting('SavingsAccount');
            break;
        case 'activate':
            var confirmDialogHeader = 'Confirm Savings Accounts Application Approval';
            var confirmDialogBody = 'Are you sure you want to approve this application ?';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader
                    , confirmDialogBody
                    , confirmDialogPositiveText
                    , function ()
                    {

                        //yes confirm savings account application
                        ShareHandler.self.approveApplication();
                    }
            , confirmDialogNegativeText
                    , function ()
                    {
                        //no dont confirm savings account application
                        SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount();
                    });
//            $('#approveApplication .panel-body .approvalObject').text('savings account');
//            showContent($('#approveApplication'));
            break;

        case 'approve':
            var confirmDialogHeader = 'Confirm Savings Accounts Application Approval';
            var confirmDialogBody = 'Are you sure you want to approve this application ?';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader
                    , confirmDialogBody
                    , confirmDialogPositiveText
                    , function ()
                    {

                        //yes confirm savings account application
                        ShareHandler.self.approveApplication();
                    }
            , confirmDialogNegativeText
                    , function ()
                    {
                        //no dont confirm savings account application
                        SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount();
                    });
//            $('#approveApplication .panel-body .approvalObject').text('savings account');
//            showContent($('#approveApplication'));
            break;
        case 'reject':
            var confirmDialogHeader = 'Confirm Savings Accounts Application Rejection';
            var confirmDialogBody = 'Are you sure you want to reject this application ?';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader
                    , confirmDialogBody
                    , confirmDialogPositiveText
                    , function ()
                    {
                        //yes reject savings account application
                        SavingsAccountHandler.prototype.rejectApplication();
                    }
            , confirmDialogNegativeText
                    , function ()
                    {
                        //no dont reject savings account application
                        SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount();
                    });
//            $('#rejectApplication .panel-body .rejectionObject').text('savings account');
//            $('#rejectionNote').val('');
//            showContent($('#rejectApplication'));
            break;
        case 'close':
            hideContent();
            $('#closeApplication .panel-body .closeObject').text('savings account');
            showContent($('#closeApplication'));
            break;
        default:
            // noop
            break;
    }
};

ShareHandler.prototype.adjustSingleActionsByStatus = function (status)
{
    //alert('found')
    $('#singleActions a[data-action]').hide();
    $('#singleActions a[data-action="back"]').show();

    console.log(status);

    switch (status)
    {
        case 'SUBMITTED':
            $('#singleActions a[data-action="approve"]').show();
            $('#singleActions a[data-action="reject"]').show();
            break;
        case 'PENDING':
            $('#singleActions a[data-action="approve"]').show();
            $('#singleActions a[data-action="reject"]').show();
            break;

        case 'APPROVED':
            $('#singleActions a[data-action="activate"]').show();
            $('#singleActions a[data-action="reject"]').show();
            break;


        case 'REJECTED':
            break;
        case 'ACTIVE':
            $('#singleActions a[data-action="close"]').show();
            break;
        case 'CLOSED':
            break;
        default:
            break;
    }
};





ShareHandler.prototype.currentshareAccount = null;

ShareHandler.prototype.displayApprovedSharesApplications = function ()
{
    var dataList = ShareHandler.self.getListByStatus('APPROVED');

    console.log(dataList);
    ShareHandler.self.currentshareAccount = null;
    initDefaultContent('Shares Account Applications');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', ShareHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync savings accounts applications');
    $('#syncNow').show();

    var $tableContainer = $('#defaultTableContainer');
    $tableContainer.empty();

    var $rowContainer = null;
    if ("actionRequiredSharesAcTable" === undefined)
    {
        $rowContainer = getDefaultRowContainer(ShareHandler.APPLICATION_PENDING_TITLES, true);
    } else
    {
        $rowContainer = getDefaultRowContainer(ShareHandler.APPLICATION_PENDING_TITLES, true, "actionRequiredSharesAcTable");
    }
    var $table = $rowContainer.parent();
    for (var i = 0; i < dataList.length; i++)
    {
        //formattedValue = formatDate(formattedValue);

        addRow(
                $rowContainer,
                ShareHandler.self.getRowData(ShareHandler.APPLICATION_PENDING_TITLES, dataList[i]),
                dataList[i],
                ShareHandler.self.rowClickHandler,
                dataList[i].accountId
                );
    }

    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        3: {sorter: 'awamoPercentageSorter'},
        4: {sorter: 'awamoCurrencySorter'}
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);

    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));


    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();


    $('#singleActions a').off('click touch');
    $('#singleActions a').on('click touch', ShareHandler.self.singleObjectActionHandler);


//    $('#approveNo').off('click touch');
//    $('#approveNo').on('click touch', ShareHandler.prototype.backToDisplayOneSavingsAccount);
//    $('#rejectNo').off('click touch');
//    $('#rejectNo').on('click touch', ShareHandler.prototype.backToDisplayOneSavingsAccount);
//    $('#closeNo').off('click touch');
//    $('#closeNo').on('click touch', ShareHandler.prototype.backToDisplayOneSavingsAccount);
//

    //not working
//    $('#approveYes').off('click touch');
//    $('#approveYes').on('click touch', ShareHandler.self.activateApplication);
    $("#_activate").off();
    $("#_activate").on('click touch', ShareHandler.self.activateApplication);

    $('#rejectYes').off('click touch');
    $('#rejectYes').on('click touch', ShareHandler.self.rejectApplication);


    //Not Yet Implemented
//    $('#closeYes').off('click touch');
//    $('#closeYes').on('click touch', ShareHandler.prototype.closeApplication);





};


ShareHandler.prototype.displayPendingSharesApplications = function ()
{
    var dataList = ShareHandler.self.getListByStatus('PENDING');

    console.log(dataList);
    ShareHandler.self.currentshareAccount = null;
    initDefaultContent('Shares Account Applications');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', ShareHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync savings accounts applications');
    $('#syncNow').show();

    var $tableContainer = $('#defaultTableContainer');
    $tableContainer.empty();

    var $rowContainer = null;
    if ("actionRequiredSharesAcTable" === undefined)
    {
        $rowContainer = getDefaultRowContainer(ShareHandler.APPLICATION_PENDING_TITLES, true);
    } else
    {
        $rowContainer = getDefaultRowContainer(ShareHandler.APPLICATION_PENDING_TITLES, true, "actionRequiredSharesAcTable");
    }
    var $table = $rowContainer.parent();
    for (var i = 0; i < dataList.length; i++)
    {
        //formattedValue = formatDate(formattedValue);

        addRow(
                $rowContainer,
                ShareHandler.self.getRowData(ShareHandler.APPLICATION_PENDING_TITLES, dataList[i]),
                dataList[i],
                ShareHandler.self.rowClickHandler,
                dataList[i].accountId
                );
    }

    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        3: {sorter: 'awamoPercentageSorter'},
        4: {sorter: 'awamoCurrencySorter'}
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);

    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));


    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();


    $('#singleActions a').off('click touch');
    $('#singleActions a').on('click touch', ShareHandler.self.singleObjectActionHandler);


//    $('#approveNo').off('click touch');
//    $('#approveNo').on('click touch', ShareHandler.prototype.backToDisplayOneSavingsAccount);
//    $('#rejectNo').off('click touch');
//    $('#rejectNo').on('click touch', ShareHandler.prototype.backToDisplayOneSavingsAccount);
//    $('#closeNo').off('click touch');
//    $('#closeNo').on('click touch', ShareHandler.prototype.backToDisplayOneSavingsAccount);
//


    $('#approveYes').off('click touch');
    $('#approveYes').on('click touch', ShareHandler.self.approveApplication);

    $('#rejectYes').off('click touch');
    $('#rejectYes').on('click touch', ShareHandler.self.rejectApplication);


    //Not Yet Implemented
//    $('#closeYes').off('click touch');
//    $('#closeYes').on('click touch', ShareHandler.prototype.closeApplication);
//




};

ShareHandler.prototype.rowClickHandler = function (event, previousPage)
{
    if (exists(previousPage))
    {
        ShareHandler.self.previousPage = previousPage;
    }


    ShareHandler.self.displayOneShareAccount($(event.currentTarget).data('object'));
};



ShareHandler.prototype.displayOneShareAccount = function (sharesAccount)
{

    ShareHandler.self.currentshareAccount = sharesAccount;
    // check parameter
    if (!exists(sharesAccount))
    {
        return;
    }

    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    // store current savings account
    SavingsAccountHandler.self.sharesAccount = sharesAccount;

    initDefaultContent('Shares Account');

    var formattedData = ShareHandler.self.getRowData(ShareHandler.ALL_ACCOUNTS_TITLES, sharesAccount);

    $('#sharesAccountNumber').val(formattedData.accountNo);
    $('#sharesAccountName').val(formattedData.clientName);
    $('#sharesAccountStatus').val(formattedData.status);
    $('#sharesAccountshares').val(formattedData.totalPendingShares);
    $('#sharesAccount .shareAccountProduct').val(formattedData.shareAccount);

    // actions
    console.log(sharesAccount);
    console.log('svngs AC 0');
    ShareHandler.self.adjustSingleActionsByStatus(sharesAccount.status);



    // show necessary content
    showContent($('#singleActions'));
    hideControlsForReporting('SavingsAccount');
    showContent($('#sharesAccount'));
};



ShareHandler.prototype.getRowData = function (titles, sharesAccount)
{
    var rowdata = {};

    for (var key in titles)
    {
        var formattedValue = sharesAccount[key];

        switch (key)
        {
            case 'clientImage':
                formattedValue = '<img src="images/personPlaceholderNoText.png" alt="client" height="32" />';

                if ('GROUP' === sharesAccount.sharesAccountType)
                {
                    formattedValue = '<img src="images/groupPlaceholder.png" alt="client" height="32" />';
                } else if ('INDIVIDUAL' === sharesAccount.sharesAccountType)
                {
                    formattedValue = '<img src="images/personPlaceholderNoText.png" alt="client" height="32" />';
                }
                break;
            case 'interestRate':
                formattedValue = formatPercentage(formattedValue) + ' %';
                break;
            case 'balance':
                formattedValue = formatCurrency(formattedValue) + ' ' + currencyCode;
                break;
            case 'submittedDate':
                formattedValue = formatDate(formattedValue);
            default:
                break;
        }
        rowdata[key] = String(formattedValue);
    }
    return rowdata;
};


ShareHandler.prototype.displayInTable = function (titles, dataList, cssClass)
{
    var $tableContainer = $('#defaultTableContainer');
    $tableContainer.empty();

    var $rowContainer = null;
    if (cssClass === undefined)
    {
        $rowContainer = getDefaultRowContainer(titles, true);
    } else
    {
        $rowContainer = getDefaultRowContainer(titles, true, cssClass);
    }
    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++)
    {
        addRow(
                $rowContainer,
                ShareHandler.prototype.getRowData(titles, dataList[i]),
                dataList[i],
                ShareHandler.self.rowClickHandler,
                dataList[i].accountId
                );
//        var $row = addRow($rowContainer, SavingsAccountHandler.prototype._getRowData(titles, dataList[i]), dataList[i], SavingsAccountHandler.self.rowClickHandler, dataList[i].accountId);
//
//        // images are lazy-loaded
//        (function (awamoId, $row) {
//            var $img = $row.find('img').first();
//            clientList.get(awamoId, function (client) {
//                if (client !== null) {
//                    $img.attr('src', client.thumbnail);
//                }
//            });
//        })(dataList[i].awamoId, $row);
    }

    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        3: {sorter: 'awamoPercentageSorter'},
        4: {sorter: 'awamoCurrencySorter'}
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);

    //.tablesorterPager({container: $("#pager")})
//    console.log('data table');

    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++)
    {
        els[i].style.textAlign = "right";
    }

    addClassToTableColumn($table, 3, 'percentage');
    addClassToTableColumn($table, 4, 'currency');

    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));
    showContent($tableContainer);
    $tableContainer.show();

    $('#sendsavingaccountEmailReportBotton').off('click touch');
    $('#sendsavingaccountEmailReportBotton').on('click touch', SavingsAccountHandler.self.sendEmailLoanReportRequest);
    $('#sendsavingaccountEmailReportBotton').show();

    if (handlers['Permissions'].check_access('_EXPORT_ACCOUNTS'))
    {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "SavingsAccounts",
            headings: true
        });
    }

    $("#hiddenPrintedTitle").val("Savingaccounts Report");
};

//<editor-fold defaultstate="collapsed" desc="GEt All Clients for New Shares Application">
ShareHandler.prototype.showAllClientsForSharesAccountApplication = function ()
{
    addHistory('Shares Accounts All Clients', '#bankingServicesSharesAccountAllClients', getSidebarSubitemSelector('SharesAccountMainMenu', 'SharesAccount', 'showAllClientsForSharesAccountApplication'));
    currentTable = 'allClients';
    SavingsAccountHandler.self.previousPage = ShareHandler.self.showAllClientsForSharesAccountApplication;
    ShareHandler.self.displayAllClientsForSharesAccountApplication();
};
ShareHandler.prototype.currentClient = null;
ShareHandler.prototype.displayAllClientsForSharesAccountApplication = function ()
{
    ShareHandler.self.currentClient = null;

    initDefaultContent('Select Client For Shares Account Application');

    var dataList = clientList.getEntities();
    var $rowContainer = getDefaultRowContainer(ShareHandler.CLIENT_TITLES, true);
    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++)
    {
        var rowdata = {};

        for (var key in SavingsAccountHandler.CLIENT_TITLES)
        {
            var formattedValue = dataList[i][key];
            if ('birthdate' === key || 'submitDate' === key)
            {
                formattedValue = formatDate(formattedValue);
            }
            if ('account' === key)
            {
                var sharesAccounts = sharesAccountList.getByClient(dataList[i]['awamoId']);
                var len = sharesAccounts.length;

                if (len > 0)
                {
                    var sum = 0;
                    for (var j = 0; j < len; j++)
                    {
                        var sharesAccount = sharesAccounts[j];
                        sum = sum + sharesAccount['balance'];

                    }
                    formattedValue = currencyCode + " " + formatCurrency(sum);
                } else
                {
                    formattedValue = currencyCode + " " + 0;
                }
            }
            if ('loan' === key)
            {
                var loans = loanList.getByClient(dataList[i]['awamoId']);
                var len = loans.length;

                if (len > 0)
                {
                    var sum = 0;
                    for (var j = 0; j < len; j++)
                    {
                        var loan = loans[j];
                        if (loan.status === "ACTIVE")
                        {
                            sum = sum + loan['principal'];
                        }
                    }
                    formattedValue = currencyCode + " " + formatCurrency(sum);
                } else
                {
                    formattedValue = currencyCode + " " + 0;
                }
            }
            if (formattedValue === ' ')
            {
                formattedValue = 'n.a.';
            }
            rowdata[key] = formattedValue;
        }

        addRow($rowContainer, rowdata, dataList[i], ShareHandler.self.newSharesApplication, dataList[i].accountId);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        3: {sorter: 'awamoDateSorter'},
        4: {sorter: 'awamoDateSorter'}
    };
    // $table.tablesorter(tableSorter);
    initialize_datatable($table);

    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++)
    {
        els[i].style.textAlign = "right";
    }

    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));

    $("#hiddenPrintedTitle").val("Clients Report");
};



ShareHandler.prototype.newSharesApplication = function () {

    var client = $(this).data('object');
    ShareHandler.self.currentClient = client;

    console.log("Client");
    console.log(client);

    hideLoader();

    // check parameter
    if (!exists(client))
    {
        return;
    }


    ShareHandler.self.stack(ShareHandler.prototype.transactionApplication);
    ShareHandler.self.shareApplication = null;
    initDefaultContent(' share');
    var $clientSelect = $('#shareClient');
    var $sharesAccountSelect = $('#shareSavingsAccount');

    var transactionType = null;
    //TODO: get Share Products List
    var share_products = shareProductList.getEntities();
    //
    var shareproduct_option = '<option value=""> Select </option>  ';

    $.each(share_products, function (key, row) {
        shareproduct_option += '<option value="' + row.id + '"> ' + row.name + '</option>';
    });

    // fill up the share product
    $("#shareProduct").html(shareproduct_option);

    console.log(share_products);
    //TODO: Get Clients Savings Accounts
    var sharesSavingsAccounts = savingsAccountList.getByClient(client.awamoId);
    var sharesavingsaccount_option = '<option value=""> Select </option>  ';
    $.each(sharesSavingsAccounts, function (key, row) {
        sharesavingsaccount_option += '<option value="' + row.accountId + '"> ' + row.accountNo + '</option>';
    });

    $("#shareSavingsAccount").html(sharesavingsaccount_option);

    console.log(sharesSavingsAccounts);
    //TODO: get Currency Code

    //todo
    $('#sharePurchaseDatePicker').datetimepicker('setValue'); // show "today" in input field
    //  ShareHandler.self.showActionButtons();


    $('#createShareApplicationForm').off('submit');
    $('#createShareApplicationForm').on('submit', ShareHandler.prototype.submitSharesApplication);

    showContent($('#shareApplication'));


};

ShareHandler.prototype.submitSharesApplication = function (e) {
    e.preventDefault();
    var productId = $("#shareProduct").val();
    var share_purchase_date = $("#share_purchase_date").val();
    share_purchase_date = new Date(share_purchase_date).getTime();
    console.log(share_purchase_date);

    var shareSavingsAccount = $("#shareSavingsAccount").val();
    var shareCount = $("#shareCount").val();

    // Form Level Validation 
    if (isEmpty(productId) == false
            || isEmpty(share_purchase_date) == false
            || isEmpty(shareSavingsAccount) == false
            || isEmpty(shareCount) == false
            ) {

        alert("Fill Mandatory FIelds ");
        return;
    }



    var share_products = shareProductList.getEntities();


    $.each(share_products, function (key, row) {

        if (row.id === productId) {
            console.log("row");
            console.log(row);

            if (shareCount > row.maximumClientShares) {
                alert("Number of shares is greater than Maximum set Client Shares ");
                return;
            }
        }
    });


    var awamoId = ShareHandler.self.currentClient.awamoId;

    var body = '{"productId":' + productId + ', "awamoId":"' + awamoId + '", "totalPendingShares":' + shareCount + ', "currencyCode":"' + currencyCode + '","sharesAccountId":' + shareSavingsAccount + ' }';

    console.log(body);

    var confirmDialogHeader = 'Confirm Share Application';
    var confirmDialogBody = 'Are you sure you want to proceede?';
    var confirmDialogPositiveText = 'Yes';
    var confirmDialogNegativeText = 'No';

    showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText,
            function ()
            {
                //yes deactivate
                var url = host + '/share/v1d/create';
                var headers = getAuthenticationHeader();
                $.ajax({
                    url: url,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: headers,
                    data: body,
                    type: 'POST',
                    beforeSend: function () {
                        showLoader();
                    },
                    success: function (data) {
                        alert("Success");
                        hideLoader();
                    },
                    complete: function () {
                        hideLoader();
                    }
                }).fail(function (Response) {
                    console.log(Response);
                    alert("Something went wrong");
                    hideLoader();
                });
            },
            confirmDialogNegativeText,
            function ()
            {
                //no dont deactivate
            });

};

//</editor-fold>




//SavingsAccountHandler.prototype.getAllForCloseDepositAndWithdraw = function ()
//{
//    addHistory('Savings Accounts All Accounts', '#bankingServicesSavingsAccountAllAccounts', getSidebarSubitemSelector('sharesAccountMainMenu', 'SavingsAccount', 'getAllForCloseDepositAndWithdraw'));
//    currentTable = 'allSavingsAccountsCustom';
//    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.getAllForCloseDepositAndWithdraw;
//    SavingsAccountHandler.self.displayAllSavingsAccountsForCloseDepositWithdraw();
//};
//
//


// <editor-fold defaultstate="collapsed" desc=" submit applications ">
ShareHandler.prototype.purchaseApplication = function() {
    ShareHandler.self.transactionApplication('purchase');
};

ShareHandler.prototype.fillClientList = function() {
    var $clientSelect = $('#shareClient');
    $clientSelect.find('option').not(':first').remove();
    clientList
            .getEntities()
            .filter(function (client) {
                return sharesAccountList.getByClient(client.awamoId).length > 0;
            })
            .sort(function (one, other) {
                return one.fullname > other.fullname;
            })
            .forEach(function (client) {
                $clientSelect.append($('<option value="' + client.awamoId + '">' + client.fullname + '</option>'));
            });
};

ShareHandler.prototype.transactionApplication = function(transactionType) {
    ShareHandler.self.stack(ShareHandler.prototype.transactionApplication);
    ShareHandler.self.shareApplication = null;
    initDefaultContent(transactionType + ' share');
    var $clientSelect = $('#shareClient');
    var $sharesAccountSelect = $('#shareSavingsAccount');
    
    ShareHandler.self.fillClientList();
    $clientSelect.off('input');
    $clientSelect.on('input', function() {
        $sharesAccountSelect.find('option').not(':first').remove();
        sharesAccountList
                .getByClient($(this).val())
                .filter(function (sharesAccount) {
                    return sharesAccount.status === 'ACTIVE';
                })
                .forEach(function (sharesAccount) {
                    $sharesAccountSelect.append($('<option value="' + sharesAccount.accountId + '">' + sharesAccount.accountNo + '</option>'));
                });
    });
    
    $('#shareCount').off('input');
    $('#shareCount').on('input', function() {
        var value = Math.round(Math.abs($(this).val()));
        if (value === 0) {
            $('#singleActions a[data-action="purchase"]').text(transactionType);
        } else {
            $('#singleActions a[data-action="purchase"]').text(transactionType + ' ' + value + ' share' + (value ===  1 ? '' : 's') + ' for ' + formatCurrency(value * ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode);
        }
    });
    $('#shareCount').next('.input-group-addon').text(formatCurrency(ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode + ' each');

    $('#shareApplicationForm').data('transactionType', transactionType);
    $('#shareApplicationForm').off('submit');
    $('#shareApplicationForm').on('submit', ShareHandler.prototype.submitTransactionApplicationHandler);

    $('#sharePurchaseDatePicker').datetimepicker({
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 1,
        pickerPosition: 'bottom-center',
        keyboardNavigation: 0
    });
    $('#sharePurchaseDatePicker').datetimepicker('setValue'); // show "today" in input field
    ShareHandler.self.showActionButtons();
    
    showContent($('#shareApplication'));
};

ShareHandler.prototype.submitTransactionApplicationHandler = function(event) {
    if (exists(event)) {
        event.preventDefault();
    }
    
    var numberOfShares = Math.round(Math.abs($('#shareCount').val()));
    var shareTransaction = {
        transactionDate: new Date($('#sharePurchaseDate').val()).getTime(),
        clientAwamoId: $('#shareClient').val(),
        sharesAccountId: $('#shareSavingsAccount').val(),
        requestedShares: numberOfShares,
        submittedDate: new Date().getTime(),
        transactionType: $('#shareApplicationForm').data('transactionType').toUpperCase()
    };
    
    ajax(shareList.rootPath, 'POST', function(response) {
        message('Success',
            'successfully submitted application for purchase of ' + numberOfShares + ' share' + (numberOfShares ===  1 ? '' : 's') + ' for ' + (numberOfShares * ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode,
            MessageType.SUCCESS);
            
        $('#sharePurchaseDatePicker').datetimepicker('setDate', new Date());
        $('#shareClient').find('option').not(':first').remove();
        $('#shareSavingsAccount').find('option').not(':first').remove();
        $('#shareCount').val('');
        $('#singleActions a[data-action="purchase"]').text('Purchase');
        $('#singleActions a[data-action="purchase"]').prop('disabled', true);
        
        $('#sharePurchaseDatePicker').blur();
        $('#shareClient').blur();
        $('#shareSavingsAccount').blur();
        $('#shareCount').blur();
        $('#singleActions a[data-action="purchase"]').blur();
        
        ShareHandler.self.fillClientList();
    }, JSON.stringify(shareTransaction), undefined, function(response) {
        message('Error', response.responseJSON.message, MessageType.WARNING);
    });
};

ShareHandler.prototype.sellApplication = function () {
    ShareHandler.self.stack(ShareHandler.prototype.sellApplication);
    initDefaultContent('Sell share(s)');

    var $clientSelect = $('#shareSaleApplicationClient');
    $clientSelect.find('option').not(':first').remove();
    ajax(shareList.rootPath + 'clientsWithShares', 'GET', function (clientsWithShares) {
        clientsWithShares.forEach(function (client) {
            var $element = $('<option value="' + client.clientAwamoId + '" data-max="' + client.numberOfShares + '">' + client.clientName + '</option>');
            $clientSelect.append($element);
        });
        $clientSelect.off('input');
        $clientSelect.on('input', function () {
            var maxShares = $(this).find(":selected").data('max');
            $('#shareSaleApplicationCount').attr('max', maxShares);
            $('#shareSaleApplicationCount').next('.input-group-addon').text(formatCurrency(ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode + ' each, min 1 and max ' + maxShares + ' shares');

        });
    });

    $('#shareSaleApplicationForm').off('submit');
    $('#shareSaleApplicationForm').on('submit', ShareHandler.prototype.submitSellApplicationHandler);

    ShareHandler.self.shareApplication = {status: 'WANT_TO_SELL'};
    ShareHandler.self.showActionButtons();

    showContent($('#shareSaleApplication'));
};

ShareHandler.prototype.submitSellApplicationHandler = function(event) {
    if (exists(event)) {
        event.preventDefault();
    }

    var $clientSelect = $('#shareSaleApplicationClient');
    var numberOfShares = Math.round(Math.abs($('#shareSaleApplicationCount').val()));
    var shareTransaction = {
        transactionDate: new Date().getTime(),
        clientAwamoId: $clientSelect.val(),
        requestedShares: numberOfShares,
        submittedDate: new Date().getTime(),
        transactionType: 'SALE'
    };
    
   ajax(shareList.rootPath, 'POST', function (response) {
        message('Success',
                'successfully submitted application for sale of ' + numberOfShares + ' share' + (numberOfShares === 1 ? '' : 's') + ' for ' + (numberOfShares * ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode,
                MessageType.SUCCESS);

        $('#shareSaleApplicationCount').val('');
        $('#shareSaleApplicationCount').next('.input-group-addon').text(formatCurrency(ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode + ' each');
        $('#singleActions a[data-action="sell"]').text('Sell');
        $('#singleActions a[data-action="sell"]').prop('disabled', true);

        $clientSelect.blur();
        $('#shareSaleApplicationCount').blur();
        $('#singleActions a[data-action="sell"]').blur();

        $clientSelect.find('option').not(':first').remove();
        ajax(shareList.rootPath + 'clientsWithShares', 'GET', function (clientsWithShares) {
            clientsWithShares.forEach(function (client) {
                var $element = $('<option value="' + client.clientAwamoId + '" data-max="' + client.numberOfShares + '">' + client.clientName + '</option>');
                $clientSelect.append($element);
            });
            $clientSelect.off('input');
            $clientSelect.on('input', function () {
                var maxShares = $(this).find(":selected").data('max');
                $('#shareSaleApplicationCount').attr('max', maxShares);
                $('#shareSaleApplicationCount').next('.input-group-addon').text(formatCurrency(ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode + ' each, min 1 and max ' + maxShares + ' shares');

            });
        });
    }, JSON.stringify(shareTransaction), undefined, function (response) {
        message('Error', response.responseJSON.message, MessageType.WARNING);
    });
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" approve/reject application ">
ShareHandler.prototype.approvePurchase = function() {
    ShareHandler.self.stack(ShareHandler.prototype.approvePurchase);
    initDefaultContent('Purchase applications');
    var $rowContainer = getDefaultRowContainer(ShareHandler.APPLICATION_TITLES);
    
    ajax(shareList.rootPath + "listApplications?transactionType=PURCHASE", "GET", function(shareApplicationList) {
        ShareHandler.self.counter = shareApplicationList.length;
        
        if (ShareHandler.self.counter === 0) {
            tableMessage('no applications found');
        }
        
        shareApplicationList.forEach(function(shareApplication) {
            clientList.get(shareApplication.clientAwamoId, function(client) {
                shareApplication.client = client;
                shareApplication.status = "SUBMITTED_FOR_PURCHASE";
                
                sharesAccountList.get(shareApplication.sharesAccountId, function (sharesAccount) {
                    shareApplication.sharesAccount = sharesAccount;
                    addRow(
                            $rowContainer,
                            ShareHandler.self.getShareRowData(shareApplication),
                            shareApplication,
                            ShareHandler.self.approvePurchaseRowClickHandler,
                            shareApplication.clientAwamoId);
                    ShareHandler.self.counter = ShareHandler.self.counter - 1;
                    if (ShareHandler.self.counter === 0) {
                        $rowContainer.parent().tablesorter(getDefaultTableSorter("unsorted"));
                        addClassToTableColumn($rowContainer.parent(), 2, 'currency');
                    }
                });
            });
        });
    });
    
    showContent($('#defaultTableContainer'));
};

ShareHandler.prototype.approvePurchaseRowClickHandler = function () {
    // register new button handler
    $('#approveNo').off('click touch');
    $('#approveNo').on('click touch', ShareHandler.prototype.back);
    $('#rejectNo').off('click touch');
    $('#rejectNo').on('click touch', ShareHandler.prototype.back);
    
    $('#approveYes').off('click touch');
    $('#approveYes').on('click touch', ShareHandler.prototype.approvePurchaseApplication);
    $('#rejectYes').off('click touch');
    $('#rejectYes').on('click touch', ShareHandler.prototype.rejectPurchaseApplication);
    
    $('#approveApplication .panel-body .approvalObject').text('share purchase');
    $('#rejectApplication .panel-body .rejectionObject').text('share purchase');
    
    ShareHandler.self.displaySingleShare($(this).data('object'));
};

ShareHandler.prototype.approvePurchaseApplication = function () {
    ShareHandler.self.shareApplication.status = 'APPROVED_PURCHASE';
    ajax(
            shareList.rootPath + ShareHandler.self.shareApplication.id + '/approvePurchase',
            'POST',
            ShareHandler.prototype.approvePurchaseApplicationSuccessful);
    
    window.setTimeout(function() {
        ShareHandler.self.back();
        ShareHandler.self.back();
    }, 1000);
};

ShareHandler.prototype.approvePurchaseApplicationSuccessful = function () {
    ShareHandler.self.shareApplication.status = 'APPROVED_PURCHASE';
};

ShareHandler.prototype.rejectPurchaseApplication = function () {
    ShareHandler.self.shareApplication.status = 'REJECTED_PURCHASE';
    ajax(
            shareList.rootPath + ShareHandler.self.shareApplication.id + '/rejectPurchase',
            'POST',
            ShareHandler.prototype.rejectPurchaseApplicationSuccessful,
            '{"note":"' + $('#rejectionNote').val() + '"}');
    ShareHandler.self.back();
    ShareHandler.self.back();
};

ShareHandler.prototype.rejectPurchaseApplicationSuccessful = function () {
    ShareHandler.self.shareApplication.status = 'REJECTED_PURCHASE';
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" apply for sale ">
ShareHandler.prototype.saleRowClickHandler = function () {
    var shareApplication = $(this).data('object');
    ShareHandler.self.displaySingleShare(shareApplication);
    $('#shareSaleCount').val(shareApplication.requestedShares);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" approve/reject sale application ">
ShareHandler.prototype.approveSale = function() {
    ShareHandler.self.stack(ShareHandler.prototype.approveSale);
    initDefaultContent('Sale applications');
    var $rowContainer = getDefaultRowContainer(ShareHandler.APPLICATION_TITLES); 

    ajax(shareList.rootPath + "listApplications?transactionType=SALE", "GET", function (shareApplicationList) {
        ShareHandler.self.counter = shareApplicationList.length;
        
        if (ShareHandler.self.counter === 0) {
            tableMessage('no applications found');
        }
        
        shareApplicationList.forEach(function (shareApplication) {
            clientList.get(shareApplication.clientAwamoId, function (client) {
                shareApplication.client = client;
                shareApplication.status = "SUBMITTED_FOR_SALE";

                sharesAccountList.get(shareApplication.sharesAccountId, function (sharesAccount) {
                    shareApplication.sharesAccount = sharesAccount;
                    addRow(
                            $rowContainer,
                            ShareHandler.self.getShareRowData(shareApplication),
                            shareApplication,
                            ShareHandler.self.approveSaleRowClickHandler,
                            shareApplication.clientAwamoId);
                    ShareHandler.self.counter = ShareHandler.self.counter - 1;
                    if (ShareHandler.self.counter === 0) {
                        $rowContainer.parent().tablesorter(getDefaultTableSorter("unsorted"));
                        addClassToTableColumn($rowContainer.parent(), 2, 'currency');
                    }
                });
            });
        });
    });

    showContent($('#defaultTableContainer'));
};

ShareHandler.prototype.approveSaleRowClickHandler = function () {
    // register new button handler
    $('#approveNo').off('click touch');
    $('#approveNo').on('click touch', ShareHandler.prototype.back);
    $('#rejectNo').off('click touch');
    $('#rejectNo').on('click touch', ShareHandler.prototype.back);
    
    $('#approveYes').off('click touch');
    $('#approveYes').on('click touch', ShareHandler.prototype.approveSaleApplication);
    $('#rejectYes').off('click touch');
    $('#rejectYes').on('click touch', ShareHandler.prototype.rejectSaleApplication);
  
    $('#approveApplication .panel-body .approvalObject').text('share sale');
    $('#rejectApplication .panel-body .rejectionObject').text('share sale');
    
    ShareHandler.self.displaySingleShare($(this).data('object'));
};

ShareHandler.prototype.approveSaleApplication = function () {
    ShareHandler.self.shareApplication.status = 'APPROVED_SALE';
    ajax(
            shareList.rootPath + ShareHandler.self.shareApplication.id + '/approveSale',
            'POST',
            ShareHandler.prototype.approveSaleApplicationSuccessful);
    window.setTimeout(function() {
        ShareHandler.self.back();
        ShareHandler.self.back();
    }, 1000);
};

ShareHandler.prototype.approveSaleApplicationSuccessful = function () {
    ShareHandler.self.shareApplication.status = 'APPROVED_SALE';
};

ShareHandler.prototype.rejectSaleApplication = function () {
    ShareHandler.self.shareApplication.status = 'REJECTED_SALE';
    ajax(
            shareList.rootPath + ShareHandler.self.shareApplication.id + '/rejectSale',
            'POST',
            ShareHandler.prototype.rejectPurchaseApplicationSuccessful,
            '{"note":"' + $('#rejectionNote').val() + '"}');
    ShareHandler.self.back();
    ShareHandler.self.back();
};

ShareHandler.prototype.rejectSaleApplicationSuccessful = function () {
    ShareHandler.self.shareApplication.status = 'REJECTED_SALE';
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" common methods ">
ShareHandler.prototype.displayApprove = function(share) {
    ShareHandler.self.stack(ShareHandler.prototype.displayApprove, share);
    hideContent();
    showContent($('#approveApplication'));
};

ShareHandler.prototype.displayReject = function(share) {
    ShareHandler.self.stack(ShareHandler.prototype.displayReject, share);
    hideContent();
    $('#rejectionNote').val('');
    showContent($('#rejectApplication'));
};

ShareHandler.prototype.getShareRowData = function(shareApplication) {
    var rowdata = {};
    
    for (var key in ShareHandler.APPLICATION_TITLES) {
        var formattedValue = shareApplication[key];
        
        switch (key) {
            case 'clientName':
                formattedValue = shareApplication.client.fullname;
                break;
            case 'numberOfShares':
                formattedValue = shareApplication.requestedShares;
                break;
            case 'valueOfShares':
                formattedValue = formatCurrency(parseInt(shareApplication.requestedShares) * parseInt(ShareHandler.CURRENT_MARKET_PRICE)) + ' ' + currencyCode;
                break;
            default:
                break;
        }
        
        rowdata[key] = String(formattedValue);
    }

    return rowdata;
};

ShareHandler.prototype.displaySingleShareApplication = function (shareApplication) {
    ShareHandler.self.stack(ShareHandler.prototype.displaySingleShare, shareApplication);
    ShareHandler.self.shareApplication = shareApplication;
    
    // hide all content
    hideContent();
    
    // set data
    $('#singleSharePurchaseDate').val(formatDate(shareApplication.submittedDate));
    $('#singleShareClient').val(shareApplication.awamoId);
    $('#singleShareSavingsAccount').val(shareApplication.sharesAccount.accountNo);
    $('#singleShareCount').val(shareApplication.requestedShares);
    $('#singleShareCount').next('.input-group-addon').text(ShareHandler.CURRENT_MARKET_PRICE + ' ' + currencyCode);
    
    // handle buttons
    ShareHandler.self.showActionButtons();
    
    // show form
    showContent($('#singleShare'));
};

ShareHandler.prototype.displaySingleShare = function (shareApplication) {
    ShareHandler.self.stack(ShareHandler.prototype.displaySingleShare, shareApplication);
    ShareHandler.self.shareApplication = shareApplication;
    
    // hide all content
    hideContent();
    
    // set data
    $('#singleSharePurchaseDate').val(formatDate(shareApplication.transactionDate));
    $('#singleShareClient').val(shareApplication.client.fullname);
    $('#singleShareSavingsAccount').val(shareApplication.sharesAccount.accountNo);
    $('#singleShareCount').val(shareApplication.requestedShares);
    $('#singleShareCountValue').val(formatCurrency(shareApplication.requestedShares * ShareHandler.CURRENT_MARKET_PRICE) + ' ' + currencyCode);
    
    // handle buttons
    ShareHandler.self.showActionButtons();
    
    // show form
    showContent($('#singleShare'));
};

ShareHandler.prototype.singleObjectActionHandler = function() {
    var action = $(this).data('action');

    switch (action) {
        case 'approve':
            ShareHandler.self.displayApprove(ShareHandler.self.shareApplication);
            break;
        case 'reject':
            ShareHandler.self.displayReject(ShareHandler.self.shareApplication);
            break;
        case 'back':
            ShareHandler.self.back();
            break;
        case 'purchase':
            $('#shareApplicationForm input[type="submit"]').click();
            break;
        case 'sell':
            $('#shareSaleApplicationForm input[type="submit"]').click();
            break;
        default:
            // noop
            break;
    }
};

ShareHandler.prototype.showActionButtons = function() {
    $('#singleActions a[data-action]').hide();
    
    if (ShareHandler.self.shareApplication === null) {
        $('#singleActions a[data-action="purchase"]').show();
    } else {
        $('#singleActions a[data-action="back"]').show();
        
        switch (ShareHandler.self.shareApplication.status) {
            case 'WANT_TO_SELL':
                $('#singleActions a[data-action="sell"]').show();
                break;
            
            case 'SUBMITTED_FOR_PURCHASE':
            case 'SUBMITTED_FOR_SALE':
                $('#singleActions a[data-action="approve"]').show();
                $('#singleActions a[data-action="reject"]').show();
                break;
            case 'ACTIVE':
                $('#singleActions a[data-action="sell"]').show();
                break;
            default:
                break;
        }
    }
    
    showContent($('#singleActions'));
};

ShareHandler.prototype.dataModelChanged = function() {
    // NOOP
};

ShareHandler.prototype.entityChanged = function(object, type) {
//    switch (type) {
//        case eventtype.CREATE:
//        case eventtype.UPDATE:
//            //ShareHandler.self.outputLoan(object);
//            break;
//        case eventtype.DELETE:
//            // TODO
//            console.log('not yet implemented: loan entity [' + object.mainId + '] deleted');
//            break;
//        default:
//            break;
//    }
};

ShareHandler.prototype.stack = function(command, arguments) {
    ShareHandler.self.commandStack.push(command);
    ShareHandler.self.argumentStack.push(arguments); // TODO: don't know if this works if it is undefined ...
};

ShareHandler.prototype.back = function() {
    // remove current page from stack
    ShareHandler.self.commandStack.pop();
    ShareHandler.self.argumentStack.pop();
    
    // call previous page
    ShareHandler.self.commandStack.pop()(ShareHandler.self.argumentStack.pop());
};
// </editor-fold>
