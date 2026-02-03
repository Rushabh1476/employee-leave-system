import React, { useState } from "react";

interface LoginProps {
    setUser: (user: { username: string; role: string }) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("EMPLOYEE");

    const login = () => {
        if (!username || !password) {
            alert("Enter username and password");
            return;
        }

        // 🔒 ADMIN AUTHENTICATION
        if (role === "ADMIN") {
            if (username === "admin" && password === "admin123") {
                setUser({ username, role: "ADMIN" });
            } else {
                alert("❌ Invalid Admin credentials");
            }
            return;
        }

        // ✅ EMPLOYEE LOGIN
        setUser({ username, role: "EMPLOYEE" });
    };

    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: "url('/office-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                className="login-box"
                style={{
                    background: "rgba(255,255,255,0.95)",
                    padding: "30px",
                    borderRadius: "8px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                    textAlign: "center"
                }}
            >

                <h2>Employee Leave Login</h2>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: "100%", padding: "8px" }}
                />
                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "8px" }}
                />
                <br /><br />

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: "80%", padding: "8px" }}
                >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                </select>

                <br /><br />

                <button
                    onClick={login}
                    style={{
                        width: "40%",
                        padding: "10px",
                        background: "#1976d2",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px"
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}

export default Login;
