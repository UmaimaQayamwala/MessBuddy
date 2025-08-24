const Pin = require("../models/Pin");
const redisClient = require("../utils/redisClient").redisClient;

const unauthorizedMsg =
  "You are not authorized to create, update and delete this pin.";

const createPin = async (req, res) => {
  const user = req.body.username;

  let title = req.body.title;
  let lat = req.body.lat;
  let long = req.body.long;
  let rating = req.body.rating;
  let desc = req.body.desc;
//   let crea= req.body.

  let idd = lat.toString();

  let newobj = {
    username: user,
    title: title,
    lat: lat,
    long: long,
    rating: rating,
    desc: desc,
    idd: idd,

  };

  const newPin = new Pin(newobj);

  try {
    const savedPin = await newPin.save();
   
    await redisClient.set(title, JSON.stringify(savedPin));

    res.status(200).json(savedPin);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAllPins = async (req, res) => {
  try {
    const keys = await redisClient.keys("*");

    const pins = [];
    let lnl = [];

    for (const key of keys) {
      const data = await redisClient.get(key);
      let ob = JSON.parse(data);

      let lat = ob.lat;
      let long = ob.long;
      let title = ob.title;
      let desc = ob.desc;
      let username = ob.username;
      let id = ob.id;
      let rating = ob.rating;
      let idd = ob.idd;

      if (lat && long) {
       
        lnl.push({
          lat: lat,
          long: long,
          title: title,
          desc: desc,
          username: username,
          id: id,
          rating: rating,
          idd: idd,
        });
      }
    }
    

    return res.status(200).json(lnl);


  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const updatePin = async (req, res) => {
  try {
    
   
    let lat = req.body.lat;
    let title = req.body.title;

    let desc = req.body.desc;

    const pin = await Pin.findOne({ lat: lat });
    let prevtitle = pin.title;
   
    let id = pin._id.toString();
   

    const resPin = await Pin.findByIdAndUpdate(
      id,
      { title: title, desc: desc },
      { new: true }
    );
    
    await redisClient.del(prevtitle);
    await redisClient.set(title, JSON.stringify(resPin));

 
    res.status(200).json({ resPin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
 
};

const deletePin = async (req, res) => {
 
  try {
    const pinId = req.params.id;
    const pin = await Pin.findOne({ idd: pinId });

    if (!pin) {
      res
        .status(404)
        .json({ message: "Pin with id: " + pinId + " not found." });
      return;
    }


   
    let title = pin.title;


    const result = await redisClient.del(title);
    if (result === 1) {
      console.log(`Key "${title}" deleted successfully.`);
    } else {
      console.log(`Key "${title}" not found.`);
    }

   
    if (pin.username !== req.user.username) {
      res.status(403).json({ message: unauthorizedMsg });
      return;
    }

    const deletedPin = await Pin.deleteOne({ idd: pinId });

    res.status(200).send(deletedPin);
  } catch (error) {
   
    res.status(500).json({ error });
  }
};

module.exports = { createPin, getAllPins, updatePin, deletePin };

