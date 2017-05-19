mapStory.controller('homeCtrl', function($window,$rootScope,$scope, currentUser, loginService, gameModel, firebase, $interval) {	
	
	//send the user to setGamePage
	$scope.setGame = function() {
		$window.location.href="#!/createGame"
	}
	//creates the map
	$scope.createMap = function() {
		if (gameModel.mapLoad==false) {
			$scope.initMap();
			gameModel.mapLoad=true;
		}
	}

	//Initiates the map
	$scope.initMap = function() {
		 navigator.geolocation.getCurrentPosition(function(position) {
	        $scope.pos = {lat: position.coords.latitude, lng: position.coords.longitude};
	        
	        var mapProp= {
    			center:$scope.pos,
    			zoom:16,
			};
			$rootScope.map = new google.maps.Map(document.getElementById("map"),mapProp);
			var lineSymbol = {
  				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
			};
			$scope.marker = new google.maps.Marker({
				icon: {
      				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      				scale: 5,
      				offset: '100%'
    			},
  				position:$scope.pos,
  				map: $rootScope.map});
            loginService.printGames();
	  	});
	 }

    $interval(function() {
     navigator.geolocation.getCurrentPosition(function(position) {
     	console.log('hej')
  		$scope.pos = {lat: position.coords.latitude, lng: position.coords.longitude};
  		$scope.marker.setMap(null);	
  		$scope.marker = new google.maps.Marker({
				icon: {
      				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      				scale: 5,
      				offset: '100%'
    			},
  				position:$scope.pos,
  				map: $rootScope.map});
})}, 10000);
});