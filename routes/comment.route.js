import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controller.js";
const router = express.Router();

router.get("/:postId", getComments);
router.post("/add/:postId", addComment);
router.delete("/:postId/:commentId", deleteComment);

export default router;
