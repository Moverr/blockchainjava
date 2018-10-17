'use strict';

/* global savingsAccountList, tableSorter, currencyCode, printData */

var currentChangedFil = "ALL";
var savings_account_submit_date;
var countOfSavingsAccountsApplicationTableIterations;
var savingsAccountTransactionBody;
var savingsAccountNewAcBalance;
var savingsAccountPrevAcBalance;
var savingsAccountTransactionDate;
var savingsAccountId;

// <editor-fold defaultstate="collapsed" desc=" init ">
var SavingsAccountHandler = function ()
{
    countOfSavingsAccountsApplicationTableIterations = 0;
    this.forReporting = false;
    SavingsAccountHandler.self = this;
    savingsAccountList.addDataModelChangedEventListenerCallback(SavingsAccountHandler.prototype.dataModelChanged);
    savingsAccountList.addEntityChangedEventListenerCallback(SavingsAccountHandler.prototype.entityChanged);
    $('#savingsAccountCloseFormCloseBtn').on('click touch', SavingsAccountHandler.self.handleSavingsAccountClosingAction);
    $('#savingsAccountCloseFormWithdrawToZeroBtn').on('click', SavingsAccountHandler.self.handleSavingsAccountWithdrawToZeroAction);
    $('#savingsAccountCloseDepositWithdrawFormCancelBtn').on('click touch', SavingsAccountHandler.self.getAllForCloseDepositAndWithdraw);
    $('#savingsAccountWithdrawFormWithdrawBtn').on('click', SavingsAccountHandler.self.handleSavingsAccountWithdrawAction);
    $('#SavingsAccountReportTypeForm select').on('input', SavingsAccountHandler.prototype.genericSavingAccountReportSelectHandler);
    $('#savingsAccountDepositFormDepositBtn').on('click', SavingsAccountHandler.self.handleSavingsAccountDepositAction);
    $('#savingsAccountCloseDepositWithdrawFormCloseBtn').click(function ()
    {
        SavingsAccountHandler.self.handleSavingsAccountCloseAccountOption();
    });
    $('#savingsAccountCloseDepositWithdrawFormWithdrawBtn').click(function ()
    {
        SavingsAccountHandler.self.handleSavingsAccountWithdrawAccountOption();
    });
    $('#savingsAccountCloseDepositWithdrawFormDepositBtn').click(function ()
    {
        SavingsAccountHandler.self.handleSavingsAccountDepositAccountOption();
    });
    SavingsAccountHandler.self.goBackHandler = null;
};

SavingsAccountHandler.ROOT_PATH = '/savingsaccount/v1d/';

