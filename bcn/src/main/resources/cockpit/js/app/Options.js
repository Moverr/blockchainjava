/* global authentication, tenantId, LoanHandler, ClientHandler, clientList, user, host, handlers, GroupHandler, loanList, AlertTypes, ActionRequiredHandler, isTest, validationClasses, index, isClientTestData */

var clientSelectedBdate;
var clientimagecreateformData;
var collateralImageCreateFormData;
var collateralImageCreateFormDataArr;

var loanEmpStartDate;
var loanSelfEmpStartDate;
var loanDisDate;
var loanType;
var collateralIndex = 0;
var arrNumCollaterals = [];

var Options = function() {

	Options.self = this;
	Options.collateralUpdateIndex = 0;
	//client functions
	$('#clientCreateIdDocumentType').on('input', Options.prototype.clientDocumentTypeSelectHandler);
	$('#loanDurationTypeDayOption').on('click', Options.prototype.handleDurationItemsSelection);
	$('#loanDurationTypeWeeksOption').on('click', Options.prototype.handleDurationItemsSelection);
	$('#loanDurationTypeMonthsOption').on('click', Options.prototype.handleDurationItemsSelection);
	$('#loanDurationTypeYearsOption').on('click', Options.prototype.handleDurationItemsSelection);

	$('#loanClientAIRTypeDailyOption').on('click', Options.prototype.handleInterestRatePeriodCalculationSelection);
	$('#loanClientAIRTypeWeeklyOption').on('click', Options.prototype.handleInterestRatePeriodCalculationSelection);
	$('#loanClientAIRTypeMonthlyOption').on('click', Options.prototype.handleInterestRatePeriodCalculationSelection);
	$('#loanClientAIRTypeYearlyOption').on('click', Options.prototype.handleInterestRatePeriodCalculationSelection);

	$('#groupLoanClientAIRTypeDailyOption').on('click', Options.prototype.handleGroupLoanInterestRatePeriodCalculationSelection);
	$('#groupLoanClientAIRTypeWeeklyOption').on('click', Options.prototype.handleGroupLoanInterestRatePeriodCalculationSelection);
	$('#groupLoanClientAIRTypeMonthlyOption').on('click', Options.prototype.handleGroupLoanInterestRatePeriodCalculationSelection);
	$('#groupLoanClientAIRTypeYearlyOption').on('click', Options.prototype.handleGroupLoanInterestRatePeriodCalculationSelection);

	$('#createClientBottom').on('click', Options.prototype.toClientConfirmPage);
	$('#modifyClientBottom').on('click', Options.prototype.modifyClientCreationFields);
	$('#confirmClientBottom').on('click', Options.prototype.submitClientData);
	$('#newClientBottom').on('click', Options.prototype.createClient);
	$('#listClientBottom').on('click', Options.prototype.clientCreationList);
	$('#clientImageIDSelector').on('change', Options.prototype.clientImageUpload);

	$("#clientCreationForm").submit(function(e) {

		e.preventDefault();
	});
	//loan functions
	$('#createLoanApplicationBottom').on('click', Options.prototype.toLoanConfirmPage);
	$('#modifyLoanApplicationBottom').on('click', Options.prototype.modifyLoanCreationFields);
	$('#confirmLoanApplicationBottom').on('click', Options.prototype.submitLoanData);
	$('#listLoanApplicationBottom').on('click', Options.prototype.loanApplicationCreationList);
	$('#newLoanApplicationBottom').on('click', ClientHandler.prototype.getAllClientsForLoanApplication);
	$('#loanClientEmployed').on('input', Options.prototype.loanClientEmployedSelectHandler);
	$('#loanClientSelfEmployed').on('input', Options.prototype.loanClientSelfEmployedSelectHandler);
	$('#loanClientSelfEmpType').on('input', Options.prototype.loanClientSelfEmployedEmploymentTypeSelectHandler);
	$('#loanClientCerditCT').on('input', Options.prototype.loanClientCreditTypeSelectHandler);
	$('#loanClientHaveGuarantor').on('input', Options.prototype.loanClientGuarantorSelectHandler);

	$("#createLoanApplicationForm").submit(function(e) {

		e.preventDefault();
	});

	//loan disburse
	$('#disburseLoanPaymentType').on('input', Options.prototype.loanDisbursePaymentType);
	$('#disburseLoanDisburseBottom').on('click', Options.prototype.toLoanDisbursementConfirmPage);
	$('#modifyLoanDisburseBottom').on('click', Options.prototype.modifyDisbursementLoanFields);
	$('#confirmLoanDisburseBottom').on('click', Options.prototype.submitDisbursementData);

	$("#disburseLoanForm").submit(function(e) {
		e.preventDefault();
	});
};

/* external */
Options.prototype.overview = function() {
	addHistory('Individual Loans', '#individualLoans', getSidebarSubitemSelector('bankingServices', 'Options', 'overview'));
	//initDefaultContent('Bussiness');
	initDefaultContent('Individual Loans');
	currentTable = 'options';
	clearExportButtons();
	$('#syncNow').off('click touch');
	$('#syncNow').attr('title', 'Nothing to sync');
	$('#printNow').off('click touch');
	$('#printNow').hide();

	var $rowContainer = getDefaultRowContainer({
		type: 'Items Available'
	});
	//addRow($rowContainer, {type: 'Add Client'/*, number: 1*/}, 'Options', Options.self.rowClickHandler, 'createClient');
	addRow($rowContainer, {
		type: 'Create Loan Application' /*, number: 7*/
	}, 'Client', ClientHandler.prototype.getAllClientsForLoanApplication, 'createLoanApplication');
	//addRow($rowContainer, {type: 'Create Loan Application'/*, number: 7*/}, 'Loan', ReportingHandler.self.rowClickHandler, 'firstGenericLoanReports');
};

Options.prototype.manageClientsOverview = function() {
	addHistory('Manage Clients overview', '#manageClientsOverview', '#manageClients');
	clearExportButtons();
	$('#syncNow').off('click touch');
	$('#syncNow').attr('title', 'Nothing to sync');
	$('#printNow').off('click touch');
	$('#printNow').hide();
	initDefaultContent('Manage Clients');
	currentTable = 'options';

	var $rowContainer = getDefaultRowContainer({
		type: 'Items Available'
	});
	if (handlers['Permissions'].check_access('_ADD_CLIENT')) {
		addRow($rowContainer, {
			type: 'Add Client'
		}, 'Options', Options.self.custManageClientsMenuRowClickHandler, 'manageClientCreateClient');
	}
	if (handlers['Permissions'].check_access('_MANAGE_CLIENTS')) {
		addRow($rowContainer, {
			type: 'View/Edit Clients'
		}, 'Client', ClientHandler.self.custManageClientsMenuRowClickHandler, 'manageClientsGetAll');
	}
};

//Create client functioanlities
Options.prototype.bankingServicesOverview = function() {
	addHistory('Banking Services overview', '#bankingServicesOverview', '#bankingServices');
	initDefaultContent('Banking Services');
	clearExportButtons();
	$('#syncNow').off('click touch');
	$('#syncNow').attr('title', 'Nothing to sync');
	$('#printNow').off('click touch');
	$('#printNow').hide();
	currentTable = 'options';

	var $rowContainer = getDefaultRowContainer({
		type: 'Items Available'
	});
	if (handlers['Permissions'].check_access('_MANAGE_INDIVIDUAL_LOANS'))
		addRow($rowContainer, {
			type: 'Individual Loans'
		}, 'Options', Options.self.bankingServicesOverviewMenuRowClickHandler, 'overview');

	if (handlers['Permissions'].check_access('_MANAGE_GROUP_LOANS'))
	//addRow($rowContainer, {type: 'Group Loans'}, 'Group', Options.self.bankingServicesOverviewMenuRowClickHandler, 'overview');
		addRow($rowContainer, {
		type: 'Group Loans'
	}, 'Group', GroupHandler.self.createGroupLaonOverview, 'createGroupLaonOverview');

	if (handlers['Permissions'].check_access('_MANAGE_SAVINGS_ACCOUNTS'))
		addRow($rowContainer, {
			type: 'Savings Accounts'
		}, 'SavingsAccount', Options.self.bankingServicesOverviewMenuRowClickHandler, 'savingsAccountMainMenuOverview');

	if (handlers['Permissions'].check_access('_MANAGE_LOANS'))
		addRow($rowContainer, {
			type: 'Collect Loan Repayments'
		}, 'Loan', Options.self.bankingServicesOverviewMenuRowClickHandler, 'manage_loan_repayments');

};

Options.prototype.createClient = function() {
	addHistory('create accounting entry', '#createAccountingEntry', getSidebarSubitemSelector('accounting', 'Accounting', 'create'));
	Options.prototype.initClientPage();
	initDefaultContent('Create Client');
	showContent($('#createClient'));
	clearExportButtons();
	$('#syncNow').off('click touch');
	$('#syncNow').attr('title', 'Nothing to sync');
	$('#printNow').off('click touch');
	$('#printNow').hide();
};

Options.prototype.manageClientCreateClient = function() {
	clearExportButtons();
	$('#syncNow').off('click touch');
	$('#syncNow').attr('title', 'Nothing to sync');
	addHistory('New Client', '#clients', getSidebarSubitemSelector('manageClients', 'Options', 'manageClientCreateClient'));
	Options.prototype.initClientPage();
	registerKeyPressValidators($('#clientCreationForm'));
	initDefaultContent('Create Client');
	handlers['Countries'].display_nationality_options("clientCreateN");
	clearFormValidators($('#clientCreationForm'));
	showContent($('#createClient'));
};

Options.prototype.toClientConfirmPage = function() {

	if (validateForm($('#clientCreationForm'))) {
		if ($("#clientCreateP1").val() === $("#clientCreateP2").val()) {
			showAlertMessage("Phone number 1 and 2 should not be the same", AlertTypes.danger);
		} else {
			var idDocumentType = $("#clientCreateIdDocumentType").val();
			var idDocumentNo = $("#clientCreateIdDocument").val();
			if (!(idDocumentType === "NONE") && idDocumentNo.length < 5) {
				showAlertMessage('Please provide a valid document no');
			} else {
				initDefaultContent('Create client');
				showContent($('#createClient'));
				clearExportButtons();
				$('#syncNow').off('click touch');
				$('#syncNow').attr('title', 'Nothing to sync');
				$('#printNow').off('click touch');
				$('#printNow').hide();
				showLoader("Validating Phone1");
				validatePhoneInput(('#clientCreateP1'),
					function() {
						//function called on success of valid phone1 validation
						hideLoader();
						if ($('#clientCreateP1').val().length > 0) {
							showLoader("Validating Phone2");
							validatePhoneInput(('#clientCreateP1'), function() {
									//function called on success of valid phone2 validation
									hideLoader();
									Options.prototype.sendClientCreationData();
								},
								function() {
									//function called on failed of valid phone2 validation
									hideLoader();
									showAlertMessage("Invalid Phone 2 input", AlertTypes.danger);
								});
						} else {
							Options.prototype.sendClientCreationData();
						}
					},
					function() {
						//function called on fail of valid phone1 validation
						hideLoader();
						showAlertMessage("Invalid Phone 1 input", AlertTypes.danger);
					});
			}
		}
	} else {
		showAlertMessage("Please ensure all the fields are filled in correctly", AlertTypes.danger);
	}
};

