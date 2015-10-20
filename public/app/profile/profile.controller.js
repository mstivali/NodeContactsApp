(function() {
	'use strict';

	angular.module('contactsApp').controller('Profile', Profile);

	function Profile($scope, $http) {
		//profile controller
		$http.get("/rest/users")
		.success(function(response) {
			$scope.users = response;
		});
	}
})();