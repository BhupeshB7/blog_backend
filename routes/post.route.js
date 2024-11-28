import express from "express";
import { createPost, getPostBySlug, getPosts, uploadAuthController } from "../controllers/post.controller.js";
const router = express.Router();

router.get("/upload-auth",uploadAuthController);
router.get("/all", getPosts); 
router.get("/:slug", getPostBySlug); 
router.get("/:slug/metadata", getPostBySlug); 
router.post("/create", createPost);
export default router;