Options.prototype.rowClickHandler = function() {
	var action = $(this).data('id');
	var handler = $(this).data('object');
	$('li[data-parent~="options"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

Options.prototype.custManageClientsMenuRowClickHandler = function() {
	var action = $(this).data('id');
	var handler = $(this).data('object');
	$('li[data-parent~="manageClients"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

Options.prototype.bankingServicesOverviewMenuRowClickHandler = function() {
	var action = $(this).data('id');
	var handler = $(this).data('object');
	$('li[data-parent~="bankingServices"][data-handler="' + handler + '"][data-action~="' + action + '"] a').click();
};

Options.prototype.actionButtonHandler = function(event) {
	event.preventDefault();
	hideContent();

	switch ($(this).data('action')) {
		case 'back':
			history.back();
			break;
		case 'resetChanges':

			break;

		case 'submit':

			break;
		default:
			// noop
			break;
	}
};

Options.prototype.clientDocumentTypeSelectHandler = function() {
	if (document.getElementById("clientCreateIdDocumentType").value !== "NONE") {
		document.getElementById("clientCreateIdDocument").required = true;
		document.getElementById("clientCreateIdDocument").disabled = false;
	} else {
		document.getElementById("clientCreateIdDocument").required = false;
		document.getElementById("clientCreateIdDocument").disabled = true;
		document.getElementById("clientCreateIdDocument").value = "";
	}
	registerKeyPressValidators($('#clientCreationForm'));
};

Options.prototype.initClientPage = function() {
	clearExportButtons();
	$('#syncNow').off('click touch');
	$('#syncNow').attr('title', 'Nothing to sync');
	$('#printNow').off('click touch');
	$('#printNow').hide();

	document.getElementById("clientCreateF").disabled = false;
	document.getElementById("clientCreateM").disabled = false;
	document.getElementById("clientCreateL").disabled = false;
	document.getElementById("clientCreateG").disabled = false;
	document.getElementById("clientCreateP1").disabled = false;
	document.getElementById("clientCreateP2").disabled = false;
	document.getElementById("clientCreateIdDocument").disabled = true;
	document.getElementById("clientCreateIdDocumentType").disabled = false;
	document.getElementById("clientCreateN").disabled = false;
	document.getElementById("createClientBirthdate").disabled = false;
	document.getElementById("clientImageIDSelector").disabled = false;
	document.getElementById("createClientBirthdate").style.backgroundColor = "white";

	document.getElementById("clientCreateF").value = "";
	document.getElementById("clientCreateM").value = "";
	document.getElementById("clientCreateL").value = "";
	document.getElementById("clientCreateG").value = "";
	document.getElementById("clientCreateP1").value = "";
	populatePhoneInputFlagAddon($('#clientCreateP1'), $('#clientCreateP1CountryBtn'), $('#clientCreateP1CountryList'));
	document.getElementById("clientCreateP2").value = "";
	populatePhoneInputFlagAddon($('#clientCreateP2'), $('#clientCreateP2CountryBtn'), $('#clientCreateP2CountryList'));
	document.getElementById("clientCreateIdDocument").value = "";
	document.getElementById("clientCreateIdDocumentType").value = "";
	document.getElementById("clientCreateN").value = "";
	document.getElementById("createClientBirthdate").value = "";
	$('#clientImageID11').attr("src", "images/personPlaceholderNoText.png");
	document.getElementById("clientImageIDSelector").value = "";

	$("#createClientBottom").show();
	$("#confirmClientBottom").hide();
	$("#modifyClientBottom").hide();
	$("#listClientBottom").hide();
	$("#newClientBottom").hide();
};

Options.prototype.modifyClientCreationFields = function() {

	initDefaultContent('Create Client');
	showContent($('#createClient'));
	document.getElementById("clientCreateF").disabled = false;
	document.getElementById("clientCreateM").disabled = false;
	document.getElementById("clientCreateL").disabled = false;
	document.getElementById("clientCreateG").disabled = false;
	document.getElementById("clientCreateP1").disabled = false;
	document.getElementById("clientCreateP2").disabled = false;
	document.getElementById("clientCreateIdDocument").disabled = true;
	document.getElementById("clientCreateIdDocumentType").disabled = false;
	document.getElementById("clientCreateN").disabled = false;
	document.getElementById("createClientBirthdate").disabled = false;
	document.getElementById("clientImageIDSelector").disabled = false;
	document.getElementById("createClientBirthdate").style.backgroundColor = "white";



	if (document.getElementById("clientCreateIdDocumentType").value === "NONE") {
		document.getElementById("clientCreateIdDocument").disabled = true;
	} else {
		document.getElementById("clientCreateIdDocument").disabled = false;
	}


	$("#createClientBottom").show();
	$("#confirmClientBottom").hide();
	$("#modifyClientBottom").hide();
	$("#listClientBottom").hide();
	$("#newClientBottom").hide();
};

Options.prototype.handleDurationItemsSelection = function() {
	var sourceId = $(this).attr('id');
	switch (sourceId) {
		case 'loanDurationTypeMonthsOption':
			$('#loanDurationTypeSelectorBtn').html("Months <span class='caret'></span>");
			$('#loanClientDuTy').val("MONTHS");
			break;
		case 'loanDurationTypeDayOption':
			$('#loanDurationTypeSelectorBtn').html("Days <span class='caret'></span>");
			$('#loanClientDuTy').val("DAYS");
			break;
		case 'loanDurationTypeWeeksOption':
			$('#loanDurationTypeSelectorBtn').html("Weeks <span class='caret'></span>");
			$('#loanClientDuTy').val("WEEKS");
			break;
		case 'loanDurationTypeYearsOption':
			$('#loanDurationTypeSelectorBtn').html("Years <span class='caret'></span>");
			$('#loanClientDuTy').val("YEARS");
			break;
		default:
			break;
	}
};

Options.prototype.handleInterestRatePeriodCalculationSelection = function() {
	var sourceId = $(this).attr('id');
	switch (sourceId) {
		case 'loanClientAIRTypeDailyOption':
			$('#loanClientAIRTypeSelectorBtn').html("Daily<span class='caret'></span>");
			$('#loanClientAIR').attr('interestPeriodCalculationType', 'Daily');
			break;
		case 'loanClientAIRTypeWeeklyOption':
			$('#loanClientAIRTypeSelectorBtn').html("Weekly<span class='caret'></span>");
			$('#loanClientAIR').attr('interestPeriodCalculationType', 'Weekly');
			break;
		case 'loanClientAIRTypeMonthlyOption':
			$('#loanClientAIRTypeSelectorBtn').html("Monthly<span class='caret'></span>");
			$('#loanClientAIR').attr('interestPeriodCalculationType', 'Monthly');
			break;
		case 'loanClientAIRTypeYearlyOption':
			$('#loanClientAIRTypeSelectorBtn').html("Yearly<span class='caret'></span>");
			$('#loanClientAIR').attr('interestPeriodCalculationType', 'Yearly');
			break;
		default:
			break;
	}
};

Options.prototype.handleGroupLoanInterestRatePeriodCalculationSelection = function() {
	var sourceId = $(this).attr('id');
	switch (sourceId) {
		case 'groupLoanClientAIRTypeDailyOption':
			$('#groupLoanClientAIRTypeSelectorBtn').html("Daily<span class='caret'></span>");
			$('#groupLoanClientAIR').attr('interestPeriodCalculationType', 'Daily');
			break;
		case 'groupLoanClientAIRTypeWeeklyOption':
			$('#groupLoanClientAIRTypeSelectorBtn').html("Weekly<span class='caret'></span>");
			$('#groupLoanClientAIR').attr('interestPeriodCalculationType', 'Weekly');
			break;
		case 'groupLoanClientAIRTypeMonthlyOption':
			$('#groupLoanClientAIRTypeSelectorBtn').html("Monthly<span class='caret'></span>");
			$('#groupLoanClientAIR').attr('interestPeriodCalculationType', 'Monthly');
			break;
		case 'groupLoanClientAIRTypeYearlyOption':
			$('#groupLoanClientAIRTypeSelectorBtn').html("Yearly<span class='caret'></span>");
			$('#groupLoanClientAIR').attr('interestPeriodCalculationType', 'Yearly');
			break;
		default:
			break;
	}
};

Options.prototype.clientCreationPassed = function() {
	ClientHandler.prototype.manageClientsDisplayClients();
	$("#createClientBottom").hide();
	$("#confirmClientBottom").hide();
	$("#modifyClientBottom").hide();
	$("#listClientBottom").show();
	$("#newClientBottom").show();
};

Options.prototype.clientCreationList = function() {
	$("#createClientSideBar").removeClass('active');
	$("#createClientSideBar").addClass('hidden');
	$("#createLoanSideBar").addClass('hidden');

	$("#reporting").addClass('active');

	ClientHandler.prototype.getAll();
};

Options.prototype.sendClientCreationData = function() {
	var validateClientRequest = '{"' + 'idDocument":"' + $('#clientCreateIdDocument').val() + '","idDocumentType":"' + $('#clientCreateIdDocumentType').val() + '"}';
	validateClientDocument(validateClientRequest, function(data) {
		if (!data) {
			headers = getAuthenticationHeader();
			var confirmDialogHeader = 'Confirm Client Creation Details';
			var confirmDialogBody = 'Are you sure you want to create this client with these details';
			var confirmDialogPositiveText = 'Yes';
			var confirmDialogNegativeText = 'No';
			showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, function() {
				//yes create client
				var currentDate = new Date();
				currentDate.setHours(0);
				var uri = '/client/v1d';
				var body = '{"' + 'firstname":"' + $('#clientCreateF').val() + '","middlename":"' + $('#clientCreateM').val() + '","lastname":"' + $('#clientCreateL').val() + '","birthdate":"' + clientSelectedBdate + '","nationality":"' + $('#clientCreateN').val() + '","iddocumenttype":"' + $('#clientCreateIdDocumentType').val() + '","iddocument":"' + $('#clientCreateIdDocument').val() + '","phone1":"' + $('#clientCreateP1').val() + '","phone2":"' + $('#clientCreateP2').val() + '","gender":"' + $('#clientCreateG').val() + '","site":"' + "MFI_OFFICE" + '"}';
				showLoader();
				ajax(uri, 'POST', function(Response) {
					ClientHandler.prototype.insertNewLocalClientObject(Response['awamoId'], clientSelectedBdate);
					if (!($('#clientImageIDSelector').get(0).files.length === 0)) {
						var fd = new FormData();
						var file_data = $('#clientImageIDSelector').prop("files")[0]; // for multiple files
						fd.append("payload", file_data);
						fd.append("datatype", "PHOTOGRAPHY");
						fd.append("deviceId", "CockpitUI");
						fd.append("authentication", authentication);
						fd.append("tenantId", tenantId);
						fd.append("awamoId", Response['awamoId']);
						$.ajax({
							url: host + "/client/v1d/upload",
							data: fd,
							contentType: false,
							processData: false,
							type: 'POST',
							beforeSend: function() {
								showLoader('Submiting client data , please wait...');
							},
							success: function(data) {
								hideLoader();
								showAlertMessage('Success, a new client has been created', AlertTypes.success);
								Options.prototype.clientCreationPassed();
							},
							complete: function() {
								hideLoader();
							}
						}).fail(function(Response) {
							console.log(Response);
							hideLoader();
							showAlertMessage('Client creation was successful, but the image failed to be uploaded please contact the support', AlertTypes.warning);
						});
					} else {
						hideLoader();
						showAlertMessage('Client created successfully', AlertTypes.success);
						Options.prototype.clientCreationPassed();
					}
				}, body, headers, function(Response) {
					console.log(Response);
					hideLoader();
					showAlertMessage('Client creation failed, please contact the support', AlertTypes.danger);
				});
			}, confirmDialogNegativeText, function() {
				//no dont create client
			});
		} else {
			showAlertMessage("Provide another ID Document, this one has been used by another client", AlertTypes.danger);
		}
	});
};

Options.prototype.submitClientData = function() {
	//'#clientCreateP1'
	//'#clientCreateP2'
	showLoader("Validating Phone1");
	validatePhoneInput(('#clientCreateP1'),
		function() {
			//function called on success of valid phone1 validation
			hideLoader();
			if ($('#clientCreateP1').val().length > 0) {
				showLoader("Validating Phone2");
				validatePhoneInput(('#clientCreateP1'), function() {
						//function called on success of valid phone2 validation
						hideLoader();
						Options.prototype.sendClientCreationData();
					},
					function() {
						//function called on failed of valid phone2 validation
						hideLoader();
						showAlertMessage("Invalid Phone 2 input", AlertTypes.danger);
					});
			} else {
				Options.prototype.sendClientCreationData();
			}
		},
		function() {
			//function called on fail of valid phone1 validation
			hideLoader();
			showAlertMessage("Invalid Phone 1 input", AlertTypes.danger);
		});
};

Options.prototype.clientImageUpload = function(event) {
	var reader = new FileReader();
	var file = event.target.files[0];
	var resizedImage = "";
	var dataUrl = "";


	reader.onload = function(e) {
		// get loaded data and render thumbnail.
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

			document.getElementById("clientImageID11").src = canvas.toDataURL();
			clientimagecreateformData = new FormData(canvas.toDataURL("image/jpeg", 1.0));

		};
		image.src = e.target.result;
	};
	// read the image file as a data URL.
	reader.readAsDataURL(file);
};

//Create loan application functioanlities
Options.prototype.createLoanApplication = function(client, loanType) {
	Options.prototype.initLoanApplicationPage(client, loanType);
};

Options.prototype.initLoanApplicationPage = function(awamoIdOrGroupObj, loanType) {
	// Options.self.emptyCollateralPlaceHolder();

	collateralImageCreateFormDataArr = [];
	clearFormValidators($('#createLoanApplicationForm'));
	$('#loanDurationTypeSelectorBtn').html("Months <span class='caret'></span>");
	$('#loanClientDuTy').val("MONTHS");
	$('#loanClientAIR').attr('interestPeriodCalculationType', 'Yearly');
	$('#loanClientAIRTypeSelectorBtn').html("Yearly<span class='caret'></span>");

	$('#groupLoanClientAIR').attr('interestPeriodCalculationType', 'Yearly');
	$('#groupLoanClientAIRTypeSelectorBtn').html("Yearly<span class='caret'></span>");

	if (loanType === 'GROUP') {

		Options.self.loanType = loanType;
		initDefaultContent('Create Group Loan Application');
		scrollToTop();
		/*$('#selectedClient').hide();
		 $('#selectedClientInformation').hide();
		 $('#employmentInformation').hide();
		 $('#selfEmploymentInformation').hide();
		 //$('#loanInformation').show();
		 $('#collateralInformation').hide();*/
		Options.prototype.initGroupLoanApplicationPage(awamoIdOrGroupObj);
	} else {
		$('#confirmLoanApplicationBottom').off('click touch');
		// Options.self.buildCollateralTemplate(null);
		var collateralInformation = $('#collateralInformation .panel-body').empty();
		Collateral.parent = collateralInformation;
		Collateral.parent.append(new Collateral().getView());

		$('#confirmLoanApplicationBottom').on('click', Options.prototype.submitLoanData);
		Options.self.loanType = 'INDIVIDUAL';
		initDefaultContent('Create Individual Loan Application');
		showContent($('#createLoanApplication'));
		scrollToTop();

		/* $('#selectedClient').show();
		 $('#selectedClientInformation').show();
		 $('#employmentInformation').show();
		 $('#selfEmploymentInformation').show();
		 //$('#loanInformation').show();
		 $('#collateralInformation').show();*/
		Options.prototype.initIndividualLoanApplicationPage(awamoIdOrGroupObj.awamoId);
	}
	// currencyInput();
	registerKeyPressValidators($('#createLoanApplicationForm'));
	$('.addonToolTip').tooltip({ placement: 'bottom' });
};

Options.prototype.addPersonalDataForLoanApplication = function(clientAwamoId, groupObj) {
	Options.self.loanType = 'GROUP';
	initDefaultContent('Group member Loan Information');
	$('html, body').animate({
		scrollTop: 0
	}, 'fast');
	//hide loan information
	$('#loanInformation').hide();
	$('#loanClientPrincipal').attr('disabled', 'disabled');
	$('#loanClientDuration').attr('disabled', 'disabled');
	$('#loanClientDuTy').attr('disabled', 'disabled');
	$('#loanClientNORe').attr('disabled', 'disabled');
	$('#loanClientAmortizationType').attr('disabled', 'disabled');
	$('#loanClientAIR').attr('disabled', 'disabled');
	$('#loanClientDiDate').attr('disabled', 'disabled');
	$('#loanClientInType').attr('disabled', 'disabled');
	$('#loanClientICPT').attr('disabled', 'disabled');
	$('#loanClientReason').attr('disabled', 'disabled');
	//hide collateral information
	$('#collateralInformation').hide();
	$('#loanClientCerditCT').attr('disabled', 'disabled');
	$('#loanClientHaveGuarantor').attr('disabled', 'disabled');
	$('#loanClientGuarantorIncome').attr('disabled', 'disabled');
	$('#loanClientCerditCTV').attr('disabled', 'disabled');
	$('#loanClientGuarantorName').attr('disabled', 'disabled');
	$('#loanClientAmortizationType').attr('disabled', 'disabled');

	showContent($('#createLoanApplication'));
	Options.prototype.initIndividualLoanApplicationPage(clientAwamoId);

};

Options.prototype.initIndividualLoanApplicationPage = function(awamoId) {
	clearFormValidators($('#createLoanApplicationForm'));
	if (exists(Options.self.loanType) && Options.self.loanType === 'GROUP') {
		$('#loanInformation').hide();
		$('#collateralInformation').hide();
		//alert('group')
	} else {
		$('#loanInformation').show();
		$('#collateralInformation').show();
		//alert('individul')
	}

	document.getElementById("loanClientImageID1").src = "images/personPlaceholderNoText.png";
	loanEmpStartDate = "";
	loanSelfEmpStartDate = "";
	loanDisDate = "";
	console.log(awamoId);
	//fill client data
	var clientlist = clientList.getEntities().filter(function(client) {
		return client.awamoId === awamoId;
	});
	if (isTest) {
		var client = GroupHandler.prototype.getClient(awamoId);
		console.log(client);
		clientlist.push(client);
	}

	document.getElementById("loanClientAwamoId").value = clientlist[0]['awamoId'];
	document.getElementById("loanClientFirstName").value = clientlist[0]['firstname'];
	document.getElementById("loanClientMiddleName").value = clientlist[0]['middlename'];
	document.getElementById("loanClientLastName").value = clientlist[0]['lastname'];
	document.getElementById("loanClientBirthdate").value = formatDate(clientlist[0]['birthdate']);
	document.getElementById("loanClientNationality").value = clientlist[0]['nationality'];
	document.getElementById("loanClientSubmitdate").value = formatDate(clientlist[0]['submitDate']);
	document.getElementById("loanClientIdDocumentType").value = clientlist[0]['iddocumenttype'];
	document.getElementById("loanClientIdDocument").value = clientlist[0]['iddocument'];
	document.getElementById("loanClientPhone1").value = clientlist[0]['phone1'];
	document.getElementById("loanClientPhone2").value = clientlist[0]['phone2'];
	document.getElementById("loanClientGender").value = clientlist[0]['gender'];
	document.getElementById("loanClientLocation").value = clientlist[0]['site'];
	$.ajax({
		url: host + '/client/v1d/find?' + 'awamoId=' + clientlist[0]['awamoId'] + '&' + 'deviceId=cockpit&' + 'datatype=PHOTOGRAPHY',
		type: 'GET',
		headers: getAuthenticationHeader(),
		xhrFields: {
			responseType: 'arraybuffer'
		}
	}).done(function(e) {
		var blob = new Blob([e], {
			type: 'image/jpg'
		});
		var fr = new FileReader();
		fr.onload = function(e) {
			document.getElementById("loanClientImageID1").src = e.target.result;
		};
		fr.readAsDataURL(blob);
	}).fail(function(e) {
		document.getElementById("loanClientImageID1").src = "images/personPlaceholderNoText.png";
		console.log('fail');
		console.log(e);
	});

	//client information
	document.getElementById("loanClientProvince").disabled = false;
	document.getElementById("loanClientCity").disabled = false;
	document.getElementById("loanClientFirstNOCIH").disabled = false;
	document.getElementById("loanClientLivingArea").disabled = false;
	document.getElementById("loanClientStreet").disabled = false;
	document.getElementById("loanClientNOC").disabled = false;
	document.getElementById("loanClientMartialStatus").disabled = false;
	document.getElementById("loanClientEmployed").disabled = false;
	document.getElementById("loanClientSelfEmployed").disabled = false;

	document.getElementById("loanClientProvince").value = "";
	document.getElementById("loanClientCity").value = "";
	document.getElementById("loanClientFirstNOCIH").value = "";
	document.getElementById("loanClientLivingArea").value = "";
	document.getElementById("loanClientStreet").value = "";
	document.getElementById("loanClientNOC").value = "";
	document.getElementById("loanClientMartialStatus").value = "";
	document.getElementById("loanClientEmployed").value = "";
	document.getElementById("loanClientSelfEmployed").value = "";

	//Employment Fields
	document.getElementById("loanClientEmpCompanyName").disabled = true;
	document.getElementById("loanClientEmpMonIncome").disabled = true;
	document.getElementById("loanClientEmpSector").disabled = true;
	document.getElementById("loanClientEmpProvince").disabled = true;
	document.getElementById("loanClientEmpStreet").disabled = true;
	document.getElementById("loanClientStartDate").disabled = true;
	document.getElementById("loanClientEmpNOE").disabled = true;
	document.getElementById("loanClientEmpFoRe").disabled = true;
	document.getElementById("loanClientEmpCity").disabled = true;
	document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";

	document.getElementById("loanClientEmpCompanyName").required = false;
	document.getElementById("loanClientEmpMonIncome").required = false;
	document.getElementById("loanClientEmpSector").required = false;
	document.getElementById("loanClientEmpProvince").required = false;
	document.getElementById("loanClientEmpStreet").required = false;
	document.getElementById("loanClientStartDate").required = false;
	document.getElementById("loanClientEmpNOE").required = false;
	document.getElementById("loanClientEmpFoRe").required = false;
	document.getElementById("loanClientEmpCity").required = false;

	document.getElementById("loanClientEmpCompanyName").value = "";
	document.getElementById("loanClientEmpMonIncome").value = "";
	document.getElementById("loanClientEmpSector").value = "";
	document.getElementById("loanClientEmpProvince").value = "";
	document.getElementById("loanClientEmpStreet").value = "";
	document.getElementById("loanClientStartDate").value = "";
	document.getElementById("loanClientEmpNOE").value = "";
	document.getElementById("loanClientEmpFoRe").value = "";
	document.getElementById("loanClientEmpCity").value = "";

	//Self Employment Fields
	document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
	document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
	document.getElementById("loanClientSelfEmpType").disabled = true;
	document.getElementById("loanClientSelfEmpAPro").disabled = true;
	document.getElementById("loanClientSelfEmpProvince").disabled = true;
	document.getElementById("loanClientSelfEmpStreet").disabled = true;
	document.getElementById("loanClientSelfStartDate").disabled = true;
	document.getElementById("loanClientSelfEmpNOE").disabled = true;
	document.getElementById("loanClientSelfEmpBSector").disabled = true;
	document.getElementById("loanClientSelfEmpFoRe").disabled = true;
	document.getElementById("loanClientSelfEmpCity").disabled = true;
	document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";

	document.getElementById("loanClientSelfEmpCompanyName").required = false;
	document.getElementById("loanClientSelfEmpMonIncome").required = false;
	document.getElementById("loanClientSelfEmpType").required = false;
	document.getElementById("loanClientSelfEmpAPro").required = false;
	document.getElementById("loanClientSelfEmpProvince").required = false;
	document.getElementById("loanClientSelfEmpStreet").required = false;
	document.getElementById("loanClientSelfStartDate").required = false;
	document.getElementById("loanClientSelfEmpNOE").required = false;
	document.getElementById("loanClientSelfEmpBSector").required = false;
	document.getElementById("loanClientSelfEmpFoRe").required = false;
	document.getElementById("loanClientSelfEmpCity").required = false;

	document.getElementById("loanClientSelfEmpCompanyName").value = "";
	document.getElementById("loanClientSelfEmpMonIncome").value = "";
	document.getElementById("loanClientSelfEmpType").value = "";
	document.getElementById("loanClientSelfEmpAPro").value = "";
	document.getElementById("loanClientSelfEmpProvince").value = "";
	document.getElementById("loanClientSelfEmpStreet").value = "";
	document.getElementById("loanClientSelfStartDate").value = "";
	document.getElementById("loanClientSelfEmpNOE").value = "";
	document.getElementById("loanClientSelfEmpBSector").value = "";
	document.getElementById("loanClientSelfEmpFoRe").value = "";
	document.getElementById("loanClientSelfEmpCity").value = "";

	//loan information
	document.getElementById("loanClientDuration").disabled = false;
	document.getElementById("loanClientPrincipal").disabled = false;
	document.getElementById("loanClientNORe").disabled = false;
	document.getElementById("loanClientAIR").disabled = false;
	document.getElementById("loanClientDuTy").disabled = false;
	document.getElementById("loanClientDiDate").disabled = false;
	document.getElementById("loanClientInType").disabled = false;
	document.getElementById("loanClientICPT").disabled = false;
	document.getElementById("loanClientReason").disabled = false;
	document.getElementById("loanClientAmortizationType").disabled = false;
	document.getElementById("loanClientAmortizationType").value = "";
	document.getElementById("loanClientDuration").value = "";
	document.getElementById("loanClientPrincipal").value = "";
	document.getElementById("loanClientNORe").value = "";
	document.getElementById("loanClientAIR").value = "";
	//    document.getElementById("loanClientDuTy").value = "";
	document.getElementById("loanClientDiDate").value = "";
	document.getElementById("loanClientInType").value = "";
	document.getElementById("loanClientICPT").value = "";
	document.getElementById("loanClientReason").value = "";
	document.getElementById('loanClientDiDate').required = true;


	//    //credit information
	//    document.getElementById("loanClientCerditCT").disabled = false;
	//    document.getElementById("loanClientCerditCTV").disabled = true;
	//
	//    document.getElementById("loanClientCerditCT").value = "";
	//    document.getElementById("loanClientCerditCTV").value = "";
	//
	//    document.getElementById("loanClientCerditCTV").required = false;
	//
	//    Options.self.bindFileUploadBtn('')
	//    //guarantor
	//    document.getElementById("loanClientHaveGuarantor").disabled = false;
	//    document.getElementById("loanClientGuarantorName").disabled = true;
	//    document.getElementById("loanClientGuarantorIncome").disabled = true;
	//
	//    document.getElementById("loanClientGuarantorName").value = "";
	//    document.getElementById("loanClientGuarantorIncome").value = "";
	//    document.getElementById("loanClientHaveGuarantor").value = "";

	$("#createLoanApplicationBottom").show();
	$("#confirmLoanApplicationBottom").hide();
	$("#modifyLoanApplicationBottom").hide();
	$("#listLoanApplicationBottom").hide();
	$("#newLoanApplicationBottom").hide();
	if (isTest) {
		Options.self.initTestData();
		$('#saveColleteralImage').on('click', function(e) {
			e.preventDefault();
			var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
			$collateralPanelBodies.each(function(index, panel, arr) {
				console.log(index);
				Options.self.uploadCollateral(140, '685PHKUV', index);
			});
		});
	}
	//bind data to the controls for an edit in case the extended data for the client exists already
	if (exists(Options.self.loanType) && Options.self.loanType === 'GROUP') {

		var groupObject = GroupHandler.prototype.getGroupObject();
		console.log(groupObject);

		if (exists(groupObject) && exists(groupObject.clientsExtendedData)) {
			var clientsExtendedData = groupObject.clientsExtendedData;
			if (exists(clientsExtendedData)) {
				var clientData = GroupHandler.prototype.getClientExtendedData(clientlist[0]['awamoId']);
				if (exists(clientData)) {
					GroupHandler.prototype.bindPersonalInfoFields(clientData);
					return;
				}
			}

		}
	}

	registerKeyPressValidators($('#createLoanApplicationForm'));
};

Options.prototype.uploadCollateralFromArray = function(loanId, awamoId, callback) {
	Options.collateralUpdateIndex = 0;

	/****** Improvise ******/
	collateralImageCreateFormDataArr = Collateral.makeImageArrayForProcessEngine();
	/****** Improvise ******/
	var collateralImagesToUpload = collateralImageCreateFormDataArr.length;
	console.log('uploading credit collateral');
	if (collateralImageCreateFormDataArr.length > 0) {
		for (var i = 0; i < collateralImageCreateFormDataArr.length; i++) {
			var fd = collateralImageCreateFormDataArr[i].fd;
			if (exists(fd)) {
				//var file_data = fd.payload;
				console.log('uplaoding credit collateral for: ' + awamoId + "-" + loanId);
				//var file_data = imageSelectEl.prop("files")[0]; // for multiple files
				//var fd = new FormData();
				var obj = {
					//"payload": file_data,
					"datatype": "COLLATERAL_IMG_1",
					"deviceId": "CockpitUI",
					"loanId": loanId,
					"authentication": authentication,
					//"tenantId": tenantId,
					"awamoId": awamoId,
					"index": i //$('#loanClientCerditCT').val()
				};
				console.log("-----payload-----");
				console.log(JSON.stringify(obj));
				//fd.append("payload", file_data);
				fd.append("datatype", "COLLATERAL_IMG_1");
				fd.append("deviceId", "CockpitUI");
				fd.append("loanId", loanId);
				fd.append("authentication", authentication);
				fd.append("tenantId", tenantId);
				fd.append("awamoId", awamoId);
				fd.append("index", i); // $('#loanClientCerditCT').val());
				//console.log(file_data)
				console.log("The form data: ", fd);
				$.ajax({
					url: host + "/loan/v1d/upload/co",
					data: fd,
					contentType: false,
					processData: false,
					//cache: false,
					type: 'POST',
					headers: getAuthenticationHeader(),
					enctype: 'multipart/form-data',
					// timeout: 2000,
					beforeSend: function() {
						showLoader('Uploading credit collateral images : ' + i + 1);
						++Options.collateralUpdateIndex;
					},
					success: function(data) {
						console.log(data);
						//hideLoader();
						//TO DO, create a retry strategy
						//showAlertMessage('Credit Colleteral created successfully', AlertTypes.success);
						var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
						try {
							collateralImageCreateFormDataArr.splice(collateralImageCreateFormDataArr.indexOf(i), 1);
						} catch (err) {
							console.log(err);
							manageErrors(err);
						}

						if (Options.collateralUpdateIndex >= $collateralPanelBodies.length) {
							//Options.prototype.loanCreationPassed();
							callback();
						}
					},
					complete: function() {
						//Options.collateralUpdateIndex=0;
						//hideLoader();
					}
				}).fail(function(Response) {
					//TO DO, create a retry strategy
					//Options.collateralUpdateIndex = 0;
					console.log(Response);
					hideLoader();
					showAlertMessage('Credit Colleteral creation failed, please contact the support', AlertTypes.danger);
				}).always(function(response) {
					collateralImagesToUpload--;
					if (collateralImagesToUpload === 0 && collateralImageCreateFormDataArr.length !== 0) {
						showDialogPopupWithHandlers(collateralImageCreateFormDataArr.length + " collateral images failed to upload",
							"Do you want to retry uploading them?",
							"Yes",
							function() {
								Options.prototype.uploadCollateralFromArray(loanId, awamoId, callback);
							},
							"No",
							function() {
								callback();
							});
					}
				});
			} else {
				continue;
				//hideLoader();
				//showAlertMessage('Credit Colleteral created successfully', AlertTypes.success);
				//Options.prototype.clientCreationPassed();
			}

		}
	} else {
		callback();
	}
	$('#saveColleteralImage').off('click');
	$('#saveColleteralImage').on('click', function(e) {
		e.preventDefault();
		var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
		$collateralPanelBodies.each(function(index, panel) {
			Options.self.uploadCollateral(140, '685PHKUV', index);
		});
	});
	Collateral.collaterals = [];
};

Options.prototype.uploadCollateral = function(loanId, awamoId, index, idIndex) {

	console.log('uplaoding credit collateral');
	var imageSelectEl = null; // $('#collateralImageIDSelector' + (idIndex === null ? '' : '_' + idIndex));
	if (idIndex === null) {
		imageSelectEl = $('#collateralImageIDSelector');
	} else {
		imageSelectEl = $('#collateralImageIDSelector_' + idIndex);
	}


	//var imageSelectEl = $('#collateralImageIDSelector' + (idIndex === null ? '' : '_' + idIndex));
	if (!(imageSelectEl[0].files.length === 0)) {
		console.log('uplaoding credit collateral for: ' + awamoId + "-" + loanId);
		var file_data = imageSelectEl.prop("files")[0]; // for multiple files
		var fd = new FormData();
		var obj = {
			"payload": file_data,
			"datatype": "COLLATERAL_IMG_1",
			"deviceId": "CockpitUI",
			"loanId": loanId,
			"authentication": authentication,
			//"tenantId": tenantId,
			"awamoId": awamoId,
			"index": index //$('#loanClientCerditCT').val()
		};
		console.log("-----payload-----");
		console.log(obj);
		fd.append("payload", file_data);
		fd.append("datatype", "COLLATERAL_IMG_1");
		fd.append("deviceId", "CockpitUI");
		fd.append("loanId", loanId);
		fd.append("authentication", authentication);
		fd.append("tenantId", tenantId);
		fd.append("awamoId", awamoId);
		fd.append("index", index); // $('#loanClientCerditCT').val());
		//console.log(file_data)
		$.ajax({
			url: host + "/loan/v1d/upload/co",
			data: fd,
			contentType: false,
			processData: false,
			//cache: false,
			type: 'POST',
			headers: getAuthenticationHeader(),
			enctype: 'multipart/form-data',
			beforeSend: function() {
				loanList.showLoading();
			},
			success: function(data) {
				console.log(data);
				loanList.hideLoading();
				showAlertMessage('Credit Colleteral created successfully', AlertTypes.success);
				var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
				++Options.collateralUpdateIndex;
				if (Options.collateralUpdateIndex >= $collateralPanelBodies.length) {
					Options.prototype.loanCreationPassed();
				}
			},
			complete: function() {
				//Options.collateralUpdateIndex=0;
				loanList.hideLoading();
			}
		}).fail(function(Response) {
			Options.collateralUpdateIndex = 0;
			console.log(Response);
			loanList.hideLoading();
			showAlertMessage('Credit Colleteral creation failed, please contact the support', AlertTypes.danger);
		});
	} else {
		loanList.hideLoading();
		showAlertMessage('Credit Colleteral created successfully', AlertTypes.success);
		Options.prototype.clientCreationPassed();
	}
	$('#saveColleteralImage').off('click');
	$('#saveColleteralImage').on('click', function(e) {
		e.preventDefault();
		var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
		$collateralPanelBodies.each(function(index, panel) {
			Options.self.uploadCollateral(140, '685PHKUV', index);
		});
	});
};

Options.prototype.buildCollateralTemplate = function(index) {
	if (!exists(index)) {
		arrNumCollaterals = [];
	} else {
		arrNumCollaterals.push(index);
		console.log("Here are the indices: ", arrNumCollaterals);
	}
	//alert('binding hit');
	var $coallatralInfoPlaceHol = $('#coallatralInfoPlaceHol');
	var $templcollateralInfoTemplate = $('#templcollateralInfoTemplate').clone();;
	var $panelBodyDiv = $('.panel-body', $templcollateralInfoTemplate);
	$panelBodyDiv.attr('id', index);
	if (index === null) {
		$('hr', $panelBodyDiv).remove();
		$panelBodyDiv.attr('id', 0);
	}
	if (index) {
		console.log("The index is here");
		$('.extra-guarantor', $panelBodyDiv).css('display', 'none');
	}
	//alert('secondary binding');
	var imageEl = $('#templcollateralImageID11', $templcollateralInfoTemplate);
	imageEl.attr('id', 'collateralImageID11' + (index === null ? '' : '_' + index));
	var imageFileSelectEl = $('#templcollateralImageIDSelector', $templcollateralInfoTemplate);
	imageFileSelectEl.attr('id', 'collateralImageIDSelector' + (index === null ? '' : '_' + index));
	var loanClientCerditCTEl = $('#templloanClientCerditCT', $templcollateralInfoTemplate);
	loanClientCerditCTEl.removeAttr('disabled');
	loanClientCerditCTEl.val('');
	loanClientCerditCTEl.attr('id', 'loanClientCerditCT' + (index === null ? '' : '_' + index));
	var loanClientCerditCTVEl = $('#templloanClientCerditCTV', $templcollateralInfoTemplate);
	loanClientCerditCTVEl.attr('disabled', 'disabled');
	loanClientCerditCTVEl.val('');
	loanClientCerditCTVEl.attr('required', false);
	loanClientCerditCTVEl.attr('id', 'loanClientCerditCTV' + (index === null ? '' : '_' + index));
	var loanClientCerditDesc = $('#templloanClientCerditDesc', $templcollateralInfoTemplate);
	loanClientCerditDesc.attr('disabled', 'disabled');
	loanClientCerditDesc.val('');
	loanClientCerditDesc.attr('required', false);
	loanClientCerditDesc.attr('id', 'loanClientCerditDesc' + (index === null ? '' : '_' + index));
	//collateral events
	loanClientCerditCTEl.on('change', function(e) {
		if (loanClientCerditCTEl.val() === 'UNSECURED') {
			loanClientCerditCTVEl.attr('disabled', 'disabled');
			loanClientCerditDesc.attr('disabled', 'disabled');
			loanClientCerditDesc.val('');
			imageFileSelectEl.attr('disabled', 'disabled');
			imageEl.attr('src', 'images/placeholder.png');
			$('#' + 'addMoreCollaterals' + (index === null ? '' : '_' + index)).css('display', 'none');
		} else {
			loanClientCerditCTVEl.removeAttr('disabled').attr('required', true);
			imageFileSelectEl.removeAttr('disabled');
			loanClientCerditDesc.removeAttr('disabled');
			$('#' + 'addMoreCollaterals' + (index === null ? '' : '_' + index)).css('display', 'block');
		}
		registerKeyPressValidators($('#createLoanApplicationForm'));
		//        if (loanClientCerditCTEl.val() === 'OTHERS' &&loanClientCerditCTEl.val() !== 'UNSECURED') {
		//            loanClientCerditDesc.attr('required',true);
		//        }else {
		//            loanClientCerditDesc.removeAttr('disabled');
		//        }
	});
	var loanClientHaveGuarantorEl = $('#templloanClientHaveGuarantor', $templcollateralInfoTemplate);
	var loanClientGuarantorIncomeEl = $('#templloanClientGuarantorIncome', $templcollateralInfoTemplate);
	var loanClientGuarantorNameEl = $('#templloanClientGuarantorName', $templcollateralInfoTemplate);
	// conditionally add a guaranter , but only once for the cuurent case, till we get
	//  a requirement for multiple guaranters
	if (index === null) {
		loanClientHaveGuarantorEl.removeAttr('disabled');
		loanClientHaveGuarantorEl.attr('id', 'loanClientHaveGuarantor' + (index === null ? '' : '_' + index));
		loanClientGuarantorIncomeEl.attr('disabled', 'disabled');
		loanClientGuarantorIncomeEl.val('');
		loanClientGuarantorIncomeEl.attr('id', 'loanClientGuarantorIncome' + (index === null ? '' : '_' + index));
		loanClientGuarantorNameEl.attr('disabled', 'disabled');
		loanClientGuarantorNameEl.val('');
		loanClientGuarantorNameEl.attr('id', 'loanClientGuarantorName' + (index === null ? '' : '_' + index));
		//guarantor events
		loanClientHaveGuarantorEl.on('change', function(e) {
			if (loanClientHaveGuarantorEl.val() === 'YES') {
				loanClientGuarantorNameEl.removeAttr('disabled', 'disabled');
				loanClientGuarantorNameEl.val('');
				loanClientGuarantorIncomeEl.removeAttr('disabled');
				loanClientGuarantorIncomeEl.val('');
			} else {
				loanClientGuarantorNameEl.attr('disabled', 'disabled');
				loanClientGuarantorNameEl.val('');
				loanClientGuarantorIncomeEl.attr('disabled', 'disabled');
				loanClientGuarantorIncomeEl.val('');
			}
		});
	} else {
		loanClientHaveGuarantorEl.parent().parent('.form-group').remove();
		loanClientGuarantorIncomeEl.parent().parent('.form-group').remove();
		loanClientGuarantorNameEl.parent().parent('.form-group').remove();
	}

	$coallatralInfoPlaceHol.append($panelBodyDiv);
	//    console.log($coallatralInfoPlaceHol);
	//    var addMoreCollateralsEl = $('#templaddMoreCollateral');
	//    addMoreCollateralsEl.attr('id', 'addMoreCollaterals' + (index === null ? '' : '_' + index));
	var addMoreCollateralsEl = $('#addMoreCollaterals', $panelBodyDiv);
	addMoreCollateralsEl.attr('id', 'addMoreCollaterals' + (index === null ? '' : '_' + index));
	//    console.log(addMoreCollateralsEl);



	var lessCollateralsEl = $('#lessCollaterals', $panelBodyDiv);
	lessCollateralsEl.attr('id', 'lessCollaterals' + (index === null ? '' : '_' + index));
	//    console.log(lessCollateralsEl);


	if (index !== null || index === 0) {
		addMoreCollateralsEl.css('display', 'block');
		lessCollateralsEl.css('display', 'block');
		console.log("I have both block");
	} else {
		addMoreCollateralsEl.css('display', 'block');
		lessCollateralsEl.css('display', 'none');
		console.log("It's only the add displayed");
	}
	$('#' + 'addMoreCollaterals' + (index === null ? '' : '_' + index)).on('click', function(e) {
		Options.prototype.buildCollateralTemplate((++collateralIndex));
		var that = $(this);
		$('#' + 'lessCollaterals' + (index === null ? '' : '_' + index)).css('display', 'none');
		that.css('display', 'none');
		if (index !== null) {
			//            arrNumCollaterals.push(parseInt(index));
			//            console.log(arrNumCollaterals);
			//            that.css('display', 'none');
			lessCollateralsEl.css('display', 'block');
		} else {
			// arrNumCollaterals.push(0);
			//that.css('display', 'none');
			lessCollateralsEl.css('display', 'none');
		}

	});
	/* $('#' + 'lessCollaterals' + (index === null ? '' : '_' + index)).on('click', function (e) {
	 var that = $(this);
	 removePanel.that=that;
	 var tempLoan = $('.templloanClientCerditCT', $panelBodyDiv).val();
	 console.log("The temp loan: ", tempLoan);
	 if (tempLoan === "UNSECURED" || tempLoan === "") {
	 removePanel();
	 } else {
	 // Dialog box
	 var confirmDialogHeader = 'Please confirm';
	 var confirmDialogBody = 'Are you sure you want to delete this section';
	 var confirmDialogPositiveText = 'Confirm';
	 var confirmDialogNegativeText = 'Cancel';
	 showDialogPopupWithHandlers(confirmDialogHeader,
	 confirmDialogBody, confirmDialogPositiveText,
	 removePanel,
	 confirmDialogNegativeText);
	 return;
	 }
	 });
	 Options.prototype.bindFileUploadBtn(index);*/
	$('#' + 'lessCollaterals' + (index === null ? '' : '_' + index)).on('click', function(e) {
		var that = $(this);
		var tempLoan = $('.templloanClientCerditCT', $panelBodyDiv).val();
		console.log("The temp loan: ", tempLoan);
		if (tempLoan === "UNSECURED" || tempLoan === "") {
			removePanel();
		} else {
			// Dialog box
			var confirmDialogHeader = 'Please confirm';
			var confirmDialogBody = 'Are you sure you want to delete this section';
			var confirmDialogPositiveText = 'Confirm';
			var confirmDialogNegativeText = 'Cancel';
			showDialogPopupWithHandlers(confirmDialogHeader,
				confirmDialogBody, confirmDialogPositiveText,
				removePanel,
				confirmDialogNegativeText);
			return;
		}

		function removePanel() {
			var id = that.attr('id');
			var idSplit = id.split('_');
			if (idSplit.length > 0) {
				var panelIndex = idSplit[1];
				if (exists(panelIndex)) {
					$('#addMoreCollaterals').removeClass('hidden');
					var elExists = false;
					for (var i = (parseInt(panelIndex) - 1); i > 0; i--) {
						var c = arrNumCollaterals[i];
						var el = $('#' + 'addMoreCollaterals_' + i);
						if (exists(c)) {
							elExists = true;
							el.css('display', 'block');
							//alert(i)
							console.log(el);
							break;
						}

					}
					if (!elExists) {
						//alert(elExists)
						$('#addMoreCollaterals').css('display', 'block');
					}
				} else {

					$('#addMoreCollaterals').removeClass('hidden');
				}
			}
			console.log(arrNumCollaterals);
			arrNumCollaterals.splice(arrNumCollaterals.indexOf(index), 1);
			collateralImageCreateFormDataArr.splice(collateralImageCreateFormDataArr.indexOf(index));
			console.log('collateral image array after splice');
			console.log(collateralImageCreateFormDataArr);
			$panelBodyDiv.remove();
			delete $panelBodyDiv;
			console.log("Here are the indices again: ", arrNumCollaterals);
			console.log("The number of panels is: ", arrNumCollaterals.length);
			if (index !== null || index === arrNumCollaterals[arrNumCollaterals.length - 1]) {
				var prevPanelAdd = '#addMoreCollaterals';
				if (index !== null && index > 1) {
					prevPanelAdd += "_";
					prevPanelAdd += (index - 1);
				}
				console.log("The previous panel is: ", prevPanelAdd);
			}
			$('#' + 'addMoreCollaterals' + (index === null ? '' : '_' + (index - 1))).css('display', 'block');
		}
	});
	Options.self.bindFileUploadBtn(index);
	$('.addonToolTip').tooltip({ placement: 'bottom' });
};

Options.prototype.bindFileUploadBtn = function(index) {
	//alert('hit')
	//alert(index)
	$('#collateralImageIDSelector' + (index === null ? '' : '_' + index)).on('change', function(event) {
		var reader = new FileReader();
		var file = event.target.files[0];
		var resizedImage = "";
		var dataUrl = "";
		//alert('here')

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
				document.getElementById("collateralImageID11" + (index === null ? '' : '_' + index)).src = canvas.toDataURL();
				collateralImageCreateFormData = new FormData(canvas.toDataURL("image/jpeg", 1.0));
				var formData = new FormData();
				formData.append("payload", file);

				collateralImageCreateFormDataArr.push({ index: (index === null ? 0 : index), fd: formData });
				console.log('collateralImageCreateFormDataArr after adding');
				console.log(collateralImageCreateFormDataArr);
			};
			image.src = e.target.result;
			// get loaded data and render thumbnail.
			//$('#manageClientImageID').attr("src", e.target.result);
		};
		// read the image file as a data URL.
		reader.readAsDataURL(file);
	});
};

