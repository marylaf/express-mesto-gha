const router = require("express").Router();

const { getUsers } = require("../controllers/users");
const { getUser } = require("../controllers/users");
const { createUser } = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", createUser);

module.exports = router; // экспортировали роутер
