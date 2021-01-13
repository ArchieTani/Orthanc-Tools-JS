var Users = require('../model/Users')

    createUser = async function (req, res) {
        const body = req.body
        try {
            await Users.createUser(body)
            res.json(true)
        } catch (error) {
            console.error(error)
            res.status(500).send('Fail to create user')
        }
    }

    getUsers = async function (req, res) {
        let user
        try {
            user = await Users.getUsers()
        } catch (error) {
            console.error(error)
            res.status(500).send('fail to get users')
        }
        res.json(user)
    }

    modifyUser = async function(req, res){
        const body = req.body
        try {
            await Users.modifyUser(body)
            res.json(true)
        } catch (error) {
            res.status(500).send('Fail to modify user')
        }
    }

    deleteUser = async function(req, res){
        const name = req.body
        try {
            await Users.deleteUser(name)
            res.json(true)
        } catch (error) {
            res.status(500).send('Fail to delete user')
        }
    }

module.exports = { createUser, modifyUser, deleteUser, getUsers }