Options.prototype.initGroupLoanApplicationPage = function(groupObj) {
	GroupHandler.prototype.displayGroupLoan(groupObj, true);
	document.getElementById("loanClientImageID1").src = "images/personPlaceholderNoText.png";
	loanEmpStartDate = "";
	loanSelfEmpStartDate = "";
	grouploanAppDate = "";
	document.getElementById("groupLoanAwamoId").value = groupObj['awamoId'];
	//fill client data
	/*var clientlist = clientList.getEntities().filter(function (client) {
	 return client.awamoId === groupAwamoId;
	 });
	 document.getElementById("loanClientAwamoId").value = clientlist[0]['awamoId'];
	 document.getElementById("loanClientFirstName").value = clientlist[0]['firstname'];
	 document.getElementById("loanClientMiddleName").value = clientlist[0]['middlename'];
	 document.getElementById("loanClientLastName").value = clientlist[0]['lastname'];
	 document.getElementById("loanClientBirthdate").value = formatDate(clientlist[0]['birthdate']);
	 document.getElementById("loanClientNationality").value = clientlist[0]['nationality'];
	 document.getElementById("loanClientSubmitdate").value = formatDate(clientlist[0]['submitDate']);
	 document.getElementById("loanClientIdDocumentType").value = clientlist[0]['iddocumenttype'];
	 document.getElementById("loanClientIdDocument").value = clientlist[0]['iddocument'];
	 document.getElementById("loanClientPhone1").value = clientlist[0]['phone1'];
	 document.getElementById("loanClientPhone2").value = clientlist[0]['phone2'];
	 document.getElementById("loanClientGender").value = clientlist[0]['gender'];
	 document.getElementById("loanClientLocation").value = clientlist[0]['site'];

	 $.ajax({
	 url: host + '/client/v1d/find?' +
	 'awamoId=' + clientlist[0]['awamoId'] + '&' +
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
	 document.getElementById("loanClientImageID1").src = e.target.result;
	 };
	 fr.readAsDataURL(blob);
	 })
	 .fail(function (e) {
	 document.getElementById("loanClientImageID1").src = "images/personPlaceholderNoText.png";
	 console.log('fail');
	 console.log(e);
	 });*/

	//client information
	document.getElementById("loanClientProvince").disabled = false;
	document.getElementById("loanClientCity").disabled = false;
	document.getElementById("loanClientFirstNOCIH").disabled = false;
	document.getElementById("loanClientLivingArea").disabled = false;
	document.getElementById("loanClientStreet").disabled = false;
	document.getElementById("loanClientNOC").disabled = false;
	document.getElementById("loanClientMartialStatus").disabled = false;
	document.getElementById("loanClientEmployed").disabled = false;
	document.getElementById("loanClientSelfEmployed").disabled = false;
	document.getElementById("loanClientProvince").value = "";
	document.getElementById("loanClientCity").value = "";
	document.getElementById("loanClientFirstNOCIH").value = "";
	document.getElementById("loanClientLivingArea").value = "";
	document.getElementById("loanClientStreet").value = "";
	document.getElementById("loanClientNOC").value = "";
	document.getElementById("loanClientMartialStatus").value = "";
	document.getElementById("loanClientEmployed").value = "";
	document.getElementById("loanClientSelfEmployed").value = "";
	//Employment Fields
	document.getElementById("loanClientEmpCompanyName").disabled = true;
	document.getElementById("loanClientEmpMonIncome").disabled = true;
	document.getElementById("loanClientEmpSector").disabled = true;
	document.getElementById("loanClientEmpProvince").disabled = true;
	document.getElementById("loanClientEmpStreet").disabled = true;
	document.getElementById("loanClientStartDate").disabled = true;
	document.getElementById("loanClientEmpNOE").disabled = true;
	document.getElementById("loanClientEmpFoRe").disabled = true;
	document.getElementById("loanClientEmpCity").disabled = true;
	document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";
	document.getElementById("loanClientEmpCompanyName").required = false;
	document.getElementById("loanClientEmpMonIncome").required = false;
	document.getElementById("loanClientEmpSector").required = false;
	document.getElementById("loanClientEmpProvince").required = false;
	document.getElementById("loanClientEmpStreet").required = false;
	document.getElementById("loanClientStartDate").required = false;
	document.getElementById("loanClientEmpNOE").required = false;
	document.getElementById("loanClientEmpFoRe").required = false;
	document.getElementById("loanClientEmpCity").required = false;
	document.getElementById("loanClientEmpCompanyName").value = "";
	document.getElementById("loanClientEmpMonIncome").value = "";
	document.getElementById("loanClientEmpSector").value = "";
	document.getElementById("loanClientEmpProvince").value = "";
	document.getElementById("loanClientEmpStreet").value = "";
	document.getElementById("loanClientStartDate").value = "";
	document.getElementById("loanClientEmpNOE").value = "";
	document.getElementById("loanClientEmpFoRe").value = "";
	document.getElementById("loanClientEmpCity").value = "";
	//Self Employment Fields
	document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
	document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
	document.getElementById("loanClientSelfEmpType").disabled = true;
	document.getElementById("loanClientSelfEmpAPro").disabled = true;
	document.getElementById("loanClientSelfEmpProvince").disabled = true;
	document.getElementById("loanClientSelfEmpStreet").disabled = true;
	document.getElementById("loanClientSelfStartDate").disabled = true;
	document.getElementById("loanClientSelfEmpNOE").disabled = true;
	document.getElementById("loanClientSelfEmpBSector").disabled = true;
	document.getElementById("loanClientSelfEmpFoRe").disabled = true;
	document.getElementById("loanClientSelfEmpCity").disabled = true;
	document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";
	document.getElementById("loanClientSelfEmpCompanyName").required = false;
	document.getElementById("loanClientSelfEmpMonIncome").required = false;
	document.getElementById("loanClientSelfEmpType").required = false;
	document.getElementById("loanClientSelfEmpAPro").required = false;
	document.getElementById("loanClientSelfEmpProvince").required = false;
	document.getElementById("loanClientSelfEmpStreet").required = false;
	document.getElementById("loanClientSelfStartDate").required = false;
	document.getElementById("loanClientSelfEmpNOE").required = false;
	document.getElementById("loanClientSelfEmpBSector").required = false;
	document.getElementById("loanClientSelfEmpFoRe").required = false;
	document.getElementById("loanClientSelfEmpCity").required = false;
	document.getElementById("loanClientSelfEmpCompanyName").value = "";
	document.getElementById("loanClientSelfEmpMonIncome").value = "";
	document.getElementById("loanClientSelfEmpType").value = "";
	document.getElementById("loanClientSelfEmpAPro").value = "";
	document.getElementById("loanClientSelfEmpProvince").value = "";
	document.getElementById("loanClientSelfEmpStreet").value = "";
	document.getElementById("loanClientSelfStartDate").value = "";
	document.getElementById("loanClientSelfEmpNOE").value = "";
	document.getElementById("loanClientSelfEmpBSector").value = "";
	document.getElementById("loanClientSelfEmpFoRe").value = "";
	document.getElementById("loanClientSelfEmpCity").value = "";
	//loan information
	document.getElementById("loanClientDuration").disabled = false;
	document.getElementById("loanClientPrincipal").disabled = false;
	document.getElementById("loanClientNORe").disabled = false;
	document.getElementById("loanClientAIR").disabled = false;
	document.getElementById("loanClientDuTy").disabled = false;
	document.getElementById("loanClientDiDate").disabled = false;
	document.getElementById("loanClientInType").disabled = false;
	document.getElementById("loanClientICPT").disabled = false;
	document.getElementById("loanClientReason").disabled = false;
	document.getElementById("loanClientDuration").value = "";
	document.getElementById("loanClientPrincipal").value = "";
	document.getElementById("loanClientNORe").value = "";
	document.getElementById("loanClientAIR").value = "";
	//    document.getElementById("loanClientDuTy").value = "";
	document.getElementById("loanClientDiDate").value = "";
	document.getElementById("loanClientInType").value = "";
	document.getElementById("loanClientICPT").value = "";
	document.getElementById("loanClientReason").value = "";
	document.getElementById('loanClientDiDate').required = true;
	//credit information
	document.getElementById("loanClientCerditCT").disabled = false;
	document.getElementById("loanClientCerditCTV").disabled = true;
	document.getElementById("loanClientCerditCT").value = "";
	document.getElementById("loanClientCerditCTV").value = "";
	document.getElementById("loanClientCerditCTV").required = false;
	//guarantor
	document.getElementById("loanClientHaveGuarantor").disabled = false;
	document.getElementById("loanClientGuarantorName").disabled = true;
	document.getElementById("loanClientGuarantorIncome").disabled = true;
	document.getElementById("loanClientGuarantorName").value = "";
	document.getElementById("loanClientGuarantorIncome").value = "";
	document.getElementById("loanClientHaveGuarantor").value = "";
	$("#createLoanApplicationBottom").show();
	$("#confirmLoanApplicationBottom").hide();
	$("#modifyLoanApplicationBottom").hide();
	$("#listLoanApplicationBottom").hide();
	$("#newLoanApplicationBottom").hide();
	//Options.self.initTestData();
};

