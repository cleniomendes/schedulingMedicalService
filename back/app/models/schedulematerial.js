'use strict';
module.exports = (sequelize, DataTypes) => {
  var ScheduleMaterial = sequelize.define('ScheduleMaterial', {
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.DECIMAL(10,2)
  }, {});
  ScheduleMaterial.associate = function(models) {
    ScheduleMaterial.belongsTo(models.Material, { foreignKey: "MaterialId", onDelete: 'CASCADE' });
    ScheduleMaterial.belongsTo(models.Schedule, { foreignKey: "ScheduleId", onDelete: 'CASCADE' });
  };
  return ScheduleMaterial;
};