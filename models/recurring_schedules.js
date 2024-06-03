'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class recurring_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      recurring_schedules.belongsTo(models.medications, {foreignKey: "medication_id"})
    }
  }
  recurring_schedules.init({
    medication_id: DataTypes.INTEGER,
    frequency: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    day_of_week: DataTypes.STRING,
    marked_as_done: DataTypes.BOOLEAN
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    sequelize,
    modelName: 'recurring_schedules',
  });
  return recurring_schedules;
};