Options.prototype.validateDuration = function() {
	errors = [];
	if (parseFloat(Options.self.calculateLoanDuration()) < parseFloat($('#loanClientNORe').val())) {
		var durationEl = $('#loanClientDuration');
		var loanClientNORe = $('#loanClientNORe').val();
		var loanClientDuTy = $('#loanClientDuTy').val();
		var mess = '  -A Duration of (' + durationEl.val() + " " + loanClientDuTy + ')' + ' is too small for ' + loanClientNORe + ' Number Of Repayments to be made, please adjust your options';
		errors.push(mess);
	}
	if (errors.length > 0) {
		return false;
	}
	return true;
};

Options.prototype.toLoanConfirmPage = function() {
	//submitLoanApplicationTest();
	//return;
	if (!validateForm($('#createLoanApplicationForm'))) {
		showAlertMessage('Please ensure that all fields are filled in correctly', AlertTypes.danger);
	} else if (!Options.self.validateDuration()) {
		var errMesseges = "Incomplete Loan Application data : <br>" + errors.join('<br>');
		showAlertMessage(errMesseges + '', AlertTypes.warning);
	} else {
		//addHistory('create accounting entry', '#createAccountingEntry', getSidebarSubitemSelector('accounting', 'Accounting', 'create'));
		initDefaultContent('Please confirm the loan application data');
		showContent($('#createLoanApplication'));
		//client data
		document.getElementById("loanClientProvince").disabled = true;
		document.getElementById("loanClientCity").disabled = true;
		document.getElementById("loanClientFirstNOCIH").disabled = true;
		document.getElementById("loanClientLivingArea").disabled = true;
		document.getElementById("loanClientStreet").disabled = true;
		document.getElementById("loanClientNOC").disabled = true;
		document.getElementById("loanClientMartialStatus").disabled = true;
		//emplyment data
		document.getElementById("loanClientEmployed").disabled = true;
		document.getElementById("loanClientEmpCompanyName").disabled = true;
		document.getElementById("loanClientEmpMonIncome").disabled = true;
		document.getElementById("loanClientEmpSector").disabled = true;
		document.getElementById("loanClientEmpProvince").disabled = true;
		document.getElementById("loanClientStartDate").disabled = true;
		document.getElementById("loanClientEmpNOE").disabled = true;
		document.getElementById("loanClientEmpFoRe").disabled = true;
		document.getElementById("loanClientEmpCity").disabled = true;
		document.getElementById("loanClientEmpStreet").disabled = true;
		document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";
		//selfemployment data
		document.getElementById("loanClientSelfEmployed").disabled = true;
		document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
		document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
		document.getElementById("loanClientSelfEmpBSector").disabled = true;
		document.getElementById("loanClientSelfEmpFoRe").disabled = true;
		document.getElementById("loanClientSelfEmpProvince").disabled = true;
		document.getElementById("loanClientSelfStartDate").disabled = true;
		document.getElementById("loanClientSelfEmpNOE").disabled = true;
		document.getElementById("loanClientSelfEmpType").disabled = true;
		document.getElementById("loanClientSelfEmpAPro").disabled = true;
		document.getElementById("loanClientSelfEmpCity").disabled = true;
		document.getElementById("loanClientSelfEmpStreet").disabled = true;
		document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";
		// loan data
		if (Options.self.loanType !== 'GROUP') {
			document.getElementById("loanClientDuration").disabled = true;
			document.getElementById("loanClientAmortizationType").disabled = true;
			document.getElementById("loanClientPrincipal").disabled = true;
			document.getElementById("loanClientNORe").disabled = true;
			document.getElementById("loanClientAIR").disabled = true;
			document.getElementById("loanClientDuTy").disabled = true;
			document.getElementById("loanClientDiDate").disabled = true;
			document.getElementById("loanClientInType").disabled = true;
			document.getElementById("loanClientICPT").disabled = true;
			document.getElementById("loanClientReason").disabled = true;
			document.getElementById("loanClientDiDate").style.backgroundColor = "#eee";
			//credit data
			// document.getElementById("loanClientCerditCT").disabled = true;
			// document.getElementById("loanClientCerditCTV").disabled = true;
			// document.getElementById("loanClientGuarantorName").disabled = true;
			// document.getElementById("loanClientGuarantorIncome").disabled = true;
			// document.getElementById("loanClientHaveGuarantor").disabled = true;
		}
		$("#createLoanApplicationBottom").hide();
		$("#confirmLoanApplicationBottom").show();
		$("#modifyLoanApplicationBottom").show();
		$("#listLoanApplicationBottom").hide();
		$("#newLoanApplicationBottom").hide();
	}


	//    if (
	//            //client data
	//            document.getElementById("loanClientProvince").checkValidity() &&
	//            document.getElementById("loanClientCity").checkValidity() &&
	//            document.getElementById("loanClientFirstNOCIH").checkValidity() &&
	//            document.getElementById("loanClientLivingArea").checkValidity() &&
	//            document.getElementById("loanClientStreet").checkValidity() &&
	//            document.getElementById("loanClientNOC").checkValidity() &&
	//            document.getElementById("loanClientMartialStatus").checkValidity() &&
	//            //emplyed
	//            document.getElementById("loanClientEmployed").checkValidity() &&
	//            document.getElementById("loanClientEmpCompanyName").checkValidity() &&
	//            document.getElementById("loanClientEmpMonIncome").checkValidity() &&
	//            document.getElementById("loanClientEmpSector").checkValidity() &&
	//            document.getElementById("loanClientEmpProvince").checkValidity() &&
	//            document.getElementById("loanClientStartDate").checkValidity() &&
	//            document.getElementById("loanClientEmpNOE").checkValidity() &&
	//            document.getElementById("loanClientEmpFoRe").checkValidity() &&
	//            document.getElementById("loanClientEmpCity").checkValidity() &&
	//            document.getElementById("loanClientEmpStreet").checkValidity() &&
	//            //self employed
	//            document.getElementById("loanClientSelfEmployed").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpCompanyName").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpMonIncome").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpBSector").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpFoRe").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpProvince").checkValidity() &&
	//            document.getElementById("loanClientSelfStartDate").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpNOE").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpType").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpAPro").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpCity").checkValidity() &&
	//            document.getElementById("loanClientSelfEmpStreet").checkValidity() &&
	//            //loan data
	//            document.getElementById("loanClientDiDate").checkValidity() &&
	//            Options.self.loanType !== 'GROUP' ? (
	//                    document.getElementById("loanClientDuration").checkValidity() &&
	//                    document.getElementById("loanClientPrincipal").checkValidity() &&
	//                    document.getElementById("loanClientNORe").checkValidity() &&
	//                    document.getElementById("loanClientAIR").checkValidity() &&
	//                    document.getElementById("loanClientDuTy").checkValidity() &&
	//                    document.getElementById("loanClientDiDate").checkValidity() &&
	//                    document.getElementById("loanClientInType").checkValidity() &&
	//                    document.getElementById("loanClientICPT").checkValidity() &&
	//                    document.getElementById("loanClientReason").checkValidity() &&
	//                    //credit data
	//                    document.getElementById("loanClientCerditCT").checkValidity() &&
	//                    document.getElementById("loanClientCerditCTV").checkValidity() &&
	//                    document.getElementById("loanClientGuarantorName").checkValidity() &&
	//                    document.getElementById("loanClientHaveGuarantor").checkValidity() &&
	//                    document.getElementById("loanClientGuarantorIncome").checkValidity()) : true
	//            )
	//    {
	//        //addHistory('create accounting entry', '#createAccountingEntry', getSidebarSubitemSelector('accounting', 'Accounting', 'create'));
	//        initDefaultContent('Please confirm the loan application data');
	//        showContent($('#createLoanApplication'));
	//
	//        //client data
	//        document.getElementById("loanClientProvince").disabled = true;
	//        document.getElementById("loanClientCity").disabled = true;
	//        document.getElementById("loanClientFirstNOCIH").disabled = true;
	//        document.getElementById("loanClientLivingArea").disabled = true;
	//        document.getElementById("loanClientStreet").disabled = true;
	//        document.getElementById("loanClientNOC").disabled = true;
	//        document.getElementById("loanClientMartialStatus").disabled = true;
	//        //emplyment data
	//        document.getElementById("loanClientEmployed").disabled = true;
	//        document.getElementById("loanClientEmpCompanyName").disabled = true;
	//        document.getElementById("loanClientEmpMonIncome").disabled = true;
	//        document.getElementById("loanClientEmpSector").disabled = true;
	//        document.getElementById("loanClientEmpProvince").disabled = true;
	//        document.getElementById("loanClientStartDate").disabled = true;
	//        document.getElementById("loanClientEmpNOE").disabled = true;
	//        document.getElementById("loanClientEmpFoRe").disabled = true;
	//        document.getElementById("loanClientEmpCity").disabled = true;
	//        document.getElementById("loanClientEmpStreet").disabled = true;
	//        document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";
	//        //selfemployment data
	//        document.getElementById("loanClientSelfEmployed").disabled = true;
	//        document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
	//        document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
	//        document.getElementById("loanClientSelfEmpBSector").disabled = true;
	//        document.getElementById("loanClientSelfEmpFoRe").disabled = true;
	//        document.getElementById("loanClientSelfEmpProvince").disabled = true;
	//        document.getElementById("loanClientSelfStartDate").disabled = true;
	//        document.getElementById("loanClientSelfEmpNOE").disabled = true;
	//        document.getElementById("loanClientSelfEmpType").disabled = true;
	//        document.getElementById("loanClientSelfEmpAPro").disabled = true;
	//        document.getElementById("loanClientSelfEmpCity").disabled = true;
	//        document.getElementById("loanClientSelfEmpStreet").disabled = true;
	//        document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";
	//        // loan data
	//        if (Options.self.loanType !== 'GROUP') {
	//            document.getElementById("loanClientDuration").disabled = true;
	//            document.getElementById("loanClientAmortizationType").disabled = true;
	//            document.getElementById("loanClientPrincipal").disabled = true;
	//            document.getElementById("loanClientNORe").disabled = true;
	//            document.getElementById("loanClientAIR").disabled = true;
	//            document.getElementById("loanClientDuTy").disabled = true;
	//            document.getElementById("loanClientDiDate").disabled = true;
	//            document.getElementById("loanClientInType").disabled = true;
	//            document.getElementById("loanClientICPT").disabled = true;
	//            document.getElementById("loanClientReason").disabled = true;
	//            document.getElementById("loanClientDiDate").style.backgroundColor = "#eee";
	//            //credit data
	//            document.getElementById("loanClientCerditCT").disabled = true;
	//            document.getElementById("loanClientCerditCTV").disabled = true;
	//            document.getElementById("loanClientGuarantorName").disabled = true;
	//            document.getElementById("loanClientGuarantorIncome").disabled = true;
	//            document.getElementById("loanClientHaveGuarantor").disabled = true;
	//
	//        }
	//        $("#createLoanApplicationBottom").hide();
	//        $("#confirmLoanApplicationBottom").show();
	//        $("#modifyLoanApplicationBottom").show();
	//        $("#listLoanApplicationBottom").hide();
	//        $("#newLoanApplicationBottom").hide();
	//    }
};

