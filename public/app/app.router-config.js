(function() {
	'use strict';

	angular.module('contactsApp').config(config);

	function config($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/contacts');

		$stateProvider
			.state('contacts', {
				url:'/contacts',
				templateUrl:'app/contacts/contacts-partial.html',
				controller: 'Contacts',
				//controllerAs: 'login'
			});
		
	}
})();