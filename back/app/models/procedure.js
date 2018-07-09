'use strict';
module.exports = (sequelize, DataTypes) => {
  var Procedure = sequelize.define('Procedure', {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {});
  Procedure.associate = function(models) {
    Procedure.belongsToMany(models.Schedule, {
      through: 'ScheduleProcedures',
      foreignKey: 'ProcedureId'
    });
  };
  return Procedure;
};