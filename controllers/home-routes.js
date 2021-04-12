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

// login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/discussions');
    return;
  }
  res.render('login');
});

// request reset password
router.get('/forgot-password', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('forgot-password');
});

// reset password
router.get('/reset-password', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('reset-password');
});

//sign up
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/discussions');
    return;
  }
  res.render('signup');
});

// edit post page
router.get('/edit-post', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/edit-post');
    return;
  }
  res.render('login');
});

module.exports = router;