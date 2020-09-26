const express = require('express');
const router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const pool = require('../handlers/dbHandler');

const feedbackSchema = Joi.object().keys({
    uuid: Joi.string().required().guid({ version: ['uuidv4'] }),
    feedback: Joi.string().required(),
}).options({ abortEarly: false });

// Creates a new feedback object and saves it to the database.
router.post('/add', (req, res) => {
    if (!joiHandler.validate(res, req.body, feedbackSchema)) return;

    const { uuid, feedback } = req.body;

    pool.query('INSERT INTO feedback (uuid, feedback) VALUES(?, ?)', [uuid, feedback], function (error) {
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

// Returns all feedback objects from the database.
router.get('/', (_, res) => {

    pool.query('SELECT * FROM feedback', (error, result) => {
        if (error) {
            return res.status(400).json({
                message: 'Failed to get all created feedback.',
                error: error.message
            });
        }
        return res.status(200).json(result);
    });

});

module.exports = router;
