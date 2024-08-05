const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

// Get all users
userRouter.get("/", userController.getAllUsers);

// Create a new user
userRouter.post("/", userController.createUser);

// Get a user by Firebase UID
userRouter.get("/firebase/:uid", userController.getUserByFirebaseId);

// Get a user by ID
userRouter.get("/:id", userController.getUserById);

// Update a user by ID
userRouter.put("/:id", userController.updateUserById);

// Delete a user by ID
userRouter.delete("/:id", userController.deleteUserById);



module.exports = userRouter;
