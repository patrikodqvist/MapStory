mapStory.controller('homeCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase, $interval) {	
	$rootScope.playSound = false;
	$rootScope.inGame = false;
	$rootScope.Playing =false;
	// Send the user to setGamePage
	$scope.setGame = function() {
		$scope.marker.setMap(null);	
		$window.location.href="#!/createGame"
	}
	// Creates the map
	$scope.createMap = function() {
		if (gameModel.mapLoad==false) {
			gameModel.mapLoad=true;
		}
	}
	// Initiates the map
	$scope.initMap = function() {
		 navigator.geolocation.getCurrentPosition(function(position) {
	        $rootScope.pos = {lat: position.coords.latitude, lng: position.coords.longitude};
	        
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
	 // Initiates the player with firesound
	$rootScope.player = $interval(function(){
		if ($rootScope.Playing) {
		}
		else {
		if ($rootScope.playSound) {
			$rootScope.Playing=true;
			$scope.audio = new Audio('images/fireMusic.mp3');
			$scope.audio.play();
			$scope.audio.addEventListener("ended", function(){
     			$rootScope.Playing = false;
			});
		}
		else {
			if ($scope.audio) {
			}
		}
	}
	}, 1000);
	// Tracks the user location
    $rootScope.trackUser = $interval(function() {
     navigator.geolocation.getCurrentPosition(function(position) {
  		$rootScope.pos = {lat: position.coords.latitude, lng: position.coords.longitude};
  		$scope.marker.setMap(null);	
  		$scope.marker = new google.maps.Marker({
				icon: {
      				path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      				scale: 5,
      				offset: '100%'
    			},
  				position:$scope.pos,
  				map: $rootScope.map});
  		var test = false;
  		if ($rootScope.games) {
  			for (game in $rootScope.games) {
  				if ($rootScope.games[game].location){
	  				var result = gameModel.getDistance($rootScope.pos, $rootScope.games[game].location);
	  				if (result <= $rootScope.games[game].range) {
	  					test=true;
	  					if ($rootScope.inGame==false) {
	  						if ($rootScope.Playing == false) {
		  						$rootScope.playSound = true;		
		  					}
	  					}
	  				}
  				}
  			}
  			if (test== false) {
  				$rootScope.playSound=false;
  			}
  		}
  	});
	}, 10000);
    // Loggs out the User
    $scope.logOut = function() {
    	$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
    	loginService.logout()
    }
    $scope.initMap();
});