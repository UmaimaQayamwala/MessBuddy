const router = require("express").Router();
const { createPin, getAllPins, updatePin, deletePin } = require("../controllers/pinController");
const verifyToken = require("../middleware/auth");

//create a pin
router.post("/", verifyToken, createPin);

//get all pins
router.get("/", getAllPins);

// Edit pin
router.put("/", verifyToken, updatePin);

//Delete Pin
router.delete("/:id", verifyToken, deletePin);

module.exports = router;