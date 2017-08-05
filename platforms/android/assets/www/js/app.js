// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-pullup']);

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});
app.directive('tabsSwipable', ['$ionicGesture', function($ionicGesture) {
    //
    // make ionTabs swipable. leftswipe -> nextTab, rightswipe -> prevTab
    // Usage: just add this as an attribute in the ionTabs tag
    // <ion-tabs tabs-swipable> ... </ion-tabs>
    //
    return {
        restrict: 'A',
        require: 'ionTabs',
        link: function(scope, elm, attrs, tabsCtrl) {
            var onSwipeLeft = function() {
                var target = tabsCtrl.selectedIndex() + 1;
                if (target < tabsCtrl.tabs.length) {
                    scope.$apply(tabsCtrl.select(target));
                }
            };
            var onSwipeRight = function() {
                var target = tabsCtrl.selectedIndex() - 1;
                if (target >= 0) {
                    scope.$apply(tabsCtrl.select(target));
                }
            };

            var swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm).on('swiperight', onSwipeRight);
            scope.$on('$destroy', function() {
                $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
                $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
            });
        }
    };
}]);

app.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        // Each tab has its own nav history stack:
        .state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'rantController'
                }
            }
        })
        .state('tab.likes', {
            url: '/dash-likes',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash-likes.html',
                    controller: 'rantController'
                }
            }
        })
        .state('tab.single', {
            url: '/dash-single',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash-single.html',
                    controller: 'rantController'
                }
            }
        })
        .state('tab.search', {
            url: '/dash-search',
            views: {
                'tab-dash':{ 
                    templateUrl: 'templates/tab-dash-search.html',
                    controller: 'searchController'
                }
            }
        })
        .state('tab.personal', {
            url: '/dash-personal',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash-personal.html',
                    controller: 'rantController'
                }
            }
        })
        .state('tab.call', {
            url: '/call',
            views: {
                'tab-call': {
                    templateUrl: 'templates/tab-call.html',
                    controller: 'callController'
                }
            }
        })
        
        .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'chatController'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});

app.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.backButton.icon('ion-chevron-left');

});

app.run(function($rootScope, $ionicViewSwitcher, $ionicHistory, $http) {
    if(!(localStorage.getItem("chatId"))){
        $http.get("https://asp-ng.herokuapp.com/counsel").then(function(response){
            $http.get("https://asp-ng.herokuapp.com/counsel/getChatId").then(function(response){

                    localStorage.setItem("chatId", response.data.res);
            });
        });
    }
    else{
        var chatId = localStorage.getItem("chatId");
        
        $http.get("https://asp-ng.herokuapp.com/counsel?chatid="+chatId).then(function(response){
                $http.get("https://asp-ng.herokuapp.com/counsel/getChatId").then(function(response){

                    localStorage.setItem("chatId", response.data.res);
                })
        });
    }

    $rootScope.goBackState = function() {
        window.location.href = "/#/tab/dash"
    };

});