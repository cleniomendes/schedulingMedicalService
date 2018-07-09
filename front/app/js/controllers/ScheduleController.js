angular.module('schedule_medical').controller('ScheduleController',
function($scope) {
    $scope.eventSources = [];
    $scope.showModal = false;
    $scope.uiConfig = {
        calendar:{      
          height: 450,
          editable: true,
          header:{
            left: 'month basicWeek basicDay',
            center: 'title',
            right: 'today prev,next',
            ignoreTimezone: false
          },
          monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
          dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],

          columnFormat: {
              month: 'ddd',
              week: 'ddd d',
              day: ''
          },
          axisFormat: 'H:mm',
          timeFormat: {
              '': 'H:mm',
              agenda: 'H:mm{ - H:mm}'
          },
          buttonText: {
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia"
          },
          eventClick: function(calEvent, jsEvent, view) {

            if (event.url) {
                window.open(event.url);
                return false;
              }
        
          },
          dayClick: function(date, allDay, jsEvent, view) {
            //$('#calendarModal').modal();
            $scope.showModal = true;
          },
        
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize
        }
      };

      $scope.ok = function() {
        $scope.showModal = false;
      };
      
      $scope.cancel = function() {
        $scope.showModal = false;
      };
});