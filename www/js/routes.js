angular.module('starter.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {
    
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.home', {
        url: '/home',
        views: {
          'page': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })

      .state('app.settings', {
        url: '/settings',
        views: {
          'page': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('app.login', {
        url: '/login',
        views: {
          'page': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('app.programs', {
        url: '/programs',
        views: {
          'page': {
            templateUrl: 'templates/programs.html',
            controller: 'ProgramsCtrl'
          }
        }
      })

      .state('app.leggiCodice', {
        url: '/leggiCodice',
        views: {
          'page': {
            templateUrl: 'templates/leggiCodice.html',
            controller: 'LeggiCodiceCtrl'
          }
        }
      })

      .state('app.tuoiAcquisti', {
        url: '/tuoiAcquisti',
        views: {
          'page': {
            templateUrl: 'templates/tuoiAcquisti.html',
            controller: 'TuoiAcquistiCtrl'
          }
        }
      })

      .state('app.storeLocator', {
        url: '/storeLocator',
        views: {
          'page': {
            templateUrl: 'templates/storeLocator.html',
            controller: 'StoreLocatorCtrl'
          }
        }
      })      

      .state('app.register', {
        url: '/register',
        views: {
          'page': {
            templateUrl: 'templates/register.html',
            controller: 'RegisterCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
  });