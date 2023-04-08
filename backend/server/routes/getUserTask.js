const router = require("express").Router();
const { createTask } = require("../models/Task");

router.get("/", async (req, res) => {
  try {
    const userId = req.body.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await createTask.find({ user_id: userId }).skip(skip).limit(limit);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
