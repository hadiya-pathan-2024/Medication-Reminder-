'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('recurring_schedules','start_date', {
        type: Sequelize.DATEONLY
      },
        { transaction }
      );
      await queryInterface.changeColumn('recurring_schedules','end_date', {
        type: Sequelize.DATEONLY
      },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.changeColumn('recurring_schedules',
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  }
};