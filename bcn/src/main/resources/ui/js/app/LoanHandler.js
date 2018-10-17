'use strict';

/* global printData,authorization, tenantId, currentTable, handlers, Storage, authentication, loanList, clientList, groupList, officerList, savingsAccountList, eventtype, currencyCode, Options, AlertTypes, host, GroupHandler, formatDate, formatCurrency, exportListName, exportListFilter, ActionRequiredHandler */

// <editor-fold defaultstate="collapsed" desc=" init ">

var fromRepaymentDateLimit = "0";
var toRepaymentDateLimit = "999999999999999";

var fromLoanEndDateDateLimit = "0";
var toLoanEndDateDateLimit = "999999999999999";
var hideLoanSingleActionButtons = false;


var LOAN_STATUS = Object.freeze({
    REGISTERING: 'new loan application',
    VERIFIED: 'did client verification',
    SUBMITTED: 'submitted and pending approval',
    REJECTED: 'closed - rejected',
    WITHDRAWN: 'closed - withdrawn',
    APPROVED: 'approved',
    CONTRACT_SIGNED: 'contract is signed by client',
    AWAITING_DISBURSEMENT: 'loan is allwed to be disbursed',
    ACTIVE: 'active',
    CLOSED: 'closed - obligations met',
    CANCELED: 'closed - written off',
    OVERPAID: 'overpaid'
});

var LoanHandler = function () {
    LoanHandler.self = this;
    this.forReporting = false;
    loanList.addDataModelChangedEventListenerCallback(LoanHandler.prototype.dataModelChanged);
    loanList.addEntityChangedEventListenerCallback(LoanHandler.prototype.loanEntityChanged);
    ///clientList.addEntityChangedEventListenerCallback(LoanHandler.prototype.clientEntityChanged);

    $('#loanApplicationForm input').on('input', LoanHandler.prototype.dataChangedHandler);
    $('#loanApplicationForm select').on('input', LoanHandler.prototype.dataChangedHandler);
    $('#loanReportType').on('input', LoanHandler.prototype.genericLoanReportSelectHandler);
    $('#loanReportTypePortfolio').on('input', LoanHandler.prototype.genericLoanReportProfileSelectHandler);

    $('#loanActionsResetBtn').off('click touch');
    $('#loanActionsResetBtn').click(function () {
        LoanHandler.prototype.handleResetChangesAction();
    });

    $('#loanActionsBackBtn').off('click touch');
    $('#loanActionsBackBtn').on('click touch', LoanHandler.prototype.handleBackAction);

    $('#loanActionsApproveWithChangesBtn').off('click touch');
    $('#loanActionsApproveWithChangesBtn').on('click touch', LoanHandler.self.approveApplicationWithChanges);

    $('#loanActionsApproveBtn').off('click touch');
    $('#loanActionsApproveBtn').on('click touch', LoanHandler.self.handleApproveAction);

    $('#loanActionsRejectBtn').off('click touch');
    $('#loanActionsRejectBtn').on('click touch', LoanHandler.prototype.handleRejectAction);

    $('#loanActionsAllowDisbursementBtn').off('click touch');
    $('#loanActionsAllowDisbursementBtn').on('click touch', LoanHandler.prototype.handleAllowDisbursmentAction);

    $('#loanActionsConfirmContractSignedBtn').off('click touch');
    $('#loanActionsConfirmContractSignedBtn').on('click touch', LoanHandler.prototype.handleConfirmContractSignedAction);

    $('#loanActionsDisburseBtn').off('click touch');
    $('#loanActionsDisburseBtn').on('click touch', LoanHandler.prototype.handleDisburseAction);

    $('#loanActionsMakeRepaymentBtn').off('click touch');
    $('#loanActionsMakeRepaymentBtn').click(function () {
        LoanHandler.prototype.handleMakeLoanRepaymentAction();
    });

    $('#repaymentSchedule-tab').on('hide.bs.tab', function (e) {
        $('#singleActions a[data-action="print"]').hide();
        $('#printNow').off('click touch');
        $('#printNow').hide();
    });

    $('#repaymentSchedule-tab').on('show.bs.tab', function (e) {
        //        $('#singleActions a[data-action="print"]').show();
        $('#printNow').off('click touch');
        $('#printNow').on('click touch', LoanHandler.self.printRepaymentSchedule);
        $('#printableTitle').text('Repayment Schedule');
        $('#printNow').show();
    });
};

LoanHandler.prototype.hideLoanActionButtons = function () {
    $('#loanActionsAcceptModificationsBtn').hide();
    $('#loanActionsWithdrawApplicationBtn').hide();
    $('#loanActionsResetBtn').hide();
    $('#loanActionsBackBtn').hide();
    $('#loanActionsApproveWithChangesBtn').hide();
    $('#loanActionsApproveBtn').hide();
    $('#loanActionsRejectBtn').hide();
    $('#loanActionsAllowDisbursementBtn').hide();
    $('#loanActionsConfirmContractSignedBtn').hide();
    $('#loanActionsDisburseBtn').hide();
    $('#loanActionsMakeRepaymentBtn').hide();
};

LoanHandler.ROOT_PATH = '/loan/v1d/';

LoanHandler.TRANSACTION_TITLES = {
    transactionDate: 'Date',
    amount: 'Amount',
    transactionType: 'Type',
    balance: 'Balance'
};

LoanHandler.APPLICATIONS_TITLES = {
    loanId: 'ID',
    ownerName: 'Name',
    principal: 'Principal',
    interestRate: 'Rate',
    status: 'Status',
    disbursementDate: 'Disbursement'
};

LoanHandler.UNAPPROVED_LOAN_TITLES = {
    loanId: 'ID',
    ownerName: 'Name',
    principal: 'Principal',
    interestRate: 'Rate',
    status: 'Status',
    lastModified: 'Submission Date'
};

LoanHandler.UNSIGNED_LOAN_TITLES = {
    loanId: 'ID',
    ownerName: 'Name',
    principal: 'Principal',
    interestRate: 'Rate',
    status: 'Status',
    lastModified: 'Approval Date'
};

LoanHandler.AWAITING_DISBURSEMENT_APPROVAL_LOAN_TITLES = {
    loanId: 'ID',
    ownerName: 'Name',
    principal: 'Principal',
    interestRate: 'Rate',
    status: 'Status',
    lastModified: 'Signed Date'
};

LoanHandler.AWAITING_DISBURSEMENT_LOAN_TITLES = {
    loanId: 'ID',
    ownerName: 'Name',
    principal: 'Principal',
    interestRate: 'Rate',
    status: 'Status',
    lastModified: 'Allowed Date'
};

LoanHandler.ALL_TITLES = {
    loanId: 'ID',
    ownerName: 'Name',
    principal: 'Principal',
    interestRate: 'Rate',
    disbursementDate: 'Disbursement',
    status: 'Status',
    lastModified: 'Modified'
};

LoanHandler.REPAYMENT_SCHEDULE_TITLES = {
    no: '#',
    dueDate: 'Due date',
    due: 'Installment',
    amortization: 'Principal',
    interest: 'Interest',
    paidDate: 'Paid date',
    outstanding: 'Outstanding'
};

//LoanHandler.REPAYMENT_SCHEDULE_TITLES = {
//    dueDate: 'Due date',
//    due: 'Amount',
//    amortization: 'Amortization part',
//    interest: 'Interest part',
//    balance: 'New balance'
//};

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" public methods ">
LoanHandler.prototype.getApplications = function () {
    LoanHandler.forReporting = false;
    addHistory('Loan applications', '#loanApplications', getSidebarSubitemSelector('actionRequired', 'Loan', 'getApplications'));
    currentTable = 'loanApplications';
    hideLoanSingleActionButtons = false;
    LoanHandler.self.previousPage = LoanHandler.self.getApplications;
    LoanHandler.self.displayApplications();
};

LoanHandler.prototype.getSingngContracts = function () {
    addHistory('Loan applications', '#loanApproved', getSidebarSubitemSelector('actionRequired', 'Loan', 'getSingngContracts'));
    currentTable = 'loanSingngContracts';
    hideLoanSingleActionButtons = false;
    LoanHandler.self.previousPage = LoanHandler.self.getSingngContracts;
    LoanHandler.self.displayApproved();
};

LoanHandler.prototype.getAllowedDisbursements = function () {
    addHistory('Disburse Loan', '#loanDisburse', getSidebarSubitemSelector('actionRequired', 'Loan', 'getAllowedDisbursements'));
    currentTable = 'loanAllowedDisbursements';
    hideLoanSingleActionButtons = false;
    LoanHandler.self.previousPage = LoanHandler.self.getAllowedDisbursements;
    LoanHandler.self.displayAllowedDisbursements();
};

LoanHandler.prototype.getDisbursements = function () {
    addHistory('Loan disbursements', '#loanDisbursements', getSidebarSubitemSelector('actionRequired', 'Loan', 'getDisbursements'));
    currentTable = 'loanDisbursements';
    hideLoanSingleActionButtons = false;
    LoanHandler.self.previousPage = LoanHandler.self.getDisbursements;
    LoanHandler.self.displayDisbursements();
};

//LoanHandler.prototype.getAll = function () {
//    currentTable = 'allLoans';
//    LoanHandler.self.previousPage = LoanHandler.self.getAll;
//    LoanHandler.self.displayLoans();
//};
//
//LoanHandler.prototype.getRejected = function () {
//    currentTable = 'rejectedLoans';
//    LoanHandler.self.previousPage = LoanHandler.self.getRejected;
//    LoanHandler.self.displayRejectedLoans();
//};
//
//LoanHandler.prototype.reportOutstandingBalance = function () {
//    currentTable = 'reportOutstandingBalance';
//    LoanHandler.self.previousPage = LoanHandler.self.reportOutstandingBalance;
//    LoanHandler.self.displayReportOutstandingBalance();
//};

LoanHandler.prototype.firstGenericLoanReports = function (list) {
    LoanHandler.forReporting = false;
    addHistory('Loan reports', '#loanReports', getSidebarSubitemSelector('reporting', 'Loan', 'firstGenericLoanReports'));

    console.log("Loan List  Handling ");
    list = LoanHandler.self.getListByStatus();

    if ("ALL" === list | !exists(list) || !Array.isArray(list)) {
        list = loanList.getEntities();
        LoanHandler.self.loan_status = "ALL";
        $('#loanReportType').val('ALL');
    }

    currentTable = 'genericLoanReports';
    LoanHandler.self.previousPage = LoanHandler.self.firstGenericLoanReports;
    LoanHandler.self.displayGenericLoanReports(list);
};
LoanHandler.prototype.firstGenericLoanReportsForReporting = function (list) {
    LoanHandler.forReporting = true;
    hideLoanSingleActionButtons = true;
    addHistory('Loan reports', '#loanReports', getSidebarSubitemSelector('reporting', 'Loan', 'firstGenericLoanReportsForReporting'));

    console.log("Loan List  Handling ");
    list = LoanHandler.self.getListByStatus();

    if ("ALL" === list | !exists(list) || !Array.isArray(list)) {
        list = loanList.getEntities();
        LoanHandler.self.loan_status = "ALL";
        $('#loanReportType').val('ALL');
    }

    currentTable = 'genericLoanReports';
    LoanHandler.self.previousPage = LoanHandler.self.firstGenericLoanReportsForReporting;

    LoanHandler.self.displayGenericLoanReports(list);
};

LoanHandler.prototype.getListByStatus = function (status) {
    var select_option = LoanHandler.self.loan_status;
    if (undefined !== status && status !== select_option)
        select_option = status;
    switch (select_option) {
        case 'ALL':
            return loanList.getEntities();
            break;
        case 'REJECTED':
            return loanList.getListByStatus('REJECTED');
            break;
        case 'OUTSTANDING_BALANCE':
            return loanList.getListByStatus('ACTIVE');
            break;
        case 'PORTFOLIO':
            return loanList;

            break;
        case 'ARREARS':
            return [];
            break;
        case 'PORTFOLIO_AT_RISK':
            return loanList.getListByStatus('ACTIVE').filter(function (loan) {
                return loan.health !== 'PAR_0';
            });
            break;
        case 'PREPAID':
            return loanList.getListByStatus('ACTIVE').filter(function (loan) {
                return LoanHandler.prototype.isPrePaid(loan) && !LoanHandler.prototype.fullyRepaid(loan);
            });
            break;
        case 'FullyRepaid':
            return loanList.getEntities().filter(function (loan) {
                return LoanHandler.prototype.fullyRepaid(loan);
            });
            $('#datesSelectorLoanEndDate').show();
            break;
        case 'REPAYMENTDUE':
            return loanList.getListByStatus('ACTIVE').filter(function (loan) {
                return LoanHandler.prototype.hasPayment(loan);
            });
            $('#datesSelectorPaymentDue').show();
            break;
        case 'OVERPAID':
            return loanList.getListByStatus('OVERPAID');
            break;
        default:
            break;
    }
};

LoanHandler.prototype.genericLoanReports = function (list) {
    if (LoanHandler.forReporting === true) {
        addHistory('Loan reports', '#loanReports', getSidebarSubitemSelector('reporting', 'Loan', 'genericLoanReportsForReporting'));
        currentTable = 'genericLoanReports';
    } else {
        addHistory('Loan reports', '#loanReports', getSidebarSubitemSelector('reporting', 'Loan', 'genericLoanReports'));
        currentTable = 'genericLoanReports';
    }


    list = LoanHandler.self.getListByStatus();
    LoanHandler.self.previousPage = LoanHandler.self.firstGenericLoanReportsForReporting;

    LoanHandler.self.displayGenericLoanReports(list);
};

LoanHandler.prototype.outputLoan = function (loan) {
    var $row = null;

    if ('loanApplications' === currentTable) {
        if (loan.status === 'SUBMITTED') {
            $row = LoanHandler.self.addToTable(loan);
        } else {
            // noop
        }
    } else if ('loanDisbursements' === currentTable) {
        if (loan.status === 'CONTRACT_SIGNED') {
            $row = LoanHandler.self.addToTable(loan);
        } else {
            // noop
        }
    } else if ('rejectedLoans' === currentTable) {
        if (loan.status === 'REJECTED') {
            $row = LoanHandler.self.addToTable(loan);
        } else {
            // noop
        }
    } else if ('allLoans' === currentTable) {
        $row = LoanHandler.self.addToTable(loan);
    } else {
        // noop
    }

    return $row;
};

