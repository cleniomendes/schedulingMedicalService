angular.module('schedule_medical').controller('ScheduleController',
function($scope, $http, $timeout) {
    let eventCalendar = []
    let dateEvent = "";
    getProcedures();
    getMaterials();
    getAllScheduling();
    
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
          events: eventCalendar,
          eventClick: function(calEvent, jsEvent, view) {

           console.log(calEvent.title);
        
          },
          dayClick: function(date, allDay, jsEvent, view) {
              $scope.title = "Agendar para dia " +  date.format('DD/MM/YYYY'); 
              dateEvent = date.format('DD/MM/YYYY');
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
        let totalWithOffer = 0.00;
        let qtd = parseFloat($scope.quantityProcedure);
        let price = parseFloat($scope.selectedProcedure.price);

        if ($scope.selectedProcedure.code == '40202542' && $scope.quantityProcedure>1){     
            totalWithOffer = ((qtd-1) * price * 0.40) + price;
            totalWithOffer = totalWithOffer.toFixed(2);
        }else{
            totalWithOffer = (price * qtd).toFixed(2);
        }


        $scope.list.push({
            type: "Procedimento",
            procedure: $scope.selectedProcedure.id,
            name: $scope.selectedProcedure.name,
            individualPrice: $scope.selectedProcedure.price,
            quantity_procedure: $scope.quantityProcedure,
            totalPrice: totalWithOffer
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

    $scope.schedulingMedical = function(){
        arrMaterial = [];
        arrProcedure = [];
        if ($scope.list.length>0){ 
            $scope.list.forEach((d) => {
                if(d.type==="Material"){
                    arrMaterial.push({
                        material: d.material,
                        quantity_material: d.quantity_material
                    });
                }else if(d.type==="Procedimento"){
                    arrProcedure.push({
                        procedure: d.procedure,
                        quantity_procedure: d.quantity_procedure
                    });
                }
            });
        }


        let sendJson = {
            "patient": $scope.patientName,
            "doctor": $scope.doctorName,
            "clinic": $scope.clinicName,
            "total_price": $scope.total_price,
            "payment": $scope.radioBt,
            "start": dateEvent,
            arrMaterial,
            arrProcedure
        }

        $http({
            method: 'POST',
            url: 'http://localhost:8000/api/schedule',
            data: sendJson,
            dataType: 'json'
          }).then(function successCallback(data) {        
                $scope.successMessage = "Agendamento realizado com sucesso!";
                $scope.successMessagebool = true;
                $timeout(function () {
                    $scope.successMessagebool = false;
                }, 4000);
                refresh();
            }, function errorCallback(response) {          
        });
    }

    function refresh(){
        $scope.list=[];
        $scope.patientName = null;
        $scope.doctorName = null;
        $scope.clinicName = null;
        $scope.total_price = 0;
        $scope.radioBt = null;
    }

    $scope.closeModal = function(){
        getAllScheduling();
        refresh();
    }

    function getAllScheduling(){
        /*eventCalendar.push(
            {
                id: 1,
                title: 'Clenio Mendes',
                start: '2018-07-09',
                textColor: '#63A223',
                color: 'rgba(122, 214, 29, 0.31)'
    
            }
        );*/        
    }    
});