var express = require('express');
var router = express.Router();

var locationsCtrl = require('../controllers/locations');
var reviewsCtrl = require('../controllers/reviews');

// locations
router.get('/locations', locationsCtrl.locationsListByDistance);
router.post('/locations', locationsCtrl.locationsCreate);
router.get('/locations/:locationId', locationsCtrl.locationRead);
router.put('/locations/:locationId', locationsCtrl.locationUpdate);
router.delete('/locations/:locationId', locationsCtrl.locationDelete);

// reviews
router.post('/locations/:locationId/reviews', reviewsCtrl.reviewCreate);
router.get('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewRead);
router.put('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewUpdate);
router.delete('/locations/:locationId/reviews/:reviewId', reviewsCtrl.reviewDelete);

module.exports = router;
