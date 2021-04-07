// sets necesarry dependencies
const router = require('express').Router();

// ties into independent route files
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
const clubRoutes = require('./club-routes');

// sets up extension for routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/clubs', clubRoutes);

module.exports = router;
