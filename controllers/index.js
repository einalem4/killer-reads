const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const homepageRoutes = require('./homepage-routes.js');

router.use('/', homeRoutes);
router.use('/homepage', homepageRoutes);
router.use('/api', apiRoutes);

module.exports = router;