LoanHandler.prototype.displayApplications = function () {
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('Loan Applications Not Yet Approved ');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync Loan Applications');
    $('#syncNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();

    LoanHandler.self.displayInTable(LoanHandler.UNAPPROVED_LOAN_TITLES, loanList.getSubmittedLoanList());
    showPrintButton(exportListName.loans, exportListFilter.submitted, LoanHandler.APPLICATIONS_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.submitted, LoanHandler.APPLICATIONS_TITLES);
};

LoanHandler.prototype.displayApproved = function () {
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('Loans With Unsigned Contracts');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync unsigned contract loans');
    $('#syncNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();
    LoanHandler.self.displayInTable(LoanHandler.UNSIGNED_LOAN_TITLES, loanList.getApprovedLoanList());
    showPrintButton(exportListName.loans, exportListFilter.approved, LoanHandler.APPLICATIONS_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.approved, LoanHandler.APPLICATIONS_TITLES);
};

LoanHandler.prototype.displayDisbursements = function () {
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('Loans Awaiting Disbursement Approval');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync loans awaiting disbursement approval');
    $('#syncNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();
    LoanHandler.self.displayInTable(LoanHandler.AWAITING_DISBURSEMENT_APPROVAL_LOAN_TITLES, loanList.getContractSignedLoanList());
    showPrintButton(exportListName.loans, exportListFilter.contract_signed, LoanHandler.APPLICATIONS_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.contract_signed, LoanHandler.APPLICATIONS_TITLES);
};

LoanHandler.prototype.displayAllowedDisbursements = function () {
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('Loans Awaiting Disbursement');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync loans awaiting disbursement');
    $('#syncNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();
    LoanHandler.self.displayInTable(LoanHandler.AWAITING_DISBURSEMENT_LOAN_TITLES, loanList.getDisburesmentAllowedList());
    showPrintButton(exportListName.loans, exportListFilter.awaiting_disbursement, LoanHandler.APPLICATIONS_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.awaiting_disbursement, LoanHandler.APPLICATIONS_TITLES);
};

LoanHandler.prototype.displayLoans = function () {
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('All loans');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync loans');
    $('#syncNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();
    LoanHandler.self.displayInTable(LoanHandler.ALL_TITLES, loanList.getEntities());
    showPrintButton(exportListName.loans, exportListFilter.all, LoanHandler.ALL_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.all, LoanHandler.ALL_TITLES);

    $('#defaultTableContainer').addClass('allLoansTable');
};

LoanHandler.prototype.displayRejectedLoans = function () {
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('Rejected loans');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync rejected loans');
    $('#syncNow').show();

    $('#printNow').off('click touch');
    $('#printNow').on('click touch', printData);
    $('#printableTitle').text('Rejected Loans');
    $('#printNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();
    LoanHandler.self.displayInTable(LoanHandler.APPLICATIONS_TITLES, loanList.getRejectedLoanList());
    showPrintButton(exportListName.loans, exportListFilter.rejected, LoanHandler.ALL_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.rejected, LoanHandler.ALL_TITLES);
};

LoanHandler.prototype.displayGenericLoanReports = function (list) {
    var len = list.length;

    LoanHandler.prototype.currentLoan = null;
    hideContent();

    $('#tableTotal').text(len);

    $('h3.page-header').hide();
    $('h4.sub-header').hide();
    $('#loanReportType').show();

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync loans');
    $('#syncNow').show();

    $('#sendLoanEmailReportBotton').off('click touch');
    $('#sendLoanEmailReportBotton').on('click touch', LoanHandler.self.sendEmailLoanReportRequest);
    $('#sendLoanEmailReportBotton').show();

    // use &nbsp; instead of space to avoid line wrap in column header
    var titles = {
        //awamoId: 'Awamo&nbsp;ID',
        loanId: 'ID  ',
        ownerName: 'Name',
        principal: 'Principal',
        //repaidPrincipal: 'Paid',
        //gender: 'Gender',
        //currency: 'Currency',
        //accountNo: 'loan&nbsp;account',
        disbursedAmount: 'D.amount',
        disbursementDate: 'D.date',
        //officer: 'Officer',
        //product: 'Loan&nbsp;product',
        //branch: 'Branch',
        interest: 'Rate',
        //principalArrears: 'Principal&nbsp;arrears',
        //interestArrears: 'Interest&nbsp;arrears',
        status: 'Status',
        //phone: 'Telephone',
        reason: 'Reason'
                //expectedEnd: 'E.end'
                //closedOn: 'Closed&nbsp;on'
                //endDate: 'A.end'
    };

    LoanHandler.self.removeTableFilterClassesLoans();

    var convert = function (loan) {
        // when loans are in status ACTIVE, all of them have
        // - either client or group
        // - transaction list containing a disbursement
        // - repayment schedule containing interests
        // when in status CLOSED, it is given that
        // - there is one final transaction of type REPAYMENT that
        // - sets the balance to zero
        var gender = exists(loan.client) ? loan.client.gender : '--&nbsp;group&nbsp;--';
        var disbursementDate = '';
        if (exists(loan.transactionList)) {
            var filteredTransactionList = loan.transactionList.filter(function (transaction) {
                return transaction.transactionType === 'DISBURSEMENT';
            });
            if (filteredTransactionList.length > 0) {
                disbursementDate = filteredTransactionList[0].transactionDate;
            }
        }
        var interest = exists(loan.repaymentSchedule) ? loan.repaymentSchedule.rows.map(function (row) {
            return row.interest;
        }).sum() : 0;
        var phone = exists(loan.client) ? loan.client.phone1 : '--&nbsp;group&nbsp;--';
        var closedOn = '--&nbsp;open&nbsp;--';
        if (loan.status === 'CLOSED') {
            closedOn =
                    formatDate(
                            loan
                            .transactionList
                            .filter(function (transaction) {
                                return transaction.transactionType === 'REPAYMENT' && transaction.balance === 0;
                            })[0]
                            .transactionDate);
        } else if (loan.status === 'REJECTED') {
            closedOn = formatDate(loan.lastModified);
        }
        var endDate = LoanHandler.prototype.getEndDate(loan);
        if (endDate !== '---') {
            endDate = formatDate(LoanHandler.prototype.getEndDate(loan));
        }
        var disbursedOnDate = formatDate(disbursementDate).replaceAll(' ', '&nbsp;');
        var loanHealth = "";
        if (disbursedOnDate.trim() === "") {
            loanHealth = "N/A";
        } else {
            loanHealth = loan.health;
        }
        return {
            //awamoId: loan.awamoId,
            loanId: loan.loanId,
            ownerName: exists(loan.ownerName) ? loan.ownerName.replaceAll(' ', '&nbsp;') : exists(loan.clientName) ? loan.clientName.replaceAll(' ', '&nbsp;') : '',
            principal: formatCurrency(loan.principal).replaceAll(' ', '&nbsp;') + " " + currencyCode,
            //repaidPrincipal: formatCurrency(LoanHandler.prototype.getTotalRepayments(loan)).replaceAll(' ', '&nbsp;') + " " + currencyCode,
            //gender: gender,
            //currency: currencyCode,
            //accountNo: loan.loanId,
            disbursedAmount: formatCurrency(loan.principal).replaceAll(' ', '&nbsp;') + " " + currencyCode,
            disbursementDate: formatDate(disbursementDate).replaceAll(' ', '&nbsp;'),
            //officer: exists(loan.officer) ? loan.officer.fullname.replaceAll(' ', '&nbsp;') : '',
            //product: 'tbd',
            //branch: 'tbd',
            interest: formatPercentage(loan.interestRate).replaceAll(' ', '&nbsp;'),
            //principalArrears: 'tbd',
            //interestArrears: 'tbd',
            status: loan.status,
            //phone: exists(phone) ? phone.replaceAll(' ', '&nbsp;') : '',
            // loan.health
            //health: loanHealth,
            reason: loan.reason
                    //expectedEnd: formatDate(LoanHandler.prototype.getExpectedEndDate(loan)),
                    //closedOn: closedOn
                    //endDate: endDate
        };
    };

    var $rowContainer = getDefaultRowContainer(titles, true, "reportingLoansTable");
    var $table = $rowContainer.parent();

    for (var i = 0; i < len; i++) {
        //        console.log("loan");
        //        console.log(list[i]);
        addRow($rowContainer, convert(list[i]), list[i], LoanHandler.self.rowClickHandler, list[i].mainId);
    }

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        4: {sorter: 'awamoDateSorter'},
        6: {sorter: 'awamoCurrencySorter'},
        10: {sorter: 'awamoCurrencySorter'},
        11: {sorter: 'awamoCurrencySorter'},
        16: {sorter: 'awamoLoanHealthSorter'},
        17: {sorter: 'awamoDateSorter'}
    };
    // $table.tablesorter(tableSorter);
    // Initializing Data Tables ::

    initialize_datatable($table);
    //$table.dataTable()

    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++) {
        els[i].style.textAlign = "right";
    }

    addClassToTableColumn($table, 6, 'currency');
    addClassToTableColumn($table, 10, 'currency');
    addClassToTableColumn($table, 11, 'currency');

    showContent($('#loanReportTypeForm'));
    showContent($('#tableTotalSum'));
    showContent($('#emailLoanReportDiv'));

    if (handlers['Permissions'].check_access('_EXPORT_LOANS')) {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "Loans",
            headings: true
        });
    }

    showPrintButton(exportListName.loans, exportListFilter.all, LoanHandler.ALL_TITLES);
    showExcelButton(exportListName.loans, exportListFilter.all, LoanHandler.ALL_TITLES);

    $("#hiddenPrintedTitle").val("Loans Report");
};

LoanHandler.prototype.getTransactionsRowData = function (transaction) {
    var rowdata = {};

    for (var key in LoanHandler.TRANSACTION_TITLES) {
        var formattedValue = transaction[key];

        switch (key) {
            case 'transactionDate':
                formattedValue = formatDate(formattedValue);
                break;
            case 'amount':
            case 'balance':
                formattedValue = exists(formattedValue) ? formatCurrency(formattedValue) + ' ' + currencyCode : '---';
                break;
            default:
                break;
        }

        rowdata[key] = String(formattedValue);
    }

    return rowdata;
};

LoanHandler.prototype.loan_status = 'ALL';

LoanHandler.prototype.genericLoanReportSelectHandler = function () {
    $('#ClearDatesPd').click();
    $('#ClearDatesEd').click();

    var select_option = $(this).val();

    LoanHandler.self.loan_status = $(this).val();

    switch (select_option) {
        case 'ALL':
            LoanHandler.self.genericLoanReports(loanList.getEntities());
            break;
        case 'REJECTED':
            LoanHandler.self.genericLoanReports(loanList.getListByStatus('REJECTED'));
            break;
        case 'OUTSTANDING_BALANCE':
            LoanHandler.self.genericLoanReports(loanList.getListByStatus('ACTIVE'));
            break;
        case 'PORTFOLIO':
            LoanHandler.self.genericLoanReports(loanList);
            $('#loanReportTypePortfolio').val('ALL');
            $('#loanReportTypePortfolio').show();
            break;
        case 'ARREARS':
            LoanHandler.self.genericLoanReports([]);
            break;
        case 'PORTFOLIO_AT_RISK':
            LoanHandler.self.genericLoanReports(loanList.getListByStatus('ACTIVE').filter(function (loan) {
                return loan.health !== 'PAR_0';
            }));
            break;
        case 'PREPAID':
            LoanHandler.self.genericLoanReports(loanList.getListByStatus('ACTIVE').filter(function (loan) {
                return LoanHandler.prototype.isPrePaid(loan) && !LoanHandler.prototype.fullyRepaid(loan);
            }));
            break;
        case 'FullyRepaid':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return LoanHandler.prototype.fullyRepaid(loan);
            }));
            $('#datesSelectorLoanEndDate').show();
            break;
        case 'REPAYMENTDUE':
            LoanHandler.self.genericLoanReports(loanList.getListByStatus('ACTIVE').filter(function (loan) {
                return LoanHandler.prototype.hasPayment(loan);
            }));
            $('#datesSelectorPaymentDue').show();
            break;
        case 'OVERPAID':
            LoanHandler.self.genericLoanReports(loanList.getListByStatus('OVERPAID'));
            break;
        default:
            break;
    }
};

LoanHandler.prototype.genericLoanReportProfileSelectHandler = function () {
    switch ($(this).val()) {
        case 'ALL':
            LoanHandler.self.genericLoanReports(loanList.getEntities());
            $('#loanReportTypePortfolio').show();
            break;
        case 'PAR_0':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return loan.health === 'PAR_0';
            }));
            $('#loanReportTypePortfolio').show();
            break;
        case 'PAR_3':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return loan.health === 'PAR_3';
            }));
            $('#loanReportTypePortfolio').show();
            break;
        case 'PAR_30':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return loan.health === 'PAR_30';
            }));
            $('#loanReportTypePortfolio').show();
            break;
        case 'PAR_60':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return loan.health === 'PAR_60';
            }));
            $('#loanReportTypePortfolio').show();
            break;
        case 'PAR_90':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return loan.health === 'PAR_90';
            }));
            $('#loanReportTypePortfolio').show();
            break;
        case 'DEFAULTED':
            LoanHandler.self.genericLoanReports(loanList.getEntities().filter(function (loan) {
                return loan.health === 'DEFAULTED';
            }));
            $('#loanReportTypePortfolio').show();
            break;
        default:
            break;
    }
};

LoanHandler.prototype.removeTableFilterClassesLoans = function () {
    $('#defaultTableContainer').removeClass('allLoansTable');
};

LoanHandler.prototype.displayInTable = function (titles, dataList) {
    var $rowContainer = getDefaultRowContainer(titles, true, "actionRequiredLoansTable");
    var $table = $rowContainer.parent();
    for (var i = 0; i < dataList.length; i++) {
        // without image use this
        addRow(
                $rowContainer,
                LoanHandler.prototype.getRowData(titles, dataList[i]),
                dataList[i],
                LoanHandler.self.rowClickHandler,
                dataList[i].loanId);
        // with images use this
        //        var $row = addRow($rowContainer, LoanHandler.prototype.getRowData(titles, dataList[i]), dataList[i], LoanHandler.self.rowClickHandler, dataList[i].loanId);
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
        4: {sorter: 'awamoDateSorter'}
    };
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);
    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++) {
        els[i].style.textAlign = "right";
    }
    if (handlers['Permissions'].check_access('_EXPORT_LOANS')) {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "export",
            headings: true
        });
    }
    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
};

LoanHandler.prototype.addToTable = function (data) {
    var $row = null;
    if (
            'loanApplications' === currentTable ||
            'loanDisbursements' === currentTable ||
            'allLoans' === currentTable ||
            'rejectedLoans' === currentTable) {

        var titles = LoanHandler.APPLICATIONS_TITLES;
        if ('allLoans' === currentTable) {
            titles = LoanHandler.ALL_TITLES;
        }

        var $tableContainer = $('#defaultTableContainer');

        if ($tableContainer.is(":visible")) {
            var $table = $tableContainer.find('table');
            var $rowContainer = $table.find('tbody');
            var $row = $rowContainer.find('[data-id="' + data.loanId + '"]');
            var oldData = $row.data('object');
            var formattedRowData = LoanHandler.prototype.getRowData(titles, data);

            /*
             *
             * THIS CODE HAS BEEN COMENTED AND REPLACED WITH CALL PREVIOUS PAGE. WHICH IDEALY IS THE PAGE YOU ARE ON
             * TO REMOVE DOUBLE USAGE OF RESOURCES AND MAKE SURE DATATABLES FUNCTION WELL. WE RE INITIALIZE THE VIEW EVERY WHEN THERE IS A NEW
             * DATA LIST CHANGE ;  @mover
             *
             */
            // Re- Call the Handler
            LoanHandler.self.previousPage();

            //            if (!exists(oldData)) {
            //                addRow($rowContainer, formattedRowData, data, LoanHandler.self.rowClickHandler, data.loanId);
            //            } else {
            //                var $cells = $row.find('td');
            //                var len = $cells.length;
            //
            //                for (var i = 0; i < len; i++) {
            //                    var $cell = $($cells[i]);
            //                    var newValue = formattedRowData[Object.keys(titles)[i]];
            //                    if ($cell.html() !== newValue) {
            //                        $cell.html(newValue);
            //                        highlightUpdatedCell($cell);
            //                    }
            //                }
            //            }
        }
    }
};

LoanHandler.prototype.getRowData = function (titles, loan) {
    var rowdata = {};
    for (var key in titles) {
        var formattedValue = loan[key];
        switch (key) {
            case 'clientImage':
                formattedValue = '<img src="images/personPlaceholderNoText.png" alt="client" height="32" />';
                if (loan.loanType === 'GROUP') {
                    formattedValue = '<img src="images/groupPlaceholder.png" alt="client" height="32" />';
                } else if (loan.loanType === 'INDIVIDUAL') {
                    formattedValue = '<img src="images/personPlaceholderNoText.png" alt="client" height="32" />';
                }
                break;
            case 'submitDate':
            case 'disbursementDate':
            case 'lastModified':
                formattedValue = formatDate(formattedValue);
                break;
            case 'principal':
                formattedValue = formatCurrency(formattedValue) + ' ' + currencyCode;
                break;
            case 'interestRate':
                formattedValue = formatPercentage(formattedValue) + ' %';
                break;
            default:
                break;
        }
        rowdata[key] = String(formattedValue);
    }
    return rowdata;
};
// </editor-fold>
LoanHandler.prototype.handleCancelRejectLoanWithMissingClientData = function () {

};
// <editor-fold defaultstate="collapsed" desc=" display a single loan (individual and group) ">
// main loan display method
LoanHandler.prototype.displayOneLoan = function (loan) {
    if (loan.loanClients && loan.repaymentSchedule)
    {
        //the loan has its repayment schedule and all its data
        LoanHandler.prototype.displayLoanCompleteData(loan);
    } else
    {
        //the loan doesnt have all its data
        LoanHandler.prototype.loadLoanData(loan.loanId);
    }
};

