var express = require('express');
var router = express.Router();

var locationsCtrl = require('../controllers/locations');
var othersCtrl = require('../controllers/others');

// location pages
router.get('/', locationsCtrl.homeList);
router.get('/location', locationsCtrl.locationInfo);
router.get('/location/review/new', locationsCtrl.addReview);

// about page
router.get('/about', othersCtrl.about);

module.exports = router;
