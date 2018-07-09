const materialController = require('../controllers/materialController');

module.exports = (app) => {  
  app.get('/api/material', materialController.find);
};