const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Genre } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            'title', 
            'author',
            'post_text', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
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

// genre posts by genre
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
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
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

// router.get('/', (req, res) => {
//     Genre.findAll()
//     .then(dbGenreData => {
//       const genres = dbGenreData.map(genre => genre.get({plain : true}));
//       res.render('landing', {genres})
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json(err);
//     });
// });

module.exports = router;