const router = require('express').Router();

// login
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/discussions');
      return;
    }
    res.render('login');
  });
  
  // request reset password
  router.get('/forgot-password', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('forgot-password');
  });
  
  // reset password
  router.get('/reset-password', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('reset-password');
  });
  
  //sign up
  router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/discussions');
      return;
    }
    res.render('signup');
  });

module.exports = router;