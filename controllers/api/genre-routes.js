const router = require('express').Router();
const { Post, Genre } = require('../../models');

// get all genres
router.get('/', (req, res) => {
    Genre.findAll()
    .then(dbGenreData => res.json(dbGenreData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/', (req, res) => {
    Genre.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbGenreData => res.json(dbGenreData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    Genre.create({
        name: req.body.name
    })
    .then(dbGenreData => res.json(dbGenreData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;