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
				clearContact();
			});
		};

		$scope.remove = function(id) {
			console.log(id);
			$http.delete('/contactlist/' + id).success(function(response) {
				refresh();
			});
		};

		$scope.edit = function(id) {
			console.log(id);
			$http.get('/contactlist/' + id).success(function(response) {
				$scope.contact = response;
			});
		};

		$scope.update = function() {
			console.log($scope.contact._id);
			$http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(){
				refresh();
				clearContact();
			});
		};

		$scope.deselect = function() {
			clearContact();
		}

		function clearContact() {
			$scope.contact = {};
		}


		function refresh() {
			$http.get('/contactlist').success(function(response) {
				console.log(response);
				$scope.contactList = response;
			});
		}


	}

})();