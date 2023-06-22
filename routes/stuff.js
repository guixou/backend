const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff')

router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.get('/:id', auth, stuffCtrl.getOnThing);
router.get('/', auth, stuffCtrl.getAllThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;