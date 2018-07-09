'use strict';
module.exports = (sequelize, DataTypes) => {
  const Material = sequelize.define('Material', {
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {});
  Material.associate = (models) => {
    Material.belongsToMany(models.Schedule, {
      through: 'ScheduleMaterials',
      foreignKey: 'MaterialId'
    });
  };
  return Material;
};