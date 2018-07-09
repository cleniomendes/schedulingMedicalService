var app = angular.module('schedule_medical', ['ngRoute', 'ui.calendar','ui.bootstrap.modal']);
app.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/schedule.html',
            controller: 'ScheduleController'
        });

        $routeProvider.otherwise({redirectTo: '/'});

});