/* global handlers, parseFloat, loanList, clientList, savingsAccountList, google, currencyCode, tenantId */
var currentChangedFil = "ALL";
var transactionsFromDate = "0";
var transactionsToDate = "999999999999999";

var ReportingHandler = function () {
    ReportingHandler.self = this;
    ReportingHandler.self.portFolioData = [];
    loanList.addDataModelChangedEventListenerCallback(ReportingHandler.prototype.dataModelChanged);
    savingsAccountList.addDataModelChangedEventListenerCallback(ReportingHandler.prototype.dataModelChanged);
    $('#TransactionsAccountReportTypeForm select').on('input', ReportingHandler.prototype.genericTransactionReportSelectHandler);

    // see here: http://www.flotcharts.org/flot/examples/series-pie/index.html
    // and here: https://github.com/krzysu/flot.tooltip
    ReportingHandler.self.pieChartConfig = {
        series: {
            pie: {
                radius: 0.7,
                innerRadius: 0.3,
                show: true,
                stroke: {
                    color: "rgba(255,255,255,1.0)",
                    width: 0
                },
                highlight: {
                    opacity: 0.25
                },
                offset: {
                    top: 0,
                    left: 0
                },
                label: {
                    show: true,
                    radius: 3 / 4,
                    formatter: function (label, series) {
                        return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:5px;color:white;">' +
                                label + ' : ' +
                                Math.round(series.percent) +
                                '%</div>';
                    },
                    background: {
                        opacity: 0.5,
                        color: '#000'
                    }
                },
                combine: {
                    color: '#999',
                    threshold: 0.05
                }
            }
        },
        legend: {
            show: false
        },
        grid: {
            hoverable: true,
            clickable: true
        },
        tooltip: {
            show: true,
            content: "%p.0%, %s, n=%n", // show percentages, rounding to 2 decimal places
            shifts: {
                x: 20,
                y: 0
            },
            defaultTheme: false
        }
    };

    this.commandStack = [];
    this.argumentStack = [];
};

function drawChart(dataArray, div_id) {

    var arrayLength = dataArray.length;

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');

    dataArray = sortAssociateArray(dataArray);

    for (var x = 0; x < arrayLength; x++) {
        // console.log(dataArray[x]);
        data.addRow(['' + dataArray[x].label, dataArray[x].data]);

    }

    var options = {
        tooltip: {
            isHtml: true
        },
        pieHole: 0.4,
        legend: {position: 'bottom', alignment: 'end'},
        colors: ['#006600', '#078e07', '#1baa2f', '#66cc00', '#81fe04', '#404041', '#666666', '#9e9a9a', '#bcbbbb', '#e5e1e1', '#025b5a', '#059da6', '#02c5d0', '#97d9ff']
                //  colors: ['#006600', '#66cc00', '#666666', '#999999', '#cccccc']


    };


    var chart = new google.visualization.PieChart(document.getElementById("panel-body-" + div_id));
    //console.log("The chart will be drawn on: ", document.getElementById("panel-body-" + div_id));
    google.visualization.events.addListener(chart, 'error', function (e) {
        console.log("The chart error:", e);
    });
    chart.draw(data, options);
    add_extended_data(dataArray, div_id);
}
;

add_extended_data = function (data_array, div_id) {

    var div_element = "<div class=' row col-md-6  panel-body-" + div_id + "-details' id='panel-body-" + div_id + "-details'>";
    div_element += " <ul class='nav' style='width:80%; margin:auto; list-style:circle;' > ";
    var total_sum = 0;
    for (var x = 0; x < data_array.length; x++) {
        total_sum += data_array[x].data;
    }

    for (var x = 0; x < data_array.length; x++) {
        var percentage_contribution = (calcuate_percentage(total_sum, data_array[x].data));
        if (percentage_contribution > 0)
            div_element += " <li>  <strong style='text-transform: uppercase;'>" + data_array[x].label + " : </strong> " + percentage_contribution + "% </li>";
    }
    div_element += " </ul> ";
    div_element += "</div>";
    $(div_element).insertAfter("#panel-body-" + div_id).fadeOut('slow');
};