LoanHandler.prototype.displayLoanCompleteData = function (loan)
{
    clearExportButtons();
    LoanHandler.rejectNote = null;
    // store current loan
    LoanHandler.self.loan = loan;
    LoanHandler.self.loan.isInitLoanRepaymentPage = null;
    //addHistory('Dashboard overview', '#dashboardOverview', '#dashboard');
    // check parameter
    if (typeof (loan.loanClients) === "undefined" || loan.loanClients === null || loan.loanClients.length === 0) {
        console.log(loan);
        if (loan.status === 'REJECTED') {
            //LoanHandler.rejectNote = 'Loan had missing client data and could not be further processed, user chose to reject it for purposes of recreating it';
            //showAlertMessage('Loan does not have associated clients data on it, its not possible to process it, please reject recreate the loan',AlertTypes.warning);
            var confirmDialogHeader = 'No associated clients information';
            var confirmDialogBody = 'Loan had missing client data and could not be further processed, user chose to reject it for purposes of recreating it';
            var confirmDialogPositiveText = 'Back';
            var confirmDialogNegativeText = 'Cancel';
            showDialogPopupWithHandlers(confirmDialogHeader,
                    confirmDialogBody,
                    confirmDialogPositiveText,
                    LoanHandler.prototype.handleCancelRejectLoanWithMissingClientData,
                    confirmDialogNegativeText,
                    LoanHandler.prototype.handleCancelRejectLoanWithMissingClientData,
                    true);

            return;
        } else {
            LoanHandler.rejectNote = 'Loan had missing client data and could not be further processed, user chose to reject it for purposes of recreating it';
            //showAlertMessage('Loan does not have associated clients data on it, its not possible to process it, please reject recreate the loan',AlertTypes.warning);
            var confirmDialogHeader = 'No associated clients information';
            var confirmDialogBody = 'Loan does not have associated clients data on it, its not possible to process it, please reject recreate the loan';
            var confirmDialogPositiveText = 'Reject';
            var confirmDialogNegativeText = 'Cancel';
            showDialogPopupWithHandlers(confirmDialogHeader,
                    confirmDialogBody,
                    confirmDialogPositiveText,
                    LoanHandler.prototype.rejectApplication,
                    confirmDialogNegativeText,
                    LoanHandler.prototype.handleCancelRejectLoanWithMissingClientData);

            return;
        }
    }
    // page headers
    initDefaultContent(''); // gets set during "adjustments"
    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', function () {
        loanList.loadOne(loan.loanId, LoanHandler.self.displayOneLoan);
    });
    $('#syncNow').show();
    populatePhoneInputFlagAddon($('#disburseLoanPhoneNumber'), $('#disburseLoanPhoneNumberCountryBtn'), $('#disburseLoanPhoneNumberCountryList'));
    // loan
    LoanHandler.self.displayLoanDataOfLoan(loan);
    // client(s)
    LoanHandler.prototype.displayClientsOfLoan(loan);
    // loan type
    if (loan.loanType === 'INDIVIDUAL') {
        LoanHandler.self.adjustForIndividualLoan(loan);
    } else if (loan.loanType === 'GROUP') {
        LoanHandler.self.adjustForGroupLoan(loan);
    } else {
        // TODO: error? JLG? else?
    }
    // repayment schedule
    LoanHandler.prototype.displayRepaymentScheduleOfLoan(loan);
    // transactions
    if (exists(loan.transactionList) && loan.transactionList.length > 0) {
        $('#loanTransactionsTableContainer').siblings('.no-info-to-display').addClass('hidden');
        LoanHandler.prototype.displayTransactionsOfLoan(loan);
    } else {
        //alert('reached')
        $('#loanTransactionsTableContainer').siblings('.no-info-to-display').removeClass('hidden');
    }
    // actions
    LoanHandler.self.adjustSingleActionsByStatus(loan.status);
    // editability
    //LoanHandler.self.disableFieldsOfSingleLoan(loan.loanType === 'GROUP' || loan.status !== 'SUBMITTED');
    LoanHandler.self.disableFieldsOfSingleLoan(loan.status !== 'SUBMITTED');
    // show necessary content
    //    showContent($('#singleActions'));
    if (hideLoanSingleActionButtons) {
        hideControlsForReporting('Loans');
    }
    showContent($('#loan'));
};

LoanHandler.prototype.loadLoanData = function (loanId)
{
    var uri = "/loan/v1d/getLoanDetails/" + loanId;
    console.log("getting loan data url : " + uri);
    var headers = getAuthenticationHeader();
    $.ajax({
        url: host + uri,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'GET',
        beforeSend: function ()
        {
            showLoader("Loading Loan Details . . .");
        },
        success: function (loan)
        {
            console.log("The loan to load", loan);
            if (loan.health)
            {
                loanList.put(loanList, loan);
                LoanHandler.prototype.displayLoanCompleteData(loan);
                hideLoader();
            } else
            {
                showAlertMessage("An error occured while retrieving the loan details, Please try again.", AlertTypes.danger);
            }
        },
        complete: function ()
        {
            hideLoader();
        }
    }).fail(function (Response)
    {
        hideLoader();
        showAlertMessage('An error occured while retrieving the loan details, Please try again.', AlertTypes.danger);
    });
};

// loan related data
LoanHandler.prototype.displayLoanDataOfLoan = function (loan) {
    $('.transactionPaymentField').hide();
    console.log("Loan xtr");
    console.log(loan);

    var outstandingAndOverDueObj = LoanHandler.prototype.getTotalOutstandingAmountAndTotalAmountOverDue(loan);
    if (outstandingAndOverDueObj !== null)
    {
        $('#loanTotalOutstandingAmount').val(formatCurrency(outstandingAndOverDueObj.totalAmountOutstanding) + " " + currencyCode);
    } else
    {
        $('#loanTotalOutstandingAmount').val(formatCurrency(0) + " " + currencyCode);
    }
    if (outstandingAndOverDueObj !== null)
    {
        $('#loanTotalOverdueAmount').val(formatCurrency(outstandingAndOverDueObj.totalAmountOverdue) + " " + currencyCode);
    } else
    {
        $('#loanTotalOverdueAmount').val(formatCurrency(0) + " " + currencyCode);
    }
    //loanTotalOverdueAmount
    //loanTotalOutstandingAmount
    $('#principal').val(formatCurrency(loan.principal));
    //$('#principal').prev('.input-group-addon').text(currencyCode);
    $('#reason').val(loan.reason);
    $('#disbursementDate').val(formatDate(loan.disbursementDate));
    $('#amortization').val(loan.amortizationType);
    $('#status').val(loan.status);
    $('#submitDate').val(formatDate(loan.submitDate));
    $('#duration').val(loan.duration);
    $('#repayments').val(loan.repayments);
    $('#interestRate').val(formatPercentage(loan.interestRate));
    $('#repayments').val(loan.numberOfRepayments);
    $('#interestType').val(loan.interestType);
    $('#amortization').val(loan.amortizationType);
    $('#interestCalculationPeriodType').val(loan.interestCalculationPeriodType);
    $('#officerComment').text(loan.officerComment);

    if (loan.status === 'REJECTED') {
        $('#rejectNoteGroup').show();
        $('#rejectNote').text(loan.rejectNote);
    } else {
        $('#rejectNoteGroup').hide();
        $('#rejectNote').text('');
    }

    if (loan.loanType === 'GROUP') {
        //console.log(loan)
        $('#groupName').val(loan.clientName);
        $('#responsibleLO').val(GroupHandler.prototype.getResponsibleLOName(loan.loanOfficer));
    } else {
        $('#groupName').val('');
        $('#responsibleLO').val('');
    }
    if (exists(loan.transactionList)) {
        var len = loan.transactionList.length;

        for (var i = 0; i < len; i++) {
            var transaction = loan.transactionList[i];
            console.log(transaction);
            if (undefined != transaction.transactionType && transaction.transactionType === "DISBURSEMENT") {

                if (undefined != transaction.transactionPayment)
                    $('#transactionPaymentPaymentType').val(transaction.transactionPayment.paymentType);

                if (undefined != transaction.transactionPayment && transaction.transactionPayment.paymentType === "CHEQUE" && exists(LoanHandler.self.loan.isInitLoanRepaymentPage)) {
                    $('#transactionPaymentChequeNumber').val(transaction.transactionPayment.chequeNumber);
                    $('#transactionPaymentChequeNumber').parent().parent().show();
                } else if (undefined != transaction.transactionPayment && transaction.transactionPayment.paymentType === "MOBILE_MONEY" && exists(LoanHandler.self.loan.isInitLoanRepaymentPage)) {
                    $('#transactionPaymentAccountName').val(transaction.transactionPayment.accountName);
                    $('#transactionPaymentAccountName').parent().parent().show();
                    $('#transactionPaymentPhoneNumber').val(transaction.transactionPayment.phoneNumber);
                    $('#transactionPaymentPhoneNumber').parent().parent().show();
                } else if (undefined != transaction.transactionPayment && transaction.transactionPayment.paymentType === "BANK_TRANSFER" && exists(LoanHandler.self.loan.isInitLoanRepaymentPage)) {
                    $('#transactionPaymentAccountName').val(transaction.transactionPayment.accountName);
                    $('#transactionPaymentAccountName').parent().parent().show();
                    $('#transactionPaymentAccountNumber').val(transaction.transactionPayment.accountNumber);
                    $('#transactionPaymentAccountNumber').parent().parent().show();
                    $('#transactionPaymentBankBranch').val(transaction.transactionPayment.bankBranch);
                    $('#transactionPaymentBankBranch').parent().parent().show();
                    $('#transactionPaymentBankName').val(transaction.transactionPayment.bankName);
                    $('#transactionPaymentBankName').parent().parent().show();
                } else if (undefined != transaction.transactionPayment && transaction.transactionPayment.paymentType === "CASH" && exists(LoanHandler.self.loan.isInitLoanRepaymentPage)) {
                    // nothing to show
                }
                break;
            }
        }
    }
};

// all clients of a loan
LoanHandler.prototype.displayClientsOfLoan = function (loan) {
    $('#loanTabContentList .generatedClientTab').remove();
    var len = loan.loanClients.length;
    for (var i = 0; i < len; i++) {
        var $template = LoanHandler.self.displayClientOfLoan($('#clientTabContentTemplate').html(), loan, i);
        $template.insertAfter($('#loanTabContent'));
        $("#client" + i).css("height", "450px");
        $("#client" + i).css("max-width", "1000px");
        $("#client" + i).mCustomScrollbar({
            scrollButtons: {enable: true},
            theme: "my-theme",
            axis: "yx" // vertical and horizontal scrollbar
        });
    }
};

