'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      notifications_log.belongsTo(models.medications, {foreignKey: 'medication_id'})
    }
  }
  notifications_log.init({
    medication_id: DataTypes.INTEGER,
    notification_date: DataTypes.DATE,
    details: DataTypes.STRING
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    sequelize,
    modelName: 'notifications_log',
  });
  return notifications_log;
};