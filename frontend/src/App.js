import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./responsive.css";



function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  // 🔹 Load logged-in user
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // 🔹 Save user on login
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <Login setUser={handleLogin} />
      ) : (
        <Dashboard user={user} logout={logout} />
      )}
    </>
  );
}

export default App;

