'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('recurring_schedules', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        medication_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'medications',
            id: 'id'
          }
        },
        frequency: {
          allowNull: false,
          type: Sequelize.STRING
        },
        start_date: {
          type: Sequelize.DATE
        },
        end_date: {
          type: Sequelize.DATE
        },
        time: {
          type: Sequelize.TIME
        },
        day_of_week: {
          type: Sequelize.STRING
        },
        marked_as_done: {
          defaultValue: false,
          type: Sequelize.BOOLEAN
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        deleted_at: {
          type: Sequelize.DATE
        }
      },
      {transaction}
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
      await queryInterface.dropTable('recurring_schedules',
        {transaction}
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  }
};