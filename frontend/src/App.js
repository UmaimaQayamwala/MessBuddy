import React, { useEffect, useState } from 'react';

import "./app.css";
import Register from './components/Register';
import Login from './components/Login';
import CustomMap2 from './components/CustomMap2';
import axios from 'axios';

function App() {

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const myStorage = window.localStorage;

 
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(myStorage.getItem("token"));

  const handleLogout = () => {
    myStorage.removeItem("user");
    myStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
  };

  useEffect(() => {
    async function fetchUser() {
      if(token) {
        // const getUser = await axios.get("http://localhost:5000/api/users/getUser", { headers: { Authorization: `Bearer ${token}` } });
        const getUser = await axios.get("https://messbuddy-backend.onrender.com/api/users/getUser", { headers: { Authorization: `Bearer ${token}` } });

        if(getUser.data.success === true) {
          setCurrentUser(getUser.data.user.username);
        }
      }
    }

    fetchUser();
  }, []);

  return (
    <div className='App'>
      <CustomMap2 currentUser={currentUser}/>
      {currentUser ? (
        <button className='button logout' id ="log" onClick={handleLogout}>Log out</button>
      ) : (
        <div className='buttons'>
          <button className='button login' onClick={() => { setShowLogin(true); setShowRegister(false) }}>Login</button>
          <button className='button register' onClick={() => { setShowRegister(true); setShowLogin(false) }}>Register</button>
        </div>
      )}
      {showRegister && (<Register setShowRegister={setShowRegister} />)}
      {showLogin && (<Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} setToken={setToken} />)}
    </div>
  );
}

export default App;