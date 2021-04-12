const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Genre } = require('../models');

// landing page
router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'post_text', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
    include: [{
      model: Comment,
      attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      include: {
        model: User,
        attributes: ['username']
      }
    },
    {
      model: User,
      attributes: ['username']
    },
    {
      model: Genre,
      attributes: ['id', 'name']
    }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      res.render('landing', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;