// single client of a loan
LoanHandler.prototype.displayClientOfLoan = function (template, loan, counter) {
    console.log('Displaying loan clients');
    //console.log(loan);
    var $template = $(template.replace(/###counter###/g, counter));
    //    $(".generatedClientTab").mCustomScrollbar({
    //        scrollButtons: {enable: true},
    //        theme: "minimal-dark",
    //        axis: "yx" // vertical and horizontal scrollbar
    //    }
    //            );
    var loanClient = loan.loanClients[counter];

    document.getElementById("loanClientImageID").src = "images/personPlaceholderNoText.png";

    $.ajax({
        url: host + '/client/v1d/find?' +
                'awamoId=' + loanClient.awamoId + '&' +
                'deviceId=cockpit&' +
                'datatype=PHOTOGRAPHY',
        type: 'GET',
        headers: getAuthenticationHeader(),
        xhrFields: {
            responseType: 'arraybuffer'
        }
    })
            .done(function (e) {
                var blob = new Blob([e], {type: 'image/jpg'});
                var fr = new FileReader();
                fr.onload = function (e) {
                    document.getElementById("loanClientImageID").src = e.target.result;
                };
                fr.readAsDataURL(blob);
            })
            .fail(function (e) {
                document.getElementById("loanClientImageID").src = "images/personPlaceholderNoText.png";
                console.log('fail');
                console.log(e);
            });

    var $clientnameField = $template.find('#clientName' + counter);

    $clientnameField.val('loading client ...');
    //console.log(loan);
    //console.log(loanClient);
    clientList.get(loanClient.awamoId, function (client) {
        if (client === null || typeof client === 'undefined') {
            $clientnameField.val('client ' + 'awamo id: ' + loanClient.awamoId + ' not found');
        } else {
            if (typeof client.fullname !== "undefined")
                $clientnameField.val(client.fullname);
        }
        $template.find('#loanClientIdNumber' + counter).val(client.iddocument);
        $template.find('#loanClientIdType' + counter).val(client.iddocumenttype);
    });

    $template.find('#numberOfChildren' + counter).val(loanClient.numberOfChildren);
    $template.find('#numberOfChildrenInHousehold' + counter).val(loanClient.numberOfChildrenInHouseHold);
    $template.find('#maritalStatus' + counter).val(loanClient.maritalStatus);
    $template.find('#livingArea' + counter).val(loanClient.livingArea);
    $template.find('#homeProvince' + counter).val(loanClient.address.province);
    $template.find('#homeCity' + counter).val(loanClient.address.city);
    $template.find('#homeStreet' + counter).val(loanClient.address.street);

    if (loanClient.clientEmployments === null || !exists(loanClient.clientEmployments || loanClient.clientEmployments.length === 0)) {
        $template.find('#employmentPanel' + counter + ' p.message').show();
        $template.find('#employmentPanel' + counter + ' div.form-group').hide();
        $template.find('#selfEmploymentPanel' + counter + ' p.message').show();
        $template.find('#selfEmploymentPanel' + counter + ' div.form-group').hide();
    } else {
        var clientEmployments = loanClient.clientEmployments;
        if (clientEmployments.length === 1) {
            if (clientEmployments[0].employmentType === 'SELF_EMPLOYED') {
                $template.find('#employmentPanel' + counter + ' p.message').show();
                $template.find('#employmentPanel' + counter + ' div.form-group').hide();
                $template.find('#selfEmploymentPanel' + counter + ' p.message').hide();
                $template.find('#selfEmploymentPanel' + counter + ' div.form-group').show();
            } else if (clientEmployments[0].employmentType === 'EMPLOYED') {
                $template.find('#employmentPanel' + counter + ' p.message').hide();
                $template.find('#employmentPanel' + counter + ' div.form-group').show();
                $template.find('#selfEmploymentPanel' + counter + ' p.message').show();
                $template.find('#selfEmploymentPanel' + counter + ' div.form-group').hide();
            } else {
                $template.find('#employmentPanel' + counter + ' p.message').show();
                $template.find('#employmentPanel' + counter + ' div.form-group').hide();
                $template.find('#selfEmploymentPanel' + counter + ' p.message').show();
                $template.find('#selfEmploymentPanel' + counter + ' div.form-group').hide();
            }
        } else if (clientEmployments.length === 2) {
            if (clientEmployments[0].employmentType === 'SELF_EMPLOYED' ||
                    clientEmployments[1].employmentType === 'SELF_EMPLOYED') {
                $template.find('#selfEmploymentPanel' + counter + ' p.message').hide();
                $template.find('#selfEmploymentPanel' + counter + ' div.form-group').show();
            } else {
                $template.find('#selfEmploymentPanel' + counter + ' p.message').show();
                $template.find('#selfEmploymentPanel' + counter + ' div.form-group').hide();
            }
            if (clientEmployments[0].employmentType === 'EMPLOYED' ||
                    clientEmployments[1].employmentType === 'EMPLOYED') {
                $template.find('#employmentPanel' + counter + ' p.message').hide();
                $template.find('#employmentPanel' + counter + ' div.form-group').show();
            } else {
                $template.find('#employmentPanel' + counter + ' p.message').show();
                $template.find('#employmentPanel' + counter + ' div.form-group').hide();
            }
        } else {
            $template.find('#employmentPanel' + counter + ' p.message').show();
            $template.find('#employmentPanel' + counter + ' div.form-group').hide();
            $template.find('#selfEmploymentPanel' + counter + ' p.message').show();
            $template.find('#selfEmploymentPanel' + counter + ' div.form-group').hide();
        }
        if (exists(clientEmployments[0])) {
            if (clientEmployments[0].employmentType === 'EMPLOYED') {
                $template.find('#employmentStartDate' + counter).val(formatDate(clientEmployments[0].startDate));
                $template.find('#employmentMonthlyIncome' + counter).val(formatCurrency(clientEmployments[0].monthlyIncome) + ' ' + currencyCode);
                $template.find('#employmentFormallyRegistered' + counter).val(clientEmployments[0].formallyRegistered ? 'yes' : 'no');
                $template.find('#employmentNumberOfEmployees' + counter).val(clientEmployments[0].numberOfEmployees);
                $template.find('#employmentSector' + counter).val(clientEmployments[0].businessSector);
                $template.find('#employmentProvince' + counter).val(clientEmployments[0].address.province);
                $template.find('#employmentCity' + counter).val(clientEmployments[0].address.city);
                $template.find('#employmentStreet' + counter).val(clientEmployments[0].address.street);
            }

            if (clientEmployments[0].employmentType === 'SELF_EMPLOYED') {
                $template.find('#selfEmploymentType' + counter).val(clientEmployments[0].selfEmploymentType);
                $template.find('#selfEmploymentStartDate' + counter).val(formatDate(clientEmployments[0].startDate));
                $template.find('#selfEmploymentMonthlyIncome' + counter).val(formatCurrency(clientEmployments[0].monthlyIncome) + ' ' + currencyCode);
                $template.find('#selfEmploymentFormallyRegistered' + counter).val(clientEmployments[0].formallyRegistered ? 'yes' : 'no');
                $template.find('#selfEmploymentNumberOfEmployees' + counter).val(clientEmployments[0].numberOfEmployees);

                if (clientEmployments[0].sector === 'BUSINESS_SECTOR') {
                    $template.find('#selfEmploymentBusinessSector' + counter).val(clientEmployments[0].businessSector);
                    $template.find('#farmer' + counter).hide();
                    $template.find('#non-farmer' + counter).show();
                } else if (clientEmployments[0].sector === 'AGRICULTURAL_SECTOR') {
                    $template.find('#selfEmploymentAgriculturalSector' + counter).val(clientEmployments[0].agriculturalSector);
                    $template.find('#farmer' + counter).show();
                    $template.find('#non-farmer' + counter).hide();
                }
                $template.find('#selfEmploymentProvince' + counter).val(clientEmployments[0].address.province);
                $template.find('#selfEmploymentCity' + counter).val(clientEmployments[0].address.city);
                $template.find('#selfEmploymentStreet' + counter).val(clientEmployments[0].address.street);
            }

        }
        if (exists(clientEmployments[1])) {
            if (clientEmployments.length > 1) {
                if (clientEmployments[1].employmentType === 'EMPLOYED') {
                    $template.find('#employmentStartDate' + counter).val(formatDate(clientEmployments[1].startDate));
                    $template.find('#employmentMonthlyIncome' + counter).val(formatCurrency(clientEmployments[1].monthlyIncome) + ' ' + currencyCode);
                    $template.find('#employmentFormallyRegistered' + counter).val(clientEmployments[0].formallyRegistered ? 'yes' : 'no');
                    $template.find('#employmentNumberOfEmployees' + counter).val(clientEmployments[1].numberOfEmployees);
                    $template.find('#employmentSector' + counter).val(clientEmployments[1].businessSector);
                    $template.find('#employmentProvince' + counter).val(clientEmployments[1].address.province);
                    $template.find('#employmentCity' + counter).val(clientEmployments[1].address.city);
                    $template.find('#employmentStreet' + counter).val(clientEmployments[1].address.street);
                }

                if (clientEmployments[1].employmentType === 'SELF_EMPLOYED') {
                    $template.find('#selfEmploymentType' + counter).val(clientEmployments[1].selfEmploymentType);
                    $template.find('#selfEmploymentStartDate' + counter).val(formatDate(clientEmployments[1].startDate));
                    $template.find('#selfEmploymentMonthlyIncome' + counter).val(formatCurrency(clientEmployments[1].monthlyIncome) + ' ' + currencyCode);
                    $template.find('#selfEmploymentFormallyRegistered' + counter).val(clientEmployments[0].formallyRegistered ? 'yes' : 'no');
                    $template.find('#selfEmploymentNumberOfEmployees' + counter).val(clientEmployments[1].numberOfEmployees);

                    if (clientEmployments[1].sector === 'BUSINESS_SECTOR') {
                        $template.find('#selfEmploymentBusinessSector' + counter).val(clientEmployments[1].businessSector);
                        $template.find('#farmer' + counter).hide();
                        $template.find('#non-farmer' + counter).show();
                    } else if (clientEmployments[1].sector === 'AGRICULTURAL_SECTOR') {
                        $template.find('#selfEmploymentBusinessSector' + counter).val(clientEmployments[1].businessSector);
                        $template.find('#farmer' + counter).show();
                        $template.find('#non-farmer' + counter).hide();
                    }

                    $template.find('#selfEmploymentProvince' + counter).val(clientEmployments[1].address.province);
                    $template.find('#selfEmploymentCity' + counter).val(clientEmployments[1].address.city);
                    $template.find('#selfEmploymentStreet' + counter).val(clientEmployments[1].address.street);
                }
            }
        }
    }
    return $template;
};

// repayment schedule
LoanHandler.prototype.getRepaymentScheduleRowData = function (repaymentScheduleRow, i) {
    var rowdata = {};
    for (var key in LoanHandler.REPAYMENT_SCHEDULE_TITLES) {
        var formattedValue = repaymentScheduleRow[key];
        if (parseInt(formattedValue) < 0) {
            formattedValue = '';
        } else {
            switch (key) {
                case 'no':
                    formattedValue = i;
                    break;
                case 'dueDate':
                    formattedValue = formatDate(formattedValue);
                    break;
                case 'due':
                case 'amortization':
                case 'interest':
                case 'outstanding':
                    formattedValue = formatCurrency(formattedValue) + ' ' + currencyCode;
                    break;
                case 'paidDate':
                    var due = repaymentScheduleRow.due;
                    var dueDate = repaymentScheduleRow.dueDate;
                    var outstanding = repaymentScheduleRow.outstanding;
                    var outstanding = repaymentScheduleRow.outstanding;
                    var paid = repaymentScheduleRow.paid;
                    if (outstanding === 0) {
                        if ((formattedValue != null || formattedValue != undefined)) {
                            formattedValue = formatDate(formattedValue);
                        } else {
                            formattedValue = ' ';
                        }
                    } else if (outstanding > 0 && paid > 0) {
                        var installment_status = 'normal';

                        if (dueDate != undefined && dueDate != null) {

                            var today = new Date();
                            var due_date = new Date(parseInt(dueDate));

                            if (today > due_date)
                                installment_status = 'expired';
                        }
                        formattedValue = '<label class="' + installment_status + '"  >Not Fully Paid</label>';
                    } else {
                        var installment_status = 'normal';

                        if (dueDate != undefined && dueDate != null) {

                            var today = new Date();
                            var due_date = new Date(parseInt(dueDate));

                            if (today > due_date)
                                installment_status = 'expired';
                        }

                        formattedValue = '<label class="' + installment_status + '" > Not Paid </label>';
                    }
                    break;
                default:
                    break;
            }
        }
        rowdata[key] = String(formattedValue);
    }
    return rowdata;
};

//Repayment Schedule
LoanHandler.prototype.displayRepaymentScheduleOfLoan = function (loan) {
    var $rowContainer = getRowContainer('#repaymentScheduleTableContainer', LoanHandler.REPAYMENT_SCHEDULE_TITLES);
    var $table = $rowContainer.parent();
    if (!exists(loan) || !exists(loan.repaymentSchedule) || !exists(loan.repaymentSchedule.rows)) {
        console.log('no repaymentSchedule found on this loan');
        console.log(loan);
        console.log('---------------------------');
        return;
    }
    var rows = loan.repaymentSchedule.rows;
    var len = rows.length;
    for (var i = 0; i < len; i++) {
        if (rows[i].dueDate < 0 && rows[i].paidDate < 0 && rows[i].due < 0 && rows[i].interest < 0 && rows[i].outstanding < 0)
            continue;
        if (loan.status === 'ACTIVE' && (LoanHandler.self.previousPage !== LoanHandler.self.firstGenericLoanReportsForReporting)) {
            addRow($rowContainer, LoanHandler.prototype.getRepaymentScheduleRowData(rows[i], i), loan, LoanHandler.self.loanRepaymentsRowClickHandler, loan.loanId);
        } else {
            addRow($rowContainer, LoanHandler.prototype.getRepaymentScheduleRowData(rows[i], i), loan, null, loan.loanId);
        }
    }
    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        0: {sorter: 'awamoDateSorter'},
        1: {sorter: 'awamoCurrencySorter'},
        2: {sorter: 'awamoCurrencySorter'},
        3: {sorter: 'awamoCurrencySorter'},
        4: {sorter: 'awamoCurrencySorter'}
    };
    tableSorter.sortList = [
        [4, 1]
    ];
    //$table.tablesorter(tableSorter);
    initialize_datatable($table);
};

LoanHandler.prototype.getTotalOutstandingAmountAndTotalAmountOverDue = function (loan)
{
    var repaymentScheduleRows = loan.repaymentSchedule.rows;
    var totalAmountOutstanding = 0;
    var totalAmountOverdue = 0;
    $.each(repaymentScheduleRows, function (index, row) {
        if (row.outstanding >= 0)
        {
            totalAmountOutstanding += row.outstanding;
            if (row.paidDate === null)
            {
                totalAmountOverdue += row.outstanding;
            }
        }
    });
    var resultObj = [];
    resultObj.totalAmountOutstanding = totalAmountOutstanding;
    resultObj.totalAmountOverdue = totalAmountOverdue;
    return resultObj;
};

// adjust GUI for individual loan (e.g. show collaterals)
LoanHandler.prototype.adjustForIndividualLoan = function (loan) {
    $('#collateralPanel .panel-heading, #collateralPanel .panel-body > div').css('display', 'block');
    $('#collateralPanel .panel-body > p').remove();

    $('#creditCollateralType').data('loan', '');
    $('h3.page-header').text("Individual Loan #" + loan.loanId);
    $('#client-tab').show();
    $('#group-tab').hide();
    $('#creditCollaterals-tab').show();
    $('#guarantor-tab').show();
    $('#guarantor-tab').show();

    $('#groupName').parent().parent().hide();
    $('#responsibleLO').parent().parent().hide();

    if (loan.creditCollaterals !== null && loan.creditCollaterals.length > 0) {

        var creditCollateral = loan.creditCollaterals[0];
        var $creditCollateralType = $('#creditCollateralType');
        $creditCollateralType.data('loan', loan);
        $creditCollateralType.val(creditCollateral.type).removeAttr('disabled');
        $creditCollateralType.html('');
        for (var i = 0; i < loan.creditCollaterals.length; i++) {
            var collateral = loan.creditCollaterals[i];
            var opt = document.createElement('option');
            opt.value = collateral.index;
            opt.innerHTML = collateral.type;
            $creditCollateralType.append(opt);
        }
        $creditCollateralType.off('change');
        $creditCollateralType.on('change', function () {
            var loan = $(this).data('loan');
            var creditCollaterals = loan.creditCollaterals;
            var index = parseInt($(this).val());
            LoanHandler.self.bindCollateralInfo(loan.loanId, creditCollaterals[index]);
        })
        LoanHandler.self.bindCollateralInfo(loan.loanId, creditCollateral);

    } else {
        // $('#creditCollateralType').attr('disabled', 'disabled').html('');
        // $('#creditCollateralDescription').val('');
        // $('#creditCollateralValue').val('');
        $('#collateralPanel .panel-heading, #collateralPanel .panel-body > div').css('display', 'none');
        $('#collateralPanel .panel-body').append('<p><b>No Items!</b> There is no collateral available for this loan.</p>');

        // noop, show that there are no collaterals
    }

    if (!exists(loan.loanClients[0].guarantor)) {
        $('#guarantorPanel0 p.message').show();
        $('#guarantorPanel0 div.form-group').hide();
    } else {
        $('#guarantorPanel0 p.message').hide();
        $('#guarantorPanel0 div.form-group').show();
        $('#guarantorName0').val(loan.loanClients[0].guarantor.guarantorName);
        $('#guarantorValue0').val(formatCurrency(loan.loanClients[0].guarantor.guarantorValue) + ' ' + currencyCode);
    }

    if ($('#client-tab').parent().hasClass('active') || $('#group-tab').parent().hasClass('active')) {
        $('#client-tab').tab('show');
        $('#client0').addClass('active in');
    }
};
LoanHandler.prototype.bindCollateralInfo = function (loanId, creditCollateral) {
    $('#creditCollateralDescription').val(creditCollateral.description);
    $('#creditCollateralValue').val(formatCurrency(creditCollateral.value) + ' ' + currencyCode);
    // images are lazy-loaded if not found locally
    var img = $('#collateralPanel .imageframe img')[0];
    if (!exists(creditCollateral.image) /*typeof (Storage) !== "undefined"*/) {
        (function (loanId, img, creditCollateral) {
            $.ajax({
                url: host + loanList.rootPath + loanId + '/download/co?datatype=COLLATERAL_IMG_1&index=' + creditCollateral.index,
                type: 'GET',
                headers: getAuthenticationHeader(),
                xhrFields: {
                    responseType: 'arraybuffer'
                }
            })
                    .done(function (e) {
                        var blob = new Blob([e], {type: "image/jpg"});
                        var fr = new FileReader();
                        fr.onload = function (e) {
                            img.src = e.target.result;
                            var loan = $('#creditCollateralType').data('loan');
                            var index = parseInt(creditCollateral.index);
                            loan.creditCollaterals[index].image = e.target.result;
                            $('#creditCollateralType').data('loan', loan);
                        };
                        fr.readAsDataURL(blob);
                    })
                    .fail(function (e) {
                        img.src = 'images/placeholder.png'
                        console.log('fail');
                    })
                    .always(function (e) {
                        //                      console.log('always');
                        //                      console.log(e);
                    });
        })(loanId, img, creditCollateral);

    } else {
        //console.log(creditCollateral.image);
        var src = 'data:image/jpeg;base64,' + creditCollateral.image;
        img.src = src;
        //$('#collateralPanel .imageframe img')[0].attr('src',src);
    }
}
// adjust GUI for group loan (e.g. hide collaterals)
LoanHandler.prototype.adjustForGroupLoan = function (loan) {
    $('h3.page-header').text("Group Loan #" + loan.loanId);
    $('#client-tab').hide();
    $('#group-tab').show();
    $('#creditCollaterals-tab').hide();
    $('#guarantor-tab').hide();
    $('#groupName').parent().parent().show();
    $('#responsibleLO').parent().parent().show();
    $('#group-tab-contents').empty();
    var len = loan.loanClients.length;

    for (var i = 0; i < len; i++) {
        var groupLoanClientTabItem = $('#groupLoanClientTabItem').html().replace(/###counter###/g, i);
        $('#group-tab-contents').append($(groupLoanClientTabItem));

        (function (index) {
            clientList.get(loan.loanClients[index].awamoId, function (client) {
                if (exists(client)) {
                    $('#client' + index + '-tab').text(client.fullname);
                } else {
                    $('#client' + index + '-tab').text('client ' + 'awamo id: ' + loan.loanClients[index].awamoId + ' not found');
                }

            });
        })(i);
    }

    if ($('#client-tab').parent().hasClass('active') || $('#group-tab').parent().hasClass('active')) {
        $('#client0-tab').tab('show');
    }

    if ($('#creditCollaterals-tab').parent().hasClass('active') || $('#guarantor-tab').parent().hasClass('active')) {
        $('#loan-tab').tab('show');
    }
};

// adjust GUI by loan status
LoanHandler.prototype.disableFieldsOfSingleLoan = function (disabledState) {
    $('#principal').prop('disabled', disabledState);
    $('#duration').prop('disabled', disabledState);
    $('#amortization').prop('disabled', disabledState);
    $('#repayments').prop('disabled', disabledState);
    $('#interestRate').prop('disabled', disabledState);
    $('#interestType').prop('disabled', disabledState);
    $('#interestCalculationPeriodType').prop('disabled', disabledState);
    $('#paymentType').prop('disabled', disabledState);
};

LoanHandler.prototype.adjustSingleActionsByStatus = function (status) {
    // TODO: can I use LoanStatus.SUBMITTED somehow?
    LoanHandler.prototype.hideLoanActionButtons();
    $('#singleActions a[data-action]').hide();
    $('#loanActionsBackBtn').show();
    //    $('#singleActions a[data-action="back"]').show();

    if ($('#repaymentSchedule-tab').parent().hasClass('active')) {
        //        $('#singleActions a[data-action="print"]').show();
        $('#printNow').off('click touch');
        $('#printNow').on('click touch', LoanHandler.self.printRepaymentSchedule);
        $('#printableTitle').text('Repayment Schedule');
        $('#printNow').show();
    } else {
        $('#printNow').off('click touch');
        $('#printNow').hide();
    }

    switch (status) {
        case 'SUBMITTED':
            //            $('#singleActions a[data-action="approve"]').show();
            $('#loanActionsApproveBtn').show();
            $('#loanActionsRejectBtn').show();
            //            $('#singleActions a[data-action="reject"]').show();
            break;
        case 'REJECTED':
            break;
        case 'APPROVED':
            //            $('#singleActions a[data-action="confirmContractSigned"]').show();
            $('#loanActionsConfirmContractSignedBtn').show();
            break;
        case 'APPROVED_WITH_MODIFICATIONS':
            //            $('#singleActions a[data-action="confirmContractSigned"]').show();
            $('#loanActionsAcceptModificationsBtn').show();
            $('#loanActionsWithdrawApplicationBtn').show();
            break;
        case 'CONTRACT_SIGNED':
            //            $('#singleActions a[data-action="allowDisbursement"]').show();
            $('#loanActionsAllowDisbursementBtn').show();
            break;
        case 'AWAITING_DISBURSEMENT':
            //            $('#singleActions a[data-action="disburse"]').show();
            $('#loanActionsDisburseBtn').show();
            break;
        case 'WITHDRAWN':
            break;
        case 'ACTIVE':
            //            $('#singleActions a[data-action="makeLoanRepayment"]').show();
            $('#loanActionsMakeRepaymentBtn').show();
            break;
        case 'CLOSED':
            break;
        case 'CANCELED':
            break;
        case 'OVERPAID':
            break;
        default:
            break;
    }
};

// transactions
LoanHandler.prototype.displayTransactionsOfLoan = function (loan) {
    var $rowContainer = getRowContainer('#loanTransactionsTableContainer', LoanHandler.TRANSACTION_TITLES);
    var $table = $rowContainer.parent();
    var $tableContainer = $('#loanTransactionsTableContainer');
    $tableContainer.empty();

    var $table = getEmptyTable(true);
    $tableContainer.append($table);

    var $rowContainer = $table.find('thead');
    addRow($rowContainer, LoanHandler.TRANSACTION_TITLES);

    $rowContainer = $table.find('tbody');

    if (!exists(loan.transactionList) || loan.transactionList === 0) {
        return;
    }

    var len = loan.transactionList.length;

    for (var i = 0; i < len; i++) {
        var transaction = loan.transactionList[i];
        var formattedRowData = LoanHandler.prototype.getTransactionsRowData(transaction);
        //addRow($rowContainer, formattedRowData, transaction, LoanHandler.self._transactionsRowClickHandler, transaction.transactionId);
        addRow($rowContainer, formattedRowData);
    }

    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        0: {sorter: 'awamoDateSorter'},
        1: {sorter: 'awamoCurrencySorter'},
        3: {sorter: 'awamoCurrencySorter'}
    };
    $table.tablesorter(tableSorter);
    //initialize_datatable($table);

    showContent($tableContainer);
};

LoanHandler.prototype.getTransactionsRowData = function (transaction) {
    var rowdata = {};

    for (var key in LoanHandler.TRANSACTION_TITLES) {
        var formattedValue = transaction[key];

        switch (key) {
            case 'transactionDate':
                formattedValue = formatDate(formattedValue);
                break;
            case 'amount':
                formattedValue = formatCurrency(formattedValue) + ' ' + currencyCode;
                break;
            case 'balance':
                formattedValue = exists(formattedValue) ? formatCurrency(formattedValue) + ' ' + currencyCode : '---';
                break;
            default:
                break;
        }

        rowdata[key] = String(formattedValue);
    }

    return rowdata;
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" event handling ">
LoanHandler.prototype.rowClickHandler = function (event) {
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();

    $('#singleActions a').off('click touch');
    //    $('#singleActions a').on('click touch', LoanHandler.prototype.singleObjectActionHandler);

    $('#approveNo').off('click touch');
    $('#approveNo').on('click touch', LoanHandler.prototype.backToDisplayOneLoan);
    $('#rejectNo').off('click touch');
    $('#rejectNo').on('click touch', LoanHandler.prototype.backToDisplayOneLoan);

    $('#allowDisbursementNo').off('click touch');
    $('#allowDisbursementNo').on('click touch', LoanHandler.prototype.backToDisplayOneLoan);
    $('#confirmContractSignedNo').off('click touch');
    $('#confirmContractSignedNo').on('click touch', LoanHandler.prototype.backToDisplayOneLoan);

    $('#approveYes').off('click touch');
    $('#approveYes').on('click touch', LoanHandler.prototype.approveApplication);
    $('#rejectYes').off('click touch');
    $('#rejectYes').on('click touch', LoanHandler.prototype.rejectApplication);

    $('#loanActionsAcceptModificationsBtn').off('click touch');
    $('#loanActionsAcceptModificationsBtn').on('click touch', LoanHandler.prototype.handleAcceptModificationsAction);
    $('#loanActionsWithdrawApplicationBtn').off('click touch');
    $('#loanActionsWithdrawApplicationBtn').on('click touch', LoanHandler.prototype.handleWithdrawLoanApplicationAction);

    $('#allowDisbursementYes').off('click touch');
    $('#allowDisbursementYes').on('click touch', LoanHandler.prototype.allowDisbursement);
    $('#confirmContractSignedYes').off('click touch');
    $('#confirmContractSignedYes').on('click touch', LoanHandler.prototype.confirmContractSigned);

    clearFormValidators($('#loanApplicationForm'));
    LoanHandler.self.displayOneLoan($(this).data('object'));
};

LoanHandler.prototype.handleResetChangesAction = function () {
    //            $('#singleActions a[data-action="approveWithChanges"]').hide();
    clearFormValidators($('#loanApplicationForm'));
    $('#loanActionsApproveWithChangesBtn').hide();
    //            $('#singleActions a[data-action="resetChanges"]').hide();
    $('#loanActionsResetBtn').hide();
    //            $('#singleActions a[data-action="approve"]').show();
    $('#loanActionsApproveBtn').show();
    LoanHandler.self.displayOneLoan(LoanHandler.self.loan);
};

LoanHandler.prototype.handleBackAction = function () {
    LoanHandler.self.previousPage();
};
LoanHandler.prototype.isValidResponse = function (status) {
    var flag = false;
    switch (status) {
        case 'SUBMITTED':
            flag = true;
            break;
        case 'AWAITING_DISBURSEMENT':
            flag = true;
            break;

        case 'APPROVED':
            flag = true;
            break;
        case 'APPROVED_WITH_MODIFICATIONS':
            flag = true;
            break;

        case 'CONTRACT_SIGNED':
            flag = true;
            break;
        case 'CLOSED':
            flag = true;
            break;
        case 'ACTIVE':
            flag = true;
            break;
        case 'REJECTED':
            flag = true;
            break;
    }
    return flag;

}
LoanHandler.prototype.buildLoanActionMessage = function (status) {
    var message = ' caused an unepected error , please refresh the application to get latest data';
    switch (status) {
        case 'SUBMITTED':
            message = ' is awaiting approval, check it out in Approve Loan Applicaions';
            break;
        case 'AWAITING_DISBURSEMENT':
            message = ' is awaiting disbursement, check for it in Disburse Loan';
            break;

        case 'APPROVED':
            message = ' is already approved ,look for it under Sign Loan Contracts';
            break;
        case 'APPROVED_WITH_MODIFICATIONS':
            message = ' is already approved with modifications ,look for it under Sign Loan Contracts';
            break;

        case 'CONTRACT_SIGNED':
            message = ', already has its contract signed, looked for it under Allow Loan Disbursements';
            break;
        case 'CLOSED':
            message = ', has already been closed, your list has been updated';
            break;
        case 'ACTIVE':
            message = ', has already been disbursed, look for it in Reporting under Loans';
            break;
        case 'REJECTED':
            message = ', has already been rejected,  your list has been updated';
            break;
    }
    return message;
}
LoanHandler.prototype.handleApproveAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            console.log(response)
            if (response === 'SUBMITTED') {
                var confirmDialogHeader = 'Confirm Loan Approval';
                var confirmDialogBody = 'Are you sure you want to approve this loan';
                var confirmDialogPositiveText = 'Yes';
                var confirmDialogNegativeText = 'No';
                showDialogPopupWithHandlers(confirmDialogHeader
                        , confirmDialogBody
                        , confirmDialogPositiveText
                        , function () {
                            //yes approve loan
                            LoanHandler.prototype.approveApplication();
                        }
                , confirmDialogNegativeText
                        , function ()
                        {
                            //no dont approve loan
                            LoanHandler.prototype.backToDisplayOneLoan();
                        });
            } else {
                hideLoader();
                showAlertMessage('Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    LoanHandler.self.loan.status = response;
                    loanList.put(loanList, LoanHandler.self.loan);
                    //LoanHandler.self.loanEntityChanged(LoanHandler.self.loan,eventtype.UPDATE)

                    LoanHandler.self.getApplications();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        LoanHandler.self.getApplications();
                    })
                }
            }
        }
    })
};