google.charts.load('current', {'packages': ['corechart']});
ReportingHandler.prototype.drawGoogleChart = function (dataArray, data_div) {
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart(dataArray, data_div));

};

ReportingHandler.TRANSACTION_TITLES = {
    transactionDate: 'Date',
    accountType: 'Account type',
    amount: 'Amount',
    transactionType: 'Transaction type',
    balance: 'Balance'
};

ReportingHandler.KPI_TITLES = {
    kpi: 'Indicator',
    value: 'Value'
};

ReportingHandler.MAX_TRANSACTION_AGE = 2592000000; // 30d * 24h * 60m * 60s * 1000ms

/* external */
ReportingHandler.prototype.overview = function () {
    addHistory('Reporting overview', '#reportingOverview', '#reporting a');
    initDefaultContent('Reporting');
    currentTable = 'reporting';
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();

    var $rowContainer = getDefaultRowContainer({type: 'Items Available'});
    var latestTransactions = [];
    var savingsAccounts = savingsAccountList.getEntities();
    var savingsAccountsNumber = savingsAccounts.length;
    for (var i = 0; i < savingsAccountsNumber; i++) {
        var savingsAccount = savingsAccounts[i];
        var transactions = savingsAccount.transactionList;
        if (exists(transactions)) {
            var transactionsNumber = transactions.length;
            for (var j = 0; j < transactionsNumber; j++) {
                if (Date.now() - transactions[j].transactionDate < ReportingHandler.MAX_TRANSACTION_AGE) {
                    latestTransactions.push(transactions[j]);
                }
            }
        }
    }
    var loans = loanList.getEntities();
    var loansNumber = loans.length;
    for (var i = 0; i < loansNumber; i++) {
        var loan = loans[i];
        var transactions = loan.transactionList;
        if (exists(transactions)) {
            var transactionsNumber = transactions.length;
            for (var j = 0; j < transactionsNumber; j++) {
                if (Date.now() - transactions[j].transactionDate < ReportingHandler.MAX_TRANSACTION_AGE) {
                    latestTransactions.push(transactions[j]);
                }
            }
        }
    }

    if (handlers['Permissions'].check_access('_VIEW_PORTFOLIO_ANALYSIS'))
        addRow($rowContainer, {type: 'Portfolio Analysis' /*, number: 4*/}, 'Reporting', ReportingHandler.self.rowClickHandler, 'collectPortfolioData');

    // [CO-#75]: remove this if block (but not the inner line of code) when "key performance indicators" have been done
    if (handlers['Permissions'].check_access('_VIEWKEYPERFORMANCEINDICATOR'))
        //addRow($rowContainer, {type: 'Key performance indicators'/*, number: 2*/}, 'Reporting', ReportingHandler.self.rowClickHandler, 'performance_indicators');

        if (handlers['Permissions'].check_access('_VIEW_CLIENTS'))
            addRow($rowContainer, {type: 'Clients' /*, number: 1*/}, 'Client', ReportingHandler.self.rowClickHandler, 'getAll');

    if (handlers['Permissions'].check_access('_VIEW_LOANS'))
        addRow($rowContainer, {type: 'Loans' /*, number: 7*/}, 'Loan', ReportingHandler.self.rowClickHandler, 'firstGenericLoanReportsForReporting');

    if (handlers['Permissions'].check_access('_MANAGE_SAVINGS_ACCOUNTS'))
        addRow($rowContainer, {type: 'Savings Accounts' /*, number: 1*/}, 'SavingsAccount', ReportingHandler.self.rowClickHandler, 'getAllForReporting');

    if (handlers['Permissions'].check_access('_MANAGE_TRANSACTIONS'))
        addRow($rowContainer, {type: 'Transactions' /*, number: 1*/}, 'Reporting', ReportingHandler.self.rowClickHandler, 'getTransactions');
};

