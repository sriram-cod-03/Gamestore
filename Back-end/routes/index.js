var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.send('API is running 🚀');
});

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

module.exports = router;
