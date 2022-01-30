const express = require("express");
const router = express.Router();
const otherController = require("../controllers/otherController");


router.get("/about", otherController.about)

module.exports = router;