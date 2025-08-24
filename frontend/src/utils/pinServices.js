import axios from "axios";

const PinServices = {
  getAllPins: async () => {
    try {
      // const res = await axios.get("http://localhost:5000/api/pins/");
      const res = await axios.get(
        "https://messbuddy-backend.onrender.com/api/pins/"
      );
      return { ...res, success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  createPin: async (newPin, token) => {
    try {
      // const res = await axios.post("http://localhost:5000/api/pins/", newPin, { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.post(
        "https://messbuddy-backend.onrender.com/api/pins/",
        newPin,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...res, success: true };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  },
  deletePin: async (pinId, token) => {
    console.log("this is delete pin");
    try {
      console.log("pinnn --------------", pinId);
      // const deletedPin = await axios.delete(`http://localhost:5000/api/pins/deletepin/${pinId}`, { headers: { Authorization: `Bearer ${token}` } });
      const deletedPin = await axios.delete(
        `https://messbuddy-backend.onrender.com/api/pins/deletepin/${pinId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { deletedPin, success: true };
    } catch (error) {
      console.log("Error deleting pin", error);
      return { success: false };
    }
  },
  editPin: async (editedPin, token) => {
    try {
      // const res = await axios.put("http://localhost:5000/api/pins/editpin", editedPin, { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.put(
        "https://messbuddy-backend.onrender.com/api/pins/editpin",
        editedPin,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const editPin = res.data;

      editPin.success = true;
      console.log("res object", res);
      return editPin;
    } catch (error) {
      console.log("Error in editing pin", error);
      return { success: false };
    }
  },
};

export default PinServices;
