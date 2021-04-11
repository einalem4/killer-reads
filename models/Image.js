const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates User model
class Image extends Model {}

// creates fields/columns for User model
Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    data: {
      type:DataTypes.BLOB
    },
    url: {
      type:DataTypes.STRING
    },
    user_id: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'image'
  }
);

module.exports = Image;
