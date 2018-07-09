const scheduleController = require('../controllers/scheduleController');

module.exports = (app) => {
  app.post('/api/schedule', scheduleController.create);
  app.get('/api/schedule', scheduleController.find);
  app.delete('/api/schedule', scheduleController.delete);
  app.put('/api/schedule/:id', scheduleController.update);
  app.get('/api/schedule/:id', scheduleController.findScheduling);
};