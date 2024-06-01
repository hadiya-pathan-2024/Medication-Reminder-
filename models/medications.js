'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class medications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      medications.belongsTo(models.users, {foreignKey: "user_id"})
      medications.hasMany(models.one_time_schedule)
      medications.hasMany(models.recurring_schedules)
      medications.hasMany(models.notifications_log)
    }
  }
  medications.init({
    user_id: DataTypes.INTEGER,
    medicine_name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    indexes: [
      {
        fields: ['medicine_name']
      }
    ],
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    sequelize,
    modelName: 'medications',
  });
  return medications;
};