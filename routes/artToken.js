const express = require('express');
const router = express.Router();
const middleware = require('../lib/middleware/index');
const artTokenController = require('../controllers/artToken/index')


/* GET home page. */
router.get('/create', (req, res, next) => {
  res.render('artToken/create');
});

router.post('/create', async (req, res, next) => {
  const message = await artTokenController.mintToken(req.body);
  res.status(200).json(message);
});

router.get('/list', (req, res, next) => {
  const allTokens = artTokenController.allTokensOf(req.query.owner);
  res.json(allTokens);
});

module.exports = router;
