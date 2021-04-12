const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
const genreRoutes = require('./genre-routes');
const imageRoutes = require('./image-routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/genres', genreRoutes);
router.use('/images', imageRoutes);

module.exports = router;
