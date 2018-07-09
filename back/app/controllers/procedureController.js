const Procedure = require('../models').Procedure;

module.exports = {
    find(req,res){
        Procedure.findAll().then(function (procedures) {
            res.json(procedures);
          });
    }
};