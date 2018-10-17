/* global handlers, user, loanList, clientList, currencyCode, doHistoryUpdate */

var DashboardHandler = function () {
    DashboardHandler.self = this;
    DashboardHandler.self.registerHandlers();
    loanList.addEntityChangedEventListenerCallback(DashboardHandler.prototype._entityChanged);
};

DashboardHandler.prototype.registerHandlers = function () {
    $('#dashboardArea button[data-target]').on('click touch', DashboardHandler.prototype.buttonHandler);
};

DashboardHandler.prototype.buttonHandler = function (event) {
    event.preventDefault();
    $('#' + $(this).data('target') + ' a').click();
};

/* external */
DashboardHandler.prototype.init = function () {
    handlers['Permissions'].init();
    $('.sidebar').show();
    var view_port = $(window).height() - 70;
    $('.sidebar').fadeIn();

    $('.main').show();
    handlers['Menu'].display_menu();
    $('#singleActions a[data-action]').on('click touch', function () {
        $("#messagebox").stop().slideUp(500);
    });
    handlers['Communication'].initData();
    statusbar('loading data');
    DashboardHandler.self.overview();
    showLoader("Loading data, Please wait...");
};

DashboardHandler.prototype.overview = function () {
    addHistory('Dashboard overview', '#dashboardOverview', '#dashboard');
    initDefaultContent('Dashboard');
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    if (handlers['Permissions'].check_access('_OVERVIEW'))
    {
        DashboardHandler.self.showOverview();
        //DashboardHandler.self.showLoanApplications();
        //DashboardHandler.self.showProfile();
        showContent($('#dashboardArea'));
    }
};

DashboardHandler.prototype.addLoan = function (loan) {
    var $row = null;
    if (loan.status === 'SUBMITTED') {
        var $rowContainer = $('#dashboardLoanApplications table tbody');
        $rowContainer.find('[data-id="' + loan.loanId + '"]').remove();
        var loanHandler = handlers['Loan'];
        var loanHandlerDefined = (typeof (loanHandler) !== 'undefined' && loanHandler !== null);
        var loanObj = {
            img: '<img src="images/personPlaceholderNoText.png" alt="" height="28" />',
            name: loan.clientName,
            date: formatDate(loan.disbursementDate),
            principal: formatCurrency(loan.principal) + ' ' + currencyCode,
            interest: formatPercentageShort(loan.interestRate) + '%',
            duration: loan.duration + 'd'
        };
        $row = addRow($rowContainer, loanObj, loanHandlerDefined ? loan : null, loanHandlerDefined ? loanHandler.rowClickHandler : null, loan.loanId);
        addClassToColumnOfTableRow($row, 1, 'image');
        if (exists(loan) && exists(loan.client)) {
            var client = loan.client;
            var clientImageEl = $('img', $row);
            if (exists(client.image)) {
                var src = 'data:image/jpeg;base64,' + client.image;
                clientImageEl.attr('src', src);
                clientImageEl.attr('height', '30px');
                clientImageEl.attr('width', '30px');
                $row.css('line-height', 0);
            }
        }
        //        addClassToColumnOfTableRow($row, 2, 'prefix');
    }
    return $row;
};

DashboardHandler.prototype.showOverview = function () {
    var $dashboardOverview = $('#dashboardOverview');

    DashboardHandler.self.loadOverviewReport('Clients');
    DashboardHandler.self.loadOverviewReport('LoanApplications');
    DashboardHandler.self.loadOverviewReport('SavingsAccounts');
    DashboardHandler.self.loadOverviewReport('ActiveSavingsAccounts');

    DashboardHandler.self.ClientActivityReport();

    DashboardHandler.self.OverviewReportSummary("outstanding_balance");
    DashboardHandler.self.OverviewReportSummary("new_loan_applications");
    DashboardHandler.self.OverviewReportSummary("total_active_loans");
    DashboardHandler.self.OverviewReportSummary("total_savings_derived");
    DashboardHandler.self.OverviewReportSummary("total_new_savings_accounts");
    // DashboardHandler.self.OverviewReportSummary("total_savings_accounts");


    showContent($dashboardOverview);
};