LoanHandler.prototype.handleRejectAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            if (response === 'SUBMITTED') {
                $('#loan').hide();
                $('#rejectApplication .panel-body .rejectionObject').text('loan');
                $('#rejectionNote').val('');
                showContent($('#rejectApplication'));
            } else {

                showAlertMessage('The requested action can not be performed, Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    //alert('effecting')
                    LoanHandler.self.loan.status = response;
                    loanList.put(loanList, LoanHandler.self.loan);
                    ActionRequiredHandler.prototype._dataModelChanged()
                    LoanHandler.self.getSingngContracts();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        LoanHandler.self.getSingngContracts();
                    });
                }
            }
        }
    })



};

LoanHandler.prototype.handleAllowDisbursmentAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            if (response === 'CONTRACT_SIGNED') {
                $('#loan').hide();
                $('#allowDisbursementLoanAmount').text(formatCurrency(LoanHandler.self.loan.principal) + ' ' + currencyCode);
                $('#allowDisbursementMandatorySavings').text('0 ' + currencyCode);
                $('#allowDisbursementOtherFees').text('0 ' + currencyCode);
                $('#allowDisbursementDisbursementAmount').text(formatCurrency(LoanHandler.self.loan.principal) + ' ' + currencyCode);
//                var dialogHtmlContent = $("#allowDisbursement").siblings($(".panel-body")).html();
//                var confirmDialogHeader = 'Approve Disbursement';
//                var confirmDialogBody = 'Please confirm that you want to make a deposit of ' + user_deposit_amount + ' to this savings account';
//                var confirmDialogPositiveText = 'Confirm';
//                var confirmDialogNegativeText = 'Cancel';
//                showDialogHtmlPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, SavingsAccountHandler.prototype.handleConfirmSubmitDepositTransaction, confirmDialogNegativeText, SavingsAccountHandler.prototype.handleDeclineSubmitDepositTransation);
//                var contentBoxContainer = document.createElement("div");
//                $(contentBoxContainer).addClass("panel-body");
//                var allowDisbursmentRow = document.createElement("div");
//                $(allowDisbursmentRow).addClass("row");
//                var loanAmountTextColumn = document.createElement("div");
//                $(loanAmountTextColumn).addClass("col-lg-3 col-md-4");
//                $(loanAmountTextColumn).css("text-align","right");
//                $(loanAmountTextColumn).html("<strong>Loan amount</strong>");
//                $(loanAmountTextColumn).
                showContent($('#allowDisbursement'));

            } else {
                showAlertMessage('The requested action can not be performed, Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    //alert('effecting')
                    LoanHandler.self.loan.status = response;
                    loanList.put(loanList, LoanHandler.self.loan);
                    ActionRequiredHandler.prototype._dataModelChanged()
                    LoanHandler.prototype.getAllowedDisbursements();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        LoanHandler.prototype.getAllowedDisbursements();
                    })
                }
            }
        }
    })
};

LoanHandler.prototype.handleConfirmContractSignedAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            if (response === 'APPROVED' || response === 'APPROVED_WITH_MODIFICATIONS') {
                $('#loan').hide();
                showContent($('#confirmContractSigned'));
                var confirmDialogHeader = 'Confirm Loan Contract Signed';
                var confirmDialogBody = 'Are you sure you want to confirm that this loan was signed';
                var confirmDialogPositiveText = 'Yes';
                var confirmDialogNegativeText = 'No';
                showDialogPopupWithHandlers(confirmDialogHeader
                        , confirmDialogBody
                        , confirmDialogPositiveText
                        , function ()
                        {
                            //yes i confirm
                            LoanHandler.prototype.confirmContractSigned();
                        }
                , confirmDialogNegativeText
                        , function ()
                        {
                            //no i dont
                            LoanHandler.prototype.backToDisplayOneLoan();
                        });
            } else {
                showAlertMessage('Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    //alert('effecting')
                    LoanHandler.self.loan.status = response; // response.status.value.toUpperCase();
                    loanList.put(loanList, LoanHandler.self.loan);
                    ActionRequiredHandler.prototype._dataModelChanged()
                    LoanHandler.self.getSingngContracts();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        ActionRequiredHandler.prototype._dataModelChanged();
                        LoanHandler.self.getSingngContracts();
                    });
                }
            }
            //            else {
            //                hideLoader();
            //                showAlertMessage('The requested action can not be performed, Loan with id: ' + LoanHandler.self.loan.loanId + 'is already ' + response.status.value + 'Contact support', AlertTypes.warning);
            //                LoanHandler.self.getSingngContracts();
            //            }
        }
    });
};

LoanHandler.prototype.handleDisburseAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            if (response === 'AWAITING_DISBURSEMENT') {
                $('#loan').hide();
                Options.prototype.initLoanDisbursementPage();
            } else {
                showAlertMessage('Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    //alert('effecting')
                    LoanHandler.self.loan.status = response;
                    loanList.put(loanList, LoanHandler.self.loan);
                    ActionRequiredHandler.prototype._dataModelChanged();
                    LoanHandler.prototype.getAllowedDisbursements();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        ActionRequiredHandler.prototype._dataModelChanged();
                        LoanHandler.prototype.getAllowedDisbursements();
                    });
                }
            }
        }
    });
};

LoanHandler.prototype.handleMakeLoanRepaymentAction = function () {
    $('#loan').hide();
    LoanHandler.self.initLoanRepaymentPage(LoanHandler.self.loan);
}

LoanHandler.prototype.singleObjectActionHandler = function () {
    var action = $(this).data('action');
    if (action !== 'print') {
        hideContent();
    }
    switch (action) {
        case 'back':

            break;
        case 'resetChanges':

            break;
        case 'approveWithChanges':

            break;
        case 'approve':

            break;
        case 'reject':

            break;
        case 'allowDisbursement':
            break;
        case 'confirmContractSigned':

            break;
        case 'disburse':
            break;
        case 'close':
            // not used in loans
            break;
        case 'print':

            break;
        case 'makeLoanRepayment':

            break;
        default:
            // noop
            break;
    }
    hideControlsForReporting('Loans');
};

LoanHandler.prototype.loanRepaymentActions = function () {
    var action = $(this).data('action');

    switch (action) {
        case 'back':
            // LoanHandler.self.displayOneLoan(LoanHandler.self.loan);
            LoanHandler.self.previousPage();
            break;

        default:
            break;
    }


};

LoanHandler.prototype.loanRepaymentsRowClickHandler = function (event) {
    clearExportButtons();
    LoanHandler.self.initLoanRepaymentPage($(this).data('object'));
};

LoanHandler.prototype.manage_loan_repayments = function () {
    LoanHandler.self.previousPage = LoanHandler.self.manage_loan_repayments;
    LoanHandler.self.init_repayment_list();
};
LoanHandler.prototype.init_repayment_list = function () {
    hideContent();
    LoanHandler.prototype.currentLoan = null;
    initDefaultContent('Collect Loan Repayments');

    $('#syncNow').off('click touch');
    $('#syncNow').on('click touch', LoanHandler.self.synchronizeNow);
    $('#syncNow').attr('title', 'Sync loans');
    $('#syncNow').show();

    $('#printNow').off('click touch');
    $('#printNow').on('click touch', printData);
    $('#printableTitle').text('Loans');
    $('#printNow').show();

    LoanHandler.self.removeTableFilterClassesLoans();

    var dataList = LoanHandler.self.getListByStatus("OUTSTANDING_BALANCE");

    var $rowContainer = getDefaultRowContainer(LoanHandler.ALL_TITLES, true, "collectRepaymentsTable");

    var $table = $rowContainer.parent();

    for (var i = 0; i < dataList.length; i++) {

        addRow(
                $rowContainer,
                LoanHandler.prototype.getRowData(LoanHandler.ALL_TITLES, dataList[i]),
                dataList[i],
                LoanHandler.self.loanRepaymentsRowClickHandler,
                dataList[i].loanId);
    }


    var tableSorter = getDefaultTableSorter();
    // TODO: this depends on the titles ...
    tableSorter.headers = {
        3: {sorter: 'awamoPercentageSorter'},
        4: {sorter: 'awamoDateSorter'}
    };


    //$table.tablesorter(tableSorter);
    initialize_datatable($table);


    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++) {
        els[i].style.textAlign = "right";
    }
    if (handlers['Permissions'].check_access('_EXPORT_LOANS')) {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "export",
            headings: true
        });
    }

    $('#tableTotal').text(dataList.length);
    showContent($('#tableTotalSum'));
    $('#defaultTableContainer').addClass('allLoansTable');
};

//loan Re Payment
LoanHandler.prototype.loan_id = 0;
LoanHandler.prototype.initLoanRepaymentPage = function (loan) {
    //LoanHandler.prototype.isInitLoanRepaymentPage=true;
    if (loan.loanClients && loan.repaymentSchedule)
    {
        //the loan has its repayment schedule and all its data
        LoanHandler.prototype.showLoanRepaymentPage(loan);
    } else
    {
        //the loan doesnt have all its data
        LoanHandler.prototype.loadLoanDataBeforeRepayment(loan);
    }
};

LoanHandler.prototype.loadLoanDataBeforeRepayment = function (loan)
{
    var uri = "/loan/v1d/getLoanDetails/" + loan.loanId;
    console.log("getting loan data url : " + uri);
    var headers = getAuthenticationHeader();
    $.ajax({
        url: host + uri,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'GET',
        beforeSend: function ()
        {
            showLoader("Loading Loan Details . . .");
        },
        success: function (loan)
        {
            if (loan.health)
            {
                loanList.put(loanList, loan);
                //LoanHandler.prototype.displayLoanCompleteData(loan);
                LoanHandler.prototype.showLoanRepaymentPage(loan);
                hideLoader();
            } else
            {
                showAlertMessage("An error occured while retrieving the loan details, Please try again.", AlertTypes.danger);
            }
        },
        complete: function ()
        {
            hideLoader();
        }
    }).fail(function (Response)
    {
        hideLoader();
        showAlertMessage('An error occured while retrieving the loan details, Please try again.', AlertTypes.danger);
    });
};

