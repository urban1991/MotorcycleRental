const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');


const markSchema = new Schema({
    mark: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Mark = mongoose.model('Mark', markSchema);

function validateMark(mark) {
    const schema = Joi.object({
        mark: Joi.string().min(3).max(50).required(),
    });

    return schema.validate(mark);
};

exports.markSchema = markSchema;
exports.Mark = Mark;
exports.validate = validateMark;