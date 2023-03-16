const UserModel = require('../models/Users')

const getAllUsers = async (req, res) => {
    const users = await UserModel.find()
    res.json(users)
}

const addUser = async (req, res) => {
    const { name, age, email } = req.body;
    const newUser = new UserModel({ name, age, email })

    await newUser.save()
    res.json(newUser)
}

const editUser = async (req, res) => {
    const { name, age, email } = req.body;
    await UserModel.updateOne({ _id: req.params.id }, { name, age, email })
}

const deleteUser = async (req, res) => {
    await UserModel.findByIdAndDelete(req.params.id)
    res.json(`User id ${req.params.id} deleted from the DB`)
}

const deleteAllUsers = async (req, res) => {
    await UserModel.deleteMany()
    res.json('Deleted all users')
}

module.exports = {
    getAllUsers,
    addUser,
    editUser,
    deleteUser,
    deleteAllUsers
}