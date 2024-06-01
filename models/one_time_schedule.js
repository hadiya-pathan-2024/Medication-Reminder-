'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class one_time_schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      one_time_schedule.belongsTo(models.medications, {foreignKey: 'medication_id'})
    }
  }
  one_time_schedule.init({
    medication_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    time: DataTypes.TIME,
    marked_as_done: DataTypes.BOOLEAN
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    sequelize,
    modelName: 'one_time_schedule',
  });
  return one_time_schedule;
};