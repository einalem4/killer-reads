const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates Post model
class Genre extends Model { }

// creates fields/columns for Post model
Genre.init(
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
    // post_id: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: 'post',
    //     key: 'id'
    //   }
    // }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'genre'
  }
);

module.exports = Genre;
