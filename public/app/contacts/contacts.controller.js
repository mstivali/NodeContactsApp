(function() {
	'use strict';

	angular.module('contactsApp').controller('Contacts', Contacts);

	function Contacts($scope, $http, $rootScope, $state) {
		console.log("Hello world from controller");

		refresh();

		$scope.addContact = function() {
			$scope.contact.userId = $rootScope.currentUser._id;
			console.log($scope.contact);
			$http.post('/contactlist/contact', $scope.contact).success(function(response) {
				console.log(response);
				refresh();
				clearContact();
			});
		};

		$scope.remove = function(id) {
			console.log(id);
			$http.delete('/contactlist/contact/' + id).success(function(response) {
				refresh();
			});
		};

		$scope.edit = function(id) {
			console.log(id);
			$http.get('/contactlist/contact/' + id).success(function(response) {
				console.log(response);
				$scope.contact = response;
			});
		};

		$scope.update = function() {
			$scope.contact.userId = $rootScope.currentUser._id;
			console.log($scope.contact._id);
			$http.put('/contactlist/contact/' + $scope.contact._id, $scope.contact).success(function(){
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
			$http.get('/loggedin').success(function(response) {
				console.log(response);
				if(response === '0') {
					$rootScope.errorMessage = 'Session expired, You need to log in.';
					$state.go('login');
				} else {
					$rootScope.currentUser = response;
					$http.get('/contactlist/' + $rootScope.currentUser._id).success(function(response) {
						console.log(response);
						$scope.contactList = response;
					});
				}
			});
		}
	}
})();