const router = require("express").Router();
const { createTask, validate } = require("../models/Task");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).json({ message: error.details[0].message });

		await new createTask({Title: req.body.Title , user_id: req.body.user_id}).save();
		res.status(201).send({ message: "Task created successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
