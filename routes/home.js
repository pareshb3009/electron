	var express = require('express');
	var router = express.Router();
	var serialController = require('../controllers/serialConn');
	var settingsController = require('../controllers/settings');
	var samplemasterController = require('../controllers/samplemaster');

	/* GET home page. */
	router.get('/', function(req, res, next) {
	    res.send('index.html');
	});

	router.get('/getPortList', serialController.getPortList);
	router.post('/start', serialController.getConn);
	router.post('/startTest', serialController.startTest);
	router.get('/getList', serialController.getList);
	router.get('/getLast', serialController.getLast);
	router.get('/close', serialController.closeConn);

	router.post('/saveSettings', settingsController.saveSettings)
	router.get('/getSetting', settingsController.getSetting)

	router.post('/savesamplemaster', samplemasterController.savesamplemaster)
	router.get('/getsamplemaster', samplemasterController.getsamplemaster)

	router.post('/saveSerialTest', serialController.saveSerialTest)


	module.exports = router;
