// imports all necessary models
const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');
const Club = require('./Club');
const Genre = require('./Genre');
const Vote = require('./Vote');

// creates necessary associations
Genre.hasMany(Post, {
  foreignKey: 'genre_id',
  // onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  // onDelete: 'SET NULL'
});

User.hasMany(Post, {
  foreignKey: 'user_id'
});

User.belongsTo(Club, {
  foreignKey: 'club_id',
  // onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

Post.belongsTo(Genre, {
  foreignKey: 'genre_id',
  // onDelete: 'SET NULL'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  // onDelete: 'SET NULL'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  // onDelete: 'SET NULL'
});

Club.hasMany(User, {
  foreignKey: 'club_id',
  // onDelete: 'SET NULL'
});

module.exports = { User, Post, Comment, Club, Genre };
