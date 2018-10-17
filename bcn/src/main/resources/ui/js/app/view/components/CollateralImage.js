function CollateralImage(collateral) {
	this.view = null;
	this.data = null;
	this.collateral = collateral;
	this.init();
}
CollateralImage.prototype = {
	constructor: CollateralImage,
	init: function() {
		var collateralImageView = $('<div class="collateral-image"><div class="cropit-preview"></div><label></label></div>');
		var collateralImageInput = $('<input>', {type: "file", class: "cropit-image-input"});
		var collateralImageControls = $('<div>', {class: "collateral-image-controls"});
		var collateralImageEdit = $('<span>', {class: "collateral-image-edit fa fa-pencil", title: "Add"});
		var collateralImageRemove = $('<span>', {class: "collateral-image-remove", title: "Delete"}).html("&Cross;");

		var collateralImage = this;
		collateralImageInput.on("change blur", function(e) {
			collateralImage.view.find('img').on('load', function() {
				// collateralImage.data.image = collateralImage.view.cropit('export');
				// console.log(collateralImage.data);
				/******* The Awamo Style *******/
				collateralImage.data = e.target.files[0];
				console.log(collateralImage.data);
			});
			collateralImage.collateral.addImage();
		});
		collateralImageEdit.on('click', function() {
			collateralImageInput.trigger('click');
		});
		collateralImageRemove.on('click', function() {
			if(collateralImage.data !== null) {
				showDialogPopupWithHandlers("Remove Collateral Image",
					"Are you sure you want to delete this image?",
					"Yes",
					function() {
						collateralImage.remove();
					},
					"No",
					function() {
						// Do nothing
					});				
			} else {
				collateralImage.remove();
			}
			return false;
		});
		collateralImageView.find('label').append(collateralImageInput);
		collateralImageControls.append(collateralImageEdit).append(collateralImageRemove);
		collateralImageView.append(collateralImageControls);

		collateralImageEdit.tooltip({
			placement: 'bottom'
		});
		collateralImageRemove.tooltip({
			placement: 'bottom'
		});

		this.view = collateralImageView;
	},
	getView: function() {
		return this.view;
	},
	remove: function() {
		this.collateral.removeImage(this);
		this.view.remove();
		this.view = null;
	},
	getData: function() {
		if(this.data == null) {
			return false;
		}
		return this.data;
	}
}