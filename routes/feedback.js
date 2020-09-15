let express = require('express');
let router = express.Router();

const Joi = require('joi');
const joiHandler = require('../handlers/joiHandler');

const feedbackSchema = Joi.object().keys({
  uuid: Joi.string().required().guid({ version: ['uuidv4'] }),
  feedback: Joi.string().required(),
}).options({ abortEarly: false });

router.post('/', function(req, res, next) {
  if (!joiHandler.validate(res, req.body, feedbackSchema)) return;

  // TODO: Database stuff

  return res.status(200).json({
    message: 'Successfully logged feedback.'
  })
});

module.exports = router;