SavingsAccountHandler.APPLICATION_TITLES = {
    clientName: 'Name',
    accountNo: 'Account',
    status: 'Status',
    submitDate: 'Submission Date',
    interestRate: 'Rate',
    balance: 'Balance'
};
SavingsAccountHandler.ALL_ACCOUNTS_TITLES = {
    clientName: 'Name',
    accountNo: 'Account',
    status: 'Status',
    interestRate: 'Rate',
    balance: 'Balance'
};
//convergence: these account titles have been created to include the account id
SavingsAccountHandler.CUSTOMISED_ACCOUNT_TITLES = {
    clientName: 'Name',
    accountNo: 'Account',
    status: 'Status',
    interestRate: 'Rate',
    balance: 'Balance',
    accountId: 'Account ID',
    awamoId: 'Awamo ID'
};
SavingsAccountHandler.CLIENT_TITLES = {
    fullname: 'Name',
    gender: 'Sex',
    birthdate: 'Birth date',
    submitDate: 'Registration',
    phone1: 'Phone'
};
SavingsAccountHandler.TRANSACTION_TITLES = {
    transactionDate: 'Date',
    amount: 'Amount',
    transactionType: 'Type',
    balance: 'Balance'
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" public methods ">
SavingsAccountHandler.prototype.getApplications = function ()
{
    SavingsAccountHandler.forReporting = false;
    addHistory('Savings Account Applications', '#savingsAccountApplications', getSidebarSubitemSelector('actionRequired', 'SavingsAccount', 'getApplications'));
    currentTable = 'savingsAccountApplications';
    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.getApplications;
    SavingsAccountHandler.self.displaySavingsAccountApplications();
};

SavingsAccountHandler.prototype.getAll = function ()
{
    SavingsAccountHandler.forReporting = false;
    addHistory('All Savings Accounts', '#savingsAccounts', getSidebarSubitemSelector('reporting', 'SavingsAccount', 'getAll'));
    currentTable = 'allSavingsAccounts';
    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.getAll;
    SavingsAccountHandler.self.displayAllSavingsAccounts();
};
SavingsAccountHandler.prototype.getAllForReporting = function ()
{
    SavingsAccountHandler.forReporting = true;
    addHistory('Reporting All Accounts', '#reportingSavingsAccountAllAccounts', getSidebarSubitemSelector('reporting', 'SavingsAccount', 'getAllForReporting'));
    currentTable = 'allSavingsAccounts';
    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.getAllForReporting;
    SavingsAccountHandler.self.displayAllSavingsAccounts();
};

SavingsAccountHandler.prototype.getAllForCloseDepositAndWithdraw = function ()
{
    addHistory('Savings Accounts All Accounts', '#bankingServicesSavingsAccountAllAccounts', getSidebarSubitemSelector('savingsAccountMainMenu', 'SavingsAccount', 'getAllForCloseDepositAndWithdraw'));
    currentTable = 'allSavingsAccountsCustom';
    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.getAllForCloseDepositAndWithdraw;
    SavingsAccountHandler.self.displayAllSavingsAccountsForCloseDepositWithdraw();
};

SavingsAccountHandler.prototype.showAllClientsForSavingsAccountApplication = function ()
{
    addHistory('Savings Accounts All Clients', '#bankingServicesSavingsAccountAllClients', getSidebarSubitemSelector('savingsAccountMainMenu', 'SavingsAccount', 'showAllClientsForSavingsAccountApplication'));
    currentTable = 'allClients';
    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.showAllClientsForSavingsAccountApplication;
    SavingsAccountHandler.self.displayAllClientsForSavingsAccountApplication();
};

SavingsAccountHandler.prototype.displayAllClientsForSavingsAccountApplication = function ()
{
    ClientHandler.self.currentClient = null;

    initDefaultContent('Select Client For Savings Account Application');

    var dataList = clientList.getEntities();
    var $rowContainer = getDefaultRowContainer(SavingsAccountHandler.CLIENT_TITLES, true, "bankingSvcsSavingsAcClientsTable");
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
                var savingsAccounts = savingsAccountList.getByClient(dataList[i]['awamoId']);
                var len = savingsAccounts.length;

                if (len > 0)
                {
                    var sum = 0;
                    for (var j = 0; j < len; j++)
                    {
                        var savingsAccount = savingsAccounts[j];
                        sum = sum + savingsAccount['balance'];

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

        addRow($rowContainer, rowdata, dataList[i], SavingsAccountHandler.self.newSavingsAccountApplicationClientRowClickHandler, dataList[i].accountId);
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

SavingsAccountHandler.prototype.newSavingsAccountApplicationClientRowClickHandler = function ()
{
    SavingsAccountHandler.self.newSavingsAccountApplicationClientManageShowApplicationForm($(this).data('object'));
};

SavingsAccountHandler.prototype.newSavingsAccountApplicationClientManageShowApplicationForm = function (client)
{
    // check parameter
    if (!exists(client))
    {
        return;
    }
    // store current client
    ClientHandler.self.client = client;

    initDefaultContent('Create Savings Account');
    SavingsAccountHandler.self.displayNewSavingsAccountApplicationForClient(client);
    document.getElementById("newSavingsAccountFormSubmitBtn").disabled = false;
    document.getElementById("newSavingsAccountFormCancelBtn").disabled = false;

    $('#newSavingsAccountFormSubmitBtn').off('click touch');
    $('#newSavingsAccountFormSubmitBtn').on('click touch', SavingsAccountHandler.self.submitSavingsAccountApplicationHandler);
    $('#newSavingsAccountFormCancelBtn').off('click touch');
    $('#newSavingsAccountFormCancelBtn').on('click touch', SavingsAccountHandler.self.cancelSavingsAccountApplicationHandler);

    // show necessary content
    showContent($('#newSavingsAccountDiv'));

};

SavingsAccountHandler.prototype.cancelSavingsAccountApplicationHandler = function ()
{
    addHistory('All Clients', '#savingsAccounts', getSidebarSubitemSelector('savingsAccount', 'SavingsAccount', 'showAllClientsForSavingsAccountApplication'));
    currentTable = 'allClients';
    SavingsAccountHandler.self.previousPage = SavingsAccountHandler.self.showAllClientsForSavingsAccountApplication;
    SavingsAccountHandler.self.displayAllClientsForSavingsAccountApplication();
};

SavingsAccountHandler.prototype.submitSavingsAccountApplicationHandler = function (e)
{
    e.preventDefault();
    if (validateForm($('#newSavingsAccountForm')))
    {
        var interest_rate = $('#newSavingsAccountFormInterestRate').val();
        var rawInterestRateValue = $('#newSavingsAccountFormInterestRate').val().replace(/\./g, '');
        var clientName = $('#newSavingsAccountFormLastName').val().toUpperCase() + ', ' + $('#newSavingsAccountFormFirstName').val();
        //checking if the interest rate value has only digits
        console.log('test result : ' + (!isNaN(parseFloat(interest_rate)) && isFinite(interest_rate)));
        var validationCheck = true;
        if ((!isNaN(parseFloat(interest_rate)) && isFinite(interest_rate)))
        {

            //var floatedInterestRate = parseFloat(rawInterestRateValue);
            var floatedInterestRate = unformatPercentage(interest_rate);

            if ($('#newSavingsAccountFormWithInterestYes').is(':checked') && (!(parseFloat(interest_rate) > 0) || !(parseFloat(interest_rate) <= 100)))
            {
                showContent($('#newSavingsAccountDiv'));//$('#newSavingsAccountFormWithInterestYes').is(':checked')
                showAlertMessage('Please check the value of the interest rate, it should be greater than 0 and less than 100', AlertTypes.warning);
                validationCheck = false;
            } else if ($('#newSavingsAccountFormWithInterestNo').is(':checked'))
            {
                validationCheck = true;
            }
            if (validationCheck)
            {
                if ($('#newSavingsAccountFormWithInterestNo').is(':checked'))
                {
                    interest_rate = 0;
                } else if ($('#newSavingsAccountFormWithInterestYes').is(':checked'))
                {
                    interest_rate = unformatCurrency(interest_rate);
                }
                var headers = getAuthenticationHeader();
                var uri = SavingsAccountHandler.ROOT_PATH;
                var body = '{"' +
                        'savingsAccountType":"' + 'INDIVIDUAL' +
                        '","interestRate":"' + floatedInterestRate +
                        '","balance":"' + '0' +
                        '","status":"' + 'SUBMITTED' +
                        '","submitDate":"' + Date.now() +
                        '","awamoId":"' + $('#newSavingsAccountFormAwamoId').val() +
                        '"}';

                $.ajax({
                    url: host + uri,
                    data: body,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    headers: headers,
                    type: 'POST',
                    beforeSend: function ()
                    {
                        document.getElementById("newSavingsAccountFormSubmitBtn").disabled = true;
                        document.getElementById("newSavingsAccountFormCancelBtn").disabled = true;
                        showLoader();
                    },
                    success: function (data)
                    {
                        $('#newSavingsAccountFormInterestRate').val('0');
                        document.getElementById("newSavingsAccountFormSubmitBtn").disabled = false;
                        document.getElementById("newSavingsAccountFormCancelBtn").disabled = false;
                        SavingsAccountHandler.prototype.createLocalSavingsAccountApplicationObject(data['accountNo'], data['accountId'], floatedInterestRate, $('#newSavingsAccountFormAwamoId').val(), clientName);
                        SavingsAccountHandler.self.displayAllClientsForSavingsAccountApplication();
                        hideLoader();
                        showAlertMessage('Savings account application submited successfully', AlertTypes.success);
                    },
                    complete: function ()
                    {
                        $('#newSavingsAccountFormInterestRate').val('0');
                        document.getElementById("newSavingsAccountFormSubmitBtn").disabled = false;
                        document.getElementById("newSavingsAccountFormCancelBtn").disabled = false;
                        hideLoader();
                    }
                }).fail(function (Response)
                {
                    hideLoader();
                    showAlertMessage('Savings account application failed and not submitted', AlertTypes.danger);
                    document.getElementById("newSavingsAccountFormSubmitBtn").disabled = false;
                    document.getElementById("newSavingsAccountFormCancelBtn").disabled = false;
                    $('#newSavingsAccountFormInterestRate').val('0');
                    showContent($('#newSavingsAccountDiv'));
                });
            }
        } else
        {
            showAlertMessage('Please check the value of the interest rate, it should be a digit greater than 0 and less than 100', AlertTypes.danger);
        }
    } else
    {
        showAlertMessage('Please ensure that all the fields are filled in correctly', AlertTypes.danger);
    }
};

SavingsAccountHandler.prototype.createLocalSavingsAccountApplicationObject = function (accountNo, accountId, interestRate, awamoId, clientName)
{
    var newSavingsAccount = new Object();
    newSavingsAccount.clientName = clientName;
    newSavingsAccount.accountNo = accountNo;
    newSavingsAccount.accountId = accountId;
    newSavingsAccount.status = "SUBMITTED";
    console.log('interest rate : ' + interestRate);
    newSavingsAccount.interestRate = interestRate;
    newSavingsAccount.awamoId = awamoId;
    newSavingsAccount.balance = '0';
    savingsAccountList.store(newSavingsAccount);
};

SavingsAccountHandler.prototype.displayNewSavingsAccountApplicationForClient = function (client)
{
    // check parameter
    document.getElementById("newSavingsAccountFormClientImageID").src = "images/personPlaceholderNoText.png";
    $('#newSavingsAccountDiv .panel-heading').text('Create Savings Account For ' + client.fullname);
    $('#newSavingsAccountFormFirstName').val('');
    $('#newSavingsAccountFormFirstName').val(client.firstname);
    $('#newSavingsAccountFormMiddleName').val(client.middlename);
    $('#newSavingsAccountFormLastName').val(client.lastname);
    $('#newSavingsAccountFormBirthdate').val(formatDate(client.birthdate) + ' (' + client.age + ' years)');
    $('#newSavingsAccountFormNationality').val(client.nationality);
    $('#newSavingsAccountFormAwamoId').val(client.awamoId);
    $('#newSavingsAccountFormInterestRate').val('0');

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
            .done(function (e)
            {
                var blob = new Blob([e], {type: 'image/jpg'});
                var fr = new FileReader();
                fr.onload = function (e)
                {
                    document.getElementById("newSavingsAccountFormClientImageID").src = e.target.result;
                };
                fr.readAsDataURL(blob);
            })
            .fail(function (e)
            {
                document.getElementById("newSavingsAccountFormClientImageID").src = "images/personPlaceholderNoText.png";
                console.log('fail');
                console.log(e);
            });

    $('#newSavingsAccountFormIdDocumentType').val(client.iddocumenttype);
    $('#newSavingsAccountFormIdDocument').val(client.iddocument);
    $('#newSavingsAccountFormPhone1').val(client.phone1);
    $('#newSavingsAccountFormGender').val(client.gender);

    $('#newSavingsAccountFormWithInterestYes').off('click');
    $('#newSavingsAccountFormWithInterestYes').on('click', SavingsAccountHandler.prototype.newSavingsAccountFormToggleInterestRateRadioBtn);
    $('#newSavingsAccountFormWithInterestNo').off('click');
    $('#newSavingsAccountFormWithInterestNo').on('click', SavingsAccountHandler.prototype.newSavingsAccountFormToggleInterestRateRadioBtn);

    $('#newSavingsAccountFormSubmitBtn').show();
    $('#newSavingsAccountFormCancelBtn').show();
    clearFormValidators($('#newSavingsAccountForm'));
    registerKeyPressValidators($('#newSavingsAccountForm'));
};

SavingsAccountHandler.prototype.newSavingsAccountFormToggleInterestRateRadioBtn = function ()
{
    if ($('#newSavingsAccountFormWithInterestYes').is(':checked'))
    {
        document.getElementById("newSavingsAccountFormInterestRate").disabled = false;
    }
    if ($('#newSavingsAccountFormWithInterestNo').is(':checked'))
    {
        document.getElementById("newSavingsAccountFormInterestRate").disabled = true;
        $('#newSavingsAccountFormInterestRate').val("0");
    }
};

SavingsAccountHandler.prototype.outputAccount = function (object)
{
    var $row = null;

    // update GUI
    if ('savingsAccountApplications' === currentTable)
    {
        if (object.status === 'SUBMITTED')
        {
            $row = SavingsAccountHandler.self.addToTable(object);
        } else
        {
            // noop
        }
    } else if ('allSavingsAccounts' === currentTable)
    {
        $row = SavingsAccountHandler.self.addToTable(object);
    } else
    {
        // noop
    }
    return $row;
};

SavingsAccountHandler.prototype.entityChanged = function (object)
{
    //console.log(object)
    if (currentChangedFil === 'ALL')
    {
        SavingsAccountHandler.self.outputAccount(object);
    } else
    {
        if (object.status.valueOf() === currentChangedFil)
            SavingsAccountHandler.self.outputAccount(object);
    }
};

SavingsAccountHandler.prototype.dataModelChanged = function ()
{
    // noop
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" private methods ">
SavingsAccountHandler.prototype.addToTable = function (data)
{

    //console.log("ADDED $ MOVERS Data ");
//    console.log(data);
    var $row = null;
    if (
            'savingsAccountApplications' === currentTable ||
            'allSavingsAccounts' === currentTable)
    {

        var titles = SavingsAccountHandler.ALL_ACCOUNTS_TITLES;
        if ('savingsAccountApplications' === currentTable)
        {
            titles = SavingsAccountHandler.APPLICATION_TITLES;
        }
        var $tableContainer = $('#defaultTableContainer');



        if ($tableContainer.is(":visible"))
        {

            var $table = $tableContainer.find('table');
            var $rowContainer = $table.find('tbody');
            var $row = $rowContainer.find('[data-id="' + data.accountId + '"]');
            var oldData = $row.data('object');
            var formattedRowData = SavingsAccountHandler.prototype.getRowData(titles, data);


            /*
             *
             * THIS CODE HAS BEEN COMENTED AND REPLACED WITH CALL PREVIOUS PAGE. WHICH IDEALY IS THE PAGE YOU ARE ON
             * TO REMOVE DOUBLE USAGE OF RESOURCES AND MAKE SURE DATATABLES FUNCTION WELL. WE RE INITIALIZE THE VIEW EVERY WHEN THERE IS A NEW
             * DATA LIST CHANGE ;  @mover
             *
             */

//            if (!exists(oldData)) {
//                addRow(
//                        $rowContainer,
//                        formattedRowData,
//                        data,
//                        SavingsAccountHandler.self.rowClickHandler,
//                        data.accountId
//                        );
//            } else {
//                var $cells = $row.find('td');
//                var len = $cells.length;
//
//                for (var i = 0; i < len; i++) {
//                    var $cell = $($cells[i]);
//                    var newValue = formattedRowData[Object.keys(SavingsAccountHandler.ALL_ACCOUNTS_TITLES)[i]];
//                    if ($cell.html() !== newValue) {
//                        $cell.html(newValue);
//                        highlightUpdatedCell($cell);
//                    }
//                }
//            }
            // Re- Call the Handler 
            SavingsAccountHandler.self.previousPage();
        }
    }
};

SavingsAccountHandler.prototype.displaySavingsAccountApplications = function ()
{
    SavingsAccountHandler.prototype.currentSavingsAccount = null;
    initDefaultContent('Savings Account Applications');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', SavingsAccountHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync savings accounts applications');
    $('#syncNow').show();

    SavingsAccountHandler.self.removeTableFilterClasses();
    SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.APPLICATION_TITLES, savingsAccountList.getListByStatus('SUBMITTED'), "actionRequiredSavingsAcTable");
    $('#defaultTableContainer').addClass('allSavingsAccountsTable');
    showPrintButton(exportListName.savingsAccounts, exportListFilter.submitted, SavingsAccountHandler.APPLICATION_TITLES);
    showExcelButton(exportListName.savingsAccounts, exportListFilter.submitted, SavingsAccountHandler.APPLICATION_TITLES);
};

//convergence : created to display all savings accounts for the savings main menu
SavingsAccountHandler.prototype.displayAllSavingsAccountsForCloseDepositWithdraw = function ()
{
    SavingsAccountHandler.prototype.currentSavingsAccount = null;

    SavingsAccountHandler.self.removeTableFilterClasses();

    SavingsAccountHandler.self.displayInTableForCloseDepositWithdraw(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('ACTIVE'));
    $('#defaultTableContainer').addClass('allSavingsAccountsTableForCloseDepositWithdraw');
};

SavingsAccountHandler.prototype.displayAllSavingsAccounts = function ()
{
    SavingsAccountHandler.prototype.currentSavingsAccount = null;
    initDefaultContent('');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', SavingsAccountHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync savings accounts');
    $('#syncNow').show();

    $('#SavingAccountReportType').show();
    $('#SavingsAccountReportTypeForm').show();
    document.getElementById("SavingAccountReportType").selectedIndex = "0";

    SavingsAccountHandler.self.removeTableFilterClasses();
    var savingsAcountList = savingsAccountList.getEntities();
//    if (exists(savingsAcountList) && savingsAcountList.length > 0) {
//        savingsAccountList.hideLoading();
    SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAcountList);
    showPrintButton(exportListName.savingsAccounts, exportListFilter.all, SavingsAccountHandler.APPLICATION_TITLES);
    showExcelButton(exportListName.savingsAccounts, exportListFilter.all, SavingsAccountHandler.APPLICATION_TITLES);
//    }else{
//        savingsAccountList.showLoading();        
    //   savingsAccountList.loadAllAtOnce(savingsAccountList, SavingsAccountHandler.self.displayAllSavingsAccounts);
    // }


    $('#defaultTableContainer').addClass('allSavingsAccountsTable');
};

SavingsAccountHandler.prototype.removeTableFilterClasses = function ()
{
    $('#defaultTableContainer').removeClass('allSavingsAccountsTable');
};

SavingsAccountHandler.prototype.displayInTable = function (titles, dataList, cssClass)
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
                SavingsAccountHandler.prototype.getRowData(titles, dataList[i]),
                dataList[i],
                SavingsAccountHandler.self.rowClickHandler,
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

//convergence mtd, created to render the list of savings accounts for the close,deposit and withdraw functions
SavingsAccountHandler.prototype.displayInTableForCloseDepositWithdraw = function (titles, dataList)
{
    initDefaultContent('Select Account To Close, Withdraw or Deposit');
    var $tableContainer = $('#defaultTableContainer');
    $tableContainer.empty();

    var $rowContainer = getDefaultRowContainer(titles, true, "bankingSvcsSavingsAcTable");
    var $table = $rowContainer.parent();


    $rowContainer = $table.find('tbody');
    for (var i = 0; i < dataList.length; i++)
    {
        addRow(
                $rowContainer,
                SavingsAccountHandler.prototype.getRowData(titles, dataList[i]),
                dataList[i],
                SavingsAccountHandler.self.rowClickHandlerForCloseDepositWithdrawActions,
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
    }

    $("#hiddenPrintedTitle").val("Savingaccounts Report");
};

//convergence row click handler for the list of savings accounts to render the savings account form with the respective actions
SavingsAccountHandler.prototype.rowClickHandlerForCloseDepositWithdrawActions = function (event, previousPage)
{
    if (exists(previousPage))
    {
        SavingsAccountHandler.self.previousPage = previousPage;
    }
    SavingsAccountHandler.self.displayOneSavingsAccountForCloseDepositWithdraw($(event.currentTarget).data('object'));
};

SavingsAccountHandler.prototype.rowClickHandler = function (event, previousPage)
{
    if (exists(previousPage))
    {
        SavingsAccountHandler.self.previousPage = previousPage;
    }

    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();

    $('#singleActions a').off('click touch');
    $('#singleActions a').on('click touch', SavingsAccountHandler.prototype.singleObjectActionHandler);

    $('#approveNo').off('click touch');
    $('#approveNo').on('click touch', SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount);
    $('#rejectNo').off('click touch');
    $('#rejectNo').on('click touch', SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount);
    $('#closeNo').off('click touch');
    $('#closeNo').on('click touch', SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount);
    $('#approveYes').off('click touch');
    $('#approveYes').on('click touch', SavingsAccountHandler.prototype.approveApplication);
    $('#rejectYes').off('click touch');
    $('#rejectYes').on('click touch', SavingsAccountHandler.prototype.rejectApplication);
    $('#closeYes').off('click touch');
    $('#closeYes').on('click touch', SavingsAccountHandler.prototype.closeApplication);

    SavingsAccountHandler.self.displayOneSavingsAccount($(event.currentTarget).data('object'));
};

SavingsAccountHandler.prototype.getRowData = function (titles, savingsAccount)
{
    var rowdata = {};

    for (var key in titles)
    {
        var formattedValue = savingsAccount[key];

        switch (key)
        {
            case 'clientImage':
                formattedValue = '<img src="images/personPlaceholderNoText.png" alt="client" height="32" />';

                if ('GROUP' === savingsAccount.savingsAccountType)
                {
                    formattedValue = '<img src="images/groupPlaceholder.png" alt="client" height="32" />';
                } else if ('INDIVIDUAL' === savingsAccount.savingsAccountType)
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
            case 'submitDate':
                formattedValue = formatDate(formattedValue);
            default:
                break;
        }
        rowdata[key] = String(formattedValue);
    }
    return rowdata;
};

//convergence mtd to display the savings account with the actions for close deposit and withdraw
SavingsAccountHandler.prototype.displayOneSavingsAccountForCloseDepositWithdraw = function (savingsAccount)
{
    // check parameter
    if (!exists(savingsAccount))
    {
        return;
    }
    // store current savings account
    SavingsAccountHandler.self.savingsAccount = savingsAccount;
    initDefaultContent('Withdraw, Close And Deposit Savings Account');
    var formattedData = SavingsAccountHandler.self.getRowData(SavingsAccountHandler.CUSTOMISED_ACCOUNT_TITLES, savingsAccount);
    $('#savingsAccountCloseDepositWithdrawFormNumber').val(formattedData.accountNo);
    $('#savingsAccountCloseDepositWithdrawFormName').val(formattedData.clientName);
    $('#savingsAccountCloseDepositWithdrawFormStatus').val(formattedData.status);
    $('#savingsAccountCloseDepositWithdrawFormInterest').val(formattedData.interestRate);
    $('#savingsAccountCloseDepositWithdrawFormAwamoID').val(formattedData.awamoId);
    //savingsAccountCloseDepositWithdrawFormAccountID
    $('#savingsAccountCloseDepositWithdrawFormAccountID').val(formattedData.accountId);

    $('#savingsAccountCloseDepositWithdrawDiv .balance .value').val(formattedData.balance);
    if (exists(savingsAccount.transactionList) && savingsAccount.transactionList.length > 0)
    {
        $('#savingsAccountCloseDepositWithdrawFormTransactionsTableContainer').parent().siblings('.no-info-to-display').addClass('hidden');
        SavingsAccountHandler.self.displayTransactionsDataForCloseDepositWithdrawForm(savingsAccount.transactionList);

    } else
    {
        $('#savingsAccountCloseDepositWithdrawFormTransactionsTableContainer').parent().siblings('.no-info-to-display').removeClass('hidden');
    }

    // show necessary content
    $('#savingsAccountCloseDiv').hide();
    $('#savingsAccountWithdrawDiv').hide();
    $('#savingsAccountDepositDiv').hide();
    showContent($('#savingsAccountCloseDepositWithdrawDiv'));
};

SavingsAccountHandler.prototype.handleSavingsAccountDepositAccountOption = function ()
{
    var savingsAccount = SavingsAccountHandler.self.savingsAccount;
    // clearFormValidators($('#savingsAccountDepositForm'));
    // registerKeyPressValidators($('#savingsAccountDepositForm'));
    $('#savingsAccountDepositDiv').show();
    var savingsAccountFormatedData = SavingsAccountHandler.self.getRowData(SavingsAccountHandler.CUSTOMISED_ACCOUNT_TITLES, savingsAccount);
    initDefaultContent('Deposit to savings account');
    $('#savingsAccountDepositFormNumber').val(savingsAccountFormatedData.accountNo);
    $('#savingsAccountDepositFormName').val(savingsAccountFormatedData.clientName);
    $('#savingsAccountDepositFormStatus').val(savingsAccountFormatedData.status);
    $('#savingsAccountDepositFormInterest').val(savingsAccountFormatedData.interestRate);
    $('#savingsAccountDepositFormAwamoId').val(savingsAccountFormatedData.awamoId);
    $('#savingsAccountDepositFormAccountId').val(savingsAccountFormatedData.accountId);
    $('#savingsAccountDepositFormBalance').val(savingsAccountFormatedData.balance);
    $('#savingsAccountDepositFormAmount').val('');
    document.getElementById("savingsAccountDepositFormDepositBtn").disabled = false;
    document.getElementById("savingsAccountDepositFormCancelBtn").disabled = false;
    $('#savingsAccountDepositFormCancelBtn').off('click touch');
    $('#savingsAccountDepositFormCancelBtn').click(function ()
    {
        SavingsAccountHandler.self.displayOneSavingsAccountForCloseDepositWithdraw(savingsAccount);
    });
    document.getElementById("savingsAccountDepositFormImageID").src = "images/personPlaceholderNoText.png";
    showContent($('#savingsAccountDepositDiv'));
    $.ajax({
        url: host + '/client/v1d/find?' +
                'awamoId=' + savingsAccountFormatedData.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
        type: 'GET',
        headers: getAuthenticationHeader(),
        xhrFields: {
            responseType: 'arraybuffer'
        }
    }).done(function (e)
    {
        var blob = new Blob([e], {type: 'image/jpg'});
        var fr = new FileReader();
        fr.onload = function (e)
        {
            document.getElementById("savingsAccountDepositFormImageID").src = e.target.result;
        };
        fr.readAsDataURL(blob);
    }).fail(function (e)
    {
        document.getElementById("savingsAccountDepositFormImageID").src = "images/personPlaceholderNoText.png";
    });
    clearFormValidators($('#savingsAccountDepositForm'));
    registerKeyPressValidators($('#savingsAccountDepositForm'));
};

SavingsAccountHandler.prototype.handleSavingsAccountWithdrawAccountOption = function ()
{
    var savingsAccount = SavingsAccountHandler.self.savingsAccount;
    // clearFormValidators($('#savingsAccountWithdrawForm'));
    // registerKeyPressValidators($('#savingsAccountWithdrawForm'));
    $('#savingsAccountWithdrawDiv').show();
    var savingsAccountFormatedData = SavingsAccountHandler.self.getRowData(SavingsAccountHandler.CUSTOMISED_ACCOUNT_TITLES, savingsAccount);
    initDefaultContent('Withdraw from savings account');
    $('#savingsAccountWithdrawFormNumber').val(savingsAccountFormatedData.accountNo);
    $('#savingsAccountWithdrawFormName').val(savingsAccountFormatedData.clientName);
    $('#savingsAccountWithdrawFormStatus').val(savingsAccountFormatedData.status);
    $('#savingsAccountWithdrawFormInterest').val(savingsAccountFormatedData.interestRate);
    $('#savingsAccountWithdrawFormAwamoId').val(savingsAccountFormatedData.awamoId);
    $('#savingsAccountWithdrawFormAccountId').val(savingsAccountFormatedData.accountId);
    $('#savingsAccountWithdrawFormBalance').val(savingsAccountFormatedData.balance);
    $('#savingsAccountWithdrawFormAmount').val('');
    var formattedBalance = (savingsAccountFormatedData.balance.toString()).slice(0, -4);
    formattedBalance = formattedBalance.replace(/,/g, "");
    $('#savingsAccountWithdrawFormAmount').attr('maxAmount', formattedBalance);

    document.getElementById("savingsAccountWithdrawFormImageID").src = "images/personPlaceholderNoText.png";
    document.getElementById("savingsAccountWithdrawFormCancelBtn").disabled = false;
    document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = false;
    if (parseFloat(savingsAccountFormatedData.balance) > 0)
    {
        document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = false;
    } else
    {
        document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = true;
    }
    // registerKeyPressValidators($('#savingsAccountWithdrawForm'));
    $('#savingsAccountWithdrawFormCancelBtn').off('click touch');
    $('#savingsAccountWithdrawFormCancelBtn').click(function ()
    {
        SavingsAccountHandler.self.displayOneSavingsAccountForCloseDepositWithdraw(savingsAccount);
    });
    showContent($('#savingsAccountWithdrawDiv'));
    $.ajax({
        url: host + '/client/v1d/find?' +
                'awamoId=' + savingsAccountFormatedData.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
        type: 'GET',
        headers: getAuthenticationHeader(),
        xhrFields: {
            responseType: 'arraybuffer'
        }
    }).done(function (e)
    {
        var blob = new Blob([e], {type: 'image/jpg'});
        var fr = new FileReader();
        fr.onload = function (e)
        {
            document.getElementById("savingsAccountWithdrawFormImageID").src = e.target.result;
        };
        fr.readAsDataURL(blob);
    }).fail(function (e)
    {
        document.getElementById("savingsAccountWithdrawFormImageID").src = "images/personPlaceholderNoText.png";
    });
    clearFormValidators($('#savingsAccountWithdrawForm'));
    registerKeyPressValidators($('#savingsAccountWithdrawForm'));
};

SavingsAccountHandler.prototype.handleSavingsAccountCloseAccountOption = function ()
{
    clearFormValidators($('#savingsAccountCloseForm'));
    registerKeyPressValidators($('#savingsAccountCloseForm'));
    var savingsAccount = SavingsAccountHandler.self.savingsAccount;
    document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = false;
    document.getElementById("savingsAccountCloseFormCloseBtn").disabled = false;
    document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
    var savingsAccountFormatedData = SavingsAccountHandler.self.getRowData(SavingsAccountHandler.CUSTOMISED_ACCOUNT_TITLES, savingsAccount);
    initDefaultContent('Close savings account');
    $('#savingsAccountCloseFormNumber').val(savingsAccountFormatedData.accountNo);
    $('#savingsAccountCloseFormName').val(savingsAccountFormatedData.clientName);
    $('#savingsAccountCloseFormStatus').val(savingsAccountFormatedData.status);
    $('#savingsAccountCloseFormInterest').val(savingsAccountFormatedData.interestRate);
    $('#savingsAccountCloseFormAwamoId').val(savingsAccountFormatedData.awamoId);
    $('#savingsAccountCloseFormAccountId').val(savingsAccountFormatedData.accountId);
    $('#savingsAccountCloseFormBalance').val(savingsAccountFormatedData.balance);
    $('#savingsAccountCloseFormClosingNote').val('');
    document.getElementById("savingsAccountCloseFormImageID").src = "images/personPlaceholderNoText.png";

    if (parseFloat(savingsAccountFormatedData.balance) > 0)
    {
        document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = false;
    } else
    {
        document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = true;
    }
    $('#savingsAccountCloseFormCancelBtn').click(function ()
    {
        SavingsAccountHandler.self.displayOneSavingsAccountForCloseDepositWithdraw(savingsAccount);
    });
    showContent($('#savingsAccountCloseDiv'));
    $.ajax({
        url: host + '/client/v1d/find?' +
                'awamoId=' + savingsAccountFormatedData.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
        type: 'GET',
        headers: getAuthenticationHeader(),
        xhrFields: {
            responseType: 'arraybuffer'
        }
    }).done(function (e)
    {
        var blob = new Blob([e], {type: 'image/jpg'});
        var fr = new FileReader();
        fr.onload = function (e)
        {
            document.getElementById("savingsAccountCloseFormImageID").src = e.target.result;
        };
        fr.readAsDataURL(blob);
    }).fail(function (e)
    {
        document.getElementById("savingsAccountCloseFormImageID").src = "images/personPlaceholderNoText.png";
    });
};

SavingsAccountHandler.prototype.handleSavingsAccountDepositAction = function ()
{
    if (validateForm($('#savingsAccountDepositForm')))
    {
        var account_id = $('#savingsAccountDepositFormAccountId').val();
        var user_deposit_amount = parseFloat(removeCommas($('#savingsAccountDepositFormAmount').val()));
        var user_account_balance = parseFloat(unformatCurrency($('#savingsAccountDepositFormBalance').val()));
        if (!isNaN(user_deposit_amount) && isFinite($('#savingsAccountWithdrawFormAmount').val()))
        {
            if (!(user_deposit_amount > 0))
            {
                showContent($('#savingsAccountDepositDiv'));
                showAlertMessage('Please input a deposit amount greater than 0', AlertTypes.warning);
            } else
            {
                savingsAccountTransactionDate = Date.now();
                savingsAccountNewAcBalance = user_account_balance + (user_deposit_amount);
                savingsAccountNewAcBalance = savingsAccountNewAcBalance * 100;
                savingsAccountTransactionBody = '{"' +
                        'accountId":"' + account_id +
                        '","transactionDate":"' + savingsAccountTransactionDate +
                        '","amount":"' + unformatCurrency($('#savingsAccountDepositFormAmount').val()) +
                        '","transactionType":"' + 'DEPOSIT' +
                        '","paymentTypeId":"' + '1' +
                        '"}';
                var confirmDialogHeader = 'Confirm Deposit';
                var confirmDialogBody = 'Please confirm that you want to make a deposit of ' + user_deposit_amount + ' to this savings account';
                var confirmDialogPositiveText = 'Confirm';
                var confirmDialogNegativeText = 'Cancel';
                showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, SavingsAccountHandler.prototype.handleConfirmSubmitDepositTransaction, confirmDialogNegativeText, SavingsAccountHandler.prototype.handleDeclineSubmitDepositTransation);
            }
        } else
        {
            showContent($('#savingsAccountDepositDiv'));
            showAlertMessage('Please input a valid amount for the deposit amount', AlertTypes.warning);
        }
    } else
    {
        showAlertMessage('Please ensure that all the fields are filled in correctly.', AlertTypes.danger);
    }
};

SavingsAccountHandler.prototype.handleConfirmSubmitDepositTransaction = function ()
{
    var uri = SavingsAccountHandler.ROOT_PATH + 'deposit';
    var headers = getAuthenticationHeader();
    $.ajax({
        url: host + uri,
        data: savingsAccountTransactionBody,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function ()
        {
            showLoader();
            document.getElementById("savingsAccountDepositFormCancelBtn").disabled = true;
            document.getElementById("savingsAccountDepositFormDepositBtn").disabled = true;
        },
        success: function (data)
        {
            $('#savingsAccountDepositFormBalance').val('' + formatCurrency(savingsAccountNewAcBalance));
            document.getElementById("savingsAccountDepositFormCancelBtn").disabled = false;
            document.getElementById("savingsAccountDepositFormDepositBtn").disabled = false;
            $('#savingsAccountDepositDiv').hide();
            var transactionAmount = unformatCurrency($('#savingsAccountDepositFormAmount').val());
            SavingsAccountHandler.prototype.updateLocalAccountAfterTransaction(savingsAccountNewAcBalance, transactionAmount, 'DEPOSIT', savingsAccountTransactionDate, data['transactionId']);
            SavingsAccountHandler.self.displayInTableForCloseDepositWithdraw(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('ACTIVE'));
            hideLoader();
            showAlertMessage('Deposit transaction completed successfully', AlertTypes.success);
        }
    }).fail(function (Response)
    {
        showContent($('#savingsAccountDepositDiv'));
        showAlertMessage('Deposit transaction failed, please try again', AlertTypes.danger);
        hideLoader();
        document.getElementById("savingsAccountDepositFormCancelBtn").disabled = false;
        document.getElementById("savingsAccountDepositFormDepositBtn").disabled = false;
    });
};

SavingsAccountHandler.prototype.handleDeclineSubmitDepositTransation = function ()
{
    document.getElementById("savingsAccountDepositFormCancelBtn").disabled = false;
    document.getElementById("savingsAccountDepositFormDepositBtn").disabled = false;
};

SavingsAccountHandler.prototype.handleSavingsAccountWithdrawAction = function ()
{
    if (validateForm($('#savingsAccountWithdrawForm')))
    {
        var account_id = $('#savingsAccountWithdrawFormAccountId').val();
        var user_withdrawal_amount = parseFloat($('#savingsAccountWithdrawFormAmount').val());
        var user_account_balance = parseFloat(unformatCurrency($('#savingsAccountWithdrawFormBalance').val()));
        if (!isNaN(parseFloat($('#savingsAccountWithdrawFormAmount').val())) && isFinite($('#savingsAccountWithdrawFormAmount').val()))
        {
            if (!(user_withdrawal_amount <= user_account_balance))
            {
                showContent($('#savingsAccountWithdrawDiv'));
                showAlertMessage('Your account balance is less than what is required to complete this transaction', AlertTypes.warning);
            } else
            {
                var formated_withdraw_amount = unformatCurrency($('#savingsAccountWithdrawFormAmount').val());
                savingsAccountNewAcBalance = user_account_balance - (user_withdrawal_amount);
                savingsAccountNewAcBalance = savingsAccountNewAcBalance * 100;
                savingsAccountTransactionDate = Date.now();
                savingsAccountTransactionBody = '{"' +
                        'accountId":"' + account_id +
                        '","transactionDate":"' + savingsAccountTransactionDate +
                        '","amount":"' + formated_withdraw_amount +
                        '","transactionType":"' + 'WITHDRAWAL' +
                        '","paymentTypeId":"' + '1' +
                        '"}';
                console.log('withdraw body');
                console.log(savingsAccountTransactionBody);
                var confirmDialogHeader = 'Confirm Withdraw';
                var confirmDialogBody = 'Please confirm that you want to make a withdraw of ' + user_withdrawal_amount + ' to this savings account';
                var confirmDialogPositiveText = 'Confirm';
                var confirmDialogNegativeText = 'Cancel';
                showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, SavingsAccountHandler.prototype.handleConfirmSubmitWithdrawTransaction, confirmDialogNegativeText, SavingsAccountHandler.prototype.handleDeclineSubmitWithdrawTransation);
            }
        } else
        {
            showContent($('#savingsAccountWithdrawDiv'));
            showAlertMessage('Please enter a valid amount for the withdraw amount', AlertTypes.warning);
        }
    } else
    {
        showAlertMessage('Please ensure that all the fields are filled in correctly.', AlertTypes.danger);
    }
};

