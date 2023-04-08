const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		const user = await User.findOne({ email: req.body.email });
		if (error){
			return res.status(400).json({ message: error.details[0].message });
		}
		if (!user){
			return res.status(401).json({ message: "Invalid Email or Password" });
		}else{
			const validPassword = await bcrypt.compare(
				req.body.password,
				user.password
			);
			if (!validPassword){
				return res.status(401).json({ message: "Invalid Email or Password" });
			}else{
				const token = user.generateAuthToken();
				res.json({ token, userId: user.id });
			}
		}

	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
