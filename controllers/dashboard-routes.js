const router = require('express').Router();

// create post page
router.get('/:id', (req, res) => {
    const uid = req.session.user_id;
    if (req.session.loggedIn) {
        res.render('create-post', {uid, loggedIn: req.session.loggedIn});
        return;
    }
    res.redirect('/login');
});

module.exports = router;