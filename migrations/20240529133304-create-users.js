'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        first_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        last_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        email: {
          allowNull: false,
          unique: true,
          type: Sequelize.STRING,
          validate: {
            isEmail: true
          }
        },
        password: {
          allowNull: false,
          type: Sequelize.STRING
        },
        dob: {
          allowNull: false,
          type: Sequelize.DATE
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
      await queryInterface.addIndex('users', ['first_name', 'email'],
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
      await queryInterface.dropTable('users',
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  }
};