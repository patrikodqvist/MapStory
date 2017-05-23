mapStory.controller('homeCtrl', function($window,$rootScope,$scope, Pubnub, currentUser, loginService, gameModel, firebase, $interval) {	
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
	$rootScope.playSound = false;
	$rootScope.inGame = false;
	$rootScope.Playing =false;
	// redirects home
	$scope.home = function() {
		$window.location.href = "#!/home";
	}
	// profile
	$scope.profile = function() {
		$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
		loginService.getUser($rootScope.currentUser.id)
		$window.location.href = "#!/profile"
		
	}
	// search
	$scope.search = function() {
		$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
		$window.location.href = "#!/search";
	}
	// user settings
	$scope.userSettings = function() {
		$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
		$window.location.href = "#!/userSettings";
	}
	// about us
	$scope.aboutUs = function() {
		$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
		$window.location.href = "#!/aboutUs";
	}
	// story feed
	$scope.storyFeed = function() {
		$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
		$window.location.href = "#!/storyFeed";
	}
	// friendslist
	$scope.friendsList = function() {
		$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
		$window.location.href = "#!/friendsList";
	}
	//menu
	$scope.splitter = function() {
		  var menu = document.getElementById('menu');
		  menu.open();
	}
	// Send the user to setGamePage
	$scope.setGame = function() {
		$scope.marker.setMap(null);	
		$window.location.href="#!/createGame"
	}
	// Creates the map
	$scope.createMap = function() {
		if (gameModel.mapLoad==false) {
			$scope.initMap();
			gameModel.mapLoad=true;
		}
	}
	 // Initiates the player with firesound
	$rootScope.player = $interval(function(){
		if ($rootScope.Playing) {
			if ($rootScope.inGame) {
				if ($scope.audio) {
					$scope.audio.pause();
				}
				
			}
			else if ($rootScope.playSound==false) {
				if ($scope.audio) {
					$scope.audio.pause();
				}
				
			}
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
					$scope.audio.pause();
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
    	if ($scope.audio) {
    		$scope.audio.pause();
    	} 
    	$interval.cancel($rootScope.trackUser);
    	$interval.cancel($rootScope.player);
    	loginService.logout();
    	
    }
    // refresh function
    $scope.refreshMap = function() {
    	$scope.initMap()
    }
   

});