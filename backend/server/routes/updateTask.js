const router = require("express").Router();
const { updateTask, validate } = require("../models/Task");

router.patch("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    await updateTask.updateOne({_id: req.body.id }, { Title: req.body.Title });

    res.status(201).send({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
