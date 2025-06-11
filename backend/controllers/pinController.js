const Pin = require("../models/Pin");
const redisClient = require("../utils/redisClient").redisClient;

const unauthorizedMsg = "You are not authorized to create, update and delete this pin.";

const createPin = async (req,res)=>{
    const user = req.body.username;

    // console.log("userrr---------------------------",user)
    // const newPin = new Pin(req.body);
    // console.log("reqb22222222222222222222222222222222222222222222------------------------------------------------------------------------------->",req.body);
    let title=req.body.title;
    let lat =req.body.lat;
    let long= req.body.long;
    let rating=req.body.rating;
    let desc=req.body.desc;

//    console.log("ratindggsss",rating)
let idd=lat.toString();
   let newobj={
    "username":user,"title":title,"lat":lat,"long":long,"rating":rating,"desc":desc,"idd":idd
   }


     const newPin = new Pin(newobj);
    // console.log("newpin------------------------------------------------------------------------------------------------------",newPin);
    try {
        // user.username===newPin.username
        if(1) {
            const savedPin = await newPin.save();

         
            //  savedPin._id=toString(savedPin._id)
            // console.log("sp---------------------------------->",savedPin);
            await redisClient.set(title,  JSON.stringify(savedPin));
      
            res.status(200).json(savedPin);
        }
        else res.status(403).json({ message: unauthorizedMsg });
    } catch (error) {
        
        // console.log("hii");
        console.log(error);
        res.status(500).json(error);
    }
};

const getAllPins = async (req,res)=>{
    // try {
    //     let pins = await redisClient.get("pins");
    //     if(pins) {
    //         pins = JSON.parse(pins);
    //     }
    //     else {
    //         pins = await Pin.find();
    //         await redisClient.set("pins", JSON.stringify(pins));
    //     }
    //     return res.status(200).json(pins);
    // } catch (error) {
    //     res.status(500).json(error);
    // }

    // .............................................................................................................................................................
    try {
        const keys = await redisClient.keys("*");
        // console.log("keys",keys);

        const pins = [];
        let lnl = [];

        for (const key of keys) {
            const data = await redisClient.get(key);
            let ob=JSON.parse(data);
            // console.log(ob);
            let lat=ob.lat;
            let long=ob.long;
            let title=ob.title;
            let desc=ob.desc;
            let username=ob.username;
            let id=ob.id;
            let rating=ob.rating;
            let idd=ob.idd;
        
            
            if (lat && long) {
                // pins.push(JSON.parse(data.lat)); // convert string back to object
                // pins.push(JSON.parse(data.long)); // convert string back to object
                lnl.push({"lat":lat,"long":long,"title":title,"desc":desc,"username":username,"id":id, "rating" :rating,"idd":idd });
            }
        }
        // console.log("pinsssss---------------------------------------------------------------------------------------------------------------------",lnl);
       
        return res.status(200).json(lnl);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

};

const updatePin = async (req, res) => {
    try {
    //     // const user = req.user;
    //     const pinId = req.body._id;
    //     console.log("buuy",req.body);
     let lat= req.body.lat;
     let title=req.body.title;
    
     let  desc= req.body.desc;
   
        const pin = await Pin.findOne({ lat: lat });
        let prevtitle=pin.title ;
        // console.log("pre",typeof(prevtitle));
        //   console.log("pinnn",pin);
         let id = pin._id.toString();
        //  console.log("i",id);
    //     if(pin.username !== req.user.username) {
    //         res.status(403).json({ message: unauthorizedMsg });
    //         return;
        // }
    
        const resPin = await Pin.findByIdAndUpdate(id, { title: title, desc:desc  },           // The update to apply
            { new: true }  );
        // console.log("np",resPin);
    //     const editedPin = await Pin.findById(pinId);
    //     console.log(editedPin);
    await redisClient.del(prevtitle);
    await redisClient.set(title,  JSON.stringify(resPin));
   
    //     await redisClient.set("pins", 5);
        res.status(200).json({ resPin });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
    // console.log("update",req.body);
};

const deletePin = async (req, res) => {
      console.log("requestparams---",req.params);
    try {
       
        const pinId = req.params.id;
        const pin = await Pin.findOne({ idd: pinId });

        // return res.status(200).json({
        //     pin,
        //     message:"pinnnnn"
        // })
        // console.log("-------------",pin);;
       console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        

//         // await redisClient.set("pins", 1);
            let title=pin.title;
            console.log("titlt---",title)

          const result = await redisClient.del(pin.title);
         if (result === 1) {
             console.log(`Key "${pin.title}" deleted successfully.`);
          } else {
               console.log(`Key "${pin.title}" not found.`);
            }





             if(!pin) {
            res.status(404).json({ message: "Pin with id: " + pinId + " not found." });
            return;
        }
        
        if(pin.username !== req.user.username) {
            res.status(403).json({ message: unauthorizedMsg });
            return;
        }


        const deletedPin = await Pin.deleteOne({idd: pinId});

        res.status(200).send(deletedPin);
    } catch (error) {
        console.log("hi");
        res.status(500).json({ error });
    }
};

module.exports = { createPin, getAllPins, updatePin, deletePin };


































































// const Pin = require("../models/Pin");
// const redisClient = require("../utils/redisClient").redisClient;

// const unauthorizedMsg = "You are not authorized to create, update and delete this pin.";

// const createPin = async (req,res)=>{
//     const user = req.user;
//     const newPin = new Pin(req.body);
//     console.log("reqb",req.body.title);
//     let pin=req.body.title;
//     console.log("newpin",newPin);
//     try {
//         // user.username===newPin.username
//         if(1) {
//             const savedPin = await newPin.save();
//             console.log("sp",savedPin);
//             // console.log("sp");
            
//             await redisClient.set(pin,  JSON.stringify(savedPin));
      
//             res.status(200).json(savedPin);
//         }
//         else res.status(403).json({ message: unauthorizedMsg });
//     } catch (error) {
        
//         console.log("hii");
//         console.log(error);
//         res.status(500).json(error);
//     }
// };

// const getAllPins = async (req,res)=>{
//     try {
//         let pins = await redisClient.get("pins");
//         if(pins) {
//             pins = JSON.parse(pins);
//         }
//         else {
//             pins = await Pin.find();
//             await redisClient.set("pins", JSON.stringify(pins));
//         }
//         return res.status(200).json(pins);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// };

// const updatePin = async (req, res) => {
//     try {
//         // const user = req.user;
//         const pinId = req.body._id;
//         const pin = await Pin.findOne({ _id : pinId });

//         if(pin.username !== req.user.username) {
//             res.status(403).json({ message: unauthorizedMsg });
//             return;
//         }

//         const resPin = await Pin.findByIdAndUpdate(pinId, req.body);
//         console.log(resPin);
//         const editedPin = await Pin.findById(pinId);
//         console.log(editedPin);
//         await redisClient.set("pins", 5);
//         res.status(200).json({ editedPin });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// };

// const deletePin = async (req, res) => {
//     try {
//         const pinId = req.params.id;
//         const pin = await Pin.findOne({ _id: pinId });
//         // console.log(pin);
        
//         if(!pin) {
//             res.status(404).json({ message: "Pin with id: " + pinId + " not found." });
//             return;
//         }
        
//         if(pin.username !== req.user.username) {
//             res.status(403).json({ message: unauthorizedMsg });
//             return;
//         }


//         const deletedPin = await Pin.deleteOne({_id: pinId});
//         // await redisClient.set("pins", 1);

//         res.status(200).send(deletedPin);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// };

// module.exports = { createPin, getAllPins, updatePin, deletePin };