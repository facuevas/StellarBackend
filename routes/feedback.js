const express = require('express');
const router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const Feedback = require('../models/feedback.model');

const feedbackSchema = Joi.object().keys({
    uuid: Joi.string().required().guid({version: ['uuidv4']}),
    feedback: Joi.string().required(),
}).options({abortEarly: false});

router.post('/', function (req, res, next) {
    if (!joiHandler.validate(res, req.body, feedbackSchema)) return;

    const {uuid, feedback} = req.body;

});

module.exports = router;
