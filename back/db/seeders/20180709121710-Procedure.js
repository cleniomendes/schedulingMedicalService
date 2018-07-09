'use strict';
const fs = require("fs");
const Material = require('../../app/models').Procedure;
module.exports = {
  up: (queryInterface, Sequelize) => {
    const contents = fs.readFileSync("./db/files/procedure.json");
    const jsonContent = JSON.parse(contents);
  
    return queryInterface.bulkInsert('Procedures', jsonContent, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
