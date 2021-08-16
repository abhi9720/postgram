const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
// Register
router.post("/register", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(401).json({ message: "User Already exists " });
  }
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

    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("user not found ");

    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword) {
      return res.status(403).json("Invalid password ");
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err.array());
  }
});

module.exports = router;
