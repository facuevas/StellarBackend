let express = require('express');
let router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const metricSchema = Joi.object().keys({
    uuid: Joi.string().required().guid({version: ['uuidv4']}).messages({
        "any.required": 'The input must be a valid UUID',
    }),
    loggedIn: Joi.boolean().required(),
}).options({abortEarly: false});

router.post('/', function (req, res, next) {
    if (!joiHandler.validate(res, req.body, metricSchema)) return;

    const {uuid, loggedIn} = req.body;

    return res.status(200).json({
        message: 'Successfully logged app open/close event.'
    })
});

module.exports = router;