ReportingHandler.prototype.getTransactions = function () {
    hideContent();
    addHistory('Reporting transactions', '#reportingTransactions', getSidebarSubitemSelector('reporting', 'Reporting', 'getTransactions'));
    initDefaultContent('');
    currentTable = 'transactions';
    //$('#SavingAccountReportType').hide();
    //$('#SavingsAccountReportTypeForm').hide();
    $('#TransactionsAccountReportType').show();
    $('#TransactionsAccountReportTypeForm').show();
    document.getElementById("TransactionsAccountReportType").selectedIndex = "0";
    currentChangedFil = 'ALL';

    $.datepicker._clearDate($("#tToDatePicker"));
    $.datepicker._clearDate($("#tFromDatePicker"));
    transactionsFromDate = "0";
    transactionsToDate = "999999999999999";

    ReportingHandler.self.showTransactions();
};

ReportingHandler.prototype.showTransactions = function () {

    var $rowContainer = getDefaultRowContainer(ReportingHandler.TRANSACTION_TITLES, true);
    var $table = $rowContainer.parent();
    var latestTransactions = [];
    var savingsAccounts = savingsAccountList.getEntities();
    var savingsAccountsNumber = savingsAccounts.length;
    for (var i = 0; i < savingsAccountsNumber; i++) {
        var savingsAccount = savingsAccounts[i];
        var transactions = savingsAccount.transactionList;
        if (exists(transactions)) {
            var transactionsNumber = transactions.length;
            for (var j = 0; j < transactionsNumber; j++) {
                if (Date.now() - transactions[j].transactionDate < ReportingHandler.MAX_TRANSACTION_AGE) {
                    if (currentChangedFil === 'ALL') {
                        if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                            latestTransactions.push(transactions[j]);
                        }
                    } else {
                        if (currentChangedFil === transactions[j]['transactionType'])
                            if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                                latestTransactions.push(transactions[j]);
                            }
                    }
                }
            }
        }
    }

    var loans = loanList.getEntities();
    var loansNumber = loans.length;
    for (var i = 0; i < loansNumber; i++) {
        var loan = loans[i];
        var transactions = loan.transactionList;
        if (exists(transactions)) {
            var transactionsNumber = transactions.length;
            for (var j = 0; j < transactionsNumber; j++) {
                if (Date.now() - transactions[j].transactionDate < ReportingHandler.MAX_TRANSACTION_AGE) {
                    if (currentChangedFil === 'ALL') {
                        if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                            latestTransactions.push(transactions[j]);
                        }
                    } else {
                        if (currentChangedFil === transactions[j]['transactionType'])
                            if (transactions[j]['transactionDate'] < transactionsToDate && transactions[j]['transactionDate'] > transactionsFromDate) {
                                latestTransactions.push(transactions[j]);
                            }
                    }
                }
            }
        }
    }

    var latestTransactionsNumber = latestTransactions.length;
    for (var i = 0; i < latestTransactionsNumber; i++) {
        var transaction = latestTransactions[i];
        var formattedRowData = ReportingHandler.prototype.getTransactionRowData(transaction);
        addRow($rowContainer, formattedRowData, transaction);
    }

    $('#tableTotal').text(latestTransactionsNumber);
    showContent($('#tableTotalSum'));

    var tableSorter = getDefaultTableSorter();
    tableSorter.headers = {
        0: {sorter: 'awamoDateSorter'},
        2: {sorter: 'awamoCurrencySorter'},
        4: {sorter: 'awamoCurrencySorter'}
    };
    //$table.tablesorter(tableSorter);

    initialize_datatable($table);

    var els = document.getElementById("defaultTableContainer").getElementsByTagName("table");
    for (var i = 0; i < els.length; i++) {
        els[i].style.textAlign = "right";
    }

    addClassToTableColumn($table, 0, 'currency');
    addClassToTableColumn($table, 2, 'currency');
    addClassToTableColumn($table, 4, 'currency');

    if (handlers['Permissions'].check_access('_EXPORT_TRANSACTIONS')) {
        var tables = $('#defaultTableContainer').tableExport();
        tables.tableExport.update({
            formats: ["xls", "xlsx"],
            fileName: "Transactions",
            headings: true
        });
    }

    $("#hiddenPrintedTitle").val("Transactions Report");
    showPrintButton(exportListName.transactions, exportListFilter.all, ReportingHandler.TRANSACTION_TITLES);
    showExcelButton(exportListName.transactions, exportListFilter.all, ReportingHandler.TRANSACTION_TITLES);
};

