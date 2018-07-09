'use strict';
module.exports = (sequelize, DataTypes) => {
  var ScheduleProcedure = sequelize.define('ScheduleProcedure', {
    quantity: DataTypes.INTEGER
  }, {});
  ScheduleProcedure.associate = function(models) {
    ScheduleProcedure.belongsTo(models.Procedure, { foreignKey: "ProcedureId", onDelete: 'CASCADE' });
    ScheduleProcedure.belongsTo(models.Schedule, {  foreignKey: "ScheduleId", onDelete: 'CASCADE' });
  };
  return ScheduleProcedure;
};