SavingsAccountHandler.prototype.handleConfirmSubmitWithdrawTransaction = function ()
{
    var uri = SavingsAccountHandler.ROOT_PATH + 'withdraw';
    var headers = getAuthenticationHeader();
    $.ajax({
        url: host + uri,
        data: savingsAccountTransactionBody,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function ()
        {
            showLoader();
            document.getElementById("savingsAccountWithdrawFormCancelBtn").disabled = true;
            document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = true;
        },
        success: function (data)
        {
            $('#savingsAccountWithdrawDiv').hide();
            console.log('successful withdraw');
            console.log(savingsAccountNewAcBalance);
            $('#savingsAccountWithdrawFormBalance').val('' + formatCurrency(savingsAccountNewAcBalance));
            console.log('failed withdraw');
            document.getElementById("savingsAccountWithdrawFormCancelBtn").disabled = false;
            document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = false;
            var formated_withdraw_amount = unformatCurrency($('#savingsAccountWithdrawFormAmount').val());
            console.log(' withdraw b4 update');
            SavingsAccountHandler.prototype.updateLocalAccountAfterTransaction(savingsAccountNewAcBalance, formated_withdraw_amount, 'WITHDRAW', savingsAccountTransactionDate, data['transactionId']);
            console.log('withdraw after update');
            SavingsAccountHandler.self.displayInTableForCloseDepositWithdraw(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('ACTIVE'));
            hideLoader();
            showAlertMessage('Withdraw transaction completed successfully', AlertTypes.success);
        }
    }).fail(function (Response)
    {
        showContent($('#savingsAccountWithdrawDiv'));
        hideLoader();
        showAlertMessage('Withdraw transaction failed, please try again', AlertTypes.danger);
        document.getElementById("savingsAccountWithdrawFormCancelBtn").disabled = false;
        document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = false;
    });
};

