'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('notifications_logs', {
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
        notification_date: {
          allowNull: false,
          type: Sequelize.DATE
        },
        details: {
          type: Sequelize.STRING
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
      await queryInterface.dropTable('notifications_logs',
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  }
};