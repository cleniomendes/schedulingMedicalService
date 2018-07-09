'use strict';
module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define('Schedule', {
    patient: DataTypes.STRING,
    doctor: DataTypes.STRING,
    clinic: DataTypes.STRING,
    total_price: DataTypes.FLOAT,
    payment: DataTypes.STRING,
    start: DataTypes.DATE
  }, {});
  Schedule.associate = function(models) {
    Schedule.belongsToMany(models.Material, {through: models.ScheduleMaterial, as:'scheduleHasMaterials', foreignKey: 'ScheduleId'});
    Schedule.belongsToMany(models.Procedure, {through: models.ScheduleProcedure, as:'scheduleHasProcedures', foreignKey: 'ScheduleId'});
  };
  return Schedule;
};