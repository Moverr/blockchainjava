/* 
 *  This Handler is mearnt to handle the menu . 
 *  Menu vs Sub Menu Items
 *  Permission Handling
 */


var MenuHandler = function() {
	MenuHandler.self = this;
};

MenuHandler.menu_array = [];

MenuHandler.prototype.menu_crumbs = function(current) {

};

MenuHandler.prototype.menu_bucket = function() {
	var menu = [];

	//Dashboard 
	menu.push({
		data_menu: 'dashboard',
		data_handler: 'Dashboard',
		data_action: 'overview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">dashboard</i>',
		data_text: '<i class="mdl-color-text--white">Dashboard</i>',
		data_parent: '',
		data_permission: '_OVERVIEW',
		data_id: 'dashboard',
		data_counterkey: ''
	});

	// Actions Performed 

	menu.push({
		data_menu: 'actionRequired',
		data_handler: 'ActionRequired',
		data_action: 'overview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">announcement</i>',
		data_text: '<i class="mdl-color-text--white">Action Required</i>',
		data_parent: '',
		data_permission: '_MANAGE_LOANS',
		data_id: 'actionRequired',
		data_counterkey: 'actionRequired'
	});


	menu.push({
		data_menu: 'actionRequiredLoanApplications',
		data_handler: 'Loan',
		data_action: 'getApplications',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Approve Loan Applications</i>',
		data_parent: 'actionRequired',
		data_permission: '_APPROVE_LOAN_APPLICATIONS',
		data_id: 'actionRequiredLoanApplications',
		data_counterkey: 'loanApplications'
	});

	menu.push({
		data_menu: 'actionRequiredLoanSigningContracts',
		data_handler: 'Loan',
		data_action: 'getSingngContracts',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Sign Loan Contracts</i>',
		data_parent: 'actionRequired',
		data_permission: '_SIGN_LOAN_CONTRACT',
		data_id: 'actionRequiredLoanSigningContracts',
		data_counterkey: 'loanApproved'
	});

	menu.push({
		data_menu: 'actionRequiredLoanDisbursements',
		data_handler: 'Loan',
		data_action: 'getDisbursements',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Allow Loan Disbursements</i>',
		data_parent: 'actionRequired',
		data_permission: '_APPROVE_LOAN_DISBURSEMENT',
		data_id: 'actionRequiredLoanDisbursements',
		data_counterkey: 'loanDisbursements'
	});

	menu.push({
		data_menu: 'actionRequiredLoanDisbursements',
		data_handler: 'Loan',
		data_action: 'getAllowedDisbursements',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Disburse Loan</i>',
		data_parent: 'actionRequired',
		data_permission: '_MANAGE_LOAN_DISBURSEMENT',
		data_id: 'actionRequiredLoanDisbursements',
		data_counterkey: 'loanDisburse'
	});

	menu.push({
		data_menu: 'actionRequiredLoanDisbursements',
		data_handler: 'SavingsAccount',
		data_action: 'getApplications',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Savings Account Applications</i>',
		data_parent: 'actionRequired',
		data_permission: '_MANAGE_SAVINGS_ACCOUNTS',
		data_id: 'savings_account',
		data_counterkey: 'savingsAccountApplications'
    });

    // Shares Accounts Application
    menu.push({
        data_menu: 'approveApplications',
        data_handler: 'Share',
        data_action: 'approveApplications',
        data_avatar: '',
        data_text: '<i class="mdl-color-text--white">Approve Share Accounts </i>',
        data_parent: 'actionRequired',
        data_permission: '_MANAGE_SHARE_APPLICATIONS',
        data_id: 'savings_account',
        data_counterkey: 'approveApplications'
    });


    menu.push({
        data_menu: 'activateApplications',
        data_handler: 'Share',
        data_action: 'activateApplications',
        data_avatar: '',
        data_text: '<i class="mdl-color-text--white">Activate Share Accounts </i>',
        data_parent: 'actionRequired',
        data_permission: '_MANAGE_SHARE_APPLICATIONS',
        data_id: 'savings_account',
        data_counterkey: 'activateApplications'
    });




	// Clients 
	menu.push({
		data_menu: 'manageClients',
		data_handler: 'Options',
		data_action: 'manageClientsOverview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">person</i>',
		data_text: '<i class="mdl-color-text--white">Manage Clients</i>',
		data_parent: '',
		data_permission: '_MANAGE_CLIENTS',
		data_id: 'manageClients',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'add_client',
		data_handler: 'Options',
		data_action: 'manageClientCreateClient',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Add Client</i>',
		data_parent: 'manageClients',
		data_permission: '_ADD_CLIENT',
		data_id: 'add_client',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'view_edit_client',
		data_handler: 'Client',
		data_action: 'manageClientsGetAll',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">View/Edit Client</i>',
		data_parent: 'manageClients',
		data_permission: '_EDIT_CLIENT',
		data_id: 'view_edit_client',
		data_counterkey: ''
	});

	// Groups
	menu.push({
		data_menu: 'manageGroups',
		data_handler: 'Group',
		data_action: 'overview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">people</i>',
		data_text: '<i class="mdl-color-text--white">Manage Groups</i>',
		data_parent: '',
		data_permission: '_MANAGE_GROUPS',
		data_id: 'manageGroups',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'registerNewGroupSideBar',
		data_handler: 'Group',
		data_action: 'registerNew',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Create Group</i>',
		data_parent: 'manageGroups',
		data_permission: '_REGISTER_NEW_GROUP',
		data_id: 'registerNewGroupSideBar',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'useExistingGroupSideBar',
		data_handler: 'Group',
		data_action: 'getExistingGroups',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Edit Group</i>',
		data_parent: 'manageGroups',
		data_permission: '_MANAGE_EXISTING_GROUPS',
		data_id: 'useExistingGroupSideBar',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'bankingServices',
		data_handler: 'Options',
		data_action: 'bankingServicesOverview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">monetization_on</i>',
		data_text: '<i class="mdl-color-text--white">Banking Services</i>',
		data_parent: '',
		data_permission: '_BANKING_SERVICES',
		data_id: 'bankingServices',
		data_counterkey: ''
	});

	// Bussiness change to Individaul loans
	menu.push({
		data_menu: 'individualLoans',
		data_handler: 'Options',
		data_action: 'overview',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Individual Loans</i>',
		data_parent: 'bankingServices',
		data_permission: '_MANAGE_INDIVIDUAL_LOANS',
		data_id: 'individualLoans',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'createLoanSideBar',
		data_handler: 'Client',
		data_action: 'getAllClientsForLoanApplication',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Create Loan Application</i>',
		data_parent: 'individualLoans',
		data_permission: '_CREATE_LOAN_APPLICATION',
		data_id: 'createLoanSideBar',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'groupLoans',
		data_handler: 'Group',
		data_action: 'createGroupLaonOverview',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Group Loans</i>',
		data_parent: 'bankingServices',
		data_permission: '_MANAGE_GROUP_LOANS',
		data_id: 'groupMainMenu',
		data_counterkey: ''
	});

	//      menu.push(
	//                    {
	//                        data_menu:'groupLoansRegisterNewGroupSideBar',
	//                        data_handler:'Group',
	//                        data_action:'registerNew',
	//                        data_avatar:'',
	//                        data_text:'<i class="mdl-color-text--white">Register New Group</i>',
	//                        data_parent:'groupLoans',
	//                        data_permission:'_REGISTER_NEW_GROUP',
	//                        data_id:'groupLoansRegisterNewGroupSideBar',
	//                        data_counterkey:''
	//                    }
	//             );

	menu.push({
		data_menu: 'groupLoansuseExistingGroupSideBar',
		data_handler: 'Group',
		data_action: 'displayAllGroupsForLoanApplication',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Use Existing Group</i>',
		data_parent: 'groupMainMenu',
		data_permission: '_MANAGE_EXISTING_GROUPS',
		data_id: 'groupLoansuseExistingGroupSideBar',
		data_counterkey: ''
	});

	//savings account
	menu.push({
		data_menu: 'savingsAccountMainMenu',
		data_handler: 'SavingsAccount',
		data_action: 'savingsAccountMainMenuOverview',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Savings Accounts</i>',
		data_parent: 'bankingServices',
		data_permission: '_MANAGE_SAVINGS_ACCOUNTS',
		data_id: 'savingsAccountMainMenu',
		data_counterkey: ''
    });

    //Share Accounts
    menu.push(
            {
                data_menu: 'shares',
                data_handler: 'Share',
                data_action: 'overview',
                data_avatar: '',
                data_text: '<i class="mdl-color-text--white">Shares Accounts</i>',
                data_parent: 'bankingServices',
                data_permission: 'manage_shares',
                data_id: 'shares',
                data_counterkey: ''
            }
    );



	// Loan Repayments
	menu.push({
		data_menu: '_loanRepayments',
		data_handler: 'Loan',
		data_action: 'manage_loan_repayments',
		data_avatar: '',
        data_text: '<i class="mdl-color-text--white">Collect Loan Repayments</i>',
		data_parent: 'bankingServices',
		data_permission: '_MANAGE_LOANS',
		data_id: '_loanRepayments',
		data_counterkey: ''
    });

	menu.push({
		data_menu: 'createNewSavingsAccountSideBar',
		data_handler: 'SavingsAccount',
		data_action: 'showAllClientsForSavingsAccountApplication',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Create New Account</i>',
		data_parent: 'savingsAccountMainMenu',
		data_permission: '_CREATE_NEW_ACCOUNT',
		data_id: 'createNewSavingsAccountSideBar',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'useExistingSavingsAccountSideBar',
		data_handler: 'SavingsAccount',
		data_action: 'getAllForCloseDepositAndWithdraw',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Use Existing Account</i>',
		data_parent: 'savingsAccountMainMenu',
		data_permission: '_MANAGE_ACCOUNTS',
		data_id: 'useExistingSavingsAccountSideBar',
		data_counterkey: ''
	});



	// Shares 
    menu.push(
            {
                data_menu: 'shares',
                data_handler: 'Share',
                data_action: 'purchaseApplication',
                data_avatar: '<span class="glyphicons glyphicons-inbox"></span>',
                data_text: 'Purchase Share',
                data_parent: '',
                data_permission: 'manage_shares',
                data_id: 'shares',
                data_counterkey: ''
            }
    );


    menu.push(
            {
                data_menu: 'approvePurchase',
                data_handler: 'Share',
                data_action: 'approvePurchase',
                data_avatar: '',
                data_text: 'Approve Share Purchase',
                data_parent: 'shares',
                data_permission: 'approve_share_purchase',
                data_id: 'approvePurchase',
                data_counterkey: 'sharePurchaseApplications'
            }
    );


    menu.push(
            {
                data_menu: 'approvePurchase',
                data_handler: 'Share',
                data_action: 'sellApplication',
                data_avatar: '',
                data_text: 'Sell Share',
                data_parent: 'shares',
                data_permission: 'sell_application',
                data_id: 'approvePurchase',
                data_counterkey: ''
            }
    );

    menu.push(
            {
                data_menu: 'approveSale',
                data_handler: 'Share',
                data_action: 'sellApplication',
                data_avatar: '',
                data_text: 'Sell Share',
                data_parent: 'shares',
                data_permission: 'approve_sale',
                data_id: 'approveSale',
                data_counterkey: ''
            }
    );



	// Accounting 
	//if(isTest){
	menu.push({
		data_menu: 'accounting',
		data_handler: 'Accounting',
		data_action: 'overview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">account_balance</i>',
		data_text: '<i class="mdl-color-text--white">Accounting</i>',
		data_parent: '',
		data_permission: '_MANAGE_ACCOUNTING',
		data_id: 'accounting',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'chart_of_accounts',
		data_handler: 'Accounting',
		data_action: 'chartOfAccounts',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Chart of Accounts</i>',
		data_parent: 'accounting',
		data_permission: '_VIEW_CHART_OF_ACCOUNTS',
		data_id: 'chart_of_accounts',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'new_accounting_entry',
		data_handler: 'Accounting',
		data_action: 'create',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">New Accounting Entry</i>',
		data_parent: 'accounting',
		data_permission: '_NEW_ACCOUNTING_ENTRY',
		data_id: 'new_accounting_entry',
		data_counterkey: ''
	});



	menu.push({
		data_menu: 'balance_sheet',
		data_handler: 'Accounting',
		data_action: 'balanceSheet',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Balance Sheet</i>',
		data_parent: 'accounting',
		data_permission: '_VIEW_BALANCE_SHEET',
		data_id: 'balanceSheet',
		data_counterkey: ''
	});



	menu.push({
		data_menu: 'income_statement',
		data_handler: 'Accounting',
		data_action: 'incomeStatement',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Income Statement</i>',
		data_parent: 'accounting',
		data_permission: '_VIEW_INCOME_STATEMENT',
		data_id: 'income_statement',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'generalLedgerAccount',
		data_handler: 'Accounting',
		data_action: 'generalLedgerAccount',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">General Ledger Account</i>',
		data_parent: 'accounting',
		data_permission: '_VIEW_GENERAL_LEDGER_ACCOUNT',
		data_id: 'generalLedgerAccount',
		data_counterkey: ''
	});

	//}


	// Reporting  
	menu.push({
		data_menu: 'reporting',
		data_handler: 'Reporting',
		data_action: 'overview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">pie_chart</i>',
		data_text: '<i class="mdl-color-text--white">Reporting</i>',
		data_parent: '',
		data_permission: '_MANAGE_REPORTING',
		data_id: 'reporting',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'get_portfolio',
		data_handler: 'Reporting',
		data_action: 'collectPortfolioData',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Portfolio</i>',
		data_parent: 'reporting',
		data_permission: '_VIEW_PORTFOLIO',
		data_id: 'get_portfolio',
		data_counterkey: ''
	});


	if (isTest) {
		menu.push({
			data_menu: 'performance_indicators',
			data_handler: 'Reporting',
			data_action: 'performance_indicators',
			data_avatar: '',
			data_text: '<i class="mdl-color-text--white">Key Performance Indicators</i>',
			data_parent: 'reporting',
			data_permission: '_VIEWKEYPERFORMANCEINDICATOR',
			data_id: 'performance_indicators',
			data_counterkey: ''
		});
	}



	//      menu.push(
	//                    {
	//                        data_menu:'keyPerformanceIndicators',
	//                        data_handler:'Reporting',
	//                        data_action:'keyPerformanceIndicators',
	//                        data_avatar:'',
	//                        data_text:'Key Performance Indicators',
	//                        data_parent:'reporting',
	//                        data_permission:'_VIEWKEYPERFORMANCEINDICATOR',
	//                        data_id:'keyPerformanceIndicators',
	//                        data_counterkey:''
	//                    }
	//             );



	menu.push({
		data_menu: 'clients_reporting',
		data_handler: 'Client',
		data_action: 'getAll',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Clients</i>',
		data_parent: 'reporting',
		data_permission: '_VIEW_CLIENTS',
		data_id: 'clients_reporting',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'clients_reporting',
		data_handler: 'Loan',
		data_action: 'firstGenericLoanReportsForReporting',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Loans</i>',
		data_parent: 'reporting',
		data_permission: '_VIEW_LOANS',
		data_id: 'generic_loan_reports',
		data_counterkey: ''
	});

	menu.push({
		data_menu: 'savings_account',
		data_handler: 'SavingsAccount',
		data_action: 'getAllForReporting',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Savings Accounts</i>',
		data_parent: 'reporting',
		data_permission: '_MANAGE_SAVINGS_ACCOUNTS',
		data_id: 'savings_account',
		data_counterkey: ''
	});


	menu.push({
		data_menu: 'transactions',
		data_handler: 'Reporting',
		data_action: 'getTransactions',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Transactions</i>',
		data_parent: 'reporting',
		data_permission: '_MANAGE_TRANSACTIONS',
		data_id: 'transactions',
		data_counterkey: ''
	});


	// Reporting  
	menu.push({
		data_menu: 'client_map',
		data_handler: 'Reporting',
		data_action: 'getClientMap',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">place</i>',
		data_text: '<i class="mdl-color-text--white">Geo Information</i>',
		data_parent: '',
		data_permission: '_VIEW_REGISTERED_CLIENTS',
		data_id: 'client_map',
		data_counterkey: ''
	});

	// Settings
	menu.push({
		data_menu: 'settings',
		data_handler: 'Settings',
		data_action: 'overview',
		data_avatar: '<i class="mdl-color-text--white material-icons" role="presentation">settings</i>',
		data_text: '<i class="mdl-color-text--white">Admin Tasks</i>',
		data_parent: '',
		data_permission: '_MANAGE_SETTINGS',
		data_id: 'settings_overview',
		data_counterkey: ''
	});




	menu.push({
		data_menu: 'manage_offices',
		data_handler: 'Settings',
		data_action: 'offices_sub_menu',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Offices & Branches</i>',
		data_parent: 'settings',
		data_permission: '_MANAGE_OFFICES',
		data_id: 'manage_offices',
		data_counterkey: ''
	});





	menu.push({
		data_menu: 'manage_roles',
		data_handler: 'Settings',
		data_action: 'roles_sub_menu',
		data_avatar: '',
		data_text: '<i class="mdl-color-text--white">Roles & Permissions</i>',
		data_parent: 'settings',
		data_permission: '_MANAGE_ROLES',
		data_id: 'manage_roles',
		data_counterkey: ''
    });

    menu.push(
            //manage_users
                    {
                        data_menu: 'UsersSubMenu',
                        data_handler: 'Settings',
                        data_action: 'users_sub_menu',
                        data_avatar: '',
                        data_text: '<i class="mdl-color-text--white">Users</i>',
                        data_parent: 'settings',
                        data_permission: '_MANAGE_USERS',
                        data_id: 'UsersSubMenu',
                        data_counterkey: ''
                    }
            );

            //Share Products 
            menu.push(
                    {
                        data_menu: 'sharesProducts',
                        data_handler: 'Products',
                        data_action: 'shareproducts_sub_menu',
                        data_avatar: '',
                        data_text: '<i class="mdl-color-text--white">Shares Products</i>',
                        data_parent: 'settings',
                        data_permission: '_MANAGE_PRODUCTS',
                        data_id: 'sharesProducts',
                        data_counterkey: ''
                    }
                    );



            // Templates
            menu.push({
                data_menu: 'templates',
                data_handler: 'templates',
                data_action: 'overview',
                data_avatar: '',
                data_text: '<i class="mdl-color-text--white">Templates</i>',
                data_parent: 'settings',
                data_permission: '_manage_templates',
                data_id: 'manage_templates',
                data_counterkey: ''
            });


//
//            // Download Template
//            menu.push({
//                data_menu: 'downloadTemplate',
//                data_handler: 'templates',
//                data_action: 'downloadTemplate',
//                data_avatar: '',
//                data_text: '<i class="mdl-color-text--white">Download Template </i>',
//                data_parent: 'templates',
//                data_permission: 'download_template',
//                data_id: 'download_template',
//                data_counterkey: ''
//            });
//
//
//            // Upload Template
//            menu.push({
//                data_menu: 'uploadTemplate',
//                data_handler: 'templates',
//                data_action: 'uploadTemplate',
//                data_avatar: '',
//                data_text: '<i class="mdl-color-text--white">Upload Template </i>',
//                data_parent: 'templates',
//                data_permission: 'upload_template',
//                data_id: 'upload_template',
//                data_counterkey: ''
//            });







	// Communication  
	//       menu.push(
	//                    {
	//                        data_menu:'get_help',
	//                        data_handler:'Communication',
	//                        data_action:'help',
	//                        data_avatar:'<i class="mdl-color-text--white material-icons" role="presentation">help</i>',
	//                        data_text:'<i class="mdl-color-text--white">Help</i>',
	//                        data_parent:'',
	//                        data_permission:'_VIEW_HELP',
	//                        data_id:'get_help',
	//                        data_counterkey:''
	//                    }
	//             );
	//     
	//     
	//      menu.push(
	//                    {
	//                        data_menu:'about',
	//                        data_handler:'Communication',
	//                        data_action:'about',
	//                        data_avatar:'<i class="mdl-color-text--white material-icons" role="presentation">info</i>',
	//                        data_text:'<i class="mdl-color-text--white">About</ix>',
	//                        data_parent:'',
	//                        data_permission:'_VIEW_ABOUT',
	//                        data_id:'about',
	//                        data_counterkey:''
	//                    }
	//             );

	MenuHandler.menu_array = menu;
	return menu;
};

