mapStory.controller('searchCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase, $interval) {
	$scope.search = function(name) {
		loginService.userSearch(name);
		loginService.gameSearch(name);
	}
});	
