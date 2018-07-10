var app = angular.module('schedule_medical', ['ngRoute', 'ngSanitize', 'ui.calendar', 'ui.select']);
app.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'partials/schedule.html',
            controller: 'ScheduleController'
        });

        $routeProvider.otherwise({redirectTo: '/'});

});