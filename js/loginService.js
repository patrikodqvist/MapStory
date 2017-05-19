mapStory.factory('loginService', ['$rootScope', '$window', '$firebaseObject', '$firebaseAuth', '$firebaseArray', function($rootScope,$window,$firebaseArray, $firebaseAuth, $firebaseObject) {
	var ref = firebase.database().ref("users");
	var gameRef = firebase.database().ref("games");
	var object = $firebaseObject(ref);
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(authUser) {
    if(authUser) {
      var userRef = ref.child(authUser.uid);
      var userObj = $firebaseObject(userRef);
      var userArray = $firebaseArray(userRef);
      $rootScope.currentUser = userArray;
      console.log($rootScope.currentUser);
    } else {
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
			console.log(user);
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
    				icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  					position: value.location,
  					map: $rootScope.map
    			});
    			Marker.addListener('click', function() {
    				var test = confirm("Accept to Join");
    				if (test) {
    					$rootScope.channel = value.channel;
    					$rootScope.game = value;
    					if ($rootScope.game.players.length < $rootScope.game.numPlayers) {
	    					$rootScope.game.players.push($rootScope.currentUser.username);
	    					gameRef.child($rootScope.game.id).child("players").set($rootScope.game.players);
	    					$window.location.href = '#!/game/'+ value.id;
	    				}
	    				else {
	    					$window.alert("The game is currenly full")
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
            		radius: 111.5
          		});
    		});
    	});
    },
    //Saves the stories to the user
    saveStory: function(userId, game) {
    	var userStories = $firebaseArray(ref.child(userId).child("stories"));
    	userStories.$loaded().then(function(reference) {
			userStories.child(game.id).set({
				name: game.name,
				id: game.id,
				story: game.story
			});
			$window.location.href = '#!/home'
		});
    },
    //require Authentication
	requireAuth: function() {
      return auth.$requireSignIn();
    }, 

    logout: function() {
      auth.$signOut();
      $window.location.href= '#!/home';
    }, //logout
}
	return service;
}]);