Options.prototype.modifyLoanCreationFields = function() {

	initDefaultContent('Create Loan Application');
	showContent($('#createLoanApplication'));
	document.getElementById("loanClientProvince").disabled = false;
	document.getElementById("loanClientCity").disabled = false;
	document.getElementById("loanClientFirstNOCIH").disabled = false;
	document.getElementById("loanClientLivingArea").disabled = false;
	document.getElementById("loanClientStreet").disabled = false;
	document.getElementById("loanClientNOC").disabled = false;
	document.getElementById("loanClientMartialStatus").disabled = false;
	document.getElementById("loanClientEmployed").disabled = false;
	document.getElementById("loanClientSelfEmployed").disabled = false;
	document.getElementById("loanClientDuration").disabled = false;
	document.getElementById("loanClientPrincipal").disabled = false;
	document.getElementById("loanClientNORe").disabled = false;
	document.getElementById("loanClientAIR").disabled = false;
	document.getElementById("loanClientDuTy").disabled = false;
	document.getElementById("loanClientDiDate").disabled = false;
	document.getElementById("loanClientInType").disabled = false;
	document.getElementById("loanClientICPT").disabled = false;
	document.getElementById("loanClientReason").disabled = false;
	document.getElementById("loanClientAmortizationType").disabled = false;
	if (Options.self.loanType !== 'GROUP') {
		document.getElementById("loanClientCerditCT").disabled = false;
		document.getElementById("loanClientCerditCTV").disabled = false;
		document.getElementById("loanClientGuarantorName").disabled = false;
		document.getElementById("loanClientGuarantorIncome").disabled = false;
		document.getElementById("loanClientHaveGuarantor").disabled = false;
	}

	if (document.getElementById("loanClientEmployed").value === "YES") {

		document.getElementById("loanClientEmpCompanyName").disabled = false;
		document.getElementById("loanClientEmpMonIncome").disabled = false;
		document.getElementById("loanClientEmpSector").disabled = false;
		document.getElementById("loanClientEmpProvince").disabled = false;
		document.getElementById("loanClientEmpStreet").disabled = false;
		document.getElementById("loanClientStartDate").disabled = false;
		document.getElementById("loanClientEmpNOE").disabled = false;
		document.getElementById("loanClientEmpFoRe").disabled = false;
		document.getElementById("loanClientEmpCity").disabled = false;
		document.getElementById("loanClientStartDate").style.backgroundColor = "white";
	} else {
		document.getElementById("loanClientEmpCompanyName").disabled = true;
		document.getElementById("loanClientEmpMonIncome").disabled = true;
		document.getElementById("loanClientEmpSector").disabled = true;
		document.getElementById("loanClientEmpProvince").disabled = true;
		document.getElementById("loanClientEmpStreet").disabled = true;
		document.getElementById("loanClientStartDate").disabled = true;
		document.getElementById("loanClientEmpNOE").disabled = true;
		document.getElementById("loanClientEmpFoRe").disabled = true;
		document.getElementById("loanClientEmpCity").disabled = true;
	}

	if (document.getElementById("loanClientSelfEmployed").value === "YES") {

		document.getElementById("loanClientSelfEmpCompanyName").disabled = false;
		document.getElementById("loanClientSelfEmpMonIncome").disabled = false;
		document.getElementById("loanClientSelfEmpBSector").disabled = false;
		document.getElementById("loanClientSelfEmpFoRe").disabled = false;
		document.getElementById("loanClientSelfEmpProvince").disabled = false;
		document.getElementById("loanClientSelfStartDate").disabled = false;
		document.getElementById("loanClientSelfEmpNOE").disabled = false;
		document.getElementById("loanClientSelfEmpType").disabled = false;
		document.getElementById("loanClientSelfEmpAPro").disabled = false;
		document.getElementById("loanClientSelfEmpCity").disabled = false;
		document.getElementById("loanClientSelfEmpStreet").disabled = false;
		document.getElementById("loanClientSelfStartDate").style.backgroundColor = "white";
		if (document.getElementById("loanClientSelfEmpType").value === "FARMER") {
			document.getElementById("loanClientSelfEmpAPro").disabled = false;
			document.getElementById("loanClientSelfEmpBSector").disabled = true;
		} else {

			if (document.getElementById("loanClientSelfEmpType").value === "OTHER") {
				document.getElementById("loanClientSelfEmpBSector").disabled = false;
				document.getElementById("loanClientSelfEmpAPro").disabled = true;
			} else {
				document.getElementById("loanClientSelfEmpBSector").disabled = true;
				document.getElementById("loanClientSelfEmpAPro").disabled = true;
			}
		}

	} else {
		document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
		document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
		document.getElementById("loanClientSelfEmpBSector").disabled = true;
		document.getElementById("loanClientSelfEmpFoRe").disabled = true;
		document.getElementById("loanClientSelfEmpProvince").disabled = true;
		document.getElementById("loanClientSelfStartDate").disabled = true;
		document.getElementById("loanClientSelfEmpNOE").disabled = true;
		document.getElementById("loanClientSelfEmpType").disabled = true;
		document.getElementById("loanClientSelfEmpAPro").disabled = true;
		document.getElementById("loanClientSelfEmpCity").disabled = true;
		document.getElementById("loanClientSelfEmpStreet").disabled = true;
	}
	if (Options.self.loanType !== 'GROUP') {
		if (document.getElementById("loanClientCerditCT").value === "UNSECURED" || document.getElementById("loanClientCerditCT").value === "") {
			document.getElementById("loanClientCerditCTV").disabled = true;
			$('#menu-share').addClass('hidden');
		} else {
			document.getElementById("loanClientCerditCTV").disabled = false;
			$('#menu-share').removeClass('hidden');
		}

		if (document.getElementById("loanClientHaveGuarantor").value === "YES") {
			document.getElementById("loanClientGuarantorIncome").disabled = false;
			document.getElementById("loanClientGuarantorName").disabled = false;
		} else {
			document.getElementById("loanClientGuarantorIncome").disabled = true;
			document.getElementById("loanClientGuarantorName").disabled = true;
		}
	}

	$("#createLoanApplicationBottom").show();
	$("#confirmLoanApplicationBottom").hide();
	$("#modifyLoanApplicationBottom").hide();
	$("#listLoanApplicationBottom").hide();
	$("#newLoanApplicationBottom").hide();
};

Options.prototype.loanCreationPassed = function() {
	//initDefaultContent('Loan application is submitted sucessfully');
	//    showContent($('#createLoanApplication'));
	//
	//    $("#createLoanApplicationBottom").hide();
	$("#confirmLoanApplicationBottom").hide();
	//    $("#modifyLoanApplicationBottom").hide();
	//    $("#listLoanApplicationBottom").show();
	//    $("#newLoanApplicationBottom").show();
	Options.self.emptyCollateralPlaceHolder();
	//LoanHandler.prototype.firstGenericLoanReports("ALL"); //firstGenericLoanReports

	LoanHandler.prototype.displayApplications();
	// $('html, body').animate({scrollTop: document.body.scrollHeight}, 'fast');
};

Options.prototype.loanApplicationCreationList = function() {
	$("#createLoanSideBar").removeClass('active');
	$("#createClientSideBar").addClass('hidden');
	$("#createLoanSideBar").addClass('hidden');
	$("#reporting").addClass('active');
	LoanHandler.prototype.firstGenericLoanReports();
	$('html, body').animate({
		scrollTop: 0
	}, 'fast');
};

Options.prototype.loanClientEmployedSelectHandler = function() {

	if (document.getElementById("loanClientEmployed").value === "YES") {
		document.getElementById("loanClientEmpCompanyName").required = true;
		document.getElementById("loanClientEmpCompanyName").disabled = false;
		document.getElementById("loanClientEmpMonIncome").required = true;
		document.getElementById("loanClientEmpMonIncome").disabled = false;
		document.getElementById("loanClientEmpSector").required = true;
		document.getElementById("loanClientEmpSector").disabled = false;
		document.getElementById("loanClientEmpProvince").required = true;
		document.getElementById("loanClientEmpProvince").disabled = false;
		document.getElementById("loanClientEmpStreet").required = true;
		document.getElementById("loanClientEmpStreet").disabled = false;
		document.getElementById("loanClientStartDate").required = true;
		document.getElementById("loanClientStartDate").disabled = false;
		document.getElementById("loanClientEmpNOE").required = true;
		document.getElementById("loanClientEmpNOE").disabled = false;
		document.getElementById("loanClientEmpFoRe").required = true;
		document.getElementById("loanClientEmpFoRe").disabled = false;
		document.getElementById("loanClientEmpCity").required = true;
		document.getElementById("loanClientEmpCity").disabled = false;
		document.getElementById("loanClientStartDate").style.backgroundColor = "white";
	} else {

		document.getElementById("loanClientEmpCompanyName").required = false;
		document.getElementById("loanClientEmpCompanyName").disabled = true;
		document.getElementById("loanClientEmpCompanyName").value = "";
		document.getElementById("loanClientEmpMonIncome").required = false;
		document.getElementById("loanClientEmpMonIncome").disabled = true;
		document.getElementById("loanClientEmpMonIncome").value = "";
		document.getElementById("loanClientEmpSector").required = false;
		document.getElementById("loanClientEmpSector").disabled = true;
		document.getElementById("loanClientEmpSector").value = "";
		document.getElementById("loanClientEmpProvince").required = false;
		document.getElementById("loanClientEmpProvince").disabled = true;
		document.getElementById("loanClientEmpProvince").value = "";
		document.getElementById("loanClientEmpStreet").required = false;
		document.getElementById("loanClientEmpStreet").disabled = true;
		document.getElementById("loanClientEmpStreet").value = "";
		document.getElementById("loanClientStartDate").required = false;
		document.getElementById("loanClientStartDate").disabled = true;
		document.getElementById("loanClientStartDate").value = "";
		document.getElementById("loanClientEmpNOE").required = false;
		document.getElementById("loanClientEmpNOE").disabled = true;
		document.getElementById("loanClientEmpNOE").value = "";
		document.getElementById("loanClientEmpFoRe").required = false;
		document.getElementById("loanClientEmpFoRe").disabled = true;
		document.getElementById("loanClientEmpFoRe").value = "";
		document.getElementById("loanClientEmpCity").required = false;
		document.getElementById("loanClientEmpCity").disabled = true;
		document.getElementById("loanClientEmpCity").value = "";
		document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";
	}
	registerKeyPressValidators($("#createLoanApplicationForm"));
};

Options.prototype.loanClientSelfEmployedSelectHandler = function() {

	if (document.getElementById("loanClientSelfEmployed").value === "YES") {
		document.getElementById("loanClientSelfEmpCompanyName").required = true;
		document.getElementById("loanClientSelfEmpCompanyName").disabled = false;
		document.getElementById("loanClientSelfEmpMonIncome").required = true;
		document.getElementById("loanClientSelfEmpMonIncome").disabled = false;
		document.getElementById("loanClientSelfEmpType").required = true;
		document.getElementById("loanClientSelfEmpType").disabled = false;
		document.getElementById("loanClientSelfEmpAPro").required = false;
		document.getElementById("loanClientSelfEmpAPro").disabled = true;
		document.getElementById("loanClientSelfEmpProvince").required = true;
		document.getElementById("loanClientSelfEmpProvince").disabled = false;
		document.getElementById("loanClientSelfStartDate").required = true;
		document.getElementById("loanClientSelfStartDate").disabled = false;
		document.getElementById("loanClientSelfEmpNOE").required = true;
		document.getElementById("loanClientSelfEmpNOE").disabled = false;
		document.getElementById("loanClientSelfEmpBSector").required = false;
		document.getElementById("loanClientSelfEmpBSector").disabled = true;
		document.getElementById("loanClientSelfEmpFoRe").required = true;
		document.getElementById("loanClientSelfEmpFoRe").disabled = false;
		document.getElementById("loanClientSelfEmpCity").required = true;
		document.getElementById("loanClientSelfEmpCity").disabled = false;
		document.getElementById("loanClientSelfEmpStreet").required = true;
		document.getElementById("loanClientSelfEmpStreet").disabled = false;
		document.getElementById("loanClientSelfStartDate").style.backgroundColor = "white";
	} else {

		document.getElementById("loanClientSelfEmpCompanyName").required = false;
		document.getElementById("loanClientSelfEmpCompanyName").disabled = true;
		document.getElementById("loanClientSelfEmpCompanyName").value = "";
		document.getElementById("loanClientSelfEmpMonIncome").required = false;
		document.getElementById("loanClientSelfEmpMonIncome").disabled = true;
		document.getElementById("loanClientSelfEmpMonIncome").value = "";
		document.getElementById("loanClientSelfEmpType").required = false;
		document.getElementById("loanClientSelfEmpType").disabled = true;
		document.getElementById("loanClientSelfEmpType").value = "";
		document.getElementById("loanClientSelfEmpAPro").required = false;
		document.getElementById("loanClientSelfEmpAPro").disabled = true;
		document.getElementById("loanClientSelfEmpAPro").value = "";
		document.getElementById("loanClientSelfEmpProvince").required = false;
		document.getElementById("loanClientSelfEmpProvince").disabled = true;
		document.getElementById("loanClientSelfEmpProvince").value = "";
		document.getElementById("loanClientSelfStartDate").required = false;
		document.getElementById("loanClientSelfStartDate").disabled = true;
		document.getElementById("loanClientSelfStartDate").value = "";
		document.getElementById("loanClientSelfEmpNOE").required = false;
		document.getElementById("loanClientSelfEmpNOE").disabled = true;
		document.getElementById("loanClientSelfEmpNOE").value = "";
		document.getElementById("loanClientSelfEmpBSector").required = false;
		document.getElementById("loanClientSelfEmpBSector").disabled = true;
		document.getElementById("loanClientSelfEmpBSector").value = "";
		document.getElementById("loanClientSelfEmpFoRe").required = false;
		document.getElementById("loanClientSelfEmpFoRe").disabled = true;
		document.getElementById("loanClientSelfEmpFoRe").value = "";
		document.getElementById("loanClientSelfEmpCity").required = false;
		document.getElementById("loanClientSelfEmpCity").disabled = true;
		document.getElementById("loanClientSelfEmpCity").value = "";
		document.getElementById("loanClientSelfEmpStreet").required = false;
		document.getElementById("loanClientSelfEmpStreet").disabled = true;
		document.getElementById("loanClientSelfEmpStreet").value = "";
		document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";
	}
	registerKeyPressValidators($("#createLoanApplicationForm"));
};

