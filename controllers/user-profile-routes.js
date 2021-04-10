const router = require('express').Router();

// user profile
router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.render('user-profile', {loggedIn: req.session.loggedIn});
        return;
    }
    res.redirect('/login');
});

module.exports = router;