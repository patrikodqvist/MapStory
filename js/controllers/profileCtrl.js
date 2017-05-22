mapStory.controller('profileCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase, $interval) {	
	$rootScope.playSound = false;
	$rootScope.inGame = false;
	$rootScope.Playing =false;

	$scope.yo = function() {
		$window.location.href = "#!/home";
	}
	$scope.profile = function() {
		$window.location.href = "#!/profile";
	}
	$scope.search = function() {
		$window.location.href = "#!/search";
	}

	$scope.splitter = function() {
		  var menu = document.getElementById('menu');
		  menu.open();
	}
});