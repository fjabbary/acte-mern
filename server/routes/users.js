const express = require('express');
const router = express.Router();

const { getAllUsers, addUser, editUser, deleteUser, deleteAllUsers } = require('../controllers/userController')

router.get("/users", getAllUsers)

router.post("/user", addUser)

router.put("/user/:id", editUser)

router.delete("/user/:id", deleteUser)

router.delete("/users", deleteAllUsers)

module.exports = router;