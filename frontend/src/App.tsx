import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./responsive.css";

// Basic interface for the User object
interface User {
    username: string;
    role: string;
}

import AdminDashboard from "./components/AdminDashboard";

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    // 🔹 Load logged-in user
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // 🔹 Save user on login
    const handleLogin = (userData: User) => {
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
                (() => {
                    const r = user.role?.toString().toUpperCase().trim();
                    console.log("Current User Role:", r);
                    if (r === "ADMIN") {
                        return <AdminDashboard user={user} logout={logout} />;
                    }
                    return <Dashboard user={user} logout={logout} />;
                })()
            )}


        </>
    );
}


export default App;
