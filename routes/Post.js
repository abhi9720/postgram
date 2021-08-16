const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
// create post

router.post("/", async (req, res) => {
  console.log("adding new post");
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    console.log(post.userId + "   " + req.body.userId);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully");
    } else {
      res.status(403).json("you cannot update this post ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  console.log("getting delete request ");
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    console.log(post.userId, req.body.userId);
    console.log(req.body);
    if (post.userId === req.body.userId) {
      await post.deleteOne({ $set: req.body });
      res.status(200).json("Post is now deleted  successfully");
    } else {
      res.status(403).json("you cannot delete  this post ");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like and dislike post a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // console.log('getting request to like for post with id ' + req.params.id + '   and userId : ' + req.body.userId);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked ");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked ");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { updatedAt, ...other } = post._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline  posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    const allpostUser = [
      ...new Set([...currentUser.friends, ...currentUser.followings]),
    ];
    console.log(allpostUser);
    const followingsPosts = await Promise.all(
      allpostUser.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    const allPost = userPosts.concat(...followingsPosts);

    res.status(200).json(allPost);
  } catch (err) {
    console.log(`Failed to get user with user   ` + err);
    res.status(500).json(err);
  }
});

// get users all post
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const userPosts = await Post.find({ userId: user._id });

    res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
