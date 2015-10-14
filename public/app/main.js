(function() {
	'use strict';

	angular.module('contactsApp', []);

	angular.module('contactsApp').controller('AppCtrl', AppCtrl);

	function AppCtrl($scope, $http){
		console.log("Hello world from controller");

		refresh();

		$scope.addContact = function() {
			console.log($scope.contact);
			$http.post('/contactlist', $scope.contact).success(function(response) {
				console.log(response);
				refresh();
			});
		}

		function refresh() {
			$http.get('/contactlist').success(function(response) {
				console.log(response);
				$scope.contactList = response;
			});
		}
	}

})();