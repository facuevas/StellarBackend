const express = require('express');
const router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const pool = require('../handlers/dbHandler');

const feedbackSchema = Joi.object().keys({
    uuid: Joi.string().required().guid({version: ['uuidv4']}),
    feedback: Joi.string().required(),
}).options({abortEarly: false});

router.post('/', function (req, res, next) {
    if (!joiHandler.validate(res, req.body, feedbackSchema)) return;

    const {uuid, feedback} = req.body;

    pool.query('INSERT INTO feedback (uuid, feedback) VALUES(?, ?)', [uuid, feedback], function (error, results, fields) {
        if (error) {
            return res.status(400).json({
                message: 'Failed to log feedback.',
                error: error.message
            })
        }

        return res.status(200).json({
            message: 'Successfully logged feedback.'
        })
    });
});

module.exports = router;
