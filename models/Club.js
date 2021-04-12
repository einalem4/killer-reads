const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates Post model
class Club extends Model { }

// creates fields/columns for Post model
Club.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'club'
  }
);

module.exports = Club;
