const router = require("express").Router();
const { deleteTask } = require("../models/Task");

router.delete("/", async (req, res) => {
  try {
    await deleteTask.deleteOne({ _id: req.body._id });
    res.status(201).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
