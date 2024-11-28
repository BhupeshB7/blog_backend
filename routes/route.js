import express from "express";
const router = express.Router();
import userRoute from "./user.route.js";
import postRoute from "./post.route.js";
import commentRoute from "./comment.route.js"; 

router.use("/user", userRoute);
router.use("/post", postRoute);
router.use("/comment", commentRoute); 


export default router;