ReportingHandler.prototype.getTransactionRowData = function (transaction) {
    var rowdata = {};

    for (var key in ReportingHandler.TRANSACTION_TITLES) {
        var formattedValue = transaction[key];
        switch (key) {
            case 'accountType':
                if (exists(transaction.accountId)) {
                    formattedValue = 'savings account';
                } else if (exists(transaction.loanId)) {
                    formattedValue = 'loan account';
                } else {
                    formattedValue = 'unknown';
                }
                break;
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

ReportingHandler.prototype.rowClickHandler = function () {
    var action = $(this).data('id');
    var handler = $(this).data('object');
    $('li[data-parent~="reporting"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

ReportingHandler.prototype.reporting_type = "number";

ReportingHandler.prototype.changePortfolioType = function () {
    ReportingHandler.self.reporting_type = $('#portfolioReportTypeForm').find(":selected").val();

    ReportingHandler.self.createLoansByHealthChart();
    ReportingHandler.self.createLoansByAgeChart();
    ReportingHandler.self.createLoansBySexChart();
    ReportingHandler.self.createLoansBySectorChart();
};

ReportingHandler.prototype.collectPortfolioData = function ()
{
    console.log("in collect portfolio data");
    console.log(ReportingHandler.self.portFolioData);
    if (ReportingHandler.self.portFolioData === null || ReportingHandler.self.portFolioData === "undefined" || ReportingHandler.self.portFolioData.length < 1)
    {
        console.log("in collect portfolio data, fetch data");
        //no portfolio data available
        var url = "/loan/v1d/loanReports";
        var headers = getAuthenticationHeader();
        $.ajax({
            url: host + url,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            headers: headers,
            type: 'GET',
            beforeSend: function ()
            {
                showLoader("Loading Portfolio Data . . .");
            },
            success: function (loanReport)
            {
                console.log("response");
                console.log(loanReport);
                if (loanReport)
                {
                    if (loanReport.length > 0)
                    {
                        ReportingHandler.self.portFolioData = loanReport;
                        ReportingHandler.prototype.getPortfolio();
                    } else
                    {
                        hideLoader();
                        showAlertMessage("An error occured while retrieving portfolio details, Please try again.", AlertTypes.danger);
                    }
                } else
                {
                    hideLoader();
                    showAlertMessage("An error occured while retrieving portfolio details, Please try again.", AlertTypes.danger);
                }
            },
            complete: function ()
            {
                hideLoader();
            }
        }).fail(function (e) {
            console.log("fail response");
            console.log(e);
            hideLoader();
            showAlertMessage("An error occured while retrieving portfolio details, Please try again.", AlertTypes.danger);
        });
    } else
    {
        //portfolio data availables
        console.log("in collect portfolio data, no need to fetch data");
        ReportingHandler.prototype.getPortfolio();
    }
};

ReportingHandler.prototype.getPortfolio = function () {
    clearExportButtons();
    $('#syncNow').off('click touch');
    $('#syncNow').attr('title', 'Nothing to sync');
    $('#printNow').off('click touch');
    $('#printNow').hide();
    addHistory('Reporting portfolio', '#reportingPortfolio', getSidebarSubitemSelector('reporting', 'Reporting', 'collectPortfolioData'));
    initDefaultContent('Portfolio');
    var $portfolio = $('#portfolioArea');
    showContent($portfolio);

    ReportingHandler.self.reporting_type = "number";
    $("#portfolioReportTypeForm").off();
    $("#portfolioReportTypeForm").on('change', ReportingHandler.self.changePortfolioType);

    ReportingHandler.self.createLoansByHealthChart();
    ReportingHandler.self.createLoansByAgeChart();
    ReportingHandler.self.createLoansBySexChart();
    ReportingHandler.self.createLoansBySectorChart();
};

ReportingHandler.prototype.getPorfolioDetailsFromServerReport = function (portfolioDetails)
{
    var reportDetails = [];
    $.each(ReportingHandler.self.portFolioData, function (index, data)
    {
        switch (data.reportName)
        {
            case "LOANS-AGE-REPORT-BY-AMOUNT":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-AGE-REPORT-BY-NUMBERS":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-EMPLOYEMENT-SECTOR-REPORT-BY-AMOUNT":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-EMPLOYEMENT-SECTOR-REPORT-BY-NUMBERS":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-GENDER-REPORT-BY-AMOUNT":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-GENDER-REPORT-BY-NUMBERS":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-HEALTH-REPORT-BY-AMOUNT":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            case "LOANS-HEALTH-REPORT-BY-NUMBER":
                if(data.reportName === portfolioDetails)
                {
                    reportDetails = data.reportDetails;
                }
                break;
            default:
                break;
        }
        if (reportDetails.length > 0)
        {
            return;
        }
    });
    return reportDetails;
};

ReportingHandler.prototype.createLoansByHealthChart = function () {
    var loanNumberByHealth;
    var reportDetails = [];
    if (ReportingHandler.self.reporting_type === "number") {
//        loanNumberByHealth = loanList.getEntities().reduce(function (accumulator, loan) {
//            accumulator[loan.health] ? accumulator[loan.health]++ : accumulator[loan.health] = 1;
//            return accumulator;
//        }, {});
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-HEALTH-REPORT-BY-NUMBER");
        console.log("health reports by number");
        console.log(reportDetails);
    } else if (ReportingHandler.self.reporting_type === "amount") {
//        {
//            loanNumberByHealth = loanList.getEntities().reduce(function (accumulator, loan) {
//                accumulator[loan.health] ? accumulator[loan.health] += (loan.principal) : accumulator[loan.health] = (loan.principal);
//                return accumulator;
//            }, {});
//        }
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-HEALTH-REPORT-BY-AMOUNT");
        console.log("health reports by amount");
        console.log(reportDetails);
    }


    var dataArray = [];
    $.each(reportDetails, function (index, data) {
        dataArray.push({label: data.key, data: data.value});
    });
//    $.each(loanNumberByHealth, function (label, data) {
//        dataArray.push({label: label, data: data});
//    });

    ReportingHandler.prototype.loansByHealthChart = ReportingHandler.prototype.drawGoogleChart(dataArray, "loansByHealth");
    // ReportingHandler.prototype.loansByHealthChart = $.plot($("#portfolio-loansByHealth .chart"), dataArray, ReportingHandler.self.pieChartConfig);
};

ReportingHandler.prototype.createLoansByAgeChart = function () {
    var labels = {
        sector0: '< 26',
        sector1: '26 - 35',
        sector2: '36 - 45',
        sector3: '46 - 55',
        sector4: '> 55'
    };
    var loanNumberByAge = {
        sector0: 0, // <26
        sector1: 0, // 26-35
        sector2: 0, // 36-45
        sector3: 0, // 46-55
        sector4: 0 // >55
    };
    var loans = loanList.getEntities();
    var len = loans.length;

    var reportDetails = [];
    if (ReportingHandler.self.reporting_type === "number") {
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-AGE-REPORT-BY-NUMBERS");
        console.log("age reports by number");
        console.log(reportDetails);
//        for (var i = 0; i < len; i++) {
//            var loan = loans[i];
//
//            if (loan.loanType === 'INDIVIDUAL') {
//                if (loan.client !== null) { // should never happen
//                    if (loan.client.age < 26) {
//                        loanNumberByAge.sector0 += 1;
//                    } else if (loan.client.age < 36) {
//                        loanNumberByAge.sector1 += 1;
//                    } else if (loan.client.age < 46) {
//                        loanNumberByAge.sector2 += 1;
//                    } else if (loan.client.age < 56) {
//                        loanNumberByAge.sector3 += 1;
//                    } else {
//                        loanNumberByAge.sector4 += 1;
//                    }
//                }
//            } else if (loan.loanType === 'GROUP') {
//                // TODO
//            }
//        }
    } else if (ReportingHandler.self.reporting_type === "amount") {
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-AGE-REPORT-BY-AMOUNT");
        console.log("age reports by amount");
        console.log(reportDetails);
//        for (var i = 0; i < len; i++) {
//            var loan = loans[i];
//
//            if (loan.loanType === 'INDIVIDUAL') {
//                if (loan.client !== null) { // should never happen
//                    if (loan.client.age < 26) {
//                        loanNumberByAge.sector0 += (loan.principal / 100);
//                    } else if (loan.client.age < 36) {
//                        loanNumberByAge.sector1 += (loan.principal / 100);
//                    } else if (loan.client.age < 46) {
//                        loanNumberByAge.sector2 += (loan.principal / 100);
//                    } else if (loan.client.age < 56) {
//                        loanNumberByAge.sector3 += (loan.principal / 100);
//                    } else {
//                        loanNumberByAge.sector4 += (loan.principal / 100);
//                    }
//                }
//            } else if (loan.loanType === 'GROUP') {
//                // TODO
//            }
//        }


    }

    var dataArray = [];
    $.each(reportDetails, function (index, data) {
        dataArray.push({label: data.key, data: data.value});
    });
//    $.each(loanNumberByAge, function (label, data) {
//        dataArray.push({label: labels[label], data: data});
//    });

    ReportingHandler.prototype.loansByHealthChart = ReportingHandler.prototype.drawGoogleChart(dataArray, "loansByAge");
    // ReportingHandler.self.loansByAgeChart = $.plot($("#portfolio-loansByAge .chart"), dataArray, ReportingHandler.self.pieChartConfig);
};

ReportingHandler.prototype.createLoansBySexChart = function () {
    var loanNumberBySex = {
        male: 0,
        female: 0
    };
    var loans = loanList.getEntities();
    var len = loans.length;

    var reportDetails = [];
    if (ReportingHandler.self.reporting_type === "number") {
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-GENDER-REPORT-BY-NUMBERS");
        console.log("gender reports by number");
        console.log(reportDetails);
//        for (var i = 0; i < len; i++) {
//            var loan = loans[i];
//            if (loan.loanType === 'INDIVIDUAL') {
//                if (loan.client !== null) { // should never happen
//                    if (loan.client.gender === 'MALE') {
//                        loanNumberBySex.male += 1;
//                    } else {
//                        loanNumberBySex.female += 1;
//                    }
//                }
//            }
//        }

    } else if (ReportingHandler.self.reporting_type === "amount") {
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-GENDER-REPORT-BY-AMOUNT");
        console.log("gender reports by amount");
        console.log(reportDetails);
//        for (var i = 0; i < len; i++) {
//            var loan = loans[i];
//            if (loan.loanType === 'INDIVIDUAL') {
//                if (loan.client !== null) { // should never happen
//                    if (loan.client.gender === 'MALE') {
//                        loanNumberBySex.male += (loan.principal / 100);
//                    } else {
//                        loanNumberBySex.female += (loan.principal / 100);
//                    }
//                }
//            }
//        }
    }

    var dataArray = [];
    $.each(reportDetails, function (index, data) {
        dataArray.push({label: data.key, data: data.value});
    });
//    $.each(loanNumberBySex, function (label, data) {
//        dataArray.push({label: label, data: data});
//    });
    ReportingHandler.prototype.loansByHealthChart = ReportingHandler.prototype.drawGoogleChart(dataArray, "loansBySex");
    //ReportingHandler.self.loansByAgeChart = $.plot($("#portfolio-loansBySex .chart"), dataArray, ReportingHandler.self.pieChartConfig);
};

ReportingHandler.prototype.createLoansBySectorChart = function () {

    var dataArray = [];
    var loanNumberBySector;

    var reportDetails = [];
    if (ReportingHandler.self.reporting_type === "number") {
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-EMPLOYEMENT-SECTOR-REPORT-BY-NUMBERS");
        console.log("sector reports by number");
        console.log(reportDetails);
//        loanNumberBySector = loanList.getEntities().reduce(function (accumulator, loan) {
//            if (typeof (loan.loanClients) !== "undefined" &&
//                    loan.loanClients !== null &&
//                    loan.loanClients.length > 0) {
//                var loanClient = loan.loanClients[0];
//
//                if (typeof (loanClient.clientEmployments) !== "undefined" &&
//                        loanClient.clientEmployments !== null &&
//                        loanClient.clientEmployments.length > 0) {
//                    var clientEmployment = loanClient.clientEmployments[0];
//                    if (clientEmployment !== null) {
//                        var sector = null;
//                        if (clientEmployment.selfEmploymentType === 'FARMER') {
//                            sector = 'FARMER';
//                        } else {
//                            sector = clientEmployment.businessSector;
//                        }
//
//                        accumulator[sector] ? accumulator[sector]++ : accumulator[sector] = 1;
//                    }
//                }
//            }
//
//            return accumulator;
//        }, {});

    } else if (ReportingHandler.self.reporting_type === "amount") {
        reportDetails = ReportingHandler.prototype.getPorfolioDetailsFromServerReport("LOANS-EMPLOYEMENT-SECTOR-REPORT-BY-AMOUNT");
        console.log("sector reports by amount");
        console.log(reportDetails);
//        loanNumberBySector = loanList.getEntities().reduce(function (accumulator, loan) {
//            if (typeof (loan.loanClients) !== "undefined" &&
//                    loan.loanClients !== null &&
//                    loan.loanClients.length > 0) {
//                var loanClient = loan.loanClients[0];
//
//                if (typeof (loanClient.clientEmployments) !== "undefined" &&
//                        loanClient.clientEmployments !== null &&
//                        loanClient.clientEmployments.length > 0) {
//                    var clientEmployment = loanClient.clientEmployments[0];
//                    if (clientEmployment !== null) {
//                        var sector = null;
//                        if (clientEmployment.selfEmploymentType === 'FARMER') {
//                            sector = 'FARMER';
//                        } else {
//                            sector = clientEmployment.businessSector;
//                        }
//
//                        accumulator[sector] ? accumulator[sector] += (loan.principal / 100) : accumulator[sector] = (loan.principal / 100);
//                    }
//                }
//            }
//
//            return accumulator;
//        }, {});

    }


    $.each(reportDetails, function (index, data) {
        dataArray.push({label: data.key, data: data.value});
    });


    ReportingHandler.prototype.loansByHealthChart = ReportingHandler.prototype.drawGoogleChart(dataArray, "loansBySector");
    //ReportingHandler.prototype.loansBySectorChart = $.plot($("#portfolio-loansBySector .chart"), dataArray, ReportingHandler.self.pieChartConfig);
};

ReportingHandler.prototype.dataModelChanged = function (object) {
    // Draws chart even when page is not displayed
    // var $chart = $("#portfolio-loansByHealth .chart");
    // if ($chart.height() > 0 && $chart.width() > 0) {
    //     ReportingHandler.self.createLoansByHealthChart();
    //     ReportingHandler.self.createLoansByAgeChart();
    //     ReportingHandler.self.createLoansBySexChart();
    //     ReportingHandler.self.createLoansBySectorChart();
    // }
};

ReportingHandler.prototype.labelFormatter = function (label, series) {
    return '<div style="font-size:12px; text-align:center; padding:4px; color: #333333; background-color: ' + series.color + '; border: solid 1px #000000">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
};

ReportingHandler.prototype.getClientMap = function () {
    addHistory('Geo Information', '#geoInformation', '#getClientMap a');
    initDefaultContent('Geo Information');
    showContent($('#geoInformationArea'));
    currentTable = null;
    var allClients = clientList.getEntities();

    var myOptions = {
        center: new google.maps.LatLng(8.7832, 34.5085),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        mapTypeControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }

    };

    var map = new google.maps.Map(document.getElementById("geoInformationMap"), myOptions);

    var bounds = new google.maps.LatLngBounds();
    var count = 0;

    allClients.forEach(function (client) {
        if (exists(client.location)) {
            if (client.location.latitude !== 0 && client.location.longitude !== 0) {
                var cLatLng = {lat: client.location.latitude, lng: client.location.longitude};

                bounds.extend(new google.maps.LatLng(client.location.latitude, client.location.longitude));
                count = count + 1;
                new google.maps.Marker({
                    position: cLatLng,
                    map: map

                });
            }
        }
    });

    if (count > 0) {
        map.fitBounds(bounds);
    }
};

ReportingHandler.prototype.performance_indicators = function () {
    ReportingHandler.self.keyPerformanceIndicators();
}
ReportingHandler.prototype.keyPerformanceIndicators = function () {
    addHistory('Key Performance Indicators', '#keyPerformanceIndicators', getSidebarSubitemSelector('reporting', 'Reporting', 'keyPerformanceIndicators'));
    initDefaultContent('Key Performance Indicators');
    ReportingHandler.self.stack(ReportingHandler.prototype.keyPerformanceIndicators);

    var $rowContainer = getDefaultRowContainer(ReportingHandler.KPI_TITLES);
    var $table = $rowContainer.parent();
    var data = [
        {kpi: 'Return on assets', value: 10},
        {kpi: 'Return on equity', value: 12}
    ];

    data.forEach(function (row) {
        addRow($rowContainer, ReportingHandler.prototype.getKPIRowData(row));
    });

    $table.tablesorter(getDefaultTableSorter());

    addClassToDefaultTableColumn(3, 'currency');
};

ReportingHandler.prototype.getKPIRowData = function (account) {
    var rowdata = {};

    for (var key in ReportingHandler.KPI_TITLES) {
        var formattedValue = account[key];

        switch (key) {
            case 'code':
                if (account.glCode % 1000 === 0) {
                    formattedValue = '<b>' + account.glCode + '</b';
                } else if (account.glCode % 100 === 0) {
                    formattedValue = '&emsp;&emsp;' + account.glCode;
                } else {
                    formattedValue = '&emsp;&emsp;&emsp;&emsp;' + account.glCode;
                }
                break;
            case 'name':
                if (account.glCode % 1000 === 0) {
                    formattedValue = '<b>' + account.name + '</b';
                } else if (account.glCode % 100 === 0) {
                    formattedValue = '&emsp;&emsp;' + account.name;
                } else {
                    formattedValue = '&emsp;&emsp;&emsp;&emsp;' + account.name;
                }
                break;
            case 'balance':
                formattedValue = formatCurrency(this._sumOfJournal(account)) + ' ' + currencyCode;
                break;
            default:
                break;
        }

        rowdata[key] = String(formattedValue);
    }

    return rowdata;
};

ReportingHandler.prototype.stack = function (command, arguments) {
    ReportingHandler.self.commandStack.push(command);
    ReportingHandler.self.argumentStack.push(arguments); // TODO: don't know if this works if it is undefined ...
};

ReportingHandler.prototype.back = function () {
    ReportingHandler.self.commandStack.pop()(ReportingHandler.self.argumentStack.pop());
};

//AccountingHandler.prototype.singleObjectActionHandler = function (event) {
//    event.preventDefault();
//    hideContent();
//
//    switch ($(this).data('action')) {
//        case 'back':
//            AccountingHandler.self.back();
//            break;
//        default:
//            // noop
//            break;
//    }
//};
ReportingHandler.prototype.genericTransactionReportSelectHandler = function () {
    switch ($(this).val()) {
        case 'ALL':
            currentChangedFil = 'ALL';
            break;
        case 'DEPOSIT':
            currentChangedFil = 'DEPOSIT';
            break;
        case 'WITHDRAWAL':
            currentChangedFil = 'WITHDRAWAL';
            break;
        case 'DISBURSEMENT':
            currentChangedFil = 'DISBURSEMENT';
            break;
        case 'REPAYMENT':
            currentChangedFil = 'REPAYMENT';
            break;
        default:
            break;
    }
    ReportingHandler.prototype.showTransactions();
};

$(".export").on('click touch', function () {

    var export_type = $(this).data('attr');
    var div_id = $(this).data('contentid');
    var title = $(this).closest('.panel-heading').children('.header').html();
    exportArea(export_type, div_id, title);

});
