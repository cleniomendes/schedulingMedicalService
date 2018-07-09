const procedureController = require('../controllers/procedureController');

module.exports = (app) => {  
  app.get('/api/procedure', procedureController.find);
};