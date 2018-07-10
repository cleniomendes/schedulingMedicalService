angular.module('schedule_medical').controller('ScheduleController',
function($scope, $http, $timeout, $window) {    
    let urlAWS = "http://medical-service.us-east-1.elasticbeanstalk.com/"
    let urlLocal = "http://localhost:3000/"
    let eventCalendar = [];
    let removeOnEdit = [];
    $scope.selectedProcedure = {};
    $scope.selectedMaterial={};
    $scope.dateEvent = "";
    $scope.buttonName = "Salvar Agendamento";
    $scope.loadButton=false;
    getProcedures();
    getMaterials();
    getAllScheduling(()=>{
        calendarConfig();
    });

     
    function calendarConfig(){
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
                $scope.title = "Edição"; 
                $scope.enableDeleteBool=true;
                findSheduling(calEvent.id,(result)=>{
                    fillScheduling(result);
                });
                
                
              },
              dayClick: function(date, allDay, jsEvent, view) {
                  $scope.title = "Agendar para dia "; 
                  $scope.dateEvent=date.format('DD/MM/YYYY');
                  $('#calendarModal').modal({backdrop: 'static', keyboard: false});
              },
            
              eventDrop: $scope.alertOnDrop,
              eventResize: $scope.alertOnResize
            }
          };  
    }
       

    $scope.list = [];
    $scope.title = "";
    $scope.total_price=0; 
    
    function getProcedures(){
        $scope.procedureItem = [];
        $http({
            method: 'GET',
            url: urlAWS+'api/procedure',
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
            url: urlAWS+'api/material',
            dataType: 'json'
          }).then(function successCallback(data) {
                $scope.materialItem = data;
            }, function errorCallback(response) {          
        });
    }

    $scope.addProcedure = function(){
        let totalWithOffer = 0.00;
        let qtd = parseFloat($scope.quantityProcedure);
        let price = parseFloat($scope.selectedProcedure.selected.price);

        if ($scope.selectedProcedure.selected.code == '40202542' && $scope.quantityProcedure>1){     
            totalWithOffer = ((qtd-1) * price * 0.40) + price;
            totalWithOffer = totalWithOffer.toFixed(2);
        }else{
            totalWithOffer = (price * qtd).toFixed(2);
        }


        $scope.list.push({
            type: "Procedimento",
            procedure: $scope.selectedProcedure.selected.id,
            name: $scope.selectedProcedure.selected.name,
            individualPrice: $scope.selectedProcedure.selected.price,
            quantity_procedure: $scope.quantityProcedure,
            totalPrice: totalWithOffer
        });     
        $scope.selectedProcedure={};   
        $scope.quantityProcedure=null;        
        calcTotal();
    }

    $scope.addMaterial = function(){
        $scope.list.push({
            type: "Material",
            material: $scope.selectedMaterial.selected.id,
            name: $scope.selectedMaterial.selected.name,
            individualPrice: $scope.selectedMaterial.selected.price,
            quantity_material: $scope.quantityMaterial,
            totalPrice: parseFloat($scope.selectedMaterial.selected.price * $scope.quantityMaterial).toFixed(2)
        });     

        $scope.selectedMaterial={};   
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
        removeOnEdit.push($scope.list[index]);
        $scope.list.splice(index, 1);        
        calcTotal();
    }

    $scope.schedulingMedical = function(){
        $scope.buttonName = "Carregando...";
        $scope.loadButton = true;
        arrMaterial = [];
        arrProcedure = [];
        if ($scope.list.length>0){ 
            $scope.list.forEach((d) => {
                if(d.type==="Material"){
                    arrMaterial.push({
                        material: d.material,
                        quantity_material: d.quantity_material,
                        totalPrice: d.totalPrice
                    });
                }else if(d.type==="Procedimento"){
                    arrProcedure.push({
                        procedure: d.procedure,
                        quantity_procedure: d.quantity_procedure,
                        totalPrice: d.totalPrice
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
            "start": $scope.dateEvent,
            arrMaterial,
            arrProcedure
        }
        
        if($scope.idScheduling){
            $http({
                method: 'PUT',
                url: urlAWS+'api/schedule/'+$scope.idScheduling,
                data: {sendJson,removeOnEdit},
                dataType: 'json'
              }).then(function successCallback(data) {        
                    $scope.successMessage = "Agendamento editado com sucesso!";
                    $scope.successMessagebool = true;
                    $scope.buttonName = "Salvar Agendamento";
                    $scope.loadButton = false;
                    $timeout(function () {
                        $scope.successMessagebool = false;
                    }, 4000);
                    refresh();
                }, function errorCallback(response) {          
            });
        }else{
            $http({
                method: 'POST',
                url: urlAWS+'api/schedule',
                data: sendJson,
                dataType: 'json'
              }).then(function successCallback(data) {        
                    $scope.successMessage = "Agendamento realizado com sucesso!";
                    $scope.successMessagebool = true;
                    $scope.buttonName = "Salvar Agendamento";
                    $scope.loadButton = false;
                    $timeout(function () {
                        $scope.successMessagebool = false;
                    }, 4000);
                    refresh();
                }, function errorCallback(response) {          
            });
        }  
    }

    function refresh(){
        $scope.list=[];
        $scope.patientName = null;
        $scope.doctorName = null;
        $scope.clinicName = null;
        $scope.total_price = 0;
        $scope.radioBt = null;
        $scope.idScheduling = null;
        removeOnEdit = [];
        $scope.enableDeleteBool=false;
        $scope.selectedMaterial={};   
        $scope.quantityMaterial=null;
        $scope.selectedProcedure={};   
        $scope.quantityProcedure=null;
    }

    $scope.closeModal = function(){
        eventCalendar = [];
        getAllScheduling(()=>{
            calendarConfig();
        });
        refresh();
    }

    function getAllScheduling(callback){
        $http({
            method: 'GET',
            url: urlAWS+'api/schedule',
            dataType: 'json'
          }).then(function successCallback(result) {                      
              result.data.forEach(d =>{
                    eventCalendar.push(
                        {
                            id: d.id,
                            title: d.patient,
                            start: moment(d.start,'YYYY-DD-MM').format('YYYY-MM-DD'),
                            textColor: '#63A223',
                            color: 'rgba(122, 214, 29, 0.31)'
                
                        }
                    );
                });
                callback();
            }, function errorCallback(response) {          
        });       

    }    
    function findSheduling(id,callback){
        $http({
            method: 'GET',
            url: urlAWS+'api/schedule/'+id,
            dataType: 'json'
          }).then(function successCallback(result) {                      
              callback(result);
            }, function errorCallback(response) {          
        });   
    }

    function fillScheduling(result){
        $scope.dateEvent = moment(result.data.start,'YYYY-DD-MM').format('DD/MM/YYYY');
        $scope.idScheduling = result.data.id;
        $scope.patientName = result.data.patient;
        $scope.doctorName = result.data.doctor;
        $scope.clinicName = result.data.clinic;
        $scope.total_price = result.data.total_price;
        $scope.radioBt = result.data.payment;

        if(result.data.scheduleHasMaterials.length>0){
            result.data.scheduleHasMaterials.forEach(d => {
                $scope.list.push({
                    type: "Material",
                    material: d.id,
                    name: d.name,
                    individualPrice: d.price,
                    quantity_material: d.ScheduleMaterial.quantity,
                    totalPrice: d.ScheduleMaterial.totalPrice
                }); 
            });
        }

        if( result.data.scheduleHasProcedures.length>0){
            result.data.scheduleHasProcedures.forEach(d => {
                $scope.list.push({
                    type: "Procedimento",
                    procedure: d.id,
                    name: d.name,
                    individualPrice: d.price,
                    quantity_procedure: d.ScheduleProcedure.quantity,
                    totalPrice: d.ScheduleProcedure.totalPrice
                });
            })
        }
        

        $('#calendarModal').modal({backdrop: 'static', keyboard: false});
    }

    $scope.deleteScheduling = function(){
        let confirm = $window.confirm("Tem certeza que deseja excluir o agendamento?");
        
        if(confirm){
            $http({
            method: 'DELETE',
            url: urlAWS+'api/schedule/'+$scope.idScheduling,
            dataType: 'json'
          }).then(function successCallback(result) {                      
                $scope.closeModal();      
            }, function errorCallback(response) {          
        }); 
        } 
    } 
});