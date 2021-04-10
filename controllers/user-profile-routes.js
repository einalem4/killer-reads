const router = require('express').Router();
const { Post, User, Comment, Genre } = require('../models');
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
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // pass a single post object into the homepage template
        res.render('user-profile', { 
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
//     if (req.session.loggedIn) {
//         res.render('user-profile', {loggedIn: req.session.loggedIn});
//         return;
//     }
//     res.redirect('/login');
// });

module.exports = router;