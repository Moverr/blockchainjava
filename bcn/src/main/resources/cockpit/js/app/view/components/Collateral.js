function Collateral(parent) {
	this.view = null;
	this.data = {};
	this.collateralImages = {
		view: null,
		images: []
	};
	this.parent = parent;
	this.init();
	Collateral.collaterals.push(this);
	if(Collateral.collaterals.indexOf(this) === 0) {
		this.hideRemoveControl();
		this.addGuarantor();
	}
}
Collateral.prototype = {
	constructor: Collateral,
	init: function() {
		var collateralView = $('<div class="row collateral"><div class="col-lg-4"><h6>Collateral Images</h6><div class="collateral-images"><p class="tip">Click here to add up to 3 images</p></div></div><div class="col-lg-4" style="border-right:1px solid rgba(34,36,38,.15)"><h6>Collateral Type</h6><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon">Type</div><select class="form-control collateral-type" required><option value="" selected="selected">Select</option><option value="UNSECURED">UNSECURED</option><option value="LAND">LAND</option><option value="BUILDING">BUILDING</option><option value="VEHICLE">VEHICLE</option><option value="EQUIPMENT">EQUIPMENT</option><option value="INVENTORY">INVENTORY</option><option value="CASH_DEPOSITS">CASH_DEPOSITS</option><option value="OTHERS">OTHERS</option></select></div><p class="help-block"></p></div><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon">Value</div><input type="currency" min="0" data-type="thousand-commas" step="500" minamount="0" class="form-control thousand-commas currency-input collateral-value" placeholder="Credit Collateral Value" autocomplete="off"></div><p class="help-block"></p></div><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon align-top">Description</div><textarea class="form-control collateral-description" data-type="string" rows="10" minlength="4" maxlength="500" placeholder="Credit Collateral Description" autocomplete="off"></textarea></div><p class="help-block"></p></div></div></div>');
		var collateralImagesView = $(collateralView.find('.collateral-images')[0]).addClass('disabled');
		this.tip = collateralImagesView.html();
		this.collateralTypeView = collateralView.find('.collateral-type');
		this.collateralValueView = collateralView.find('.collateral-value').attr('disabled', 'true');
		this.collateralDescriptionView = collateralView.find('.collateral-description').attr('disabled', 'true');


		var collateral = this;
		this.collateralTypeView.on('change', function() {
			if($(this).val() !== "UNSECURED" && $(this).val() !== "") {
				collateral.collateralValueView.removeAttr('disabled');
				collateral.collateralDescriptionView.removeAttr('disabled');
				collateral.collateralImages.view.on('click', function() {
					collateral.addImage();
				});
				collateral.collateralImages.view.removeClass('disabled');
			} else {
				collateral.collateralValueView.attr('disabled', 'true');
				collateral.collateralDescriptionView.attr('disabled', 'true');
				collateral.collateralImages.view.unbind('click').addClass('disabled');
			}
		});

		var collateralControlsView = $('<div>', {class: "collateral-controls clearfix"});
		var removeCollateralButtonView = $('<div>', {class: "collateral-control", title: "Remove collateral"}).append('<i class="material-icons my-float">&#xE15D;</i>');
		removeCollateralButtonView.on('click', function() {
			Collateral.removeCollateral(collateral);
		});
		var addCollateralButtonView = $('<div>', {class: "collateral-control", title: "Add more collaterals"}).append('<i class="material-icons my-float">&#xE148;</i>');
		addCollateralButtonView.on('click', function() {
			collateral.hideAddControl();
			Collateral.addCollateral();
		});
		collateralControlsView.append(removeCollateralButtonView)
			.append(addCollateralButtonView)
			.append('<div class="collateral-control"><i class="fa fa-share my-float"></i></div>');
		addCollateralButtonView.tooltip({
			placement: 'bottom'
		});
		removeCollateralButtonView.tooltip({
			placement: 'bottom'
		});
		this.controls = {
			view: collateralControlsView,
			addCollateralButtonView: addCollateralButtonView,
			removeCollateralButtonView: removeCollateralButtonView
		}
		this.collateralImages.view = collateralImagesView;
		collateralView.append(collateralControlsView);
		this.view = collateralView;
	},
	addImage: function() {
		if(this.collateralImages.images.length === 0) {
			this.collateralImages.view.empty();
			this.collateralImages.view.addClass('collateral-images-loaded');
			this.collateralImages.view.unbind('click');
		}
		if(this.collateralImages.images.length < 3) {
			var collateralImage = new CollateralImage(this);
			this.collateralImages.view.append(collateralImage.getView());
			this.collateralImages.images.push(collateralImage);
			collateralImage.getView().cropit();
		}
		console.log(this.collateralImages.images);
	},
	removeImage: function(collateralImage) {
		this.collateralImages.images.splice(this.collateralImages.images.indexOf(collateralImage), 1);
		console.log(this.collateralImages.images);
		if(this.collateralImages.images.length === 0) {
			this.collateralImages.view.html(this.tip);
			this.collateralImages.view.removeClass('collateral-images-loaded');
			var collateral = this;
			this.collateralImages.view.on('click', function() {
				collateral.addImage();
			});
		}
	},
	addGuarantor: function() {
		var guarantor = new Guarantor();
		this.guarantor = guarantor;
		this.view.find('.collateral-controls').before(guarantor.getView());
	},
	getView: function() {
		return this.view;
	},
	getData: function() {
		/******* The awamo Style *******/
		if (this.collateralTypeView.val() !== 'UNSECURED') {
			if (Number.isNaN(removeThousandCommas(this.collateralValueView.val()))) {
				showAlertMessage('Collateral must have a value attached if is of any other type apart from UNSECURED', AlertTypes.warning);
				throw new Error("Collateral must have a value attached if is of any other type apart from UNSECURED");
				console.log("Oh no, this is not good");
				return false;
			}
		} else {
			return false;
			this.collateralValueView.val("0");
		}
		if (this.collateralTypeView.val() === 'OTHERS') {
			if (this.collateralDescriptionView.val().length < 5) {
				showAlertMessage('For Collaterals of type OTHERS, you must supply a description of more than 5 characters', AlertTypes.warning);
				throw new Error("For Collaterals of type OTHERS, you must supply a description");
				console.log("Again, this is not good");
				return false;
			}
		}
		/******* The awamo Style *******/

		var collateralImages = [];
		this.collateralImages.images.forEach(function(collateralImage) {
			var imageData = collateralImage.getData();
			if(imageData) {
				collateralImages.push(imageData);
			}
		});
		this.data.images = collateralImages;
		this.data.type = this.collateralTypeView.val();
		this.data.value = parseFloat(unformatCurrency(removeThousandCommas(this.collateralValueView.val())));
		this.data.description = this.collateralDescriptionView.val();
		if(this.guarantor) {
			this.data.guarantor = this.guarantor.getData();
		}

		return this.data;
	},
	showAddControl: function() {
		// console.log(this.controls.view.find('div:last-child'));
		var collateral = this;
		this.controls.addCollateralButtonView.on('click', function() {
			collateral.hideAddControl();
			Collateral.addCollateral();
		}).tooltip({
			placement: 'bottom'
		});
		this.controls.view.find('div:last-child').before(this.controls.addCollateralButtonView);
	},
	hideAddControl: function() {
		// this.controls.addCollateralButtonView.tooltip('disable');
		// console.log(this.controls.addCollateralButtonView.next().remove());
		this.controls.addCollateralButtonView.unbind('click').remove();
	},
	showRemoveControl: function() {

	},
	hideRemoveControl: function() {
		this.controls.removeCollateralButtonView.unbind('click').remove();
	}
};

