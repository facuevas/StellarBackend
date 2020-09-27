const express = require("express");
const router = express.Router();

const Joi = require("joi");
const joiHandler = require("../handlers/joiHandler");

const pool = require("../handlers/dbHandler");

const feedbackSchema = Joi.object()
  .keys({
    uuid: Joi.string()
      .required()
      .guid({ version: ["uuidv4"] }),
    feedback: Joi.string().required(),
  })
  .options({ abortEarly: false });

// Creates a new feedback object and saves it to the database.
router.post("/new", (req, res) => {
  if (!joiHandler.validate(res, req.body, feedbackSchema)) return;

  const { uuid, feedback } = req.body;

  pool.query(
    "INSERT INTO feedback (uuid, feedback) VALUES(?, ?)",
    [uuid, feedback],
    (error) => {
      if (error) {
        return res.status(400).json({
          message: "Failed to log feedback.",
          error: error.message,
        });
      }
      return res.status(200).json({
        message: "Successfully logged feedback.",
      });
    }
  );
});

// Returns all feedback results from the feedback table.
router.get("/all", (_, res) => {
  pool.query("SELECT uuid, feedback FROM feedback", (error, results) => {
    if (error) {
      return res.status(400).json({
        message: "Failed to get all rows from feedback table.",
        error: error.message,
      });
    }
    return res.status(200).json(results);
  });
});

// Get one feedback result from the feedback table based on the id
router.get("/:uuid", (req, res) => {
  const { uuid } = req.params;
  pool.query(
    "SELECT uuid, feedback FROM feedback WHERE uuid = ?",
    [uuid],
    (error, results) => {
      if (error) {
        return res.status(400).json({
          message: `ID ${uuid} was not found.`,
          error: error.message,
        });
      }
      return res.status(200).json(results);
    }
  );
});

// Delete a feedback result based on the id.
router.delete("/:uuid", (req, res) => {
  const { uuid } = req.params;
  pool.query("DELETE FROM feedback WHERE uuid = ?", [uuid], (error) => {
    if (error) {
      return res.status(400).json({
        message: `ID ${uuid} was not found.`,
        error: error.message,
      });
    }
    return res.status(200).json({
      message: "Feedback successfully deleted.",
    });
  });
});

router.put("/edit", (req, res) => {
  if (!joiHandler.validate(res, req.body, feedbackSchema)) return;
  const { feedback, uuid } = req.body;
  pool.query(
    "UPDATE feedback SET feedback=? WHERE uuid = ?",
    [feedback, uuid],
    (error) => {
      if (error) {
        return res.status(400).json({
          message: `ID ${uuid} was not found.`,
          error: error.message,
        });
      }
      return res.status(200).json({
        message: "Feedback successfully updated.",
      });
    }
  );
});

module.exports = router;
