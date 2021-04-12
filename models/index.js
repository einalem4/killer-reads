// imports all necessary models
const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');
const Vote = require('./Vote');
const Club = require('./Club');
const Genre = require('./Genre');
const Image = require('./Image');

// creates necessary associations
User.hasMany(Image, {
  foreignKey: 'user_id'
});

Image.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Genre.hasMany(Post, {
  foreignKey: 'genre_id',
  // onDelete: 'SET NULL'
});

User.belongsTo(Club, {
  foreignKey: 'club_id',
  // onDelete: 'SET NULL'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  // onDelete: 'SET NULL'
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  // onDelete: 'SET NULL'
});

User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id',
  // onDelete: 'SET NULL'
});

User.hasMany(Post, {
  foreignKey: 'user_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id',
  // onDelete: 'SET NULL'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id',
  // onDelete: 'SET NULL'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

Post.belongsTo(Genre, {
  foreignKey: 'genre_id',
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

module.exports = { User, Post, Vote, Comment, Club, Genre, Image };
