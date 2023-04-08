const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
	Title: { type: String},
    user_id: { type: String}
});


const createTask = mongoose.model("createTask", taskSchema);
const updateTask = mongoose.model("updateTask", taskSchema);
const deleteTask = mongoose.model("updateTask", taskSchema);
const validate = (data) => {
	const schema = Joi.object({
		id:Joi.string(),
		Title: Joi.string().required().label("Task"),
        user_id: Joi.string()
	});
	return schema.validate(data);
};

module.exports = { createTask, updateTask, deleteTask, validate };
