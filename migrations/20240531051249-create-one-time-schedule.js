'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('one_time_schedules', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        medication_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'medications',
            key: 'id'
          }
        },
        date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        time: {
          allowNull: false,
          type: Sequelize.TIME
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
      await queryInterface.dropTable('one_time_schedules',
        {transaction}
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  }
};