SavingsAccountHandler.prototype.handleDeclineSubmitWithdrawTransation = function ()
{
    document.getElementById("savingsAccountWithdrawFormCancelBtn").disabled = false;
    document.getElementById("savingsAccountWithdrawFormWithdrawBtn").disabled = false;
};

SavingsAccountHandler.prototype.handleSavingsAccountWithdrawToZeroAction = function ()
{
    var account_id = $('#savingsAccountCloseFormAccountId').val();
    savingsAccountPrevAcBalance = $('#savingsAccountCloseFormBalance').val();
    savingsAccountNewAcBalance = unformatCurrency($('#savingsAccountCloseFormBalance').val());
    var account_balance = parseFloat(savingsAccountNewAcBalance);
    savingsAccountTransactionDate = Date.now();
    if (!(account_balance > 0))
    {
        showContent($('#savingsAccountCloseDiv'));
        showAlertMessage('Your account balance is already zero, you cannot withdraw any amount', AlertTypes.warning);
    } else
    {
        console.log('withdraw to zero ac bal : ' + savingsAccountNewAcBalance);
        console.log('withdraw to zero ac bal2 : ' + unformatCurrency("" + account_balance));
        console.log('withdraw to zero ac bal3 : ' + account_balance);
        var headers = getAuthenticationHeader();
        var uri = SavingsAccountHandler.ROOT_PATH + 'withdraw';
        savingsAccountTransactionBody = '{"' +
                'accountId":"' + account_id +
                '","transactionDate":"' + savingsAccountTransactionDate +
                '","amount":"' + unformatCurrency("" + account_balance) +
                '","transactionType":"' + 'WITHDRAWAL' +
                '","paymentTypeId":"' + '1' +
                '"}';

        console.log(headers);
        console.log(savingsAccountTransactionBody);
        savingsAccountNewAcBalance = unformatCurrency("" + account_balance)
        var confirmDialogHeader = 'Confirm Withdraw To Zero';
        var confirmDialogBody = 'Please confirm that you want to make a withdraw of ' + savingsAccountPrevAcBalance + ' to this savings account';
        var confirmDialogPositiveText = 'Confirm';
        var confirmDialogNegativeText = 'Cancel';
        showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, SavingsAccountHandler.prototype.handleConfirmSubmitWithdrawToZeroTransaction, confirmDialogNegativeText, SavingsAccountHandler.prototype.handleDeclineSubmitWithdrawToZeroTransation);
    }
};

