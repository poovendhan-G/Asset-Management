const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetcontroller');

router.get('/ui', assetController.assetsPage);
router.get('/history/:id/page', assetController.getAssetHistoryPage);

router.post('/add', assetController.addAsset);
router.get('/', assetController.getAssets);
router.post('/issue', assetController.issueAsset);
router.post('/return', assetController.returnAsset);

router.get('/history/:id', assetController.getAssetHistory);

module.exports = router;
