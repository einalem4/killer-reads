const router = require('express').Router();
const { User, Post, Comment, Vote } = require('../../models');
const { randomString } = require('../../utils/helpers');
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_text', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at'],
        include: [{
          model: Post,
          attributes: ['title']
        }]
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
      }
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234', club_id: "club666"}
  User.create({
    username: req.body.username,
    email: req.body.email,
    club_id: req.body.club_id,
    password: req.body.password
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;

      res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

//forgot password
router.post('/forgot', (req, res) => {
  if (!req.body.email) {
    res.status(200).json({ message: 'If this email exists you should receive an email shortly' });
    return;
  }
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(async dbUserData => {
    if (!dbUserData) {
      res.status(200).json({ message: 'If this email exists you should receive an email shortly' });
      return;
    }
    dbUserData.reset_token = randomString();
    await dbUserData.save();
    let link = `${process.env.SERVICE_URL}/reset-password?token=${dbUserData.reset_token}`
    const msg = {
      to: dbUserData.email,
      from: 'killerreadsbookclub@gmail.com',
      subject: 'Killer Reads - Reset Your Password',
      html: `<a href="${link}"> Click here to reset password</a>`
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
    res.json({ message: 'If this email exists you should receive an email shortly' });
  });
});

// PUT reset password
router.put('/reset-password', (req, res) => {
  if (!req.body.reset_token) {
    res.status(400).json({ message: 'reset token is required' });
    return;
  }
  if (!req.body.new_password || req.body.new_password.length < 6) {
    res.status(400).json({ message: 'password must be at least 6 characters' });
    return;
  }
  User.findOne({
    where: {
      reset_token: req.body.reset_token
    }
  }).then(async dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'Invalid reset token' });
      return;
    }
    dbUserData.reset_token = null;
    dbUserData.password = req.body.new_password;

    await dbUserData.save();
    res.json({ message: 'Your password has been reset' });
  });
});

router.put('/:id', (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
