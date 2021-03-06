const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const { Rental } = require('../models/rental');
const { Motorcycle } = require('../models/motorcycle');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');


router.post('/', [auth, validate(validateReturn)], async (req, res) => {
   const rental = await Rental.lookup(req.body.customerId, req.body.motorcycleId);

    if(!rental) return res.status(404).send('Rental not found.');

    if(rental.dateReturned) return res.status(400).send('Return already processed.');

    rental.return();
    
    await Motorcycle.update({ _id: rental.motorcycle._id }, {
        $inc: { numberInStock: 1 }
    });
    
    await rental.save();
    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        motorcycleId: Joi.objectId().required(),
    });

    return schema.validate(req);
};

module.exports = router;