Collateral.collaterals = [];
Collateral.addCollateral = function() {
	var collateral = new Collateral();
	Collateral.parent.append('<hr>').append(collateral.getView());
	collateral.getView().find('input[type="currency"]').currencyInput();
	console.log(Collateral.collaterals);
};
Collateral.removeCollateral = function(collateral) {
	if(Collateral.collaterals.indexOf(collateral) === (Collateral.collaterals.length - 1)) {
		Collateral.collaterals[Collateral.collaterals.indexOf(collateral) - 1].showAddControl();
	}
	collateral.view.prev().remove();
	collateral.view.remove();
	Collateral.collaterals.splice(Collateral.collaterals.indexOf(collateral), 1);
	console.log(Collateral.collaterals);
};
Collateral.getData = function() {
	var data = [];
	Collateral.collaterals.forEach(function(collateral) {
		var collateralData = collateral.getData();
		if(collateralData) {
			data.push(collateralData);
		} else {
			data.push(null);
		}
	});
	return data;
};

/******** Awamo Style - Scheduled for removal *******/
Collateral.makeYourSelfForProcessEngine = function() {
	var data = Collateral.getData();
	var processEnginesExpectations = [];
	data.forEach(function(collateral, index) {
		if(collateral == null) {
			return;
		}
		var processEngineCollateral = {};
		for(key in collateral) {
			if(key == "images" || key == "guarantor") {
				continue;
			}
			processEngineCollateral[key] = collateral[key];
			console.log(key);
		}
		processEngineCollateral.index = index;
		processEnginesExpectations.push(processEngineCollateral);
	});
	console.log("Process engine data: ", processEnginesExpectations);
	return processEnginesExpectations;
};
Collateral.makeImageArrayForProcessEngine = function() {
	var imageArrayForProcessEngine = [];
	var data = Collateral.getData();
	data.forEach(function(collateral, index) {
		if(collateral == null) {
			return;
		}
		if(collateral.images.length > 0) {
			var formData = new FormData();
			formData.append("payload", collateral.images[0]);
			imageArrayForProcessEngine.push({
				index: index,
				fd: formData
			});
		}
	});
	return imageArrayForProcessEngine;
};
Collateral.getGuarantor = function() {
	return Collateral.collaterals[0].guarantor.getData();
};
