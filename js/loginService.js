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
    				var cancel = false;
    				if (value.host == $rootScope.currentUser.username) {
    					var login = prompt("Type in your Host password if you want to delete your game, Press Cancel to join", "Password");
    					if (login == null) {
    					}
    					else if (login == value.gamePassword) {
    						cancel=true;
    						service.saveStory($rootScope.currentUser.id, value);
    						gameRef.child(value.id).remove().then(
    							service.removeHost($rootScope.currentUser.id, value)
    							).then($window.location.reload());

    					}
    					else {
    						$window.alert('Wrong Password');
    					}
    				}
    				if (cancel == false) {
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
			story: game.story,
			host: game.host,
			players: game.players
		}).then($window.location.href = '#!/home')
			
	},
	//Removes The game from profile host list
    removeHost: function(userId, game) {
    	var userStories = ref.child(userId).child("host").child(game.id).remove(
    		).then(
    		$window.location.href = '#!/home')
			
	},
	//User search
	userSearch: function(name) {
      var users = $firebaseArray(ref);
      users.$loaded().then(function(ref){
        	for (var profile in ref) {
        		if (ref[profile].username == name) {
        			$rootScope.selUser = ref[profile];
        		}
        	}
          })
    },
    //User search
	getUser: function(id) {
      var users = $firebaseArray(ref);
      users.$loaded().then(function(ref){
        	for (var profile in ref) {
        		if (ref[profile].id == id) {
        			$rootScope.selUser = ref[profile];
        		}
        	}
          });
    },
    //Game search
    gameSearch: function(gameName) {
      var searchGames = $firebaseArray(gameRef);
      searchGames.$loaded().then(function(ref){
        	for (var game in ref) {
        		if (ref[game].name == gameName) {
        			console.log(ref[game]);
        			$rootScope.selGame = ref[game];
        		}
        	}
          })
    },
    //require Authentication
	requireAuth: function() {
      return auth.$requireSignIn();
    }, 
    //logout
    logout: function() {
      auth.$signOut();
      $window.location.href= '#!/login';
      $window.location.reload();
    }, 
}
	return service;
}]);