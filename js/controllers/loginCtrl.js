mapStory.controller('loginCtrl', function($window,$rootScope,$scope, currentUser, loginService) {
	//Signs in user
	$scope.login = function() {
		var pass = document.getElementById("password").value;
		var email = document.getElementById("email").value;
		var user = {
			email: email,
			password: pass
		};
		loginService.login(user);
	}

	//Register new user
	$scope.registerNewUser = function() {
		var pass = document.getElementById("password").value;
		var email = document.getElementById("email").value;
		var username = document.getElementById("username").value;
		console.log(username);

		var user = {
			email: email,
			password: pass,
			username: username
		};
		loginService.createNewUser(user);
	}

});