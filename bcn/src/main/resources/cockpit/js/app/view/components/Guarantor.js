function Guarantor() {
	this.view = null;
	this.data = null;
	this.init();
}
Guarantor.prototype = {
	constructor: Guarantor,
	init: function() {
		var guarantorView = $('<div class="col-lg-4 extra-guarantor"><h6>Guarantor Info</h6><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon">Has Guarantor</div><select class="form-control guarantor-presence" required=""><option value="" selected="selected">Select</option><option value="YES">YES</option><option value="NO">NO</option></select></div><p class="help-block"></p></div><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon">Name</div><input type="text" data-type="string" minlength="4" maxlength="70" class="form-control guarantor-name" placeholder="Guarantor Name" required="" autocomplete="off"></div><p class="help-block"></p></div><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon addonToolTip" title="Monthly Income">Income</div><input type="currency" min="0" data-type="thousand-commas" step="500" minamount="0" class="form-control thousand-commas currency-input guarantor-income" placeholder="Guarantor Income" required="" autocomplete="off"><span class="input-group-addon ext currencyExtensionAddon">KES</span></div><p class="help-block"></p></div><div class="form-group inputGroupContainer"><div class="input-group"><div class="input-group-addon addonToolTip" title="Phone Number" style="min-width:4px;padding:6px 8px">Phone</div><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle country-btn" data-toggle="dropdown" style="background-color:white;color:#464a4c;border-radius:1px"><img src="img/flags/ug.png" style="height:20px;width:20px"><span class="caret"></span></button><ul class="dropdown-menu dropdown-menu-right phoneCountryPickerList country-list" role="menu"></ul></div><input type="tel" class="form-control phone-field guarantor-phone" data-type="phone" placeholder="Guarantor Phone Number" required autocomplete="off" countryCode=""></div><p class="help-block"></p></div></div>');
		this.guarantorPresence = guarantorView.find('.guarantor-presence');
		this.guarantorNameView = guarantorView.find('.guarantor-name').attr('disabled', 'true');
		this.guarantorValueView = guarantorView.find('.guarantor-income').attr('disabled', 'true');
		this.guarantorPhoneView = guarantorView.find('.guarantor-phone').attr('disabled', 'true');

		var countryButtonView = guarantorView.find('.country-btn').attr('disabled', 'true');
		var countryListView = guarantorView.find('.country-list');

		/* The Awamo Style */
		populatePhoneInputFlagAddon(this.guarantorPhoneView, countryButtonView, countryListView);
		/* The Awamo Style */

		var guarantor = this;
		this.guarantorPresence.on('change', function() {
			if($(this).val() === 'YES') {
				guarantor.guarantorNameView.removeAttr('disabled');
				guarantor.guarantorValueView.removeAttr('disabled');
				guarantor.guarantorPhoneView.removeAttr('disabled');
				countryButtonView.removeAttr('disabled');
			} else {
				guarantor.guarantorNameView.attr('disabled', 'true');
				guarantor.guarantorValueView.attr('disabled', 'true');
				guarantor.guarantorPhoneView.attr('disabled', 'true');
				countryButtonView.attr('disabled', 'true');
			}
		});
		this.view = guarantorView;
	},
	getView: function() {
		return this.view;
	},
	getData: function() {
		if(this.guarantorPresence.val() !== 'YES') {
			return false;
		}
		this.data = {
			guarantorName: this.guarantorNameView.val(),
			guarantorValue: unformatCurrency(removeThousandCommas(this.guarantorValueView.val()))
			// ,
			// guarantorPhone: this.guarantorPhoneView.val()
		}
		return this.data;
	}
}
