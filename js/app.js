var mapStory = angular.module('mapStory',['onsen', 'ui.router', "pubnub.angular.service", "firebase"]);
mapStory.value('currentUser', Math.random().toString(36).substring(7));

mapStory.run(function($rootScope, Pubnub, currentUser, $firebaseObject, $window) {
   //Initiates Pubnub
   Pubnub.init({
     publish_key: 'pub-c-9ded1149-0d94-4941-af4b-1eac63c501b0',
     subscribe_key: 'sub-c-140f0530-3589-11e7-b860-02ee2ddab7fe',
     uuid: currentUser  
   });

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
      }).
      state('profile', {
        url: '/profile',
        templateUrl: 'partials/profilePage.html',
        controller: 'windowCtrl'
      }).
      state('search', {
        url: '/search',
        templateUrl: 'partials/search.html',
        controller: 'windowCtrl'
      }).
      state('userSettings', {
        url: '/userSettings',
        templateUrl: 'partials/userSettings.html',
        controller: 'windowCtrl'
      }).
      state('searchedGame', {
        url: '/searchedGame',
        templateUrl: 'partials/searchedGame.html',
        controller: 'windowCtrl'
      }).
      state('aboutUs', {
        url: '/aboutUs',
        templateUrl: 'partials/aboutUs.html',
        controller: 'windowCtrl'
      }).
      state('storyFeed', {
        url: '/storyFeed',
        templateUrl: 'partials/storyFeed.html',
        controller: 'windowCtrl'
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