SavingsAccountHandler.prototype.handleConfirmSubmitWithdrawToZeroTransaction = function ()
{
    var uri = SavingsAccountHandler.ROOT_PATH + 'withdraw';
    var headers = getAuthenticationHeader();
    $.ajax({
        url: host + uri,
        data: savingsAccountTransactionBody,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function ()
        {
            showLoader();
            document.getElementById("savingsAccountCloseFormCancelBtn").disabled = true;
            document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = true;
            document.getElementById("savingsAccountCloseFormCloseBtn").disabled = true;
        },
        success: function (data)
        {
            console.log('withdraw to zero, successful');
            document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
            document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = true;
            document.getElementById("savingsAccountCloseFormCloseBtn").disabled = false;
            SavingsAccountHandler.prototype.updateLocalAccountAfterTransaction('0', savingsAccountNewAcBalance, 'WITHDRAW', savingsAccountTransactionDate, data['transactionId']);
            SavingsAccountHandler.self.displayTransactionsDataForCloseDepositWithdrawForm(SavingsAccountHandler.self.savingsAccount.transactionList);
            hideLoader();
            showAlertMessage('Savings account application successfully withdrawn to zero', AlertTypes.success);
            $('#savingsAccountCloseFormBalance').val('0');
            showContent($('#savingsAccountCloseDiv'));
        }
    }).fail(function (Response)
    {
        hideLoader();
        $('#savingsAccountCloseFormBalance').val(savingsAccountPrevAcBalance);
        showContent($('#savingsAccountCloseDiv'));
        showAlertMessage('Savings account was not withdrawn to zero', AlertTypes.danger);
        document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
        document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = false;
        document.getElementById("savingsAccountCloseFormCloseBtn").disabled = false;
    });
};

