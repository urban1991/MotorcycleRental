const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Mark, validate } = require('../models/mark')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



router.get('/', async (req, res) => {
    const marks = await Mark.find().sort('mark');
    res.send(marks);
});

router.get('/:id',validateObjectId, async (req, res) => {
    const mark = await Mark.findById(req.params.id);
    
    if(!mark) return res.status(404).send('The mark with given ID was not found');
    res.send(mark);
});

router.post('/', auth, async (req, res) => {
    const { error }  = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    
    const mark = new Mark({
        mark: req.body.mark,
    }); 

    await mark.save();       
    res.send(mark);
});
 
router.put('/:id', [auth,validateObjectId], async (req, res) => {
    const { error }  = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
    const mark = await Mark.findByIdAndUpdate(req.params.id, {
        $set: {
            mark: req.body.mark,
        }
    }, { returnOriginal: false });
    if(!mark) return res.status(404).send('The mark with given ID was not found');
    res.send(mark);
});

router.delete('/:id',[auth, admin,validateObjectId], async (req, res) => {
    const mark= await Mark.findByIdAndRemove(req.params.id)
    if(!mark) return res.status(404).send('The mark with given ID was not found');

    res.send(mark);
});

module.exports = router;

