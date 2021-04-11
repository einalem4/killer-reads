const router = require('express').Router();

// create post page
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('create-post', {loggedIn: req.session.loggedIn});
        return;
    }
    res.redirect('/login');
});

module.exports = router;