(function() {
	'use strict';

	angular.module('contactsApp').controller('Login', Login);

	function Login($scope, $rootScope, $http, $log, $state) {
		
		$scope.login = function(user) {
			$log.debug(user);
			$http.post('/login', user)
			.success(function(response) {
				$log.debug(response);
				$rootScope.currentUser = response;
				$state.go('contacts');
			});
		}
	}
})();