const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.get("/", userController.index);

userRouter.post("/", userController.create);

userRouter.get("/:id", userController.getById);

userRouter.put("/:id", userController.updateById);

userRouter.delete("/:id", userController.deleteById);

module.exports = userRouter;