LoanHandler.prototype.showLoanRepaymentPage = function (loan)
{
    hideContent();
    initDefaultContent('Collect Loan Repayment');
    LoanHandler.self.loan_id = loan.loanId;
    LoanHandler.self.loan = loan;
    LoanHandler.self.loan.isInitLoanRepaymentPage = true;
    // clearFormValidators($('#LoanRepaymentForm'));
    // registerKeyPressValidators($('#LoanRepaymentForm'));
    var header_text = "Make Loan Repayments";
    var current_balance = LoanHandler.self.get_current_balance(loan);

    if (loan.loanType === 'GROUP') {
        header_text = "<strong>Make Group Loan Repayments</strong>" + "<a href='javascript:void(0);'  class='btn customCancelButton pull-right' id='_viewloan_details' > Loan Details</a>";

        // some ELements that depend onINdividual Loan
        $("#loan_repayment_clientname").removeAttr("required");
        $(".loan_repayment_clientname-panel").fadeOut();

        $("#loan_repayment_clientdatebirth").removeAttr("required");
        $(".loan_repayment_clientdatebirth-panel").fadeOut();

        $(".loanrepayment_img").fadeOut();

        //Show and Activate Group Level Parametes
        $("#loan_repayment_groupname").attr("required", "required");
        $('#loan_repayment_groupname').val(loan.clientName);
        $(".loan_repayment_groupname-panel").fadeIn();

        $("#loan_responsible_lo").attr("required", "required");
        $(".loan_responsible_lo-panel").fadeIn();
        $('#loan_responsible_lo').val(GroupHandler.prototype.getResponsibleLOName(loan.loanOfficer));
        $("#loan_responsible_lo").attr("disabled", "disabled");


    } else if (loan.loanType === 'INDIVIDUAL') {
        header_text = "<strong>Make Individual Loan Repayments</strong>" + "<a href='javascript:void(0);'  class='btn customCancelButton pull-right' id='_viewloan_details' > Loan Details</a>";

        // Show ELements that depend onINdividual Loan
        $("#loan_repayment_clientname").attr("required", "required");
        $(".loan_repayment_clientname-panel").fadeIn();

        $("#loan_repayment_clientdatebirth").attr("required", "attr");
        $(".loan_repayment_clientdatebirth-panel").fadeIn();

        $(".loanrepayment_img").fadeIn();

        //Disalbe and Activate Group Level Parametes
        $("#loan_repayment_groupname").removeAttr("required");
        $(".loan_repayment_groupname-panel").fadeOut();

        $("#loan_responsible_lo").removeAttr("required");
        $(".loan_responsible_lo-panel").fadeOut();

        $('#loan_repayment_clientname').val(loan.clientName).prop('disabled', true);
        $('#loan_repayment_clientdatebirth').val(formatDate(loan.client.birthdate)).prop('disabled', true);

        document.getElementById("loanrepayment_img").src = "images/personPlaceholderNoText.png";

        $.ajax({
            url: host + '/client/v1d/find?' +
                    'awamoId=' + loan.awamoId + '&' +
                    'deviceId=cockpit&' +
                    'datatype=PHOTOGRAPHY',
            type: 'GET',
            headers: getAuthenticationHeader(),
            xhrFields: {
                responseType: 'arraybuffer'
            }
        })
                .done(function (e) {
                    var blob = new Blob([e], {type: 'image/jpg'});
                    var fr = new FileReader();
                    fr.onload = function (e) {
                        document.getElementById("loanrepayment_img").src = e.target.result;
                    };
                    fr.readAsDataURL(blob);
                })
                .fail(function (e) {
                    document.getElementById("loanrepayment_img").src = "images/personPlaceholderNoText.png";
                    console.log('fail');
                    console.log(e);
                });
    }

    $('#loan_repayment_nextDueDate').val(current_balance.dueDate);
    $('#loan_repayment_nextInstallment_due').val(current_balance.requiredBalance);
    $('#loan_repayment_installmentDate').val('');
    $('#loan_repayment_transactionPaymentPaymentType').val('');
    $('#loan_repayment_cheque_number').val('');
    $('#loan_repayment_phone_number').val('');
    populatePhoneInputFlagAddon($('#loan_repayment_phone_number'), $('#loan_repayment_phone_numberCountryBtn'), $('#loan_repayment_phone_numberCountryList'));

    $('#loan_repayment_account_name').val('');
    $('#loan_repayment_account_number').val('');
    $('#loan_repayment_bank_name').val('');
    $('#loan_repayment_branch_name').val('');

    //Installment Date
    $("#loan_repayment_installmentDate").datepicker().datepicker("setDate", new Date());

    $('#loanRepaymentPanal button').off('click touch');
    $('#loanRepaymentPanal button').on('click touch', LoanHandler.self.loanRepaymentActions);
    $('#LoanRepaymentForm').off('submit');
    $('#LoanRepaymentForm').on('submit', LoanHandler.self.submit_repay_loan);
    $('#loan_repayment_transactionPaymentPaymentType').off('change');
    $('#loan_repayment_transactionPaymentPaymentType').on('change', LoanHandler.self.validate_payment_type);

    $("#loanRepaymentPanal .panel-heading").html(header_text);

    console.log(LoanHandler.self.loan);

    console.log(loan);
    LoanHandler.self.get_current_balance(loan);

    showContent($('#loanRepaymentPanal'));
    $(".mobile_money-details-panel").fadeOut();
    $(".banktransfer-details-panel").fadeOut();
    $(".cheque-details-panel").fadeOut();

    $("#loan_repayment_cheque_number").removeAttr("required");
    $("#loan_repayment_account_name").removeAttr("required");
    $("#loan_repayment_account_number").removeAttr("required");
    $("#loan_repayment_bank_name").removeAttr("required");
    $("#loan_repayment_branch_name").removeAttr("required");
    $("#loan_repayment_phone_number").removeAttr("required");

    $("#pay_installments").val("submit");
    $("#pay_installments").html("Make Repayment");

    $(".loan_repayment_currency_code").html("" + currencyCode);

    $('#_viewloan_details').off('click touch');

    $('#_viewloan_details').on('click touch', function () {
        LoanHandler.self.displayOneLoan(loan);
    });
    $("#loan_repayment_transactionamount").val("");
    $("#loan_repayment_transactionPaymentPaymentType").val("");
    clearFormValidators($('#LoanRepaymentForm'));
    registerKeyPressValidators($('#LoanRepaymentForm'));
};

LoanHandler.prototype.validate_payment_type = function () {

    var selcted_value = $(this).val();
    $(".mobile_money-details-panel").fadeOut();
    $(".banktransfer-details-panel").fadeOut();
    $(".cheque-details-panel").fadeOut();

    $("#loan_repayment_cheque_number").removeAttr("required");
    var containingFormGroup = $('#loan_repayment_cheque_number').parent().parent();
    var containingInputGroup = $('#loan_repayment_cheque_number').parent();
    clearElementValidator(containingFormGroup, containingInputGroup);

    $("#loan_repayment_account_name").removeAttr("required");
    containingFormGroup = $('#loan_repayment_account_name').parent().parent();
    containingInputGroup = $('#loan_repayment_account_name').parent();
    clearElementValidator(containingFormGroup, containingInputGroup);

    $("#loan_repayment_account_number").removeAttr("required");
    containingFormGroup = $('#loan_repayment_account_number').parent().parent();
    containingInputGroup = $('#loan_repayment_account_number').parent();
    clearElementValidator(containingFormGroup, containingInputGroup);

    $("#loan_repayment_bank_name").removeAttr("required");
    containingFormGroup = $('#loan_repayment_bank_name').parent().parent();
    containingInputGroup = $('#loan_repayment_bank_name').parent();
    clearElementValidator(containingFormGroup, containingInputGroup);


    $("#loan_repayment_branch_name").removeAttr("required");
    containingFormGroup = $('#loan_repayment_branch_name').parent().parent();
    containingInputGroup = $('#loan_repayment_branch_name').parent();
    clearElementValidator(containingFormGroup, containingInputGroup);

    $("#loan_repayment_phone_number").removeAttr("required");
    containingFormGroup = $('#loan_repayment_phone_number').parent().parent();
    containingInputGroup = $('#loan_repayment_phone_number').parent();
    clearElementValidator(containingFormGroup, containingInputGroup);


    switch (selcted_value) {
        case 'CASH':

            break;
        case 'CHEQUE':
            $(".cheque-details-panel").fadeIn();
            $("#loan_repayment_cheque_number").attr("required", "required");
            containingFormGroup = $('#loan_repayment_cheque_number').parent().parent();
            containingInputGroup = $('#loan_repayment_cheque_number').parent();
            if ($("#loan_repayment_cheque_number").val().length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide a cheque number");
            }
            break;
        case 'MOBILE_MONEY':
            $(".mobile_money-details-panel").fadeIn();
            $("#loan_repayment_phone_number").attr("required", "required");
            containingFormGroup = $('#loan_repayment_phone_number').parent().parent();
            containingInputGroup = $('#loan_repayment_phone_number').parent();
            console.log('check phone number size ' + $("#loan_repayment_phone_number").val().length);
            if ($("#loan_repayment_phone_number").val().length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide a phone number number");
            }
            break;
        case 'BANK_TRANSFER':
            $(".banktransfer-details-panel").fadeIn();
            $("#loan_repayment_account_name").attr("required", "required");
            containingFormGroup = $('#loan_repayment_account_name').parent().parent();
            containingInputGroup = $('#loan_repayment_account_name').parent();
            console.log('check ac name size ' + $("#loan_repayment_account_name").val().length);
            if ($("#loan_repayment_account_name").val().length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide an account name");
            }
            $("#loan_repayment_account_number").attr("required", "required");
            containingFormGroup = $('#loan_repayment_account_number').parent().parent();
            containingInputGroup = $('#loan_repayment_account_number').parent();
            console.log('check ac number size ' + $("#loan_repayment_account_number").val().length);
            if ($("#loan_repayment_account_number").val().length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide an account number");
            }
            $("#loan_repayment_bank_name").attr("required", "required");
            containingFormGroup = $('#loan_repayment_bank_name').parent().parent();
            containingInputGroup = $('#loan_repayment_bank_name').parent();
            console.log('check bank name size ' + $("#loan_repayment_bank_name").val().length);
            if ($("#loan_repayment_bank_name").val().length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide a bank name");
            }
            $("#loan_repayment_branch_name").attr("required", "required");
            containingFormGroup = $('#loan_repayment_branch_name').parent().parent();
            containingInputGroup = $('#loan_repayment_branch_name').parent();
            console.log('check branch name size ' + $("#loan_repayment_branch_name").val().length);
            if ($("#loan_repayment_branch_name").val().length < 1) {
                validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please provide a branch name");
            }
            break;

        default:
            $("#loan_repayment_cheque_number").removeAttr("required");
            $("#loan_repayment_account_name").removeAttr("required");
            $("#loan_repayment_account_number").removeAttr("required");
            $("#loan_repayment_bank_name").removeAttr("required");
            $("#loan_repayment_branch_name").removeAttr("required");
            $("#loan_repayment_phone_number").removeAttr("required");
            break;
    }
    registerKeyPressValidators($('#LoanRepaymentForm'));
    //showFadingMessage(selcted_value);
};

