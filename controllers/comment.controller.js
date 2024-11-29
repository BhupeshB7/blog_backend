import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username img")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addComment = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;
  if (!clerkUserId) {
    res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      res.status(401).json({ message: "User not found" });
    }
    const comment = new Comment({
      ...req.body,
      user: user._id,
      post: postId,
    });
   const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = () => {};
