mapStory.controller('windowCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase, $interval) {	
	if ($rootScope.currentUser) {

	}
	else {
		$window.location.href = "#!/login"
		$window.location.reload();
	}

	$rootScope.playSound = false;
	$rootScope.inGame = false;
	$rootScope.Playing =false;

	$scope.searchInfo = function(name) {
		loginService.userSearch(name);
		loginService.gameSearch(name);
	}

	$scope.home = function() {
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

	$scope.logOut = function() {
    	if ($scope.audio) {
    		$scope.audio.pause();
    	}
    	loginService.logout();
    	
    }
});