SavingsAccountHandler.prototype.handleDeclineSubmitWithdrawToZeroTransation = function ()
{
    document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
    document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = false;
    document.getElementById("savingsAccountCloseFormCloseBtn").disabled = false;
};

SavingsAccountHandler.prototype.handleSavingsAccountClosingAction = function ()
{
    savingsAccountId = $('#savingsAccountCloseFormAccountId').val();
    var closing_note = $('#savingsAccountCloseFormClosingNote').val();
    var formated_ac_balance = unformatCurrency($('#savingsAccountCloseFormBalance').val());
    var account_balance = parseFloat(formated_ac_balance);
    if (account_balance > 0)
    {
        showContent($('#savingsAccountCloseDiv'));
        showAlertMessage('Please withdraw the account balance to zero, then try again', AlertTypes.warning);
    } else
    {
        if (validateForm($('#savingsAccountCloseForm')))
        {
            savingsAccountTransactionBody = '{"note":"' + closing_note + '"}';
            var confirmDialogHeader = 'Confirm Closing Account';
            var confirmDialogBody = 'Please confirm that you want to close this account';
            var confirmDialogPositiveText = 'Confirm';
            var confirmDialogNegativeText = 'Cancel';
            showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, SavingsAccountHandler.prototype.handleConfirmCloseAccountAction, confirmDialogNegativeText, SavingsAccountHandler.prototype.handleDeclineCloseAccountAction);
        } else
        {
            showAlertMessage('Please ensure that all fields are filled in correctly', AlertTypes.danger);
        }
    }
};

