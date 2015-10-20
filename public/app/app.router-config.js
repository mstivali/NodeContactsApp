(function() {
	'use strict';

	angular.module('contactsApp').config(config);

	function config($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/login');

		$stateProvider
			.state('contacts', {
				url:'/contacts',
				templateUrl:'app/contacts/contacts-partial.html',
				controller: 'Contacts',
				resolve: { authenticate: authenticate }
				//controllerAs: 'login'
			})
			.state('home', {
				url:'/home',
				templateUrl:'app/home/home-partial.html',
				controller:'Home',
			})
			.state('login', {
				url:'/login',
				templateUrl:'app/login/login-partial.html',
				controller:'Login',
			})
			.state('profile', {
				url:'/profile',
				templateUrl:'app/profile/profile-partial.html',
				controller:'Profile',
				resolve: { authenticate: authenticate }
			})
			.state('register', {
				url:'/register',
				templateUrl:'app/register/register-partial.html',
				controller:'Register'
			});

		function authenticate($q, $timeout, $http, $state, $rootScope) {
			var deferred = $q.defer();

		    $http.get('/loggedin').success(function(user)
		    {
		        $rootScope.errorMessage = null;
		        // User is Authenticated
		        if (user !== '0')
		            deferred.resolve();
		        // User is Not Authenticated
		        else
		        {
		            $rootScope.errorMessage = 'You need to log in.';
		            deferred.reject();
		            $state.go('login');
		        }
		    });
		    
    		return deferred.promise;
		}
		
	}
})();