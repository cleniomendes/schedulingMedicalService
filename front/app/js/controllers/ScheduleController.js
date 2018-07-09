angular.module('schedule_medical').controller('ScheduleController',
function($scope) {
    let data = Date.now();
   /* $scope.eventSources = [ 
        {"events":
            [
                {"id":1,"title":"Teste Tal","start":"2018-07-09 05:30:00.0","end":"2018-07-09 06:00:00.0"},
                {"id":2,"title":"Teste Tal 2","start":"2018-07-10 06:00:00.0","end":"2018-07-10 06:00:00.0"}
            ]
        }                
    ]; */
    $scope.title = "";
    $scope.total_price = 0;
    $scope.uiConfig = {
        calendar:{      
          height: 450,
          editable: false,
          disableDragging: true,
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
          events: [
            {
                id: 1,
                title: 'Clenio Mendes',
                start: '2018-07-09',
                textColor: '#63A223',
                color: 'rgba(122, 214, 29, 0.31)'

            },
            {
                id: 2,
                title: 'Long Event',
                start: '2018-07-09',
                textColor: '#63A223',
                color: 'rgba(122, 214, 29, 0.31)'
            },
            {
                id: 3,
                title: 'Teste',
                start: '2018-07-09',
                textColor: '#63A223',
                color: 'rgba(122, 214, 29, 0.31)'
            },
            {
                id: 4,
                title: 'Teste',
                start: '2018-07-09',
                textColor: '#63A223',
                color: 'rgba(122, 214, 29, 0.31)'
            }
          ],
          eventClick: function(calEvent, jsEvent, view) {

           console.log(calEvent.title);
        
          },
          dayClick: function(date, allDay, jsEvent, view) {
              $scope.title = "Marcar Consulta " +  date.format('DD/MM/YYYY'); 
              $('#calendarModal').modal();
          },
        
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize
        }
      };      
});