MenuHandler.prototype.find_my_parent = function(menu_item) {

};

MenuHandler.prototype.display_submenu = function(current_menu, selected_item) {

};

MenuHandler.prototype.find_my_children = function(menu_item) {

	var menu = this.menu_bucket();
	var array_counter = 0;
	var menu_ui = '';

	array_length = menu.length;

	if (array_length > 0) {

		while (array_counter < array_length) {

			var status = '';
			if (menu[array_counter].data_parent === menu_item) {
				if (handlers['Permissions'].check_access(menu[array_counter].data_permission)) {
					menu_ui += '<li class="hidden subitem ' + status + '" data-parent="' + menu[array_counter].data_parent + '" id="' + menu[array_counter].data_menu + '" data-handler="' + menu[array_counter].data_handler + '" data-action="' + menu[array_counter].data_action + '">' + '<a href="#"> ' + menu[array_counter].data_avatar + ' ' + menu[array_counter].data_text + '' + '<span class="badge" data-counter="0" data-counterkey="' + menu[array_counter].data_counterkey + '">0</span>' + '</a></li>';
				}

			}

			array_counter = array_counter + 1;
		}
	}
	return menu_ui;

};

MenuHandler.prototype.display_menu = function(current_menu, selected_item) {

	current_menu = 'dashboard';
	var menu = this.menu_bucket();
	array_length = menu.length;
	var array_counter = 0;
	if (array_length > 0) {
		statusbar("Initializing the Side Menu");
		var menu_ui = '<ul class="nav nav-sidebar">';
		while (array_counter < array_length) {
			var status = '';
			if (menu[array_counter].data_parent === '') {
				if (current_menu === menu[array_counter].data_menu) {
					status = 'active';
				}
				// check to see if u have permissions 
				if (handlers['Permissions'].check_access(menu[array_counter].data_permission)) {
					menu_ui += '<li class="parentitem bold ' + status + '" id="' + menu[array_counter].data_menu + '" data-handler="' + menu[array_counter].data_handler + '" data-action="' + menu[array_counter].data_action + '">' + '<a href="#"> ' + menu[array_counter].data_avatar + '&nbsp; &nbsp; &nbsp; ' + menu[array_counter].data_text + '' + '<span class="badge" data-counter="0" data-counterkey="' + menu[array_counter].data_counterkey + '">0</span>' + '</a></li>';
					var child_components = this.find_my_children(menu[array_counter].data_menu);
					menu_ui += child_components;
				}
			}
			array_counter = array_counter + 1;
		}
		menu_ui += '</ul>';
		$(".sidebar").html(menu_ui);
		$('.sidebar .nav li').on('click touch', CommunicationHandler.prototype.sidebarNavigationHandler);
	} else {
		alert(" You Dont Have a Menu Engine Set ");
	}

	// console.log(MenuHandler.menu_array);  
};
