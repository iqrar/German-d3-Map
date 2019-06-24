'use strict';

angular
    .module('German-d3-Map', [
        'ui.router', 'ngSanitize'
    ])
    .config(function($urlRouterProvider, $stateProvider) {

       $urlRouterProvider.otherwise("/home");
        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "views/home.html",
                controller: 'Home'
            });
    });