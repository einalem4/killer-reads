const router = require('express').Router();
const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api');
const dashboardRoutes = require('./dashboard-routes.js');
const discussionRoutes = require('./discussions-routes.js');
const userProfileRoutes = require('./user-profile-routes.js');
const authRoutes = require('./auth-routes.js');
const sitePostRoutes = require('./site-post-routes');

router.use('/', homeRoutes);
router.use('/', authRoutes);
router.use('/', sitePostRoutes);
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/discussions', discussionRoutes);
router.use('/user-profile', userProfileRoutes);

module.exports = router;
