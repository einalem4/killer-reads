const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// create post page
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('create-post', {loggedIn: req.session.loggedIn});
        return;
    }
    res.redirect('/login');
});


module.exports = router;