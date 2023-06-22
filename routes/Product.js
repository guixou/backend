const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/Product')

router.post('/', stuffCtrl.createThing);
router.put('/:id', stuffCtrl.modifyThing);
router.get('/:id', stuffCtrl.getOnThing);
router.get('/', stuffCtrl.getAllThing);
router.delete('/:id', stuffCtrl.deletThing);

module.exports = router;