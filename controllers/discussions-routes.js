const router = require('express').Router();
const { Post, User, Comment, Genre } = require('../models');

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
  
router.get('/:id', (req, res) => {
    Post.findAll({
        where: {
            genre_id: req.params.id
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

module.exports = router;