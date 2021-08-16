const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
// Register
router.post('/register', async (req, res) => {
	try {
		// generate hashed password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		// create new user
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		// saveuser and return response
		await newUser.save();

		res.status(200).json(newUser);
	} catch (err) {
		console.log(err);
		res.send(500).json(err);
	}
});

// login user

router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		!user && res.status(404).json('user not found ');

		const validpassword = await bcrypt.compare(req.body.password, user.password);
		!validpassword && res.status(404).json('Invalid password ');

		res.status(200).json(user);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
