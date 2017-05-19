var mapStory = angular.module('mapStory',['ui.router', "firebase"]);
mapStory.value('currentUser', Math.random().toString(36).substring(7));

mapStory.run(function($rootScope, currentUser, $firebaseObject, $window) {

   $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          console.log(error);
          $window.location.href = "#!/login";
    }
  });
  });

mapStory.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.
      state('login', {
        url: '/login',
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl', 
      }).
      state('register', {
        url: '/register',
        templateUrl: 'partials/createUser.html',
        controller: 'loginCtrl',
      }).
    	state('home', {
        url: '/home',
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      }).
      state('createGame', {
        url: '/createGame',
        templateUrl: 'partials/setGame.html',
        controller: 'setGameCtrl'
      }).
      state('game/:id', {
        url: '/game/:id',
        templateUrl: 'partials/game.html',
        controller: 'chatCtrl'
      })
      $urlRouterProvider.
      otherwise("/login", {
        templateUrl: 'partials/login.html',
        controller: 'loginCtrl'
      });
  });

mapStory.factory("Auth", ["$firebaseAuth", function($firebaseAuth) {
    return $firebaseAuth();
  }
]);