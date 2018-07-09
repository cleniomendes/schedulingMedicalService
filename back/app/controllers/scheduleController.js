const Schedule = require('../models').Schedule;
const Material = require('../models').Material;
const Procedure = require('../models').Procedure;
const ScheduleMaterial = require('../models').ScheduleMaterial;
const ScheduleProcedure = require('../models').ScheduleProcedure;

module.exports = {
    create(req, res) {
        let receivedSchedule = Object.assign({}, req.body, req.params);    
        Schedule.create({
            patient:  receivedSchedule.patient,
            doctor:   receivedSchedule.doctor,
            clinic: receivedSchedule.clinic,
            total_price: receivedSchedule.total_price,
            payment: receivedSchedule.payment,
            start: receivedSchedule.start
        }).then(newSchedule => {
          updateAssociatesOnCreate(receivedSchedule,newSchedule);
          res.json(newSchedule).code(200);  
        }); 
    },

    find(req,res){
        Schedule.findAll({
            include: [{
                all: true
            }]
        }).then(function (schedules) {
            res.json(schedules);
          });
    },

    delete(req,res){
        Schedule.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(data){
            res.json("Excluído com sucesso!");
        })
    },

    update(req,res){   
        let receivedSchedule = Object.assign({}, req.body, req.params);     
        
        Schedule.find({
            where:{ id:receivedSchedule.id }
        }).then((schedule) => {
            schedule.update(receivedSchedule.sendJson, {include: {all: true, nested:true}});            
            updateAssociatesOnUpdate(receivedSchedule,schedule);
            res.json(schedule).code(200);  
        });        
    },

    findScheduling(req,res){
        Schedule.findById(req.params.id,{include: [{all: true}]})
        .then(function (schedule) {
            res.json(schedule);
          });
    },
};

function updateAssociatesOnUpdate(receivedSchedule,schedule){    
    if(receivedSchedule.removeOnEdit.length>0){
        receivedSchedule.removeOnEdit.forEach((d) => {
            if(d.type=="Procedimento"){
                ScheduleProcedure.destroy({where: 
                    {
                        ProcedureId: d.procedure,
                        ScheduleId: receivedSchedule.id
                }});
            }

            if(d.type=="Material"){
                ScheduleMaterial.destroy({where: 
                    {
                        MaterialId: d.material,
                        ScheduleId: receivedSchedule.id
                }});
            }
        });    
    }

    if(receivedSchedule.sendJson.arrMaterial.length>0){
        receivedSchedule.sendJson.arrMaterial.forEach(element => {
            Material.findById(element.material).then((m) => {
                schedule.addScheduleHasMaterials(m,{ through: { quantity: element.quantity_material, totalPrice: element.totalPrice }});
            });             
        });
    }

    
    if(receivedSchedule.sendJson.arrProcedure.length>0){
        receivedSchedule.sendJson.arrProcedure.forEach(element => {
            Procedure.findById(element.procedure).then((p) => {
                schedule.addScheduleHasProcedures(p, { through: { quantity: element.quantity_procedure, totalPrice: element.totalPrice }});
            });
        })
    }
   
}

function updateAssociatesOnCreate(receivedSchedule,schedule){ 
    if(receivedSchedule.arrMaterial.length>0){
        receivedSchedule.arrMaterial.forEach(element => {
            Material.findById(element.material).then((m) => {
                schedule.addScheduleHasMaterials(m,{ through: { quantity: element.quantity_material, totalPrice: element.totalPrice }});
            });             
        });
    }

    if(receivedSchedule.arrProcedure.length>0){
        receivedSchedule.arrProcedure.forEach(element => {
            Procedure.findById(element.procedure).then((p) => {
                schedule.addScheduleHasProcedures(p, { through: { quantity: element.quantity_procedure, totalPrice: element.totalPrice }});
            });
        })
    }
   
}