LoanHandler.prototype.submit_repay_loan = function (event) {
    event.preventDefault();
    console.log('loan repayment : ' + validateForm($('#LoanRepaymentForm')));
    if (validateForm($('#LoanRepaymentForm'))) {
        if ($('#loan_repayment_phone_number').val().length > 0) {
            showLoader('Validating Phone Number');
            validatePhoneInput(('#loan_repayment_phone_number'), function () {
                //function called on success of valid phone validation
                hideLoader();
                var confirmDialogHeader = 'Confirm Loan Repayment';
                var loanOwnersName = $('#loan_repayment_clientname').val().length > 0 ? $('#loan_repayment_clientname').val() : $("#loan_repayment_groupname").val();
                var confirmDialogBody = 'Are you sure you want to repay ' + loanOwnersName + '\'s loan ?';
                var confirmDialogPositiveText = 'Yes';
                var confirmDialogNegativeText = 'No';
                showDialogPopupWithHandlers(confirmDialogHeader
                        , confirmDialogBody
                        , confirmDialogPositiveText
                        , function ()
                        {
                            //yes repay loan
                            console.log('valid repayment form');
                            var formEl = $(this);
                            var submitButton = $('input[type=submit]', formEl);
                            var client_name = $('#loan_repayment_clientname').val();
                            var birthdate = $('#loan_repayment_clientdatebirth').val();
                            var due_date = $('#loan_repayment_nextDueDate').val();
                            var next_installment = $('#loan_repayment_nextInstallment_due').val();
                            var repayment_date = $('#loan_repayment_installmentDate').val();
                            var payment_type = $('#loan_repayment_transactionPaymentPaymentType').val();
                            var transaction_amount = removeCommas($("#loan_repayment_transactionamount").val());
                            /*
                             * Though We DOnt Submit the CLient Name Birth Date Due Date Next Installment, its important
                             * to see that they are not empty
                             */
                            //client_name.length <= 0  || birthdate.length <= 0 ||
                            if (due_date.length <= 0 || next_installment.length <= 0) {
                                showAlertMessage("Fill Blanks ", AlertTypes.warning);
                                return;
                            }
                            if (repayment_date <= 0 || payment_type <= 0 || transaction_amount <= 0) {
                                showAlertMessage()("Fill Blanks", AlertTypes.warning);
                                return;
                            }
                            var original_loan = LoanHandler.self.loan;
                            var loan_principal = LoanHandler.self.loan.transactionList.principal;
                            var loan_interest = LoanHandler.self.loan.transactionList.interestRate;
                            var current_loan_balance = LoanHandler.self.get_current_balance(original_loan);
                            transaction_amount = removeCommas(transaction_amount);
                            var original_transaction_amount = transaction_amount;
                            transaction_amount = transaction_amount * 100;
                            var selectedDate = selecteDate;
                            var d = $("#loan_repayment_installmentDate").datepicker("getDate");
                            d.setHours(0);
                            selectedDate = d.getTime();
                            var today = new Date();
                            if (selectedDate > today.getTime()) {
                                showAlertMessage("Repayment Date Cant not be breater than Today ", AlertTypes.warning);
                                return;
                            }
                            var payment_options;
                            switch (payment_type) {
                                case 'CASH':
                                    payment_options = '{"paymentType" : "CASH"}';
                                    break;
                                case 'CHEQUE':
                                    var cheque_number = $("#loan_repayment_cheque_number").val();
                                    if (cheque_number === undefined || cheque_number === '' || cheque_number.length <= 0) {
                                        showAlertMessage()("Enter Check Number", AlertTypes.warning);
                                        return;
                                    }
                                    payment_options = '{"paymentType" : "CHEQUE","chequeNumber":"' + cheque_number + '"}';
                                    break;
                                case 'MOBILE_MONEY':
                                    var mobile_money = $("#loan_repayment_phone_number").val();
                                    if (mobile_money === undefined || mobile_money === '' || mobile_money.length <= 0) {
                                        showAlertMessage("Enter Mobile Money  Number", AlertTypes.warning);
                                        return;
                                    }
                                    payment_options = '{"paymentType" : "MOBILE_MONEY","phoneNumber":"' + mobile_money + '"}';
                                    break;
                                case 'BANK_TRANSFER':
                                    var account_name = $("#loan_repayment_account_name").val();
                                    var account_number = $("#loan_repayment_account_number").val();
                                    var bank_name = $("#loan_repayment_bank_name").val();
                                    var branch_name = $("#loan_repayment_branch_name").val();
                                    if (account_name.length <= 0 || account_number.length <= 0 || bank_name.length <= 0 || branch_name.length <= 0 || account_name === undefined || account_number === undefined || bank_name === undefined) {
                                        showAlertMessage("Enter Account Details", AlertTypes.warning);
                                        return;
                                    }
                                    payment_options = '{"paymentType" : "BANK_TRANSFER","accountName":"' + account_name + '" ,"accountNumber":"' + account_number + '" ,"bankName":"' + bank_name + '" ,"bankBranch":"' + branch_name + '"}';
                                    break;
                                default:
                                    break;
                            }
                            var body = '{"transactionAmount":"' + transaction_amount + '","installmentDate":"' + selectedDate + '","transactionPayment":' + payment_options + '}';
                            console.log(body);
                            var headers = getAuthenticationHeader();
                            console.log(headers);
                            var $body = $("body");
                            $.ajax({
                                url: host + '/loan/v1d/' + LoanHandler.self.loan.loanId + '/repay',
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
                                    document.getElementById("userCreationForm").reset();
                                    $("#loan_repayment_transactionamount").val("");
                                    $("#loan_repayment_transactionPaymentPaymentType").val("").trigger("change");
                                    $("#pay_installments").val("submit");
                                    $("#pay_installments").html("Make Repayment");
                                    // Reset Form::
                                    //Custom Functions that you can call
                                    $('.loanRepaymentPanal').find('input:text').val('');
                                    $("#pay_installments").fadeOut('fast');
                                    $("#back_to_single_loan").fadeOut('fast');
                                    showLoader("Updating Lists ");
                                    loanList.loadOne(LoanHandler.self.loan.loanId, function (response) {
                                        //  put: function (self, entity, callback, callbackArgs) {
                                        showAlertMessage("Record Saved Successfully", AlertTypes.success);
                                        loanList.put(loanList, response, function () {
                                            //  LoanHandler.self.loan.transactionList.push(transaction);
                                            $("#pay_installments").fadeIn('fast');
                                            $("#back_to_single_loan").fadeIn('fast');
                                            var _list = LoanHandler.self.getListByStatus("REPAYMENTDUE");
                                            LoanHandler.self.init_repayment_list();
                                            showAlertMessage("Record Saved Successfully", AlertTypes.success);
                                        });
                                    });
                                },
                                complete: function () {
                                    //   showFadingMessage("complete");
                                    //hideLoader();
                                    submitButton.prop('disabled', false);
                                    selecteDate = null;
                                }
                            }).fail(function (Response) {
                                console.log(Response);
                                console.log("Response ");
                                console.log(Response.status);
                                hideLoader();
                                if (Response.status === 403) {
                                    showAlertMessage("An error occured while making this repayment, Please try again or contact the awamo support team", AlertTypes.danger);
                                } else if (Response.status === 404) {
                                    showAlertMessage("Awamo Servers Not Reacheable,Please Check Your Internet Connectivity and try again", AlertTypes.danger);
                                } else {
                                    showAlertMessage("An error occured while making this repayment, Please try again or contact the awamo support team", AlertTypes.danger);
                                }
                            });
                        }
                , confirmDialogNegativeText
                        , function ()
                        {
                            //no dont repay loan

                        });
            },
                    function () {
                        //function called on failed of valid phone2 validation
                        hideLoader();
                        showAlertMessage("Invalid Phone number", AlertTypes.danger);
                    });
        } else {
            console.log('valid repayment form');
            var that = this;
            var confirmDialogHeader = 'Confirm Loan Repayment';
            var loanOwnersName = $('#loan_repayment_clientname').val().length > 0 ? $('#loan_repayment_clientname').val() : $("#loan_repayment_groupname").val();
            var confirmDialogBody = 'Are you sure you want to repay ' + loanOwnersName + '\'s loan ?';
            var confirmDialogPositiveText = 'Yes';
            var confirmDialogNegativeText = 'No';
            showDialogPopupWithHandlers(confirmDialogHeader
                    , confirmDialogBody
                    , confirmDialogPositiveText
                    , function ()
                    {
                        //yes repay loan
                        var formEl = $(that);
                        var submitButton = $('input[type=submit]', formEl);
                        var client_name = $('#loan_repayment_clientname').val();
                        var birthdate = $('#loan_repayment_clientdatebirth').val();
                        var due_date = $('#loan_repayment_nextDueDate').val();
                        var next_installment = $('#loan_repayment_nextInstallment_due').val();
                        var repayment_date = $('#loan_repayment_installmentDate').val();
                        var payment_type = $('#loan_repayment_transactionPaymentPaymentType').val();
                        var transaction_amount = $("#loan_repayment_transactionamount").val();
                        /*
                         * Though We DOnt Submit the CLient Name Birth Date Due Date Next Installment, its important
                         * to see that they are not empty
                         */
                        //client_name.length <= 0  || birthdate.length <= 0 ||
                        if (due_date.length <= 0 || next_installment.length <= 0) {
                            showAlertMessage("Fill Blanks ", AlertTypes.warning);
                            return;
                        }
                        if (repayment_date <= 0 || payment_type <= 0 || transaction_amount <= 0) {
                            showAlertMessage()("Fill Blanks", AlertTypes.warning);
                            return;
                        }
                        var original_loan = LoanHandler.self.loan;
                        var loan_principal = LoanHandler.self.loan.transactionList.principal;
                        var loan_interest = LoanHandler.self.loan.transactionList.interestRate;
                        var current_loan_balance = LoanHandler.self.get_current_balance(original_loan);
                        transaction_amount = removeCommas(transaction_amount);
                        var original_transaction_amount = transaction_amount;
                        transaction_amount = transaction_amount * 100;
                        var selectedDate = selecteDate;
                        var d = $("#loan_repayment_installmentDate").datepicker("getDate");
                        d.setHours(0);
                        selectedDate = d.getTime();
                        var today = new Date();
                        if (selectedDate > today.getTime()) {
                            showAlertMessage("Repayment Date Cant not be breater than Today ", AlertTypes.warning);
                            return;
                        }
                        var payment_options;
                        switch (payment_type) {
                            case 'CASH':
                                payment_options = '{"paymentType" : "CASH"}';
                                break;
                            case 'CHEQUE':
                                var cheque_number = $("#loan_repayment_cheque_number").val();
                                if (cheque_number === undefined || cheque_number === '' || cheque_number.length <= 0) {
                                    showAlertMessage()("Enter Check Number", AlertTypes.warning);
                                    return;
                                }
                                payment_options = '{"paymentType" : "CHEQUE","chequeNumber":"' + cheque_number + '"}';
                                break;
                            case 'MOBILE_MONEY':
                                var mobile_money = $("#loan_repayment_phone_number").val();
                                if (mobile_money === undefined || mobile_money === '' || mobile_money.length <= 0) {
                                    showAlertMessage("Enter Mobile Money  Number", AlertTypes.warning);
                                    return;
                                }
                                payment_options = '{"paymentType" : "MOBILE_MONEY","phoneNumber":"' + mobile_money + '"}';
                                break;
                            case 'BANK_TRANSFER':
                                var account_name = $("#loan_repayment_account_name").val();
                                var account_number = $("#loan_repayment_account_number").val();
                                var bank_name = $("#loan_repayment_bank_name").val();
                                var branch_name = $("#loan_repayment_branch_name").val();
                                if (account_name.length <= 0 || account_number.length <= 0 || bank_name.length <= 0 || branch_name.length <= 0 || account_name === undefined || account_number === undefined || bank_name === undefined) {
                                    showAlertMessage("Enter Account Details", AlertTypes.warning);
                                    return;
                                }
                                payment_options = '{"paymentType" : "BANK_TRANSFER","accountName":"' + account_name + '" ,"accountNumber":"' + account_number + '" ,"bankName":"' + bank_name + '" ,"bankBranch":"' + branch_name + '"}';
                                break;
                            default:
                                break;
                        }
                        var body = '{"transactionAmount":"' + transaction_amount + '","installmentDate":"' + selectedDate + '","transactionPayment":' + payment_options + '}';
                        console.log(body);
                        var headers = getAuthenticationHeader();
                        console.log(headers);
                        var $body = $("body");
                        $.ajax({
                            url: host + '/loan/v1d/' + LoanHandler.self.loan.loanId + '/repay',
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
                                document.getElementById("userCreationForm").reset();
                                $("#loan_repayment_transactionamount").val("");
                                $("#loan_repayment_transactionPaymentPaymentType").val("").trigger("change");
                                $("#pay_installments").val("submit");
                                $("#pay_installments").html("Make Repayment");
                                // Reset Form::
                                //Custom Functions that you can call
                                $('.loanRepaymentPanal').find('input:text').val('');
                                $("#pay_installments").fadeOut('fast');
                                $("#back_to_single_loan").fadeOut('fast');
                                showLoader("Updating Lists ");
                                loanList.loadOne(LoanHandler.self.loan.loanId, function (response) {
                                    //  put: function (self, entity, callback, callbackArgs) {
                                    showAlertMessage("Record Saved Successfully", AlertTypes.success);
                                    loanList.put(loanList, response, function () {
                                        //  LoanHandler.self.loan.transactionList.push(transaction);
                                        $("#pay_installments").fadeIn('fast');
                                        $("#back_to_single_loan").fadeIn('fast');
                                        var _list = LoanHandler.self.getListByStatus("REPAYMENTDUE");
                                        LoanHandler.self.init_repayment_list();
                                        showAlertMessage("Record Saved Successfully", AlertTypes.success);
                                    });
                                });
                            },
                            complete: function () {
                                //   showFadingMessage("complete");
                                //hideLoader();
                                submitButton.prop('disabled', false);
                                selecteDate = null;
                            }
                        }).fail(function (Response) {
                            console.log(Response);
                            console.log("Response ");
                            console.log(Response.status);
                            hideLoader();
                            if (Response.status === 403) {
                                showAlertMessage("An error occured while making this repayment, Please try again or contact the awamo support team", AlertTypes.danger);
                            } else if (Response.status === 404) {
                                showAlertMessage("Awamo Servers Not Reacheable,Please Check Your Internet Connectivity and try again", AlertTypes.danger);
                            } else {
                                showAlertMessage("An error occured while making this repayment, Please try again or contact the awamo support team", AlertTypes.danger);
                            }
                        });
                    }
            , confirmDialogNegativeText
                    , function ()
                    {
                        //no dont repay loan

                    });
        }
    } else {
        showAlertMessage('Please fill in all the fields correctly', AlertTypes.danger);
    }
};

LoanHandler.prototype.get_current_balance = function (loan) {


    var repayamentListCount = loan.repaymentSchedule.rows.length;
    var pendingInstallments = [];
    var dueDates = [];

    for (var i = 0; i < repayamentListCount; i++) {
        // if outstanding balance > 0 :  jump::
        if (loan.repaymentSchedule.rows[i].outstanding === 0)
            continue;
        // Due date Not Set
        if (loan.repaymentSchedule.rows[i].dueDate === -1)
            continue;

        pendingInstallments.push(loan.repaymentSchedule.rows[i]);
        dueDates.push(loan.repaymentSchedule.rows[i].dueDate);

    }

    // Sort to get date
    dueDates.sort();

    console.log("Due Dates ");
    console.log(dueDates);


    console.log("Panding Installments");
    console.log(pendingInstallments);


    var repayment_index = 0;

    var x = 0;
    while (x < pendingInstallments.length) {
        if (dueDates[0] === pendingInstallments[x].dueDate) {
            repayment_index = x;
            break;
        }
        x++;
    }



    //get required balance
    var currentDate = new Date().getTime();
    var requiredBalance = formatCurrency((pendingInstallments[repayment_index].outstanding > 0) ? (pendingInstallments[repayment_index].due - pendingInstallments[repayment_index].paid) : pendingInstallments[repayment_index].due);
    var rows = loan.repaymentSchedule.rows;
    var len = rows.length;
    var dueDate = formatDate(pendingInstallments[repayment_index].dueDate);


    return {'dueDate': dueDate, 'requiredBalance': requiredBalance};

};

LoanHandler.prototype.approveApplication = function () {
    LoanHandler.self.loan.status = 'APPROVED';
    showLoader(' Approving Loan Application Please wait...');
    ajax(LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/approve', 'POST', LoanHandler.prototype.approveApplicationSuccessful, null, undefined, function (err) {
        hideLoader();
        console.log(err);
        manageErors(err)
    });
};
LoanHandler.prototype.fetchLoanStatus = function (callback) {
    var headers = getAuthenticationHeader();
    console.log(headers);
    var uri = host + LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/status';
    $.ajax({
        url: uri,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'GET',
        beforeSend: function () {
            showLoader('  Contacting server for loan status, please wait...');
        },
        success: function (response) {
            console.log(response)
            hideLoader();
            callback(response)
        }
    }).fail(function (Response) {
        hideLoader();
        showAlertMessage('An error occured while attempting to retrieve the loan status, Please try again', AlertTypes.danger);
    });
    //    ajax(LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/status', 'GET', function (response)
    //    {
    //
    //    }, null, undefined, function (err)
    //    {
    //        hideLoader();
    //        showAlertMessage('An error occured while attempting to retrieve the loan status, Please try again', AlertTypes.danger);
    //        console.log(err);
    //    }, function ()
    //    {
    //        showAlertMessage('An error occured while attempting to retrieve the loan status, Please try again', AlertTypes.danger);
    //        hideLoader();
    //    });
}
LoanHandler.prototype.approveApplicationSuccessful = function () {
    hideLoader();
    showAlertMessage('The loan has been approved successfully', AlertTypes.success);
    LoanHandler.self.loan.status = 'APPROVED';
    loanList.put(loanList, LoanHandler.self.loan);
    LoanHandler.prototype.getApplications();
};

LoanHandler.prototype.approveApplicationWithChanges = function () {
    if (validateForm($('#loanApplicationForm'))) {
        LoanHandler.self.fetchLoanStatus(function (response) {
            if (exists(response)) {
                console.log(response)
                if (response === 'SUBMITTED') {
                    var confirmDialogHeader = 'Confirm Loan Approval With Changes';
                    var confirmDialogBody = 'Are you sure you wish to approve this loan with the provided changes';
                    var confirmDialogPositiveText = 'Confirm';
                    var confirmDialogNegativeText = 'Cancel';
                    showDialogPopupWithHandlers(confirmDialogHeader
                            , confirmDialogBody
                            , confirmDialogPositiveText
                            , function () {
                                //yes approve with modifications
                                var changedLoan = {
                                    "loanId": LoanHandler.self.loan.loanId,
                                    "principal": unformatCurrency($('#principal').val()),
                                    "duration": $('#duration').val(),
                                    "amortizationType": $('#amortization').val(),
                                    "numberOfRepayments": $('#repayments').val(),
                                    "interestRate": unformatPercentage($('#interestRate').val()),
                                    "interestType": $('#interestType').val(),
                                    "interestCalculationPeriodType": $('#interestCalculationPeriodType').val()
                                };
                                showLoader(' Approving with changes, please wait...');
                                console.log('changedLoanBody');
                                console.log(JSON.stringify(changedLoan));
                                //var loanUrl = "http://localhost:9090/loan/v1d/modifyOnApproval";
                                //var loanUrl = LoanHandler.ROOT_PATH + 'modifyOnApproval';
                                ajax(LoanHandler.ROOT_PATH + 'modifyOnApproval', 'PUT',
                                        //ajaxLocal(loanUrl, 'PUT',
                                                function () {
                                                    LoanHandler.prototype.approveApplicationWithChangesSuccessful(changedLoan);
                                                },
                                                JSON.stringify(changedLoan),
                                                undefined,
                                                function (XMLHttpRequest, statusText, err) {
                                                    hideLoader();
                                                    showAlertMessage('Approving Loan with modifications failed, with error: ' + err, AlertTypes.danger);
                                                    manageErrors(err);

                                                },
                                                function (XMLHttpRequest, statusText, err) {
                                                    hideLoader();
                                                }); /**/
                                    }
                            , confirmDialogNegativeText
                                    , function () {
                                        //no dont approve with modifications
                                    });
                        } else {
                    hideLoader();
                    showAlertMessage('Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                    if (response && LoanHandler.self.isValidResponse(response)) {
                        LoanHandler.self.loan.status = response;
                        loanList.put(loanList, LoanHandler.self.loan);
                        ActionRequiredHandler.prototype._dataModelChanged()
                        LoanHandler.self.getApplications();
                    } else {
                        loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                            hideLoader();
                            loanList.put(loanList, loan);
                            ActionRequiredHandler.prototype._dataModelChanged()
                            LoanHandler.self.getApplications();
                        })
                    }
                }
            }
        })
    } else {
        showAlertMessage('Please ensure all the fields are filled in correctly', AlertTypes.danger);
    }
};

LoanHandler.prototype.approveApplicationWithChangesSuccessful = function (changedLoan) {
    showAlertMessage('The loan has been approved with modifications successfully', AlertTypes.success);
    LoanHandler.self.loan.status = 'APPROVED_WITH_MODIFICATIONS';
    LoanHandler.self.loan.principal = changedLoan.principal;
    LoanHandler.self.loan.duration = changedLoan.duration;
    LoanHandler.self.loan.amortizationType = changedLoan.amortizationType;
    LoanHandler.self.loan.numberOfRepayments = changedLoan.numberOfRepayments;
    LoanHandler.self.loan.interestRate = changedLoan.interestRate;
    LoanHandler.self.loan.interestType = changedLoan.interestType;
    LoanHandler.self.loan.interestCalculationPeriodType = changedLoan.interestCalculationPeriodType;
    loanList.put(loanList, LoanHandler.self.loan);
    ActionRequiredHandler.prototype._dataModelChanged();
    LoanHandler.prototype.getApplications();
    hideLoader();
};

LoanHandler.prototype.approveApplicationWithChangesFailed = function (changedLoan) {
    showAlertMessage('The operation to approve the loan failed, Please try again', AlertTypes.danger);
    hideLoader();
};

LoanHandler.prototype.rejectApplication = function () {
    var uri = LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/reject';
    var body = {};
    if (exists(LoanHandler.rejectNote)) {
        body = '{"note":"' + LoanHandler.rejectNote + '"}';
    } else {
        body = '{"note":"' + $('#rejectionNote').val() + '"}';
    }

    showLoader(' Rejecting loan,please wait...');
    ajax(uri, 'POST', LoanHandler.prototype.rejectApplicationSuccessful, body);
};

LoanHandler.prototype.rejectApplicationSuccessful = function () {
    hideLoader();
    showAlertMessage('The loan has been rejected successfully', AlertTypes.success);
    LoanHandler.self.loan.status = 'REJECTED';
    loanList.put(loanList, LoanHandler.self.loan);
    ActionRequiredHandler.prototype._dataModelChanged();
    LoanHandler.prototype.getApplications();
};

