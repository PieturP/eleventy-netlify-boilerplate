<?php

        /**
		 * getShipmentCosts
		 * Calculates shipmentcosts, bases on nr of books, type of books and shipment details (tariff regions and delivery options)
		 * @return float
		 */
		public function getShipmentCosts($books, $shipmentDetails) {
			$costs = 0.0;
			$extraCosts = 0.0;
			$heavyCount = 0;

			$extraHeavyCount = 0;
			$expensiveCount = 0;
			$country = $shipmentDetails['country'];
			$nrOfItems = count($books);

			//		$newBooksCount = 0;
			//		$secureShipment = (isset($shipmentDetails['secure']) && $shipmentDetails['secure'] === 'on') ? true : false;

            // heavyCount, extraHeavyCount, expensiveCount
			foreach ($books as $book) {
				if ($book['Book']['weight'] === 'Heavy') {
					$heavyCount++;
				}
				if ($book['Book']['weight'] === 'Extra Heavy') {
					$extraHeavyCount++;

				}
				if ($book['Book']['price'] > 65.0) {
					$expensiveCount++;
				}
				//		foreach($book['Keyword'] as $keyword){
				//			if($keyword['name'] === 'nieuw' && $country === 'NL'){
				//				$newBooksCount++;
				//				break;
				//			}
				//		}
			}

			if ($country === 'NL' || $country === 'DE') {

				switch ($nrOfItems){
					case 1:
						$costs = 4.0;
					break;
					case 2:
						$costs = 6.0;
					break;
					case 3:
					case 4:
					case 5:
						$costs = 8.0;
					break;
					case 6:
					default:
						$costs = 10.0;
					break;
				}
				if ($expensiveCount > 0) {
					if ($nrOfItems < 6){
						$costs  = 8.0;
					} else {
						$costs  = 10.0;
					}
				}

			} else if ($this->isEurope($country)) {

				switch($nrOfItems){
					case 1:
						$costs = 8.0;
					break;
					case 2:
						$costs = 10.0;
					break;
					case 3:
						$costs = 12.0;
					break;
					case 4:
						$costs = 14.0;
					break;
					case 5:
						$costs = 16.0;
					break;
					case 6:
						$costs = 18.0;
					break;
					case 7:
					default:
						$costs = 20.0;
					break;
				}
				/*
				$extraCosts  = ($heavyCount * 8.0);
				$extraCosts += ($extraHeavyCount * 12.0);
				if ($extraCosts > 16) {
					$extraCosts = 16.0;
				}*/

			} else { // worldwide

				switch($nrOfItems){
					case 1:
						$costs = 15.0;
					break;
					case 2:
						$costs = 20.0;
					break;
					case 3:
						$costs = 25.0;
					break;
					case 4:
						$costs = 30.0;
					break;
					case 5:
						$costs = 35.0;
					break;
					case 6:
						$costs = 40.0;
					break;
					case 7:
					case 8:
					case 9:
					case 10:
						$costs = 45.0;
					default:
					break;
				}

				if ($heavyCount > 0 || $expensiveCount > 0) {
					$extraCosts = 10.0;
				}
				if ($extraHeavyCount > 0) {
					$extraCosts = 15.0;
				}
			}
			return ($costs + $extraCosts);
		}

		public function getHandling($paymentDetails) {
			$handling = 0;
				//if ($paymentDetails == 'PayPal' || $paymentDetails == 'Creditcard') {
				//	$handling = 2.0;
				//}
			return $handling;
		}

		/**
		 * getPrexifes()
		 * @return prefixes
		 */
		public function getPrefixes(){
			$prefixesArray = array();
			$prefixesArray['Mr.'] = 'Mr.';
			$prefixesArray['Ms.'] = 'Ms.';
			return $prefixesArray;
		}

		/**
		 * Returns true if country is part of the European Union
		 * @param string $country
		 * @return bool
		 */
		public function isEurope($country){
			return in_array($country, array(
			 	'AT', // Austria
				'BE', // Belgium
				'BG', // Bulgaria
				'CY', 'CZ', // Cyprus, Czech Republic
				'DK', 'FI', // Denmark, Finland
				'ES', // Estonia
				'FR', 'DE', // France, Germany
				'GR', // Greece
				'HU', // Hungary
				'IE', // Ireland
				'IT', // Italy
				'LT', // Lithuania
				'LU', // Luxembourg
				'LV', // Latvia
				'MT', // Malta
				'NL', // The Netherlands
				'PL', 'PT', // Poland, Portugal
				'RO', 'SK', // Romania, Slovakia
				'SI', 'ES', // Slovenia, Spain
				'SE', // Sweden
				'GB'  // United Kingdom
			));
		}

		/**
		 * Returns true if country is in Tariff Region A of the EU
		 * @param string $country
		 * @return bool
		 */
		public function isEuropeA($country){
			return in_array($country, array(
			 	'AT', // Austria
				'BE', // Belgium
				'DK', // Denmark
				'FR', // France
				'IE', // Ireland
				'IT', // Italy
				'LU', // Luxembourg
				'ES', // Spain
				'SE', // Sweden
				'NO', // Norway
				'GB'  // United Kingdom
			));
		}

		/**
		 * Returns true if country is in Tariff Region B of the EU
		 * @param string $country
		 * @return bool
		 */
		public function isEuropeB($country){
			return in_array($country, array(
			 	'BG', // Bulgaria
				'EE', // Estonia
				'FI', // Finland
				'HU', // Hungary
				'LV', // Latvia
				'LT', // Lithuania
				'PL', // Poland
				'PT', // Portugal
				'RO', // Romania
				'SI', // Slovenia
				'SK', // Slovakia
				'CH', // Switserland
				'CZ', // Czech Republic
				'GR', // Greece
				'CY'  // Cyprus
			));
		}

		/**
		 * getCountryCodes()
		 * @return arr countryCodes (Key => "PayPal area code", Value => UK English string )
		 */
		public function getCountryCodes() {

	      $arr = array();

	      // A
	      $arr['AL'] = 'Albania';
	      $arr['DZ'] = 'Algeria';
	      $arr['AS'] = 'American Samoa';
	      $arr['AD'] = 'Andorra';
	      $arr['AI'] = 'Anguilla';
	      $arr['AG'] = 'Antigua and Barbuda';
	      $arr['AR'] = 'Argentina';
	      $arr['AM'] = 'Armenia';
	      $arr['AW'] = 'Aruba';
	      $arr['00'] = 'Athos';
	      $arr['AU'] = 'Autstralia';
	      $arr['AT'] = 'Austria';
	      $arr['AZ'] = 'Azerbaijan';

	      // B
	      $arr['BS'] = 'Bahamas';
	      $arr['BH'] = 'Bahrain';
	      $arr['BD'] = 'Bangladesh';
	      $arr['BB'] = 'Barbados';
	      $arr['BY'] = 'Belarus';
	      $arr['BE'] = 'Belgium';
	      $arr['BZ'] = 'Belize';
	      $arr['BJ'] = 'Benin';
	      $arr['BM'] = 'Bermuda';
	      $arr['BO'] = 'Bolivia';
	      $arr['BA'] = 'Bosnia and Herzegovina';
	      $arr['BW'] = 'Botswana';
	      $arr['BR'] = 'Brazil';
	      $arr['VG'] = 'British Virgin Islands';
	      $arr['BN'] = 'Brunei';
	      $arr['BG'] = 'Bulgaria';
	      $arr['BF'] = 'Burkina Faso';

	      // C
	      $arr['KH'] = 'Cambodia';
	      $arr['CM'] = 'Cameroon';
	      $arr['01'] = 'Campione d\' Italia';
	      $arr['CA'] = 'Canada';
	      $arr['02'] = 'Canary Islands';
	      $arr['CV'] = 'Cape Verde';
	      $arr['KY'] = 'Cayman Islands';
	      $arr['03'] = 'Ceuta';
	      $arr['04'] = 'Chanal Islands';
	      $arr['CL'] = 'Chile';
	      $arr['CN'] = 'China';
	      $arr['CO'] = 'Colombia';
	      $arr['CK'] = 'Cook Islands';
	      $arr['HR'] = 'Croatia';
	      $arr['CY'] = 'Cyprus';
	      $arr['05'] = 'Cyprus (Turkish -)';
	      $arr['CZ'] = 'Czech Republic';

	      // D
	      $arr['DK'] = 'Denmark';
	      $arr['DJ'] = 'Djibouti';
	      $arr['DM'] = 'Dominica';
	      $arr['DO'] = 'Dominican Republic';

	      // E
	      $arr['TP'] = 'East Timor';
	      $arr['EG'] = 'Egypt';
	      $arr['SV'] = 'El Salvador';
	      $arr['EE'] = 'Estonia';

	      // F
	      $arr['FJ'] = 'Fiji';
	      $arr['FI'] = 'Finland';
	      $arr['FR'] = 'France';
	      $arr['GF'] = 'French Guiana';
	      $arr['PF'] = 'French Polynesia';

	      // G
	      $arr['GA'] = 'Gabon';
	      $arr['GE'] = 'Georgia';
	      $arr['DE'] = 'Germany';
	      $arr['GH'] = 'Ghana';
	      $arr['GI'] = 'Gibraltar';
	      $arr['GR'] = 'Greece';
	      $arr['06'] = 'Greenland';
	      $arr['GD'] = 'Grenada';
	      $arr['GP'] = 'Guadeloupe';
	      $arr['GU'] = 'Guam';
	      $arr['GT'] = 'Guatemala';
	      $arr['GN'] = 'Guinea';
	      $arr['GY'] = 'Guyana';

	      // H
	      $arr['HT'] = 'Haiti';
	      $arr['HN'] = 'Honduras';
	      $arr['HK'] = 'Hong Kong';
	      $arr['HU'] = 'Hungary';

	      // I
	      $arr['IS'] = 'Iceland';
	      $arr['IN'] = 'India';
	      $arr['ID'] = 'Indonesia';
	      $arr['IE'] = 'Ireland';
	      $arr['IL'] = 'Israel';
	      $arr['IT'] = 'Italy';
	      $arr['CI'] = 'Ivory Coast';

	      // J
	      $arr['JM'] = 'Jamaica';
	      $arr['JP'] = 'Japan';
	      $arr['JO'] = 'Jordan';

	      // K
	      $arr['KZ'] = 'Kazakhstan';
	      $arr['KE'] = 'Kenya';
	      $arr['KW'] = 'Kuwait';

	      // L
	      $arr['LA'] = 'Lao People\'s Democratic Republic';
	      $arr['LV'] = 'Latvia';
	      $arr['LB'] = 'Lebanon';
	      $arr['LS'] = 'Lesotho';
	      $arr['07'] = 'Lichtenstein';
	      $arr['LT'] = 'Lithuania';
	      $arr['08'] = 'Livigno';
	      $arr['LU'] = 'Luxembourg';

	      // M
	      $arr['MO'] = 'Macao';
	      $arr['MK'] = 'Macedonia';
	      $arr['MG'] = 'Madagascar';
	      $arr['MY'] = 'Malaysia';
	      $arr['MV'] = 'Maldives';
	      $arr['ML'] = 'Mali';
	      $arr['MT'] = 'Malta';
	      $arr['MH'] = 'Marshall Island';
	      $arr['MQ'] = 'Martinique';
	      $arr['MU'] = 'Mauritius';
	      $arr['09'] = 'Melilla';
	      $arr['MX'] = 'Mexico';
	      $arr['FM'] = 'Micronesia, Federated States of';
	      $arr['MD'] = 'Moldova';
	      $arr['10'] = 'Monaco';
	      $arr['MN'] = 'Mongolia';
	      $arr['MS'] = 'Montserrat';
	      $arr['MA'] = 'Morocco';
	      $arr['MZ'] = 'Mozambique';

	      // N
	      $arr['NA'] = 'Namibia';
	      $arr['NP'] = 'Nepal';
	      $arr['NL'] = 'The Netherlands';
	      $arr['AN'] = 'Netherlands Antilles';
	      $arr['NZ'] = 'New Zealand';
	      $arr['NI'] = 'Nicaragua';
	      $arr['MP'] = 'Northern Mariana Islands';
	      $arr['NO'] = 'Norway';

	      // O
	      $arr['OM'] = 'Oman';

	      // P
	      $arr['PK'] = 'Pakistan';
	      $arr['PW'] = 'Palau';
	      $arr['PS'] = 'Palestine';
	      $arr['PA'] = 'Panama';
	      $arr['PG'] = 'Papua New Guinea';
	      $arr['PY'] = 'Paraguay';
	      $arr['PE'] = 'Peru';
	      $arr['PH'] = 'Phillipines, Replubic of';
	      $arr['PL'] = 'Poland';
	      $arr['PT'] = 'Portugal';
	      $arr['PR'] = 'Puerto Rico';

	      // Q
	      $arr['QA'] = 'Qatar';

	      // R
	      $arr['RO'] = 'Romania';
	      $arr['RU'] = 'Russian Federation';
	      $arr['RW'] = 'Rwanda';

	      // S
	      $arr['KN'] = 'Saint Kitts and Nevis';
	      $arr['LC'] = 'Saint Lucia';
	      $arr['VC'] = 'Saint Vincent and the Grendines';
	 	  $arr['11'] = 'San Marino';
	      $arr['WS'] = 'Samoa';
	      $arr['SA'] = 'Saudi Arabia';
	      $arr['CS'] = 'Serbia and Montenegro';
	      $arr['SC'] = 'Seychelles';
	      $arr['SG'] = 'Singapore';
	      $arr['SK'] = 'Slovakia';
	      $arr['SI'] = 'Slovenia';
	      $arr['SB'] = 'Solomon Islands';
	      $arr['ZA'] = 'South Africa';
	      $arr['KR'] = 'South Korea';
	      $arr['ES'] = 'Spain';
	      $arr['LK'] = 'Sri Lanka';
	      $arr['SZ'] = 'Swaziland';
	      $arr['SE'] = 'Sweden';
	      $arr['CH'] = 'Switzerland';

	      // T
	      $arr['TW'] = 'Taiwan';
	      $arr['TZ'] = 'Tanzania, United Republic of';
	      $arr['TH'] = 'Thailand';
	      $arr['TG'] = 'Togo';
	      $arr['TO'] = 'Tonga';
	      $arr['TT'] = 'Trinidad and Tobago';
	      $arr['TN'] = 'Tunisia';
	      $arr['TR'] = 'Turkey';
	      $arr['TM'] = 'Turkmenistan';
	      $arr['TC'] = 'Turks and Caicos Islands';

	      // U
	      $arr['UG'] = 'Uganda';
	      $arr['UA'] = 'Ukraine';
	      $arr['AE'] = 'United Arab Emirates';
	      $arr['GB'] = 'United Kingdom';
	      $arr['US'] = 'United States of America';
	      $arr['UY'] = 'Uruguay';
	      $arr['UZ'] = 'Uzbekistan';

	      // V
	      $arr['12'] = 'Vatican';
	      $arr['VU'] = 'Vanuatu';
	      $arr['VE'] = 'Venezuela';
	      $arr['VN'] = 'Vietnam';
	      $arr['VI'] = 'Virgin Islands, U.S.';

	      // W, X, Y, Z
	      $arr['YE'] = 'Yemen Arab Republic';
	      $arr['ZM'] = 'Zambia';

	      return $arr;
	   }

		public function validateShipment($data, $Validator){
			$valid = true;
			$msg = '';
			if(!$Validator->checkEmail($data['email'])){
				$valid = false;
				$msg .= 'Email not valid<br />';
			}
			if(trim($data['firstname'] == '')){
				$valid = false;
				$msg .= 'First name cannot be blank<br />';
			}
			if(trim($data['lastname'] == '')){
				$valid = false;
				$msg .= 'Last name cannot be blank<br />';
			}
			if(trim($data['street'] == '')){
				$valid = false;
				$msg .= 'Street name cannot be blank<br />';
			}
			if(trim($data['housenumber'] == '')){
				$valid = false;
				$msg .= 'House number cannot be blank<br />';
			}
			if(trim($data['city'] == '')){
				$valid = false;
				$msg .= 'City cannot be blank<br />';
			}
			if(trim($data['postalcode'] == '')){
				$valid = false;
				$msg .= 'Postalcode cannot be blank<br />';
			}
			if(trim($data['country'] == '')){
				$valid = false;
				$msg .= 'Country cannot be blank<br />';
			}
			if(trim($data['telephone'] == '')){
				$valid = false;
				$msg .= 'Telephone number cannot be blank<br />';
			}
			return array($valid,$msg);
		}


		public function calculateOrder($books, $shipmentDetails, $paymentDetails){

			// calculate subtotal price
			$subtotal = 0;
			foreach($books as $book){
				$subtotal += $book['Book']['price'];
			}

			if(!$this->isEurope($shipmentDetails['country'])){
				$subtotal -= $this->getBTW($subtotal);
				$shipmentCosts = $this->getShipmentCosts($books, $shipmentDetails);
				//$shipmentCosts -= $this->getBTW($shipmentCosts); // shipment costs dont count for the VAT
				$handling = $this->getHandling($paymentDetails);
				$handling -= $this->getBTW($handling);

				$BTW = 0.0;
				$total = $subtotal + $shipmentCosts + $handling;

			} else {
				$shipmentCosts = $this->getShipmentCosts($books, $shipmentDetails);
				$handling = $this->getHandling($paymentDetails);
				$BTW = $this->getBTW($subtotal + $handling + $shipmentCosts);
				$total = $subtotal + $shipmentCosts + $handling;
			}

			$result = array(
				'items' => count($books),
				'subtotal' => $subtotal,
				'BTW' => $BTW,
				'shipment' => $shipmentCosts,
				'handling' => $handling,
				'total' => $total
			);

			foreach($result as $k=>$v){
				$this->set($k,$v);
			}

			return $result;
		}