Options.prototype.loanClientSelfEmployedEmploymentTypeSelectHandler = function() {
	if (document.getElementById("loanClientSelfEmpType").value === "FARMER") {
		document.getElementById("loanClientSelfEmpAPro").required = true;
		document.getElementById("loanClientSelfEmpAPro").disabled = false;
		document.getElementById("loanClientSelfEmpBSector").required = false;
		document.getElementById("loanClientSelfEmpBSector").disabled = true;
		document.getElementById("loanClientSelfEmpBSector").value = "";
	} else {

		if (document.getElementById("loanClientSelfEmpType").value === "OTHER") {
			document.getElementById("loanClientSelfEmpBSector").required = true;
			document.getElementById("loanClientSelfEmpBSector").disabled = false;
			document.getElementById("loanClientSelfEmpAPro").required = false;
			document.getElementById("loanClientSelfEmpAPro").disabled = true;
			document.getElementById("loanClientSelfEmpAPro").value = "";
		} else {
			document.getElementById("loanClientSelfEmpBSector").required = false;
			document.getElementById("loanClientSelfEmpBSector").disabled = true;
			document.getElementById("loanClientSelfEmpBSector").value = "";
			document.getElementById("loanClientSelfEmpAPro").required = false;
			document.getElementById("loanClientSelfEmpAPro").disabled = true;
			document.getElementById("loanClientSelfEmpAPro").value = "";
		}
	}
};

Options.prototype.loanClientCreditTypeSelectHandler = function() {
	if (document.getElementById("loanClientCerditCT").value === "UNSECURED" || document.getElementById("loanClientCerditCT").value === "") {
		document.getElementById("loanClientCerditCTV").required = false;
		document.getElementById("loanClientCerditCTV").disabled = true;
		document.getElementById("loanClientCerditCTV").value = "";
		$('#addMoreCollaterals').css('display', 'none');
		$('#menu-share').addClass('hidden');
	} else {
		document.getElementById("loanClientCerditCTV").required = true;
		document.getElementById("loanClientCerditCTV").disabled = false;
		$('#addMoreCollaterals').css('display', 'block');
		$('#menu-share').removeClass('hidden');
	}
};

Options.prototype.loanClientGuarantorSelectHandler = function() {
	if (document.getElementById("loanClientHaveGuarantor").value !== "YES") {
		document.getElementById("loanClientGuarantorIncome").required = false;
		document.getElementById("loanClientGuarantorIncome").disabled = true;
		document.getElementById("loanClientGuarantorIncome").value = "";
		document.getElementById("loanClientGuarantorName").required = false;
		document.getElementById("loanClientGuarantorName").disabled = true;
		document.getElementById("loanClientGuarantorName").value = "";
	} else {
		document.getElementById("loanClientGuarantorIncome").required = true;
		document.getElementById("loanClientGuarantorIncome").disabled = false;
		document.getElementById("loanClientGuarantorName").required = true;
		document.getElementById("loanClientGuarantorName").disabled = false;
	}
};

