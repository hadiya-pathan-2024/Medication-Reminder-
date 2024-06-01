'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('medications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
        },
        medicine_name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          allowNull: true,
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
    {transaction}
    );
    await queryInterface.addIndex('medications', ['medicine_name'],
      {transaction}
    )
    await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('medications',
        {transaction}
      );
      await transaction.commit();
    } catch (error) {
      console.log("Error", error);
      await transaction.rollback();
    }
  }
};