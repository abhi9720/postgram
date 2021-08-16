const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conversation

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get("/:userId", async (req, res) => {
  try {
    
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      // it return all the conversation in which thi userID present
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/delete/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const res = await Conversation.findOneAndDelete({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });

    res.status(200).send("Conversation deleted ok :)");
  } catch (err) {
    res.status(500).json({
      Error: err,
      message: "Conversation not found ",
    });
  }
});

module.exports = router;