Options.prototype.buildCollateralList = function(loanObj) {
	var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
	var collateralArray = [];
	// $collateralPanelBodies.each(function(index, panel) {
	//  var creditColateralType = $('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val();
	//  var creditCollateralValue = $('#loanClientCerditCTV' + (index === 0 ? '' : '_' + index)).val();
	//  var loanClientCerditDesc = $('#loanClientCerditDesc' + (index === 0 ? '' : '_' + index)).val();
	//  if (creditColateralType !== 'UNSECURED') {
	//      if (Number.isNaN(creditCollateralValue)) {
	//          console.log(creditCollateralValue);
	//          showAlertMessage('Collateral must have a value attached if is of any other type apart from UNSECURED', AlertTypes.warning);
	//          throw new Error("Collateral must have a value attached if is of any other type apart from UNSECURED");
	//      }
	//  }
	//  if (creditColateralType === 'OTHERS') {
	//      if (loanClientCerditDesc.length < 5) {
	//          showAlertMessage('For Collaterals of type OTHERS, you must supply a description of more than 5 characters', AlertTypes.warning);
	//          throw new Error("For Collaterals of type OTHERS, you must supply a description");
	//      }
	//  }

	//  var collateralObj = {
	//      'index': index,
	//      'type': $('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val(),
	//      'description': $('#loanClientCerditDesc' + (index === 0 ? '' : '_' + index)).val(),
	//      'value': $('#loanClientCerditCTV' + (index === 0 ? '' : '_' + index)).val() + '00'
	//  };
	//  if ($('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val() !== "UNSECURED" && $('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val() !== '') {
	//      console.log('collateral number: ' + index);
	//      //loanObj.creditCollaterals.push(collateralObj);
	//      collateralArray.push(collateralObj);
	//  }
	// });
	if ($collateralPanelBodies.length > 0) {
		$collateralPanelBodies.each(function(index, panel) {
			var creditColateralType = $('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val();
			var creditCollateralValue = $('#loanClientCerditCTV' + (index === 0 ? '' : '_' + index)).val();
			var loanClientCerditDesc = $('#loanClientCerditDesc' + (index === 0 ? '' : '_' + index)).val();
			if (creditColateralType !== 'UNSECURED') {
				if (Number.isNaN(creditCollateralValue)) {
					console.log(creditCollateralValue);
					showAlertMessage('Collateral must have a value attached if is of any other type apart from UNSECURED', AlertTypes.warning);
					throw new Error("Collateral must have a value attached if is of any other type apart from UNSECURED");
				}
			}
			if (creditColateralType === 'OTHERS') {
				if (loanClientCerditDesc.length < 5) {
					showAlertMessage('For Collaterals of type OTHERS, you must supply a description of more than 5 characters', AlertTypes.warning);
					throw new Error("For Collaterals of type OTHERS, you must supply a description");
				}
			}

			var collateralObj = {
				'index': index,
				'type': $('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val(),
				'description': $('#loanClientCerditDesc' + (index === 0 ? '' : '_' + index)).val(),
				'value': unformatCurrency(removeThousandCommas($('#loanClientCerditCTV' + (index === 0 ? '' : '_' + index)).val()))
			};
			if ($('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val() !== "UNSECURED" && $('#loanClientCerditCT' + (index === 0 ? '' : '_' + index)).val() !== '') {
				console.log('collateral number: ' + index);
				//loanObj.creditCollaterals.push(collateralObj);
				collateralArray.push(collateralObj);
			}
		});
		return collateralArray;
	}
	// return loanObj;
	console.log(JSON.stringify(collateralArray));
	// return collateralArray.length > 0 ? ',"creditCollaterals":' + JSON.stringify(collateralArray) + '' : '';
	return false;
};

Options.prototype.emptyCollateralPlaceHolder = function() {
	$('#coallatralInfoPlaceHol').empty();
};

Options.prototype.buildGuarantor = function(loanClientObj) {
	// $collateralPanelBodies.forEach(function (panel, index) {
	var guarantorObj = {
		'guarantorName': $('#loanClientGuarantorName').val(),
		'guarantorValue': $('#loanClientGuarantorIncome').val() + '00'
	};
	if ($('#loanClientHaveGuarantor' + '_' + index).val() === "YES") {
		loanClientObj.guarantor = guarantorObj;
	}
	//})
	return loanClientObj;
};

Options.prototype.calculateInterestPeriodCalculation = function() {
	var $loanClientAIR = $('#loanClientAIR');
	var interestRate = parseFloat($loanClientAIR.val());
	var resultingInterestRate = 0;
	var interestPeriodCalculationType = $loanClientAIR.attr('interestPeriodCalculationType');
	switch (interestPeriodCalculationType) {

		case 'Daily':
			resultingInterestRate = interestRate * 365;
			console.log(interestPeriodCalculationType);
			break;
		case 'Weekly':
			resultingInterestRate = interestRate * 4 * 12;
			console.log(interestPeriodCalculationType);
			break;
		case 'Monthly':
			resultingInterestRate = interestRate * 12;
			console.log(interestPeriodCalculationType);
			break;
		case 'Yearly':
			resultingInterestRate = interestRate;
			console.log(interestPeriodCalculationType);
			break;
	}
	console.log('Original Interest Rate');
	console.log(interestRate);
	console.log('Resulting Interest Rate After Conversion');
	console.log(resultingInterestRate);
	return resultingInterestRate;
};

Options.prototype.calculateLoanDuration = function() {
	return calculateLoanDuration('loanClientDuration', 'loanClientDuTy');
};

Options.prototype.submitLoanData = function() {
	if (Options.self.loanType === 'GROUP') {
		var loanClient = GroupHandler.prototype.getLoanClientExtendedData();
		console.log(loanClient);
		GroupHandler.prototype.putExtendedClientData(loanClient);
	} else {
		var uri = '/loan/v1d';
		//constructing loan body

		//<editor-fold defaultstate="collapsed" desc="Collateral String">
		// var collateralJsonString = '[{"' + 'index":"' + '0' + '"' + ',"type":"' + $('#loanClientCerditCT').val() + '"' + ',"description":"' + "" + '"' + ',"value":"' + unformatCurrency(removeThousandCommas($('#loanClientCerditCTV').val())) + '"' + '}]';
		// var collatoralJsonLine = "";
		// var creditCollaterals = {};
		// if (document.getElementById("loanClientCerditCT").value !== "UNSECURED" && document.getElementById("loanClientCerditCT").value !== "") {
		// 	// collatoralJsonLine = ',"creditCollaterals":' + collateralJsonString + '';
		// 	creditCollaterals = [{
		// 		index: 0,
		// 		type: $('#loanClientCerditCT').val(),
		// 		description: '',
		// 		value: unformatCurrency(removeThousandCommas($('#loanClientCerditCTV').val()))
		// 	}];
		// }
		// console.log("The collateral string: ", collateralJsonString);
		//</editor-fold>

		//<editor-fold defaultstate="collapsed" desc="Guarantor String">
		// var guarantorJsonString = '{"' + 'guarantorName":"' + $('#loanClientGuarantorName').val() + '"' + ',"guarantorValue":"' + unformatCurrency(removeThousandCommas($('#loanClientGuarantorIncome').val())) + '"' + '}';
		// var guarantorJsonLine = '';

		// var guarantor = {};
		// if (document.getElementById("loanClientHaveGuarantor").value === "YES") {
		// 	// guarantorJsonLine = ',"guarantor":' + guarantorJsonString + '';
		// 	guarantor = {
		// 		guarantorName: $('#loanClientGuarantorName').val(),
		// 		guarantorValue: unformatCurrency(removeThousandCommas($('#loanClientGuarantorIncome').val()))
		// 	}
		// }

		// console.log("The guarantorJsonLine string: ", guarantorJsonLine);
		//</editor-fold>

		//<editor-fold defaultstate="collapsed" desc="Employed">
		// var clientEmplAddressJsonString = '{"' + 'province":"' + $('#loanClientEmpProvince').val() + '"' + ',"city":"' + $('#loanClientEmpCity').val() + '"' + ',"street":"' + $('#loanClientEmpStreet').val() + '"' + '}';
		var clientEmploymentAddress = {
				province: $('#loanClientEmpProvince').val(),
				city: $('#loanClientEmpCity').val(),
				street: $('#loanClientEmpStreet').val()
			}
			// var clientEmploymentJsonString = '{"' + 'employmentType":"' + 'EMPLOYED' + '"' + ',"startDate":"' + loanEmpStartDate + '"' + ',"monthlyIncome":"' + unformatCurrency(removeThousandCommas($('#loanClientEmpMonIncome').val())) + '"' + ',"formallyRegistered":"' + $('#loanClientEmpFoRe').val() + '"' + ',"numberOfEmployees":"' + $('#loanClientEmpNOE').val() + '"' + ',"address":' + clientEmplAddressJsonString + '' + ',"businessSector":"' + $('#loanClientEmpSector').val() + '"' + ',"sector":"' + 'BUSINESS_SECTOR' + '"' + ',"awamoId":"' + $('#loanClientAwamoId').val() + '"' + ',"name":"' + $('#loanClientEmpCompanyName').val() + '"' + '}';

		var clientEmployment = {
				employmentType: 'EMPLOYED',
				startDate: loanEmpStartDate,
				monthlyIncome: unformatCurrency(removeThousandCommas($('#loanClientEmpMonIncome').val())),
				formallyRegistered: $('#loanClientEmpFoRe').val(),
				numberOfEmployees: $('#loanClientEmpNOE').val(),
				address: clientEmploymentAddress,
				businessSector: $('#loanClientEmpSector').val(),
				sector: 'BUSINESS_SECTOR',
				awamoId: $('#loanClientAwamoId').val(),
				name: $('#loanClientEmpCompanyName').val()
			}
			// console.log("The clientEmplAddressJsonString string: ", clientEmplAddressJsonString);
			//</editor-fold>

		//<editor-fold defaultstate="collapsed" desc="SelfEmplyed">
		// var clientSelfEmplAddressJsonString = '{"' + 'province":"' + $('#loanClientSelfEmpProvince').val() + '"' + ',"city":"' + $('#loanClientSelfEmpCity').val() + '"' + ',"street":"' + $('#loanClientSelfEmpStreet').val() + '"' + '}';
		var clientSelfEmploymentAddress = {
			province: $('#loanClientSelfEmpProvince').val(),
			city: $('#loanClientSelfEmpCity').val(),
			street: $('#loanClientSelfEmpStreet').val()
		}

		// var selfEmplymentSecotrLine = "";
		// if (document.getElementById("loanClientSelfEmpType").value === "FARMER") {
		//  selfEmplymentSecotrLine = ',"agriculturalSector":"' + $('#loanClientSelfEmpAPro').val() + '"';
		// }

		// if (document.getElementById("loanClientSelfEmpType").value === "OTHER") {
		//  selfEmplymentSecotrLine = ',"businessSector":"' + $('#loanClientSelfEmpBSector').val() + '"';
		// }

		// var clientSelfEmploymentJsonString = '{"' + 'employmentType":"' + 'SELF_EMPLOYED' + '"' + ',"selfEmploymentType":"' + $('#loanClientSelfEmpType').val() + '"' + ',"startDate":"' + loanSelfEmpStartDate + '"' + ',"monthlyIncome":"' + unformatCurrency(removeThousandCommas($('#loanClientSelfEmpMonIncome').val())) + '"' + ',"formallyRegistered":"' + $('#loanClientSelfEmpFoRe').val() + '"' + ',"numberOfEmployees":"' + $('#loanClientSelfEmpNOE').val() + '"' + ',"address":' + clientSelfEmplAddressJsonString + '' + selfEmplymentSecotrLine + ',"awamoId":"' + $('#loanClientAwamoId').val() + '"' + ',"name":"' + $('#loanClientSelfEmpCompanyName').val() + '"' + '}';
		var clientSelfEmployment = {
			employmentType: 'SELF_EMPLOYED',
			selfEmploymentType: $('#loanClientSelfEmpType').val(),
			startDate: loanSelfEmpStartDate,
			monthlyIncome: unformatCurrency(removeThousandCommas($('#loanClientSelfEmpMonIncome').val())),
			formallyRegistered: $('#loanClientSelfEmpFoRe').val(),
			numberOfEmployees: $('#loanClientSelfEmpNOE').val(),
			address: clientSelfEmploymentAddress,
			awamoId: $('#loanClientAwamoId').val(),
			name: $('#loanClientSelfEmpCompanyName').val()
		}
		if (document.getElementById("loanClientSelfEmpType").value === "FARMER") {
			clientSelfEmployment.agriculturalSector = $('#loanClientSelfEmpAPro').val();
		}

		if (document.getElementById("loanClientSelfEmpType").value === "OTHER") {
			clientSelfEmployment.businessSector = $('#loanClientSelfEmpBSector').val();
		}
		//</editor-fold>

		//<editor-fold defaultstate="collapsed" desc="Employments line">
		// var empLineJsonString = '';
		var clientEmployments = [];
		if (document.getElementById("loanClientSelfEmployed").value === "YES" && document.getElementById("loanClientEmployed").value === "YES") {
			// empLineJsonString = ',"clientEmployments":' + "[" + clientSelfEmploymentJsonString + "," + clientEmploymentJsonString + "]";
			clientEmployments.push(clientSelfEmployment);
			clientEmployments.push(clientEmployment);
		} else {
			if (document.getElementById("loanClientSelfEmployed").value === "YES") {
				// empLineJsonString = ',"clientEmployments":' + "[" + clientSelfEmploymentJsonString + "]";
				clientEmployments.push(clientSelfEmployment);
			}

			if (document.getElementById("loanClientEmployed").value === "YES") {
				// empLineJsonString = ',"clientEmployments":' + "[" + clientEmploymentJsonString + "]";
				clientEmployments.push(clientEmployment);
			}
		}
		//</editor-fold>
		// console.log("The empLineJsonString string: ", empLineJsonString);

		//<editor-fold defaultstate="collapsed" desc="Loan Clients">
		// var clientAddressJsonString = '{"' + 'province":"' + $('#loanClientProvince').val() + '"' + ',"city":"' + $('#loanClientCity').val() + '"' + ',"street":"' + $('#loanClientStreet').val() + '"' + '}';
		var clientAddress = {
				province: $('#loanClientProvince').val(),
				city: $('#loanClientCity').val(),
				street: $('#loanClientStreet').val()
			}
			// console.log("The clientAddressJsonString string: ", clientAddressJsonString);

		// var clientAddressJsonString = {
		//  province: $('#loanClientProvince').val(),
		//  city: $('#loanClientCity').val(),
		//  street: $('#loanClientStreet').val()
		// };


		// var loanClientsJsonString = '[{"' + 'awamoId":"' + $('#loanClientAwamoId').val() + '"' + ',"numberOfChildren":"' + $('#loanClientNOC').val() + '"' + ',"numberOfChildrenInHouseHold":"' + $('#loanClientFirstNOCIH').val() + '"' + ',"maritalStatus":"' + $('#loanClientMartialStatus').val() + '"' + ',"livingArea":"' + $('#loanClientLivingArea').val() + '"' + ',"address":' + clientAddressJsonString + '' + guarantorJsonLine + empLineJsonString + '}]';

		var loanClientsJsonString = {
			awamoId: $('#loanClientAwamoId').val(),
			numberOfChildren: $('#loanClientNOC').val(),
			numberOfChildrenInHouseHold: $('#loanClientFirstNOCIH').val(),
			maritalStatus: $('#loanClientMartialStatus').val(),
			livingArea: $('#loanClientLivingArea').val(),
			// address: JSON.parse(clientAddressJsonString + '' + guarantorJsonLine + empLineJsonString)
			address: clientAddress
		};
		if (document.getElementById("loanClientSelfEmployed").value === "YES" || document.getElementById("loanClientEmployed").value === "YES") {
			loanClientsJsonString.clientEmployments = clientEmployments;
		}
		// if (document.getElementById("loanClientHaveGuarantor").value === "YES") {
		//
		var guarantor = Collateral.getGuarantor();
		if(guarantor) {
			loanClientsJsonString.guarantor = guarantor;
		}
		// }

		// Quick fix - I don't recommend it
		var loanClients = [];
		loanClients.push(loanClientsJsonString);
		loanClientsJsonString = loanClients;

		//</editor-fold>

		//<editor-fold defaultstate="collapsed" desc="Calculate Duration">

		var calculatedDuration = Options.self.calculateLoanDuration();
		var calculatedInterestRate = unformatPercentage(calculateInterestPeriodCalculation('loanClientAIR') + '');
		//</editor-fold>
		var currentTime = new Date().getTime();
		// var body = '{"' + 'awamoId":"' + $('#loanClientAwamoId').val() + '"' +
		//   ',"numberOfRepayments":"' + $('#loanClientNORe').val() + '"' + ',"amortizationType":"' + $('#loanClientAmortizationType').val() + '"' + ',"interestCalculationPeriodType":"' + $('#loanClientICPT').val() + '"' +
		//   ',"reason":"' + $('#loanClientReason').val() + '"' + ',"interestType":"' + $('#loanClientInType').val() + '"' + ',"disbursementDate":"' + Date.parse($('#loanClientDiDate').val()).getTime() + '"' + ',"submitDate":"' + currentTime + '"' + ',"loanType":"' + "INDIVIDUAL" + '"' + ',"interestRate":"' + calculatedInterestRate + '"' + ',"principal":"' + (unformatCurrency(removeThousandCommas($('#loanClientPrincipal').val()))) + '00' + '"' + ',"duration":"' + calculatedDuration + '"' + ',"loanClients":' + loanClientsJsonString + '' + Options.self.buildCollateralList(null) + ',"loanOfficer":"' + user.fullname + '"' + '}';
		// ',"interestRate":"' + calculatedInterestRate + '"' +
		//     ',"principal":"' + (unformatCurrency(removeThousandCommas($('#loanClientPrincipal').val()))) + '"' +

		var body = {
			awamoId: $('#loanClientAwamoId').val(),
			numberOfRepayments: $('#loanClientNORe').val(),
			amortizationType: $('#loanClientAmortizationType').val(),
			interestCalculationPeriodType: $('#loanClientICPT').val(),
			reason: $('#loanClientReason').val(),
			interestType: $('#loanClientInType').val(),
			disbursementDate: Date.parse($('#loanClientDiDate').val()).getTime(),
			submitDate: currentTime,
			loanType: "INDIVIDUAL",
			interestRate: calculatedInterestRate,
			principal: unformatCurrency(removeThousandCommas($('#loanClientPrincipal').val())),
			duration: calculatedDuration,
			loanClients: loanClientsJsonString,
			loanOfficer: user.fullname
		};
		// var creditCollaterals = Options.self.buildCollateralList(null);
		var creditCollaterals = Collateral.makeYourSelfForProcessEngine();
		if (creditCollaterals) {
			body.creditCollaterals = creditCollaterals;
		}
		body = JSON.stringify(body);

		console.log(body);

		$.ajax({
			url: host + uri,
			//url: 'http://localhost:2060/' + uri,
			type: 'POST',
			data: body,
			headers: getAuthenticationHeader(),
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			beforeSend: function() {
				showLoader();
			},
			success: function(data) {
				hideLoader();
				showAlertMessage('The loan application has been successfully created', AlertTypes.success);
				console.log(data);
				if (exists(data) & exists(data.loanId)) {
					try {
						var loan = JSON.parse(body);
						loan.loanId = data.loanId;
						loanList.put(loanList, loan);
					} catch (err) {
						console.log(err.message);
					}
					var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
					/*$collateralPanelBodies.each(function (index, panel) {
					 var id = $(this).attr('id');
					 var idIndex = id;
					 if (parseInt(id) === 0) {

					 idIndex = null;
					 } else {
					 idIndex = parseInt(id);
					 }

					 console.log(id)
					 console.log(panel);
					 console.log(idIndex);
					 var $loanClientCerditCT = null;
					 var $collateralImageIDSelector = null;
					 if (idIndex === null) {
					 $loanClientCerditCT = $('#loanClientCerditCT');
					 $collateralImageIDSelector = $('#collateralImageIDSelector');
					 } else {
					 $loanClientCerditCT = $('#loanClientCerditCT_' + idIndex);
					 $collateralImageIDSelector = $('#collateralImageIDSelector_' + idIndex);
					 }
					 console.log($collateralImageIDSelector);
					 try {
					 if ($loanClientCerditCT.val() !== 'UNSECURED' && exists($collateralImageIDSelector) && $collateralImageIDSelector[0].files.length !== 0) {
					 Options.self.uploadCollateral(data.loanId, $('#loanClientAwamoId').val(), index, idIndex);
					 //(loanId, awamoId, index,idIndex)
					 } else {
					 Options.prototype.loanCreationPassed();
					 }
					 } catch (err) {
					 Options.prototype.loanCreationPassed();
					 }
					 })*/
					Options.self.uploadCollateralFromArray(data.loanId, $('#loanClientAwamoId').val(), function() {
						loanList.loadOne(data.loanId, function(loan) {
							console.log(loan);
							if (exists(loan))
								loanList.put(loanList, loan);
							Options.prototype.loanCreationPassed();
						})
					});

				} else {
					Options.prototype.loanCreationPassed();
				}
			},
			complete: function() {
				hideLoader();
			}
		}).fail(function(Response) {
			console.log(Response);
			hideLoader();
			if (exists(Response) && exists(Response.responseJSON)) {
				showAlertMessage('Loan Application creation failed, ' + Response.responseJSON.message, AlertTypes.danger);
			} else {
				console.log(Response);
				showAlertMessage('Loan Application creation failed, please contact the support', AlertTypes.danger);
			}

			$('html, body').animate({
				scrollTop: document.body.scrollHeight
			}, 'fast');
		});
	}
};

//loan disbursement
Options.prototype.initLoanDisbursementPage = function() {
	clearFormValidators($('#disburseLoanForm'));
	registerKeyPressValidators($('#disburseLoanForm'));
	document.getElementById("disburseLoanPaymentType").disabled = false;
	document.getElementById("disburseLoanAccountName").disabled = true;
	document.getElementById("disburseLoanPhoneNumber").disabled = true;
	document.getElementById("disburseLoanBankBranch").disabled = true;
	document.getElementById("disburseLoanChequeNumber").disabled = true;
	document.getElementById("disburseLoanAccountNumber").disabled = true;
	document.getElementById("disburseLoanBankName").disabled = true;
	document.getElementById("disburseLoanPaymentType").value = "";
	document.getElementById("disburseLoanAccountName").value = "";
	document.getElementById("disburseLoanPhoneNumber").value = "";
	document.getElementById("disburseLoanBankBranch").value = "";
	document.getElementById("disburseLoanChequeNumber").value = "";
	document.getElementById("disburseLoanAccountNumber").value = "";
	document.getElementById("disburseLoanBankName").value = "";
	document.getElementById("disburseLoanPaymentType").required = true;
	document.getElementById("disburseLoanAccountName").required = false;
	document.getElementById("disburseLoanPhoneNumber").required = false;
	document.getElementById("disburseLoanBankBranch").required = false;
	document.getElementById("disburseLoanChequeNumber").required = false;
	document.getElementById("disburseLoanAccountNumber").required = false;
	document.getElementById("disburseLoanBankName").required = false;
	$("#disburseLoanDisburseBottom").show();
	$("#confirmLoanDisburseBottom").hide();
	$("#modifyLoanDisburseBottom").hide();
	showContent($('#disburseLoanPanal'));
};

Options.prototype.loanDisbursePaymentType = function() {

	document.getElementById("disburseLoanAccountName").required = false;
	document.getElementById("disburseLoanAccountName").disabled = true;
	document.getElementById("disburseLoanAccountName").value = "";
	document.getElementById("disburseLoanPhoneNumber").required = false;
	document.getElementById("disburseLoanPhoneNumber").disabled = true;
	document.getElementById("disburseLoanPhoneNumber").value = "";
	document.getElementById("disburseLoanBankBranch").required = false;
	document.getElementById("disburseLoanBankBranch").disabled = true;
	document.getElementById("disburseLoanBankBranch").value = "";
	document.getElementById("disburseLoanChequeNumber").required = false;
	document.getElementById("disburseLoanChequeNumber").disabled = true;
	document.getElementById("disburseLoanChequeNumber").value = "";
	document.getElementById("disburseLoanAccountNumber").required = false;
	document.getElementById("disburseLoanAccountNumber").disabled = true;
	document.getElementById("disburseLoanAccountNumber").value = "";
	document.getElementById("disburseLoanBankName").required = false;
	document.getElementById("disburseLoanBankName").disabled = true;
	document.getElementById("disburseLoanBankName").value = "";
	clearFormValidators($('#disburseLoanForm'));
	if (document.getElementById("disburseLoanPaymentType").value === "CHEQUE") {
		var containingFormGroup = $('#disburseLoanChequeNumber').parent().parent();
		var containingInputGroup = $('#disburseLoanChequeNumber').parent();
		document.getElementById("disburseLoanChequeNumber").required = true;
		document.getElementById("disburseLoanChequeNumber").disabled = false;
		var chequeNumber = $('#disburseLoanChequeNumber').val();
		if (chequeNumber.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter a cheque number");
		}
		registerKeyPressValidators($('#disburseLoanForm'));
	}

	if (document.getElementById("disburseLoanPaymentType").value === "MOBILE_MONEY") {
		var containingFormGroup = $('#disburseLoanPhoneNumber').parent().parent();
		var containingInputGroup = $('#disburseLoanPhoneNumber').parent();
		document.getElementById("disburseLoanPhoneNumber").required = true;
		document.getElementById("disburseLoanPhoneNumber").disabled = false;
		var phoneNumber = $('#disburseLoanPhoneNumber').val();
		if (phoneNumber.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter a phone number");
		}

		containingFormGroup = $('#disburseLoanAccountName').parent().parent();
		containingInputGroup = $('#disburseLoanAccountName').parent();
		document.getElementById("disburseLoanAccountName").required = true;
		document.getElementById("disburseLoanAccountName").disabled = false;
		var accountName = $('#disburseLoanAccountName').val();
		if (accountName.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter an account name");
		}
		registerKeyPressValidators($('#disburseLoanForm'));
	}

	if (document.getElementById("disburseLoanPaymentType").value === "BANK_TRANSFER") {

		var containingFormGroup = $('#disburseLoanAccountName').parent().parent();
		var containingInputGroup = $('#disburseLoanAccountName').parent();
		document.getElementById("disburseLoanAccountName").required = true;
		document.getElementById("disburseLoanAccountName").disabled = false;
		var accountName = $('#disburseLoanAccountName').val();
		if (accountName.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter an account name");
		}

		containingFormGroup = $('#disburseLoanBankBranch').parent().parent();
		containingInputGroup = $('#disburseLoanBankBranch').parent();
		document.getElementById("disburseLoanBankBranch").required = true;
		document.getElementById("disburseLoanBankBranch").disabled = false;
		var bankBranch = $('#disburseLoanBankBranch').val();
		if (bankBranch.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter a bank branch");
		}

		containingFormGroup = $('#disburseLoanAccountNumber').parent().parent();
		containingInputGroup = $('#disburseLoanAccountNumber').parent();
		document.getElementById("disburseLoanAccountNumber").required = true;
		document.getElementById("disburseLoanAccountNumber").disabled = false;
		var acName = $('#disburseLoanAccountNumber').val();
		if (acName.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter the account name");
		}

		containingFormGroup = $('#disburseLoanAccountNumber').parent().parent();
		containingInputGroup = $('#disburseLoanAccountNumber').parent();
		document.getElementById("disburseLoanBankName").required = true;
		document.getElementById("disburseLoanBankName").disabled = false;
		var bankName = $('#disburseLoanBankName').val();
		if (bankName.length < 1) {
			validateElement(containingFormGroup, containingInputGroup, validationClasses.error, "Please enter the bank name");
		}

		registerKeyPressValidators($('#disburseLoanForm'));
	}
};

Options.prototype.toLoanDisbursementConfirmPage = function() {
	if (validateForm($('#disburseLoanForm'))) {
		if (
			//client data
			document.getElementById("disburseLoanBankName").checkValidity() && document.getElementById("disburseLoanAccountNumber").checkValidity() && document.getElementById("disburseLoanBankBranch").checkValidity() && document.getElementById("disburseLoanAccountName").checkValidity() && document.getElementById("disburseLoanPaymentType").checkValidity() && document.getElementById("disburseLoanChequeNumber").checkValidity() && document.getElementById("disburseLoanPhoneNumber").checkValidity()) {
			//addHistory('create accounting entry', '#createAccountingEntry', getSidebarSubitemSelector('accounting', 'Accounting', 'create'));
			document.getElementById("disburseLoanBankName").disabled = true;
			document.getElementById("disburseLoanAccountNumber").disabled = true;
			document.getElementById("disburseLoanBankBranch").disabled = true;
			document.getElementById("disburseLoanAccountName").disabled = true;
			document.getElementById("disburseLoanPaymentType").disabled = true;
			document.getElementById("disburseLoanChequeNumber").disabled = true;
			document.getElementById("disburseLoanPhoneNumber").disabled = true;

			var confirmDialogHeader = 'Confirm Loan Disbursement';
			var confirmDialogBody = 'Are you sure you want to Disburse this loan';
			var confirmDialogPositiveText = 'Yes';
			var confirmDialogNegativeText = 'No';
			showDialogPopupWithHandlers(confirmDialogHeader, confirmDialogBody, confirmDialogPositiveText, function() {
				//yes disburse loan
				Options.prototype.submitDisbursementData();
			}, confirmDialogNegativeText, function() {
				//no dont modify
				Options.prototype.modifyDisbursementLoanFields();
			});

		}
	} else {
		showAlertMessage('Please ensure all the fields are filled in correctly', AlertTypes.danger);
	}
};

Options.prototype.modifyDisbursementLoanFields = function() {

	showContent($('#disburseLoanPanal'));
	document.getElementById("disburseLoanBankName").disabled = true;
	document.getElementById("disburseLoanAccountNumber").disabled = true;
	document.getElementById("disburseLoanBankBranch").disabled = true;
	document.getElementById("disburseLoanAccountName").disabled = true;
	document.getElementById("disburseLoanPaymentType").disabled = false;
	document.getElementById("disburseLoanChequeNumber").disabled = true;
	document.getElementById("disburseLoanPhoneNumber").disabled = true;
	if (document.getElementById("disburseLoanPaymentType").value === "CHEQUE") {

		document.getElementById("disburseLoanChequeNumber").disabled = false;
	}

	if (document.getElementById("disburseLoanPaymentType").value === "MOBILE_MONEY") {

		document.getElementById("disburseLoanPhoneNumber").disabled = false;
		document.getElementById("disburseLoanAccountName").disabled = false;
	}

	if (document.getElementById("disburseLoanPaymentType").value === "BANK_TRANSFER") {

		document.getElementById("disburseLoanAccountName").disabled = false;
		document.getElementById("disburseLoanBankBranch").disabled = false;
		document.getElementById("disburseLoanAccountNumber").disabled = false;
		document.getElementById("disburseLoanBankName").disabled = false;
	}

	$("#disburseLoanDisburseBottom").show();
	$("#confirmLoanDisburseBottom").hide();
	$("#modifyLoanDisburseBottom").hide();
};

Options.prototype.loanDisbursementPassed = function() {
	showAlertMessage('The loan has been successfully disbursed', AlertTypes.success);
	showContent($('#disburseLoanPanal'));
	$("#disburseLoanDisburseBottom").hide();
	$("#confirmLoanDisburseBottom").hide();
	$("#modifyLoanDisburseBottom").hide();
	LoanHandler.self.loan.status = 'ACTIVE';
	loanList.put(loanList, LoanHandler.self.loan);
	ActionRequiredHandler.prototype._dataModelChanged();
	LoanHandler.prototype.getAllowedDisbursements();
};

Options.prototype.submitDisbursementData = function() {

	var uri = '/loan/v1d/' + LoanHandler.self.loan.loanId + '/disburse';
	//constructing loan body

	//<editor-fold defaultstate="collapsed" desc="chequeNumberJsonLine">
	var chequeNumberJsonLine = '';
	if (document.getElementById("disburseLoanPaymentType").value === "CHEQUE") {
		chequeNumberJsonLine = ',"chequeNumber":"' + document.getElementById("disburseLoanChequeNumber").value + '"';
	}
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="accountNameJsonLine">
	var accountNameJsonLine = '';
	if (document.getElementById("disburseLoanPaymentType").value === "MOBILE_MONEY" || document.getElementById("disburseLoanPaymentType").value === "BANK_TRANSFER") {
		accountNameJsonLine = ',"accountName":"' + document.getElementById("disburseLoanAccountName").value + '"';
	}
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="accountNumberJsonLine">
	var accountNumberJsonLine = '';
	if (document.getElementById("disburseLoanPaymentType").value === "BANK_TRANSFER") {
		accountNumberJsonLine = ',"accountNumber":"' + document.getElementById("disburseLoanAccountNumber").value + '"';
	}
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="phoneNumberJsonLine">
	var phoneNumberJsonLine = '';
	if (document.getElementById("disburseLoanPaymentType").value === "MOBILE_MONEY") {
		phoneNumberJsonLine = ',"phoneNumber":"' + document.getElementById("disburseLoanPhoneNumber").value + '"';
	}
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="bankNameJsonLine">
	var bankNameJsonLine = '';
	if (document.getElementById("disburseLoanPaymentType").value === "BANK_TRANSFER") {
		bankNameJsonLine = ',"bankName":"' + document.getElementById("disburseLoanBankName").value + '"';
	}
	//</editor-fold>

	//<editor-fold defaultstate="collapsed" desc="bankNameJsonLine">
	var bankBranchJsonLine = '';
	if (document.getElementById("disburseLoanPaymentType").value === "BANK_TRANSFER") {
		bankBranchJsonLine = ',"bankBranch":"' + document.getElementById("disburseLoanBankBranch").value + '"';
	}
	//</editor-fold>
	var body = '{"' + 'paymentType":"' + $('#disburseLoanPaymentType').val() + '"' + chequeNumberJsonLine + accountNameJsonLine + accountNumberJsonLine + phoneNumberJsonLine + bankNameJsonLine + bankBranchJsonLine + '}';
	$.ajax({
		url: host + uri,
		type: 'POST',
		data: body,
		headers: getAuthenticationHeader(),
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		beforeSend: function() {
			showLoader();
		},
		success: function(data) {

			showLoader("Updating Lists ");

			loanList.loadOne(LoanHandler.self.loan.loanId, function(response) {

				showAlertMessage("Record Saved Successfully", AlertTypes.success);

				loanList.put(loanList, response, function() {
					// ActionRequiredHandler.prototype._dataModelChanged();
					handlers['Loan'].getAllowedDisbursements();
					//  LoanHandler.self.getAllowedDisbursements();
					showAlertMessage("Record Saved Successfully", AlertTypes.success);

				});
			});

		},
		complete: function() {

		}
	}).fail(function(Response) {
		hideLoader();
		showContent($('#disburseLoanPanal'));
		showAlertMessage('Loan disbursement failed, please contact the support', AlertTypes.danger);
		$('html, body').animate({
			scrollTop: document.body.scrollHeight
		}, 'fast');
	});
};

Options.prototype.initTestData = function() {
	//alert('hit')
	if (!isClientTestData) {

		return;
	}

	document.getElementById("loanClientEmpCompanyName").disabled = false;
	document.getElementById("loanClientEmpMonIncome").disabled = false;
	document.getElementById("loanClientEmpSector").disabled = false;
	document.getElementById("loanClientEmpProvince").disabled = false;
	document.getElementById("loanClientEmpStreet").disabled = false;
	document.getElementById("loanClientStartDate").disabled = false;
	document.getElementById("loanClientEmpNOE").disabled = false;
	document.getElementById("loanClientEmpFoRe").disabled = false;
	document.getElementById("loanClientEmpCity").disabled = false;
	document.getElementById("loanClientStartDate").style.backgroundColor = "#eee";
	document.getElementById("loanClientEmpCompanyName").required = false;
	document.getElementById("loanClientEmpMonIncome").required = false;
	document.getElementById("loanClientEmpSector").required = false;
	document.getElementById("loanClientEmpProvince").required = false;
	document.getElementById("loanClientEmpStreet").required = false;
	document.getElementById("loanClientStartDate").required = false;
	document.getElementById("loanClientEmpNOE").required = false;
	document.getElementById("loanClientEmpFoRe").required = false;
	document.getElementById("loanClientEmpCity").required = false;
	document.getElementById("loanClientEmpCompanyName").value = "";
	document.getElementById("loanClientEmpMonIncome").value = "";
	document.getElementById("loanClientEmpSector").value = "";
	document.getElementById("loanClientEmpProvince").value = "";
	document.getElementById("loanClientEmpStreet").value = "";
	document.getElementById("loanClientStartDate").value = "";
	document.getElementById("loanClientEmpNOE").value = "";
	document.getElementById("loanClientEmpFoRe").value = "";
	document.getElementById("loanClientEmpCity").value = "";
	//Self Employment Fields
	document.getElementById("loanClientSelfEmpCompanyName").disabled = false;
	document.getElementById("loanClientSelfEmpMonIncome").disabled = false;
	document.getElementById("loanClientSelfEmpType").disabled = false;
	document.getElementById("loanClientSelfEmpAPro").disabled = false;
	document.getElementById("loanClientSelfEmpProvince").disabled = false;
	document.getElementById("loanClientSelfEmpStreet").disabled = false;
	document.getElementById("loanClientSelfStartDate").disabled = false;
	document.getElementById("loanClientSelfEmpNOE").disabled = false;
	document.getElementById("loanClientSelfEmpBSector").disabled = false;
	document.getElementById("loanClientSelfEmpFoRe").disabled = false;
	document.getElementById("loanClientSelfEmpCity").disabled = false;
	document.getElementById("loanClientSelfStartDate").style.backgroundColor = "#eee";
	document.getElementById("loanClientSelfEmpCompanyName").required = false;
	document.getElementById("loanClientSelfEmpMonIncome").required = false;
	document.getElementById("loanClientSelfEmpType").required = false;
	document.getElementById("loanClientSelfEmpAPro").required = false;
	document.getElementById("loanClientSelfEmpProvince").required = false;
	document.getElementById("loanClientSelfEmpStreet").required = false;
	document.getElementById("loanClientSelfStartDate").required = false;
	document.getElementById("loanClientSelfEmpNOE").required = false;
	document.getElementById("loanClientSelfEmpBSector").required = false;
	document.getElementById("loanClientSelfEmpFoRe").required = false;
	document.getElementById("loanClientSelfEmpCity").required = false;
	document.getElementById("loanClientSelfEmpCompanyName").value = "";
	document.getElementById("loanClientSelfEmpMonIncome").value = "";
	document.getElementById("loanClientSelfEmpType").value = "";
	document.getElementById("loanClientSelfEmpAPro").value = "";
	document.getElementById("loanClientSelfEmpProvince").value = "";
	document.getElementById("loanClientSelfEmpStreet").value = "";
	document.getElementById("loanClientSelfStartDate").value = "";
	document.getElementById("loanClientSelfEmpNOE").value = "";
	document.getElementById("loanClientSelfEmpBSector").value = "";
	document.getElementById("loanClientSelfEmpFoRe").value = "";
	document.getElementById("loanClientSelfEmpCity").value = "";
	//loan information
	document.getElementById("loanClientDuration").disabled = false;
	document.getElementById("loanClientPrincipal").disabled = false;
	document.getElementById("loanClientNORe").disabled = false;
	document.getElementById("loanClientAIR").disabled = false;
	document.getElementById("loanClientDuTy").disabled = false;
	document.getElementById("loanClientDiDate").disabled = false;
	document.getElementById("loanClientInType").disabled = false;
	document.getElementById("loanClientICPT").disabled = false;
	document.getElementById("loanClientReason").disabled = false;
	document.getElementById("loanClientDuration").value = "";
	document.getElementById("loanClientPrincipal").value = "";
	document.getElementById("loanClientNORe").value = "";
	document.getElementById("loanClientAIR").value = "";
	//    document.getElementById("loanClientDuTy").value = "";
	document.getElementById("loanClientDiDate").value = "";
	document.getElementById("loanClientInType").value = "";
	document.getElementById("loanClientICPT").value = "";
	document.getElementById("loanClientReason").value = "";
	//credit information
	if (Options.self.loanType !== 'GROUP') {
		document.getElementById("loanClientCerditCT").disabled = false;
		document.getElementById("loanClientCerditCTV").disabled = false;
		document.getElementById("loanClientCerditCT").value = "";
		document.getElementById("loanClientCerditCTV").value = "";
		document.getElementById("loanClientCerditCTV").required = false;
		//guarantor
		document.getElementById("loanClientHaveGuarantor").disabled = false;
		document.getElementById("loanClientGuarantorName").disabled = false;
		document.getElementById("loanClientGuarantorIncome").disabled = false;
		document.getElementById("loanClientGuarantorName").value = "";
		document.getElementById("loanClientGuarantorIncome").value = "";
		document.getElementById("loanClientHaveGuarantor").value = "";
	}



	document.getElementById("loanClientProvince").value = 'Kampala';
	document.getElementById("loanClientCity").value = 'Kampala';
	document.getElementById("loanClientCity").value = 'Kampala';
	document.getElementById("loanClientFirstNOCIH").value = 2;
	document.getElementById("loanClientLivingArea").value = 'RURAL';
	document.getElementById("loanClientStreet").value = 'Kamwokya';
	document.getElementById("loanClientNOC").value = 5;
	document.getElementById("loanClientMartialStatus").value = 'MARRIED';
	document.getElementById("loanClientEmployed").value = 'YES';
	document.getElementById("loanClientEmpCompanyName").value = 'Awamo';
	document.getElementById("loanClientEmpMonIncome").value = 2000000;
	document.getElementById("loanClientSelfEmpFoRe").value = true;
	document.getElementById("loanClientSelfEmpProvince").value = 'Central';
	document.getElementById("loanClientSelfStartDate").value = '04 Apr 2017';
	document.getElementById("loanClientSelfEmpNOE").value = 5;
	document.getElementById("loanClientSelfEmpType").value = 'FARMER';
	document.getElementById("loanClientSelfEmpAPro").value = 'CROPS';
	document.getElementById("loanClientSelfEmpCity").value = 'Kampala';
	document.getElementById("loanClientSelfEmpStreet").value = 'Kamwokya';
	document.getElementById("loanClientSelfEmployed").value = 'YES';
	document.getElementById("loanClientSelfEmpCompanyName").value = 'STEK';
	document.getElementById("loanClientSelfEmpMonIncome").value = 2000000;
	document.getElementById("loanClientSelfEmpBSector").value = 'AGRICULTURE';
	document.getElementById("loanClientSelfEmpFoRe").value = 'YES';
	document.getElementById("loanClientEmpSector").value = 'AGRICULTURE';
	document.getElementById("loanClientEmpProvince").value = 'Central';
	document.getElementById("loanClientEmpFoRe").value = true;
	document.getElementById("loanClientEmpCity").value = 'Kampala';
	document.getElementById("loanClientEmpStreet").value = 'Kamwokya';
	document.getElementById("loanClientEmpNOE").value = 2;
	//loan data
	document.getElementById("groupLoanClientDuration").disabled = false;
	document.getElementById("loanClientAmortizationType").disabled = false;
	document.getElementById("loanClientPrincipal").disabled = false;
	document.getElementById("loanClientNORe").disabled = false;
	document.getElementById("loanClientAIR").disabled = false;
	document.getElementById("loanClientDuTy").disabled = false;
	document.getElementById("loanClientDiDate").disabled = false;
	document.getElementById("loanClientInType").disabled = false;
	document.getElementById("loanClientICPT").disabled = false;
	document.getElementById("loanClientReason").disabled = false;
	document.getElementById("loanClientDiDate").style.backgroundColor = "#fff";
	if (Options.self.loanType === 'GROUP') {
		document.getElementById("groupLoanClientPrincipal").value = 50000000;
		document.getElementById("groupLoanClientDuration").value = 2;
		document.getElementById("groupLoanClientNORe").value = 24;
		document.getElementById("groupLoanClientAmortizationType").value = 'EQUAL_INSTALLMENTS';
		document.getElementById("groupLoanClientAIR").value = 18;
		document.getElementById("groupLoanClientDuTy").value = 'YEARS';
		document.getElementById("groupLoanClientDiDate").value = '22 Apr 2017';
		document.getElementById("loanClientStartDate").value = '11 Apr 2017';
		document.getElementById("loanClientStartDate").disable = false;
		document.getElementById("groupLoanClientInType").value = 'FLAT';
		document.getElementById("groupLoanClientICPT").value = 'LIKE_REPAYMENT';
		document.getElementById("groupLoanClientReason").value = 'WORKING_CAPITAL';
		//document.getElementById("loanClientCerditCT").value = 'UNSECURED';
		//document.getElementById("loanClientHaveGuarantor").value = 'NO';
		//document.getElementById("loanClientGuarantorIncome").required = false;
		//document.getElementById("loanClientCerditCTV").required = false;
		//document.getElementById("loanClientGuarantorName").required = false;
	} else {
		document.getElementById("loanClientPrincipal").value = 50000000;
		document.getElementById("loanClientDuration").value = 2;
		document.getElementById("loanClientNORe").value = 24;
		document.getElementById("loanClientAmortizationType").value = 'EQUAL_INSTALLMENTS';
		document.getElementById("loanClientAIR").value = 18;
		document.getElementById("loanClientDuTy").value = 'YEARS';
		document.getElementById("loanClientDiDate").value = '29 Mar 2017';
		document.getElementById("loanClientStartDate").value = '11 Apr 2017';
		document.getElementById("loanClientStartDate").disable = false;
		document.getElementById("loanClientInType").value = 'FLAT';
		document.getElementById("loanClientICPT").value = 'LIKE_REPAYMENT';
		document.getElementById("loanClientReason").value = 'WORKING_CAPITAL';
		document.getElementById("loanClientCerditCT").value = 'UNSECURED';
		document.getElementById("loanClientHaveGuarantor").value = 'NO';
		document.getElementById("loanClientGuarantorIncome").required = false;
		document.getElementById("loanClientCerditCTV").required = false;
		document.getElementById("loanClientGuarantorName").required = false;
	}
};

function submitLoanApplicationTest() {
	var uri = '/loan/v1d';
	var body = { "awamoId": "6AW0JAK8", "numberOfRepayments": "12", "amortizationType": "", "interestCalculationPeriodType": "DAILY", "reason": "WORKING_CAPITAL", "interestType": "DECLINING_BALANCE", "disbursementDate": "1496350800000", "submitDate": "1496428253570", "loanType": "INDIVIDUAL", "interestRate": "12000", "principal": "200000", "duration": "12", "loanClients": [{ "awamoId": "6AW0JAK8", "numberOfChildren": "6", "numberOfChildrenInHouseHold": "3", "maritalStatus": "MARRIED", "livingArea": "RURAL", "address": { "province": "lbnjlbdv", "city": "jlbnjlsd", "street": "jkvbkh" }, "clientEmployments": [{ "employmentType": "EMPLOYED", "startDate": "1496350800000", "monthlyIncome": "2000", "formallyRegistered": "true", "numberOfEmployees": "12", "address": { "province": "hkvhv j", "city": "hk vh ", "street": "h vjh" }, "businessSector": "CONSTRUCTION", "sector": "BUSINESS_SECTOR", "awamoId": "6AW0JAK8", "name": "hkvkh" }] }], "loanOfficer": "Dirk Dirk" };
	body = GroupHandler.prototype.trim(JSON.stringify(body));


	$.ajax({
		//url: host + uri,
		url: 'http://localhost:2060/' + uri,
		type: 'POST',
		data: body,
		headers: getAuthenticationHeader(),
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		beforeSend: function() {
			showLoader();
		},
		success: function(data) {
			//hideLoader();
			//showAlertMessage('The loan application has been successfully created', AlertTypes.success);
			console.log(data);
			if (exists(data) & exists(data.loanId)) {
				try {
					var loan = JSON.parse(body);
					loan.loanId = data.loanId;
					loanList.put(loanList, loan);
				} catch (err) {
					console.log(err.message);
				}
				var $collateralPanelBodies = $('.panel-body', $('#collateralInformation'));
				/*$collateralPanelBodies.each(function (index, panel) {
				 var id = $(this).attr('id');
				 var idIndex = id;
				 if (parseInt(id) === 0) {

				 idIndex = null;
				 } else {
				 idIndex = parseInt(id);
				 }

				 console.log(id)
				 console.log(panel);
				 console.log(idIndex);
				 var $loanClientCerditCT = null;
				 var $collateralImageIDSelector = null;
				 if (idIndex === null) {
				 $loanClientCerditCT = $('#loanClientCerditCT');
				 $collateralImageIDSelector = $('#collateralImageIDSelector');
				 } else {
				 $loanClientCerditCT = $('#loanClientCerditCT_' + idIndex);
				 $collateralImageIDSelector = $('#collateralImageIDSelector_' + idIndex);
				 }
				 console.log($collateralImageIDSelector);
				 try {
				 if ($loanClientCerditCT.val() !== 'UNSECURED' && exists($collateralImageIDSelector) && $collateralImageIDSelector[0].files.length !== 0) {
				 Options.self.uploadCollateral(data.loanId, $('#loanClientAwamoId').val(), index, idIndex);
				 //(loanId, awamoId, index,idIndex)
				 } else {
				 Options.prototype.loanCreationPassed();
				 }
				 } catch (err) {
				 Options.prototype.loanCreationPassed();
				 }
				 })*/
				var clientAwamoId = $('#loanClientAwamoId').val();
				Options.self.uploadCollateralFromArray(data.loanId, clientAwamoId, function() {
					loanList.loadOne(data.loanId, function(loan) {
						showAlertMessage('The loan application has been successfully created', AlertTypes.success);
						console.log(loan);
						if (exists(loan))
							loanList.put(loanList, loan);
						Options.prototype.loanCreationPassed();
						hideLoader();
					});
				});

			} else {
				Options.prototype.loanCreationPassed();
				hideLoader();
			}
		},
		complete: function() {
			hideLoader();
		}
	}).fail(function(Response) {
		console.log(Response);
		hideLoader();
		if (exists(Response) && exists(Response.responseJSON)) {
			showAlertMessage('Loan Application creation failed, ' + Response.responseJSON.message, AlertTypes.danger);
		} else {
			console.log(Response);
			showAlertMessage('Loan Application creation failed, please contact the support', AlertTypes.danger);
		}

		$('html, body').animate({
			scrollTop: document.body.scrollHeight
		}, 'fast');
	});
}
