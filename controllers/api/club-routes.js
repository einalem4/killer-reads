const router = require('express').Router();
const { User, Club } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
  Club.findAll({
    attributes: [
      'id',
      'name'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbClubData => res.json(dbClubData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// creates new club in database
router.post('/', withAuth, (req, res) => {
  // expects => {club_text: "This is the club", user_id: 1, post_id: 2}
  Club.create({
    club_text: req.body.club_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id
  })
    .then(dbClubData => res.json(dbClubData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

// deletes club in database
router.delete('/:id', withAuth, (req, res) => {
  Club.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbClubData => {
      if (!dbClubData) {
        res.status(404).json({ message: 'No club found with this id!' });
        return;
      }
      res.json(dbClubData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
