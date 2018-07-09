const Material = require('../models').Material;

module.exports = {
    find(req,res){
        Material.findAll().then(function (materials) {
            res.json(materials);
          });
    }
};