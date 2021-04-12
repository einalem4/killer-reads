const router = require('express').Router();
const { Post, User, Comment, Genre, Image } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

// user profile
router.get('/', withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'title',
      'author',
      'user_id',
      'post_text',
      'created_at'
    ],
    include: [
      {
        model: Genre,
        attributes: ['name']
      },
      {
        model: Comment,
        attributes: [
          'id',
          'comment_text',
          'post_id',
          'user_id',
          'created_at'
        ],
        include:
        {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username'],
        include:
        {
          model: Image,
          attributes: ['name']
        }
      }
    ]
  })
    .then(dbPostData => {
      // console.log(dbPostData);
      const posts = dbPostData.map(post => post.get({ plain: true }))
        .map(post => {
          let p = { ...post };
          p.isMine = p.user_id === req.session.user_id;
          return p;
        })
      const user = req.session.username
      console.log("posts: " + JSON.stringify(posts));
      console.log(posts);
      console.log(req.session.user);
      // pass a single post object into the homepage template
      res.render('user-profile', {
        posts,
        user,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.render('user-profile', { loggedIn: req.session.loggedIn });
    return;
  }
  res.redirect('/login');
});


// gets edit page based on selected post id
router.get('/edit-post/:id', withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
      user_id: req.session.user_id,
    },
    attributes: [
      'id',
      'post_text',
      'author',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
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
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/images', (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
    return;
  }
  res.render('images');
});


module.exports = router;