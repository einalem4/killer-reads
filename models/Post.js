const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates Post model
class Post extends Model { }

// creates fields/columns for Post model
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    genre_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'genre',
        key: 'id'
      }
    },
    post_text: {
      type: DataTypes.STRING,
      validate: {
        len: [1]
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;
