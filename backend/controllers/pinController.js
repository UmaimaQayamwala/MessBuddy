const Pin = require("../models/Pin");
const redisClient = require("../utils/redisClient").redisClient;

const unauthorizedMsg = "You are not authorized to create, update and delete this pin.";

const createPin = async (req,res)=>{
    const user = req.user;
    const newPin = new Pin(req.body);
    try {
        if(user.username===newPin.username) {
            const savedPin = await newPin.save();
            await redisClient.set("pins", null);
            res.status(200).json(savedPin);
        }
        else res.status(403).json({ message: unauthorizedMsg });
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllPins = async (req,res)=>{
    try {
        let pins = await redisClient.get("pins");
        if(pins) {
            pins = JSON.parse(pins);
        }
        else {
            pins = await Pin.find();
            await redisClient.set("pins", JSON.stringify(pins));
        }
        return res.status(200).json(pins);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updatePin = async (req, res) => {
    try {
        // const user = req.user;
        const pinId = req.body._id;
        const pin = await Pin.findOne({ _id : pinId });

        if(pin.username !== req.user.username) {
            res.status(403).json({ message: unauthorizedMsg });
            return;
        }

        const resPin = await Pin.findByIdAndUpdate(pinId, req.body);
        console.log(resPin);
        const editedPin = await Pin.findById(pinId);
        console.log(editedPin);
        await redisClient.set("pins", null);
        res.status(200).json({ editedPin });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const deletePin = async (req, res) => {
    try {
        const pinId = req.params.id;
        const pin = await Pin.findOne({ _id: pinId });
        // console.log(pin);
        
        if(!pin) {
            res.status(404).json({ message: "Pin with id: " + pinId + " not found." });
            return;
        }
        
        if(pin.username !== req.user.username) {
            res.status(403).json({ message: unauthorizedMsg });
            return;
        }


        const deletedPin = await Pin.deleteOne({_id: pinId});
        await redisClient.set("pins", null);

        res.status(200).send(deletedPin);
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = { createPin, getAllPins, updatePin, deletePin };