var express = require('express');
var router = express.Router();

var locationsCtrl = require('../controllers/locations');
var othersCtrl = require('../controllers/others');

// location pages
router.get('/', locationsCtrl.homeList);
router.get('/location/:locationId', locationsCtrl.locationInfo);
router.get('/location/:locationId/review/new', locationsCtrl.addReview);
router.post('/location/:locationId/review/new', locationsCtrl.doAddReview);

// about page
router.get('/about', othersCtrl.about);

module.exports = router;
