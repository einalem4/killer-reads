const router = require('express').Router();
// const sequelize = require('../config/connection');
const { Post, User, Comment, Genre } = require('../models');

// discussions
// router.get('/discussions', (req, res) => {
//     res.render('discussions');
// });

router.get('/', (req, res) => {
    Post.findAll({
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
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // pass a single post object into the homepage template
        res.render('discussions', { 
            posts, 
            loggedIn: req.session.loggedIn 
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
  
// discussions genre
router.get('/discussions/genre/:genreId', (req, res) => {
// res.render('discussions');
res.render('discussions', { genreId: req.params.genreId });
});

module.exports = router;