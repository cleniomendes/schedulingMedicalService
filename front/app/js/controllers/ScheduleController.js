angular.module('schedule_medical').controller('ScheduleController',
function($scope, $http) {
    getProcedures();
    getMaterials();
    
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
              $scope.title = "Agendar para dia " +  date.format('DD/MM/YYYY'); 
              $('#calendarModal').modal();
          },
        
          eventDrop: $scope.alertOnDrop,
          eventResize: $scope.alertOnResize
        }
      };      

    $scope.list = [];
    $scope.title = "";
    $scope.total_price=0; 
    
    function getProcedures(){
        $scope.procedureItem = [];
        $http({
            method: 'GET',
            url: 'http://localhost:8000/api/procedure',
            dataType: 'json'
          }).then(function successCallback(data) {
                $scope.procedureItem = data;
            }, function errorCallback(response) {          
        });
    }

    function getMaterials(){
        $scope.materialItem = [];
        $http({
            method: 'GET',
            url: 'http://localhost:8000/api/material',
            dataType: 'json'
          }).then(function successCallback(data) {
                $scope.materialItem = data;
            }, function errorCallback(response) {          
        });
    }

    $scope.addProcedure = function(){
        $scope.list.push({
            type: "Procedimento",
            procedure: $scope.selectedProcedure.id,
            name: $scope.selectedProcedure.name,
            individualPrice: $scope.selectedProcedure.price,
            quantity_procedure: $scope.quantityProcedure,
            totalPrice: parseFloat($scope.selectedProcedure.price * $scope.quantityProcedure).toFixed(2)
        });     
        $scope.selectedProcedure=null;   
        $scope.quantityProcedure=null;        
        calcTotal();
    }

    $scope.addMaterial = function(){
        $scope.list.push({
            type: "Material",
            material: $scope.selectedMaterial.id,
            name: $scope.selectedMaterial.name,
            individualPrice: $scope.selectedMaterial.price,
            quantity_material: $scope.quantityMaterial,
            totalPrice: parseFloat($scope.selectedMaterial.price * $scope.quantityMaterial).toFixed(2)
        });     

        $scope.selectedMaterial=null;   
        $scope.quantityMaterial=null;
        calcTotal();
    }
    function calcTotal(){
        let total = 0.00;
        if ($scope.list.length>0){            
            for(d of $scope.list){
                total = parseFloat(total) + parseFloat(d.totalPrice);                
            }
        }
        $scope.total_price = total.toFixed(2);
    }

    $scope.deleteService = function(index){
        $scope.list.splice(index, 1);
        calcTotal();
    }
});