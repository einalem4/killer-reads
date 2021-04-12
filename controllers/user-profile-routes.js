const router = require('express').Router();
const { Post, User, Comment, Genre, Image } = require('../models');
const withAuth = require('../utils/auth');

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
        const posts = dbPostData.map(post => post.get({ plain: true }));
        const usernamedir = req.session.username;
        const uid = req.session.user_id;
        console.log("posts: " + JSON.stringify(posts));
        console.log(posts);
        console.log(req.session.user);
        // pass a single post object into the homepage template
        res.render('user-profile', { 
            posts,
            usernamedir,
            uid,
            loggedIn: req.session.loggedIn 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// router.get('/', (req, res) => {
//     if (req.session.loggedIn) {
//         res.render('user-profile', {loggedIn: req.session.loggedIn});
//         return;
//     }
//     res.redirect('/login');
// });





// gets edit page based on selected post id
router.get('/edit-post/:id', withAuth, (req, res) => {
    Post.findByPk(req.params.id, {
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at'
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