DashboardHandler.prototype.OverviewReportSummary = function (section) {
    switch (section) {
        case "outstanding_balance":
            ajax('/report/v1d/activeLoansReport', 'GET', function (report) {
                $("#dashboardOverviewReportTotalOutstandingLoansBalance .prefix").html("Total Outstanding (" + currencyCode + ")");
                $('#dashboardOverviewReportTotalOutstandingLoansBalance').find('td:last-child').html(numberWithCommas(report.count));

            });

            break;


        case "new_loan_applications":
            ajax('/report/v1d/newLoanApplicationsSummary', 'GET', function (report) {
                $('#dashboardOverviewReportTotalNewLoanApplications').find('td:last-child').html(numberWithCommas(report.count));

            });

            break;
        case "total_active_loans":
            ajax('/report/v1d/summaryActiveLoans', 'GET', function (report) {
                $('#dashboardOverviewReportTotalActiveLoans').find('td:last-child').html(numberWithCommas(report.count));

            });
            break;

        case "total_savings_derived":
            ajax('/report/v1d/totalSavings', 'GET', function (report) {
                $("#dashboardOverviewReportTotalSavingsAmount .prefix").html("Total Savings (" + currencyCode + ")");
                $('#dashboardOverviewReportTotalSavingsAmount').find('td:last-child').html(numberWithCommas(report.count));

            });
            break;

        case "total_savings_accounts":
            ajax('/report/v1d/totalSavingsAccounts', 'GET', function (report) {
                $('#dashboardOverviewReportActiveSavingsAccounts').find('td:last-child').html(numberWithCommas(report.count));

            });
            break;

        case "total_new_savings_accounts":
            ajax('/report/v1d/totalNewSavingsAccounts', 'GET', function (report) {
                $('#dashboardOverviewReportTotalNewSavingsAccounts').find('td:last-child').html(numberWithCommas(report.count));

            });
            break;

        default:

            break;
    }
};


DashboardHandler.prototype.ClientActivityReport = function () {
    ajax('/tenant/v1d/mis/clientActivityReport', 'GET', function (report) {
        $('#dashboardOverviewReportActiveClients').find('td:last-child').html(report.active);
        $('#dashboardOverviewReportPassiveClients').find('td:last-child').html(report.passive);
        $('#dashboardOverviewReporttotalClients').find('td:last-child').html(report.total);

    });
};

DashboardHandler.prototype.showLoanApplications = function () {
    currentTable = 'dashboardLoanApplications';

    var $table = $('#dashboardLoanApplications table');
    var $rowContainer = $table.find('tbody');
    $rowContainer.empty();
    loanList.getSubmittedLoanList().forEach(function (entry) {
        DashboardHandler.self.addLoan(entry);
    });

    addClassToTableColumn($table, 0, 'image');
    //    addClassToTableColumn($table, 1, 'prefix');
    showContent($('#dashboardArea'));
};

DashboardHandler.prototype.showProfile = function () {
    var $dashboardProfile = $('#dashboardProfile');
    $dashboardProfile.find('input[data-target]').each(function () {
        $(this).val(getTargetFromObject($(this), user));
    });
    showContent($dashboardProfile);
};

DashboardHandler.prototype._entityChanged = function (loan) {
    if ('dashboardLoanApplications' === currentTable) {
        DashboardHandler.self.addLoan(loan);
    }
};

DashboardHandler.prototype.loadOverviewReport = function (type) {
    ajax('/report/v1d/new' + type + 'Report', 'GET', function (dashboardOverviewReport) {
        console.log("The type on dashboard: ", type);
        // var text = type.split(/(?=[A-Z])/).join(' ').toLowerCase();
        var text = type.split(/(?=[A-Z])/).join(' ');
        var $row = $('#dashboardOverviewReportNew' + type);
        $row.empty();
        $row.append($('<td class="prefix">New ' + text + '</td>'));
        $row.append($('<td>' + dashboardOverviewReport.day + '</td>'));
        $row.append($('<td>' + dashboardOverviewReport.week + '</td>'));
        $row.append($('<td>' + dashboardOverviewReport.month + '</td>'));
        $row.append($('<td>' + dashboardOverviewReport.year + '</td>'));
        $row.on('click touch', DashboardHandler.prototype.overviewReportRowClickHandler);
    });
};

DashboardHandler.prototype.overviewReportRowClickHandler = function () {
    var id = $(this).attr('id').substr(26);
    var type = id.endsWith('Applications') ? 'Applications' : 'All';
    var handler = id.replace('Application', '').slice(0, -1);
    var link = $('li.subitem[data-handler="' + handler + '"][data-action="get' + type + '"] a');
    link.click();
};