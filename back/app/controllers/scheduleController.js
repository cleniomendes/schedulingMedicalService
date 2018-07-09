const Schedule = require('../models').Schedule;
const Material = require('../models').Material;
const Procedure = require('../models').Procedure;

module.exports = {
    create(req, res) {
        let receivedSchedule = Object.assign({}, req.body, req.params);

        Schedule.create({
            patient:  receivedSchedule.patient,
            doctor:   receivedSchedule.doctor,
            clinic: receivedSchedule.clinic,
            total_price: receivedSchedule.total_price,
            payment: receivedSchedule.payment
        }).then(newSchedule => {         
          updateAssociates(receivedSchedule,newSchedule);
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
                id: req.body.id
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
            schedule.update(receivedSchedule, {include: {all: true, nested:true}});            
            updateAssociates(receivedSchedule,schedule);
        });        
    }
};

function updateAssociates(receivedSchedule,schedule){
    Material.findById(receivedSchedule.material).then((m) => {
        schedule.setScheduleHasMaterials(m,{ through: { quantity: receivedSchedule.quantity_material }});
    });     

    Procedure.findById(receivedSchedule.procedure).then((p) => {
        schedule.setScheduleHasProcedures(p, { through: { quantity: receivedSchedule.quantity_procedure }});
    });
}