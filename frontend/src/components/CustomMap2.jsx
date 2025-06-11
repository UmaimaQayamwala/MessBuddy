import React, { useState, useEffect } from "react";
import Map, { GeolocateControl, Marker, NavigationControl } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import RoomIcon from "@mui/icons-material/Room";
import axios from "axios";
import CustomPopup from "./CustomPopup";



const CustomMap = ({ currentUser }) => {
  const [pins, setPins] = useState([{}]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 77.7523,
    latitude: 20.932,
    zoom: 12,
  });
  const mapurl= process.env.REACT_APP_Map_LIBRE;
  const logo=process.env.REACT_APP_LOGO;



  const handleMarkerClick = (id, lat, lng) => {
      
          //  setcurridd(id);
    setCurrentPlaceId(id);
  };

  

  // double tap for mobile logic
  const [lastTouch, setLastTouch] = useState(0);
  const handleTouch = (e) => {
    const currentTime = new Date().getTime();
    const timeSinceLastTouch = currentTime - lastTouch;
    if (timeSinceLastTouch < 400 && timeSinceLastTouch > 0) {
      handelAddClick(e);
    }
    setLastTouch(currentTime);
  };

  const handelAddClick = (e) => {
    let { lng, lat } = e.lngLat;
    setNewPlace({
      lng,
      lat,
    });
  };

  useEffect(() => {
    const getPins = async () => {
      try {
   

        // i comment
        // const res = await axios.get("http://localhost:5000/api/pins/");
        const res = await axios.get("https://messbuddy-backend.onrender.com/api/pins/");
        setPins(res.data);
       
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);


//   let pins2=[{
//     username: 'my',
//     title: 'hfwuhedfu',
//     desc: 'sdnjifh',
//     rating: 0,
//     lat: 20.967509458951284,
//     long: 77.75101253967125,
  
//   },
//   {
//     username: 'my',
//     title: 'hijdbfiffwuhedfu',
//     desc: 'sdnjnjjkdeifh',
//     rating: 0,
//     lat: 20.954044109677483,
//     long: 77.7677495239239,
  
//   }
// ]
let pins2=pins;
// let object2=pins[0];
// console.log("pinsss2---------------------------------------------------------------",pins2);

  
  return (
    <div className="App">
      <div className="navbar">
      <img src={logo} className="image" alt="img"></img>
      <h1 className="text">M   e   s   s     B  u  d  d  y</h1>
      </div>
      <Map
        mapLib={maplibregl}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: " calc(100vh - 50px)" }}
        mapStyle={mapurl}
        onDblClick={handelAddClick}
        onTouchStart={handleTouch}
        doubleClickZoom={false}
      >
        <GeolocateControl
          position="bottom-right"
          trackUserLocation="true"
          showAccuracyCircle={false}
          fitBoundsOptions={{ zoom: 15 }}
        ></GeolocateControl>
        
        {Array.isArray(pins2) && pins2.map((p, i) => (
      <>
       { !isNaN(p.lat) && !isNaN(p.long) && p.lat != null && p.long != null && ( <Marker longitude={p.long} latitude={p.lat} anchor="bottom">
          <RoomIcon
            style={{
              color: p.username === currentUser ? "tomato" : "slateblue",
              cursor: "pointer",
            }}
      
            onClick={() => handleMarkerClick(p.idd, p.lat, p.long)}
          />
        </Marker>)}
      
        {p.idd=== currentPlaceId && (
          <CustomPopup
            key={i}
            newPlace={newPlace}
            setNewPlace={setNewPlace}
            currentUser={currentUser}
            pin={p}
            setPins={setPins}
            showDetails={true}
            />
          )}
        </>
      ))}











       
       {newPlace && currentUser && (
      <CustomPopup
        newPlace={newPlace}
        setNewPlace={setNewPlace}
        currentUser={currentUser}
        pin={null}
        setPins={setPins}
        showDetails={false}
      />
    )}

        <NavigationControl position="top-left" />
      </Map>
    </div>
  );
};

export default CustomMap;
