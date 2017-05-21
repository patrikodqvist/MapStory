mapStory.factory('loginService', ['$rootScope', '$window', '$firebaseObject', '$firebaseAuth', '$firebaseArray','Pubnub','gameModel', function($rootScope,$window,$firebaseObject, $firebaseAuth,$firebaseArray , Pubnub,gameModel) {
	var ref = firebase.database().ref("users");
	var gameRef = firebase.database().ref("games");
	var object = $firebaseObject(ref);
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(authUser) {
	    if(authUser) {
	      var userRef = ref.child(authUser.uid);
	      var userObj = $firebaseObject(userRef);
	      $rootScope.currentUser = userObj;
	      console.log($rootScope.currentUser);
	    } 
	    else {
	      $rootScope.currentUser = '';
	    }
  	});
	//LogsIn a user, and authenticates with firebase
	var service = {
	login: function(user) {
		auth.$signInWithEmailAndPassword(
			user.email,
			user.password
		).then(function(user){
			console.log("login success");
			$window.location.href="#!/home"
		}).catch(function(error) {
			$rootScope.errorMessage = error.message;
		});
	},
	//Creates a New User, and signs the new user.
	createNewUser: function(user) {
		auth.$createUserWithEmailAndPassword(
			user.email,
			user.password,
			user.username
			).then(function(newUser) {
				ref.child(newUser.uid).set({
					email: user.email,
					password: user.password,
					username: user.username,
					id: newUser.uid,
					stories: '',
					position: '',
					host: '',
				});
				service.login(user);
			}).catch(function(error) {
				console.log(error);
				$rootScope.errorMessage= error.message;
			});
	},
	createGame: function(gameName, game) {
		gameRef.child(gameName).set(game
		).then(function(ref) {
			$rootScope.game = game;
			service.addHostToProfile(game);
      });
    },
    addHostToProfile: function(game) {
      ref.child($rootScope.currentUser.id).child("host").child(game.id).set({
      	gameName: game.name,
        id: game.id
      }
      ).then(function(reference) {
      	$window.location.href = '#!/game/'+game.id;
      });
    },
    //prints out all games
    printGames: function() {
    	var games = $firebaseArray(gameRef);
    	games.$loaded().then(function(reference) {
    		$rootScope.games = [];
    		angular.forEach(reference, function(value, key) {
        		$rootScope.games.push(value);
        		var Marker = new google.maps.Marker({
  					position: value.location,
  					map: $rootScope.map
    			});
    			Marker.addListener('click', function() {
    				var test = confirm("Accept to Join");
    				if (test) {
    					var result = gameModel.getDistance($rootScope.pos,value.location);
    					$rootScope.game = value;
    					if (result <= value.range) {	
	    					$rootScope.inGame=true;
	    					$rootScope.playSound = false;
	    					Pubnub.setUUID($rootScope.currentUser.username);
	    					Pubnub.hereNow({
					    		channels: [$rootScope.game.channel],
					    		includeUUIDs: true},
					    		function(status, response) {
					    			angular.forEach(response.channels, function(obj,nyckel){
					    				$rootScope.onlineUsers = obj.occupants;
					    				if (obj.occupants.length < value.numPlayers) {
					    					$window.location.href = '#!/game/'+ value.id;
					    				}
					    				else {
					    					$window.alert('Game is currently full')
					    					$rootScope.inGame=false;
					    				}
					    			});
					  			}
					  		);
		    			}
		    			else {
		    				$window.alert('You are too far away, You have to be in the story area!')
		    			}
		    		}
        		});
    			var cityCircle = new google.maps.Circle({
            		strokeColor: '#0000ff',
            		strokeOpacity: 0.8,
            		strokeWeight: 2,
            		fillColor: '#0000ff',
            		fillOpacity: 0.35,
            		map: $rootScope.map,
            		center: value.location,
            		radius: value.range
          		});
    		});
    	});
    },
    //Saves the stories to the user
    saveStory: function(userId, game) {
    	var userStories = ref.child(userId).child("stories");
		userStories.child(game.id).set({
			name: game.name,
			id: game.id,
			story: game.story
		}).then($window.location.href = '#!/home')
			
		},
    //require Authentication
	requireAuth: function() {
      return auth.$requireSignIn();
    }, 
    //logout
    logout: function() {
      auth.$signOut();
      $window.location.href= '#!/login';
    }, 
}
	return service;
}]);