SavingsAccountHandler.prototype.handleConfirmCloseAccountAction = function ()
{
    var uri = SavingsAccountHandler.ROOT_PATH + savingsAccountId + '/close';
    var headers = getAuthenticationHeader();
    $.ajax({
        url: host + uri,
        data: savingsAccountTransactionBody,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function ()
        {
            showLoader();
            document.getElementById("savingsAccountCloseFormCancelBtn").disabled = true;
            document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = true;
            document.getElementById("savingsAccountCloseFormCloseBtn").disabled = true;
        },
        success: function (data)
        {
            $('#savingsAccountCloseDiv').hide();
            document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
            document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = true;
            document.getElementById("savingsAccountCloseFormCloseBtn").disabled = true;
            SavingsAccountHandler.prototype.updateLocalAccountAfterClosing();
            SavingsAccountHandler.self.displayInTableForCloseDepositWithdraw(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('ACTIVE'));
            hideLoader();
            showAlertMessage('Savings account closed successfully', AlertTypes.success);
        },
        complete: function ()
        {
            document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
        }
    }).fail(function (Response)
    {
        hideLoader();
        showContent($('#savingsAccountCloseDiv'));
        showAlertMessage('Savings account was not closed successfully', AlertTypes.danger);
        document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
        document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = false;
        document.getElementById("savingsAccountCloseFormCloseBtn").disabled = false;
    });
};

SavingsAccountHandler.prototype.handleDeclineCloseAccountAction = function ()
{
    document.getElementById("savingsAccountCloseFormCancelBtn").disabled = false;
    document.getElementById("savingsAccountCloseFormWithdrawToZeroBtn").disabled = false;
    document.getElementById("savingsAccountCloseFormCloseBtn").disabled = false;
};

SavingsAccountHandler.prototype.updateLocalAccountAfterClosing = function ()
{
    SavingsAccountHandler.self.savingsAccount.status = "CLOSED";
    savingsAccountList.put(SavingsAccountHandler.self.savingsAccount);
};

SavingsAccountHandler.prototype.updateLocalAccountAfterTransaction = function (newAccountBalance, transactionAmount, transactionType, transactionDate, transactionId)
{
    var newTransaction = new Object();
    newTransaction.transactionType = transactionType;
    newTransaction.transactionDate = transactionDate;
    newTransaction.amount = transactionAmount;
    newTransaction.balance = newAccountBalance;
    SavingsAccountHandler.self.savingsAccount.balance = newAccountBalance;
    if (!exists(SavingsAccountHandler.self.savingsAccount.transactionList))
    {
        SavingsAccountHandler.self.savingsAccount.transactionList = [];
    }
    SavingsAccountHandler.self.savingsAccount.transactionList.push(newTransaction);
    savingsAccountList.put(SavingsAccountHandler.self.savingsAccount);
};

SavingsAccountHandler.prototype.displayOneSavingsAccount = function (savingsAccount)
{
    // check parameter
    if (!exists(savingsAccount))
    {
        return;
    }

    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    // store current savings account
    SavingsAccountHandler.self.savingsAccount = savingsAccount;

    initDefaultContent('Savings Account');

    var formattedData = SavingsAccountHandler.self.getRowData(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccount);

    $('#savingsAccountNumber').val(formattedData.accountNo);
    $('#savingsAccountName').val(formattedData.clientName);
    $('#savingsAccountStatus').val(formattedData.status);
    $('#savingsAccountInterest').val(formattedData.interestRate);
    $('#savingsAccount .balance .value').val(formattedData.balance);

    // actions
    console.log(savingsAccount);
    console.log('svngs AC 0');
    SavingsAccountHandler.self.adjustSingleActionsByStatus(savingsAccount.status);
    if (exists(savingsAccount.transactionList) && savingsAccount.transactionList.length > 0)
    {
        console.log('svngs AC 1');
        $('#savingsAccountTransactionsTableContainer').siblings('.no-info-to-display').addClass('hidden');
        SavingsAccountHandler.self.displayTransactionsData(savingsAccount.transactionList);
    } else
    {
        console.log('svngs AC 2');
        $('#savingsAccountTransactionsTableContainer').siblings('.no-info-to-display').removeClass('hidden');
        $('#savingsAccountTransactionsTableContainer').siblings('.no-info-to-display').show();
        $('#savingsAccountTransactionsTableContainer').siblings('.no-info-to-display').parent().show();
    }

    // show necessary content
    showContent($('#singleActions'));
    hideControlsForReporting('SavingsAccount');
    showContent($('#savingsAccount'));
};

//convergence mtd to display the savings account transactions for the close deposit and withdraw form
SavingsAccountHandler.prototype.displayTransactionsDataForCloseDepositWithdrawForm = function (transactionList)
{
    var $tableContainer = $('#savingsAccountCloseDepositWithdrawFormTransactionsTableContainer');
    $tableContainer.empty();
    var $table = getEmptyTable(true);
    $tableContainer.append($table);

    var $rowContainer = $table.find('thead');
    addRow($rowContainer, SavingsAccountHandler.TRANSACTION_TITLES);

    $rowContainer = $table.find('tbody');

    if (!exists(transactionList))
    {
        return;
    }

    var len = transactionList.length;
    for (var i = 0; i < len; i++)
    {
        var transaction = transactionList[i];
        var formattedRowData = SavingsAccountHandler.prototype.getTransactionRowData(transaction);
        addRow($rowContainer, formattedRowData, transaction);
    }

    // transactions sorter
    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        0: {sorter: 'awamoDateSorter'},
        1: {sorter: 'awamoCurrencySorter'},
        3: {sorter: 'awamoCurrencySorter'}
    };
    $table.tablesorter(tableSorter);

    addClassToTableColumn($table, 1, 'currency');
    addClassToTableColumn($table, 3, 'currency');

    showContent($table);
};

SavingsAccountHandler.prototype.displayTransactionsData = function (transactionList)
{
    var $tableContainer = $('#savingsAccountTransactionsTableContainer');
    $tableContainer.empty();

    var $table = getEmptyTable(true);
    $tableContainer.append($table);

    var $rowContainer = $table.find('thead');
    addRow($rowContainer, SavingsAccountHandler.TRANSACTION_TITLES);

    $rowContainer = $table.find('tbody');

    if (!exists(transactionList))
    {
        return;
    }

    var len = transactionList.length;
    for (var i = 0; i < len; i++)
    {
        var transaction = transactionList[i];
        var formattedRowData = SavingsAccountHandler.prototype.getTransactionRowData(transaction);
        addRow($rowContainer, formattedRowData, transaction);
    }

    // transactions sorter
    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        0: {sorter: 'awamoDateSorter'},
        1: {sorter: 'awamoCurrencySorter'},
        3: {sorter: 'awamoCurrencySorter'}
    };
    $table.tablesorter(tableSorter);

    addClassToTableColumn($table, 1, 'currency');
    addClassToTableColumn($table, 3, 'currency');

    showContent($table);
};

