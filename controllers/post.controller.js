import postModel from "../models/post.model.js";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import ImageKit from "imagekit";
// import NodeCache from "node-cache";
export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const user = await userModel.findOne({ clerkUserId });
  if (!user) {
    return res.status(401).json({ message: "user not found" });
  }

  const { title, desc, content, img, category } = req.body;
  const slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
  let existingSlug = await postModel.findOne({ slug });

  let counter = 2;
  while (existingSlug) {
    slug = `${slug}-${counter}`;
    existingSlug = await postModel.findOne({ slug });
    counter++;
  }
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const post = new postModel({
      user,
      title,
      desc,
      content,
      img,
      slug,
      category: category || "general",
      user
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  } catch (error) {
    // if (error instanceof mongoose.Error.ValidationError) {
    //   return res
    //     .status(400)
    //     .json({ message: "Validation error.", details: error.errors });
    // }
    console.error(error);
    res.status(500).json({
      message:
        "An error occurred while creating the post. Please try again later.",
    });
  }
};
export const getPosts = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;
  const skip = page * limit - limit;
  try {
    const posts = await postModel.find().skip(skip).limit(limit).populate("user","username");
    const totalPosts = await postModel.countDocuments();
    const hasMore = totalPosts > skip + limit;
    res.status(200).json({ message: "Posts retrieved successfully.", posts, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "An error occurred while retrieving the posts. Please try again later.",
    });
  }
};

export const getPostBySlug = async (req, res) => {
  const { slug } = req.params; 
  console.log("api called");
  console.log("----------------");
  console.log(slug);
  
  try {
    const post = await postModel.findOne({ slug }).populate("user","username img");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ message: "Post retrieved successfully.", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "An error occurred while retrieving the post. Please try again later.",
    });
  }
};

export const getPostMetadata = async (req, res) => {
  const { slug } = req.params; 
  console.log("api called");
  console.log("***************");
  // console.log(slug);
  
  try {
    const post = await postModel.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ message: "Post retrieved successfully.", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "An error occurred while retrieving the post. Please try again later.",
    });
  }
};
export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  if (!clerkUserId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = await userModel.findOne({ clerkUserId });
  if (!userId) {
    return res.status(401).json({ message: "user not found" });
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});
export const uploadAuthController = async (req, res) => {
  console.log("Called api"); 
  console.log(process.env.IK_URL_ENDPOINT);
  console.log(process.env.IK_PUBLIC_KEY);
  console.log(process.env.IK_PRIVATE_KEY);
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
}; 
