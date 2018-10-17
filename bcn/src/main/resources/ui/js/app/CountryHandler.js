/*
 * Country Handler in the World
 * Author : Muyinda Rogers
 */


var CountryHandler = function() {
    CountryHandler.self = this;
};

CountryHandler.prototype.countryList = [];

CountryHandler.prototype.display_nationality_options = function(select_handler) {

    var count = 0;
    var countries = CountryHandler.self.countryList;
    var options = "<option value='' > Select Nationality </option>";
    while (count < countries.length) {
        options += "<option value='" + countries[count].nationality.toUpperCase() + "' >" + countries[count].nationality + "</option>";
        count++;
    }
    $("#" + select_handler).html(options);
};

CountryHandler.prototype.init = function() {
    var country = [];

    country.push({
        name: 'Uganda',
        nationality: 'Ugandan',
        region: 'East Africa',
        continent: ''
    });

    country.push({
        name: 'Kenya',
        nationality: 'Kenyan',
        region: 'East Africa',
        continent: ''
    });


    country.push({
        name: 'Tanzania',
        nationality: 'Tanzanian',
        region: 'East Africa',
        continent: ''
    });

    country.push({
        name: 'Rwanda',
        nationality: 'Rwandese',
        region: 'East Africa',
        continent: ''
    });

    country.push({
        name: 'Burundi',
        nationality: 'Burundian',
        region: 'East Africa',
        continent: ''
    });


    country.push({
        name: 'South Sudan',
        nationality: 'South Sudanese',
        region: 'East Africa',
        continent: ''
    });


    country.push({
        name: 'Congo',
        nationality: 'Congolese',
        region: '',
        continent: ''
    });



    country.push({
        name: 'DR Congo',
        nationality: 'Congolese (brazavile)',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Afghanistan',
        nationality: 'Afghan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Albania',
        nationality: 'Albanian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Algeria',
        nationality: 'Algerian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'America',
        nationality: 'American',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Andorra',
        nationality: 'Andorran',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Angola',
        nationality: 'Angolan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Antigua and Barbuda',
        nationality: 'Antiguans',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Argentina',
        nationality: 'Argentinean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Armenia',
        nationality: 'Armenian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Australia',
        nationality: 'Australian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Austria',
        nationality: 'Austrian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Azerbaijan',
        nationality: 'Azerbaijani',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Bahamas',
        nationality: 'Bahamian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Bahrain',
        nationality: 'Bahamian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Bangladesh',
        nationality: 'Bangladeshi',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Barbados',
        nationality: 'Barbadian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Antigua and Barbuda',
        nationality: 'Barbudans',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Batswana',
        nationality: 'Batswana',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Belarus',
        nationality: 'Belarusian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Belgium',
        nationality: 'Belgian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Belize',
        nationality: 'Belizean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Benin',
        nationality: 'Beninese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Bhutan',
        nationality: 'Bhutanese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Bolivia',
        nationality: 'Bolivian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Bosnia',
        nationality: 'Bosnian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Brazil',
        nationality: 'Brazilian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Britain',
        nationality: 'British',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Brunei',
        nationality: 'Bruneian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Bulgaria',
        nationality: 'Bulgarian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Burkina Faso',
        nationality: 'Burkinabe',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Myanmar (Burma)',
        nationality: 'Burmese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Cambodia',
        nationality: 'Cambodian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Cameroon',
        nationality: 'Cameroonian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Canada',
        nationality: 'Canadian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Cape Verde',
        nationality: 'Cape Verdean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Central Africa',
        nationality: 'Central African',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Chad',
        nationality: 'Chadian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Chile',
        nationality: 'Chilean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'China',
        nationality: 'Chinese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Colombia',
        nationality: 'Colombian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Comoros',
        nationality: 'Comoran',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Costa Rica',
        nationality: 'Costa Rican',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Croatia',
        nationality: 'Croatian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Cuba',
        nationality: 'Cuban',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Cyprus',
        nationality: 'Cypriot',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Czech Republic',
        nationality: 'Czech',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Denmark',
        nationality: 'Danish',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Djibouti',
        nationality: 'Djibouti',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Dominican Republic',
        nationality: 'Dominican',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Dutch',
        nationality: 'Dutch',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Timor-Leste',
        nationality: 'East Timorese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Ecuador',
        nationality: 'Ecuadorean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Egypt',
        nationality: 'Egyptian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'United Arab Emirates',
        nationality: 'Emirian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Equatorial Guinea',
        nationality: 'Equatorial Guinean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Eritrea',
        nationality: 'Eritrean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Estonia',
        nationality: 'Estonian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Ethiopia',
        nationality: 'Ethiopian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Fiji',
        nationality: 'Fijian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Philippines',
        nationality: 'Filipino',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Finland',
        nationality: 'Finnish',
        region: '',
        continent: ''
    });

    country.push({
        name: 'France',
        nationality: 'French',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Gabon',
        nationality: 'Gabonese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Gambia',
        nationality: 'Gambian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Georgia',
        nationality: 'Georgian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Germany',
        nationality: 'German',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Ghana',
        nationality: 'Ghanaian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Greece',
        nationality: 'Greek',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Grenada',
        nationality: 'Grenadian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Guatemala',
        nationality: 'Guatemalan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Guinea-Bissau',
        nationality: 'Guinea-Bissauan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Guinea',
        nationality: 'Guinean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Guyana',
        nationality: 'Guyanese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Haiti',
        nationality: 'Haitian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Herzegovinia',
        nationality: 'Herzegovinian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Honduras',
        nationality: 'Honduran',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Hungary',
        nationality: 'Hungarian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Iceland',
        nationality: 'Icelander',
        region: '',
        continent: ''
    });

    country.push({
        name: 'India',
        nationality: 'Indian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Indonesia',
        nationality: 'Indonesian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Iran',
        nationality: 'Iranian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Iraq',
        nationality: 'Iraqi',
        region: '',
        continent: ''
    });



    country.push({
        name: 'Ireland',
        nationality: 'Irish',
        region: '',
        continent: ''
    });



    country.push({
        name: 'Israel',
        nationality: 'Israeli',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Italy',
        nationality: 'Italian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Ivoery Coast',
        nationality: 'Ivorian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Jamaica',
        nationality: 'Jamaican',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Japan',
        nationality: 'Japanese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Jordan',
        nationality: 'Jordanian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Kazakhstan',
        nationality: 'Kazakhstani',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Saint Kitts and Nevis',
        nationality: 'Kittian and Nevisian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Kuwait',
        nationality: 'Kuwaiti',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Kyrgyzstan',
        nationality: 'Kyrgyz',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Laos',
        nationality: 'Laotian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Latvia',
        nationality: 'Latvian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Labanon',
        nationality: 'Lebanese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Liberia',
        nationality: 'Liberian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Libya',
        nationality: 'Libyan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Liechtenstein',
        nationality: 'Liechtensteiner',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Lithuania',
        nationality: 'Lithuanian',
        region: '',
        continent: ''
    });



    country.push({
        name: 'Luxembourg',
        nationality: 'Luxembourger',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Macedonia',
        nationality: 'Macedonian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Madagascar',
        nationality: 'Malagasy',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Malawi',
        nationality: 'Malawian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Malaysia',
        nationality: 'Malaysian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Maldives',
        nationality: 'Maldivan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Mali',
        nationality: 'Malian',
        region: '',
        continent: ''
    });



    country.push({
        name: 'Malta',
        nationality: 'Maltese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Marshall Islands',
        nationality: 'Marshallese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Mauritania',
        nationality: 'Mauritanian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Mauritius',
        nationality: 'Mauritian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Mexico',
        nationality: 'Mexican',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Federated States of Micronesia',
        nationality: 'Micronesian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Moldova',
        nationality: 'Moldovan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Monaco',
        nationality: 'Monacan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Mongolia',
        nationality: 'Mongolian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Morocco',
        nationality: 'Moroccan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Lesotho',
        nationality: 'Mosotho',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Botswana',
        nationality: 'Motswana',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Mozambique',
        nationality: 'Mozambican',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Namibia',
        nationality: 'Namibian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Nauru',
        nationality: 'Nauruan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Nepal',
        nationality: 'Nepalese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'New Zealand  ',
        nationality: 'New Zealander',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Vanuatu',
        nationality: 'Ni-Vanuatu',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Vanuatu',
        nationality: 'Ni-Vanuatu',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Nicaragua',
        nationality: 'Nicaraguan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Nigeria',
        nationality: 'Nigerien',
        region: '',
        continent: ''
    });


    country.push({
        name: 'North Korean',
        nationality: 'North Korean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Northern Ireland',
        nationality: 'Northern Irish',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Norway',
        nationality: 'Norwegian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Oman',
        nationality: 'Norwegian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Pakistan',
        nationality: 'Pakistani',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Palau',
        nationality: 'Palauan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Panama',
        nationality: 'Panamanian',
        region: '',
        continent: ''
    });



    country.push({
        name: 'Papua New Guinea',
        nationality: 'Papua New Guinean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Paraguay',
        nationality: 'Paraguayan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Peru',
        nationality: 'Peruvian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Poland',
        nationality: 'Polish',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Portugal',
        nationality: 'Portuguese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Qatar',
        nationality: 'Qatari',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Romania',
        nationality: 'Romanian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Russia',
        nationality: 'Russian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Rwanda',
        nationality: 'Rwandan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Saint Lucia',
        nationality: 'Saint Lucian',
        region: '',
        continent: ''
    });



    country.push({
        name: 'El Salvador',
        nationality: 'Salvadoran',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Samoa',
        nationality: 'Samoan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Samoa',
        nationality: 'San Marino',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Samoa',
        nationality: 'Sao Tomean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'São Tomé and Príncipe',
        nationality: 'Sao Tomean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Saudi Arabia',
        nationality: 'Saudi',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Scotland',
        nationality: 'Scottish',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Senegal',
        nationality: 'Senegalese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Serbia',
        nationality: 'Serbian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Seychelles',
        nationality: 'Seychellois',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Sierra Leone',
        nationality: 'Sierra Leonean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Singapore',
        nationality: 'Singaporean',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Slovakia',
        nationality: 'Slovakian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Slovenia',
        nationality: 'Slovenian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Solomon Island',
        nationality: 'Solomon Islander',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Somalia',
        nationality: 'Somali',
        region: '',
        continent: ''
    });

    country.push({
        name: 'South Africa',
        nationality: 'South African',
        region: '',
        continent: ''
    });

    country.push({
        name: 'South Korea',
        nationality: 'South Korean',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Spain',
        nationality: 'Spanish',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Sri Lanka',
        nationality: 'Sri Lankan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Sudan',
        nationality: 'Sudanese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Suriname',
        nationality: 'Surinamer',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Swaziland',
        nationality: 'swazi',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Sweden',
        nationality: 'Swedish',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Switzerland',
        nationality: 'Swiss',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Syria',
        nationality: 'Syrian',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Taiwan',
        nationality: 'Taiwanese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Tajikistan',
        nationality: 'Tajik',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Thailand',
        nationality: 'Thai',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Togo',
        nationality: 'Togolese',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Tonga',
        nationality: 'Tongan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Trinidad and Tobago',
        nationality: 'Trinidadian or Tobagonian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Tunisia',
        nationality: 'Tunisian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Turkey',
        nationality: 'Turkish',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Tuvalu',
        nationality: 'Tuvaluan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Ukrain',
        nationality: 'Ukrainian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Uruguay',
        nationality: 'Uruguayan',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Uzbekistan',
        nationality: 'Uzbekistani',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Venezuela',
        nationality: 'Venezuelan',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Vietnam',
        nationality: 'Vietnamese',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Wales',
        nationality: 'Welsh',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Yemen',
        nationality: 'Yemenite',
        region: '',
        continent: ''
    });


    country.push({
        name: 'Zambia',
        nationality: 'Zambian',
        region: '',
        continent: ''
    });

    country.push({
        name: 'Zimbabwe',
        nationality: 'Zimbabwean',
        region: '',
        continent: ''
    });

    CountryHandler.self.countryList = country;

};
