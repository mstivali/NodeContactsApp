(function() {
	'use strict';

	angular.module('contactsApp').controller('NavCtrl', NavCtrl);

	function NavCtrl($scope, $http, $state, $rootScope) {
		$scope.logout = function() {
			$http.post('/logout')
			.success(function() {
				$rootScope.currentUser = null;
				$state.go('login');
			});
		}
	}

})();