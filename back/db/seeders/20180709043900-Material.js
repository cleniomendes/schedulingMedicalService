'use strict';
const fs = require("fs");
const Material = require('../../app/models').Material;
module.exports = {
  up: (queryInterface, Sequelize) => {
    const contents = fs.readFileSync("./db/files/material.json");
    const jsonContent = JSON.parse(contents);
  
    return queryInterface.bulkInsert('Materials', jsonContent, {});
  },

  down: (queryInterface, Sequelize) => {
    
  }
};