SavingsAccountHandler.prototype.getTransactionRowData = function (savingsAccount)
{
    var rowdata = {};

    for (var key in SavingsAccountHandler.TRANSACTION_TITLES)
    {
        var formattedValue = savingsAccount[key];

        switch (key)
        {
            case 'transactionDate':
                formattedValue = formatDate(formattedValue);
                break;
            case 'amount':
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

SavingsAccountHandler.prototype.singleObjectActionHandler = function (event)
{
    event.preventDefault();
    switch ($(this).data('action'))
    {
        case 'back':
            hideContent();
            SavingsAccountHandler.self.previousPage();
            hideControlsForReporting('SavingsAccount');
            break;
        case 'approve':
            var confirmDialogHeader = 'Confirm Savings Accounts Application Approval';
            var confirmDialogBody = 'Are you sure you want to approve this application ?';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader
                    , confirmDialogBody
                    , confirmDialogPositiveText
                    , function()
                    {
                        //yes confirm savings account application
                        SavingsAccountHandler.prototype.approveApplication();
                    }
                    , confirmDialogNegativeText
                    , function()
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
                    , function()
                    {
                        //yes reject savings account application
                        SavingsAccountHandler.prototype.rejectApplication();
                    }
                    , confirmDialogNegativeText
                    , function()
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

SavingsAccountHandler.prototype.adjustSingleActionsByStatus = function (status)
{
    //alert('found')
    $('#singleActions a[data-action]').hide();
    $('#singleActions a[data-action="back"]').show();

    switch (status)
    {
        case 'SUBMITTED':
            $('#singleActions a[data-action="approve"]').show();
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


SavingsAccountHandler.prototype.backToDisplayOneSavingsAccount = function ()
{
    SavingsAccountHandler.self.displayOneSavingsAccount(SavingsAccountHandler.self.savingsAccount);
};

SavingsAccountHandler.prototype.approveApplication = function ()
{

    SavingsAccountHandler.self.savingsAccount.status = 'ACTIVE';
    showLoader();
    ajax(
            SavingsAccountHandler.ROOT_PATH + SavingsAccountHandler.self.savingsAccount.accountId + '/approve',
            'POST',
            SavingsAccountHandler.prototype.approveApplicationSuccessful);
};

SavingsAccountHandler.prototype.approveApplicationSuccessful = function ()
{
    hideLoader();
    showAlertMessage("Savings Account approved sucessfully", AlertTypes.success);
    SavingsAccountHandler.self.savingsAccount.status = 'ACTIVE';
    savingsAccountList.put(savingsAccountList, SavingsAccountHandler.self.savingsAccount);
    SavingsAccountHandler.self.previousPage();
    SavingsAccountHandler.prototype.getApplications();
};

SavingsAccountHandler.prototype.rejectApplication = function ()
{
    SavingsAccountHandler.self.savingsAccount.status = 'REJECTED';
    showLoader();
    ajax(
            SavingsAccountHandler.ROOT_PATH + SavingsAccountHandler.self.savingsAccount.accountId + '/reject',
            'POST',
            SavingsAccountHandler.prototype.rejectApplicationSuccessful,
            '{"note":"' + $('#rejectionNote').val() + '"}');
};

SavingsAccountHandler.prototype.rejectApplicationSuccessful = function ()
{
    SavingsAccountHandler.self.savingsAccount.status = 'REJECTED';
    hideLoader();
    showAlertMessage("Savings Account rejected sucessfully", AlertTypes.success);
    savingsAccountList.put(savingsAccountList, SavingsAccountHandler.self.savingsAccount);
    SavingsAccountHandler.self.previousPage();
};

SavingsAccountHandler.prototype.closeApplication = function ()
{
    SavingsAccountHandler.self.savingsAccount.status = 'CLOSED';
    showLoader();
    ajax(
            SavingsAccountHandler.ROOT_PATH + SavingsAccountHandler.self.savingsAccount.accountId + '/close',
            'POST',
            SavingsAccountHandler.prototype.closeApplicationSuccessful,
            '{"note":"' + $('#closeNote').val() + '"}');
};

SavingsAccountHandler.prototype.closeApplicationSuccessful = function ()
{
    SavingsAccountHandler.self.savingsAccount.status = 'CLOSED';
    hideLoader();
    showAlertMessage("Savings Account closed sucessfully", AlertTypes.success);
    savingsAccountList.put(savingsAccountList, SavingsAccountHandler.self.savingsAccount);
    SavingsAccountHandler.self.previousPage();
};

SavingsAccountHandler.prototype.loadSavingsAccounts = function ()
{
    savingsAccountList.reload();
};

SavingsAccountHandler.prototype.synchronizeNow = function ()
{
    savingsAccountList.reload();
};
// </editor-fold>

SavingsAccountHandler.prototype.sendEmailLoanReportRequest = function ()
{
    // not using default ajax call here because user handling is done against a different endpoint
    var headers = {
        tenantId: tenantId
    };

    var uri = '/tenant/v1d/mis/reportEmail';
    var body = '{"startTime":"' + '0' +
            '","endTime":"' + '0' +
            '","reportEmailEntity":"' + "SAVINGS_ACCOUNTS" +
            '","reportEmailType":"' + "ALL" +
            '","email":"' + $('#emailReportC').val() +
            '"}';
    ajax(uri, 'POST', SavingsAccountHandler.prototype.emailReportResponseHandler, body, headers, SavingsAccountHandler.prototype.emailReportFailedResponseHandler);

};

SavingsAccountHandler.prototype.emailReportResponseHandler = function (response)
{
    message('Success',
            'Message Sent Successfully',
            MessageType.SUCCESS);
};

SavingsAccountHandler.prototype.emailReportFailedResponseHandler = function (response)
{
    message('Error', response.responseJSON.message, MessageType.WARNING);
};

SavingsAccountHandler.prototype.savingsAccountMainMenuOverview = function ()
{
    addHistory('Bankings Services Savings Account', '#bankingServicesSavingsAccountOverview', getSidebarSubitemSelector('bankingServices', 'SavingsAccount', 'savingsAccountMainMenuOverview'));
    initDefaultContent('Savings Accounts');
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    currentTable = 'options';

    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});
    if (handlers['Permissions'].check_access('_CREATE_NEW_ACCOUNT'))
        addRow($rowContainer, {type: 'Create New Account'}, 'SavingsAccount', SavingsAccountHandler.prototype.showAllClientsForSavingsAccountApplication, 'showAllClientsForSavingsAccountApplication');

    if (handlers['Permissions'].check_access('_MANAGE_ACCOUNTS'))
        addRow($rowContainer, {type: 'Use Existing Account'}, 'SavingsAccount', SavingsAccountHandler.prototype.getAllForCloseDepositAndWithdraw, 'getAllForCloseDepositAndWithdraw');
};

SavingsAccountHandler.prototype.savingsAccountMainMenuRowClickHandler = function ()
{
    var action = $(this).data('id');
    var handler = $(this).data('object');
    $('li[data-parent~="bankingServices"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

SavingsAccountHandler.prototype.genericSavingAccountReportSelectHandler = function ()
{
    switch ($(this).val())
    {
        case 'ALL':
            currentChangedFil = 'ALL';
            SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getEntities());
            break;
        case 'ACTIVE':
            currentChangedFil = 'ACTIVE';
            SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('ACTIVE'));
            break;
        case 'CLOSED':
            currentChangedFil = 'CLOSED';
            SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('CLOSED'));
            break;
        case 'REJECTED':
            currentChangedFil = 'CLOSED';
            SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('REJECTED'));
            break;
        case 'SUBMITTED':
            currentChangedFil = 'SUBMITTED';
            SavingsAccountHandler.self.displayInTable(SavingsAccountHandler.ALL_ACCOUNTS_TITLES, savingsAccountList.getListByStatus('SUBMITTED'));
            break;
        default:
            break;
    }
};