LoanHandler.prototype.confirmContractSigned = function () {
    var uri = LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/confirmContractSigned';
    showLoader(' Confirming loan contract, please wait...');
    ajax(uri, 'POST', LoanHandler.prototype.confirmContractSignedSuccessful, null, undefined, function (XMLHttpRequest, statusText, err) {
        hideLoader();
        manageErrors(err)
        showAlertMessage('Failed to sign the loan contract, please try again, if the problem persists, contact support', AlertTypes.danger);
    }, function (XMLHttpRequest, statusText, err) {

    });
};

LoanHandler.prototype.handleAcceptModificationsAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            console.log(response)
            console.log(response === 'APPROVED_WITH_MODIFICATIONS');
            if (response === 'APPROVED_WITH_MODIFICATIONS') {
                var confirmDialogHeader = 'Accept Loan Modifications';
                var confirmDialogBody = 'Please confirm that you want to accept the changes made to this loan Application';
                var confirmDialogPositiveText = 'Confirm';
                var confirmDialogNegativeText = 'Cancel';
                showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, LoanHandler.prototype.handleSubmitAcceptModificationsAction, confirmDialogNegativeText, LoanHandler.prototype.handleCancelSubmitModificationsAction);
            } else {
                hideLoader();
                showAlertMessage('Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    LoanHandler.self.loan.status = response;
                    loanList.put(loanList, LoanHandler.self.loan);
                    ActionRequiredHandler.prototype._dataModelChanged()
                    LoanHandler.self.getSingngContracts();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        ActionRequiredHandler.prototype._dataModelChanged()
                        LoanHandler.self.getSingngContracts();
                    })
                }
            }
        }
    })
};

LoanHandler.prototype.handleWithdrawLoanApplicationAction = function () {
    LoanHandler.self.fetchLoanStatus(function (response) {
        if (exists(response)) {
            console.log(response)
            if (response === 'APPROVED_WITH_MODIFICATIONS') {
                var confirmDialogHeader = 'Withdraw Loan Modifications';
                var confirmDialogBody = 'Please confirm that you want to withdraw this loan Application';
                var confirmDialogPositiveText = 'Confirm';
                var confirmDialogNegativeText = 'Cancel';
                showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, LoanHandler.prototype.handleSubmitWithdrawLoanApplication, confirmDialogNegativeText, LoanHandler.prototype.handleCancelWithdrawLoanApplicationAction);
            } else {
                hideLoader();
                showAlertMessage('Loan with id: ' + LoanHandler.self.loan.loanId + LoanHandler.self.buildLoanActionMessage(response), AlertTypes.warning);
                if (response && LoanHandler.self.isValidResponse(response)) {
                    LoanHandler.self.loan.status = response;
                    loanList.put(loanList, LoanHandler.self.loan);
                    ActionRequiredHandler.prototype._dataModelChanged()
                    LoanHandler.self.getSingngContracts();
                } else {
                    loanList.loadOne(LoanHandler.self.loan.loanId, function (loan) {
                        hideLoader();
                        loanList.put(loanList, loan);
                        LoanHandler.self.getSingngContracts();
                    })
                }
            }
        }
    })
};

LoanHandler.prototype.handleSubmitWithdrawLoanApplication = function () {
    var headers = getAuthenticationHeader();
    var uri = host + LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/withdraw';
    $.ajax({
        url: uri,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function () {
            showLoader();
        },
        success: function (data) {
            LoanHandler.self.loan.status = 'WITHDRAWN';
            loanList.put(loanList, LoanHandler.self.loan);
            showAlertMessage('Loan changes accepted successfully', AlertTypes.success);
            LoanHandler.prototype.getSingngContracts();
            hideLoader();
        }
    }).fail(function (Response) {
        showAlertMessage('Loan changes not accepted successfully', AlertTypes.danger);
        hideLoader();
    });
};

LoanHandler.prototype.handleSubmitAcceptModificationsAction = function () {
    var headers = getAuthenticationHeader();
    var uri = host + LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/acceptModification';
    console.log('uri');
    console.log(uri);
    $.ajax({
        url: uri,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        headers: headers,
        type: 'POST',
        beforeSend: function () {
            showLoader();
        },
        success: function (data) {
            $('#loanActionsAcceptModificationsBtn').hide();
            $('#loanActionsWithdrawApplicationBtn').hide();
            $('#loanActionsConfirmContractSignedBtn').show();
            $('#loanActionsBackBtn').show();
            LoanHandler.self.loan.status = 'APPROVED';
            loanList.put(loanList, LoanHandler.self.loan);
            ActionRequiredHandler.prototype._dataModelChanged();
            hideLoader();
            showAlertMessage('Loan changes accepted successfully', AlertTypes.success);
        }
    }).fail(function (Response) {
        showAlertMessage('Loan changes not accepted successfully', AlertTypes.danger);
        hideLoader();
    });
}

LoanHandler.prototype.handleCancelSubmitModificationsAction = function () {

};

LoanHandler.prototype.handleCancelWithdrawLoanApplicationAction = function () {

};

LoanHandler.prototype.confirmContractSignedSuccessful = function () {
    hideLoader();
    showAlertMessage('Operation successful, loan contract has been confirmed signed', AlertTypes.success);
    LoanHandler.self.loan.status = 'CONTRACT_SIGNED';
    //loanList.put(loanList, LoanHandler.self.loan);
    loanList.store(LoanHandler.self.loan);
    ActionRequiredHandler.prototype._dataModelChanged();
    LoanHandler.prototype.getSingngContracts();

};

LoanHandler.prototype.allowDisbursement = function () {
    var uri = LoanHandler.ROOT_PATH + LoanHandler.self.loan.loanId + '/allowDisbursement';
    showLoader(' Allowing a disbursement, please wait...');
    ajax(uri, 'POST', LoanHandler.prototype.allowDisbursementSuccessful);
};

LoanHandler.prototype.allowDisbursementSuccessful = function () {
    hideLoader();
    showAlertMessage('Operation successful, loan disbursement has been allowed', AlertTypes.success);
    LoanHandler.self.loan.status = 'AWAITING_DISBURSEMENT';
    loanList.store(LoanHandler.self.loan);
    ActionRequiredHandler.prototype._dataModelChanged();
    LoanHandler.prototype.getDisbursements();
};

LoanHandler.prototype.backToDisplayOneLoan = function () {
    LoanHandler.self.displayOneLoan(LoanHandler.self.loan);
};

LoanHandler.prototype.dataChangedHandler = function () {
    //    $('#singleActions a[data-action="approveWithChanges"]').show();
    clearFormValidators($('#loanApplicationForm'));
    registerKeyPressValidators($('#loanApplicationForm'));
    $('#loanActionsApproveWithChangesBtn').show();
    //    $('#singleActions a[data-action="resetChanges"]').show();
    $('loanActionsResetBtn').show();
    //    $('#singleActions a[data-action="approve"]').hide();
    $('#loanActionsApproveBtn').hide();
};

LoanHandler.prototype.dataModelChanged = function () {
    // noop
};

LoanHandler.prototype.loanEntityChanged = function (object, type) {
    switch (type) {
        case eventtype.CREATE:
        case eventtype.UPDATE:
            LoanHandler.self.outputLoan(object);
            break;
        case eventtype.DELETE:
            // TODO
            console.log('not yet implemented: loan entity [' + object.mainId + '] deleted');
            break;
        default:
            break;
    }
};

LoanHandler.prototype.clientEntityChanged = function (object, type) {
    switch (type) {
        case eventtype.CREATE:
            // TODO
            console.log('not yet implemented: client entity [' + object.mainId + ']created');
            break;
        case eventtype.UPDATE:
            console.log('not yet implemented: client entity[' + object.mainId + '] updated');
            // TODO
            break;
        case eventtype.DELETE:
            console.log('not yet implemented: client entity [' + object.mainId + '] deleted');
            // TODO
            break;
        default:
            break;
    }
};

LoanHandler.prototype.notifyClientListChanged = function (client) {
    // TODO, update table column 2 (image), when it has been loaded lazily
};

LoanHandler.prototype.printRepaymentSchedule = function () {
    // TODO: needs more work when spanning over more than one page
    var loan = LoanHandler.self.loan;
    var date = formatLocalDate(new Date());
    var header = '\n\
	<p style="text-align: right; width: 100%;">awamo360 Cockpit - ' + date + '</p>\n\
';

    var loanDetails = '<br>\n\<br>\n\
		<table>\n\
			<thead>\n\
				<tr>\n\
					<th colspan="5" style="text-align: left;">\n\
						Loan #' + loan.loanId + '\n\
					</th>\n\
				</tr>\n\
			</thead>\n\
			<tbody>\n\
				<tr>\n\
					<td>Client name</td>\n\
					<td style="width: 616px; text-align: left;">' + loan.clientName + '</td>\n\
				</tr>\n\
				<tr>\n\
					<td>Status</td>\n\
					<td style="width: 616px; text-align: left;">' + loan.status + '</td>\n\
				</tr>\n\
				<tr>\n\
					<td>Interest rate p.a.</td>\n\
					<td style="width: 616px; text-align: left;">' + formatPercentage(loan.interestRate) + ' %</td>\n\
				</tr>\n\
				<tr>\n\
					<td>Principal</td>\n\
					<td style="width: 616px; text-align: left;">' + formatCurrency(loan.principal) + ' ' + currencyCode + '</td>\n\
				</tr>\n\
			</tbody>\n\
		</table>\n\
';
    var repaymentSchedule = $('#repaymentScheduleTableContainer').html();
    var $repaymentSchedule = $(repaymentSchedule).clone();
    $repaymentSchedule.find("tr:nth-child(2)").remove();
    $repaymentSchedule.find("td:nth-child(2)").css('font-weight', 'bold');

    var $lastCells = $repaymentSchedule.find("td:last-child");
    $.each($lastCells, function (cell) {
        var $cell = $($lastCells[cell]);
        var lastCellValue = $cell.text();
        if (!lastCellValue.startsWith('0')) {
            $cell.text('-' + lastCellValue);
        }
    });

    $repaymentSchedule.find('thead').prepend($('<tr>\n<th colspan="5" style="text-align: left;">Loan repayment schedule</th>\n</tr>\n'));
    repaymentSchedule = '<br><br><table>' + $repaymentSchedule.html() + '</table>\n';

    var myWindow = window.open("", "print repayment schedule", "width=800,height=1200", true);

    var css = '\n\
div {\n\
	width: 100%;\n\
	height: 95%;\n\
	margin-top: 20px;\n\
}\n\
\n\
table {\n\
	display: blocK;\n\
	margin-left: auto;\n\
	margin-right: auto;\n\
	border-collapse: collapse;\n\
	width: 770px;\n\
}\n\
\n\
table, th, td {\n\
	border: 1px solid black;\n\
	padding-left: 10px;\n\
	padding-right: 10px;\n\
	text-align: right;\n\
}\n\
\n\
td {\n\
	width: 154px;\n\
}\n\
\n\
button {\n\
	background-color: #ffc266;\n\
	border-color: #ffc266;\n\
	color: #333333;\n\
	outline: none;\n\
	outline-color: transparent;\n\
	text-decoration: none;\n\
	line-height: 20px;\n\
	padding: 15px 10px;\n\
	font-size: 14px;\n\
	font-weight: 400;\n\
	text-align: center;\n\
	border: 1px solid transparent;\n\
	border-radius: 4px;\n\
}\n\
\n\
button:hover {\n\
	background-color: #ff9900;\n\
	border-color: #ff9900;\n\
}\n\
\n\
@media print {\n\
	button {\n\
		display: none;\n\
	}\n\
}\n\
';
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    var printButton = '<br>\n<br>\n<button onClick="window.print();">Print repayment schedule</button>\n';
    var html = '<div class="content">' + header + loanDetails + repaymentSchedule + printButton + '</div>';

    myWindow.document.head.appendChild(style);
    $(myWindow.document.body).html(html);
};
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" other ">
LoanHandler.prototype.loanStatusFilter = function (status) {
    return function (loan) {
        return loan.status === status;
    };
};

LoanHandler.prototype.synchronizeNow = function () {
    loanList.reload();
};

LoanHandler.prototype.sendEmailLoanReportRequest = function () {
    // not using default ajax call here because user handling is done against a different endpoint
    var headers = {
        tenantId: tenantId
    };

    var uri = '/tenant/v1d/mis/reportEmail';
    var body = '{"startTime":"' + '0' +
            '","endTime":"' + '0' +
            '","reportEmailEntity":"' + "LOAN" +
            '","reportEmailType":"' + "ALL" +
            '","email":"' + $('#emailReportC').val() +
            '"}';
    ajax(uri, 'POST', LoanHandler.prototype.emailReportResponseHandler, body, headers, LoanHandler.prototype.emailReportFailedResponseHandler);

};

LoanHandler.prototype.emailReportResponseHandler = function (response) {
    message('Success',
            'Message Sent Successfully',
            MessageType.SUCCESS);
};

LoanHandler.prototype.emailReportFailedResponseHandler = function (response) {
    message('Error', response.responseJSON.message, MessageType.WARNING);
};

// </editor-fold>

function refreshDialer() {
    //showFadingMessage("In function");
    var container = document.getElementById("loanClientImageID");
    var content = container.innerHTML;
    //showFadingMessage(content);
    container.innerHTML = content;
}

LoanHandler.prototype.isPrePaid = function (loan) {
    if (!exists(loan) || !exists(loan.repaymentSchedule) || !exists(loan.repaymentSchedule.rows)) {
        console.log('no repaymentSchedule found on this loan');
        console.log(loan);
        console.log('---------------------------');
        return;
    }
    if (!exists(loan.transactionList)) {
        return;
    }
    //get current balance
    var lentransactionList = loan.transactionList.length;
    if (loan.transactionList.length > 0) {
        var transaction = loan.transactionList[0];
        var currentBalance = transaction['balance'];
    } else {
        false;
    }
    for (var i = 0; i < lentransactionList; i++) {
        var transaction = loan.transactionList[i];
        if (currentBalance > transaction['balance']) {
            var currentBalance = transaction['balance'];
        }
    }
    //get required balance
    var currentDate = new Date().getTime();
    var requiredBalance = loan.principal;
    var rows = loan.repaymentSchedule.rows;
    var len = rows.length;
    for (var i = 0; i < len; i++) {
        if (rows[i]['dueDate'] < currentDate) {
            if (rows[i]['balance'] < requiredBalance) {
                requiredBalance = rows[i]['balance'];
            }
        }
    }
    //decide
    if (currentBalance < requiredBalance) {
        return true;
    } else {
        return false;
    }
};

LoanHandler.prototype.fullyRepaid = function (loan) {

    if (!exists(loan.transactionList)) {
        return;
    }
    //get current balance
    for (var i = 0; i < loan.transactionList.length; i++) {
        var transaction = loan.transactionList[i];
        if (transaction['balance'] <= 0) {
            if (transaction['transactionDate'] < toLoanEndDateDateLimit && transaction['transactionDate'] > fromLoanEndDateDateLimit) {
                return true;
            }
        }
    }
    return false;
};

LoanHandler.prototype.getTotalRepayments = function (loan) {
    if (!exists(loan.transactionList)) {
        return 0;
    }
    //get current balance
    var total = 0;
    for (var i = 0; i < loan.transactionList.length; i++) {
        var transaction = loan.transactionList[i];
        if (transaction['transactionType'] === 'REPAYMENT') {

            console.log("Transaction Ammount");
            console.log(transaction['amount']);
            total = total + transaction['amount'];
        }
    }
    return total;
};

LoanHandler.prototype.getExpectedEndDate = function (loan) {

    if (!exists(loan) || !exists(loan.repaymentSchedule) || !exists(loan.repaymentSchedule.rows)) {
        console.log('no repaymentSchedule found on this loan');
        console.log(loan);
        console.log('---------------------------');
        return;
    }
    var rows = loan.repaymentSchedule.rows;
    var len = rows.length;
    for (var i = 0; i < len; i++) {
        if (rows[i]['balance'] === 0) {
            return rows[i]['dueDate'];
        }
    }
};

LoanHandler.prototype.hasPayment = function (loan) {

    if (!exists(loan) || !exists(loan.repaymentSchedule) || !exists(loan.repaymentSchedule.rows)) {
        console.log('no repaymentSchedule found on this loan');
        console.log(loan);
        console.log('---------------------------');
        return;
    }

    var rows = loan.repaymentSchedule.rows;
    var len = rows.length;
    for (var i = 0; i < len; i++) {
        if (rows[i]['dueDate'] < toRepaymentDateLimit && rows[i]['dueDate'] > fromRepaymentDateLimit) {
            return true;
        }
    }
    return false;
};

LoanHandler.prototype.getEndDate = function (loan) {

    if (!exists(loan.transactionList)) {
        return;
    }
    //get current balance
    for (var i = 0; i < loan.transactionList.length; i++) {
        var transaction = loan.transactionList[i];
        if (transaction['balance'] <= 0) {

            return transaction['transactionDate'];

        }
    }
    return '---';
};
