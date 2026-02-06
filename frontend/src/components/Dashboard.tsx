import React, { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import LeaveHistory from "./LeaveHistory";
import LeaveService, { Leave } from "../services/LeaveService";

interface User {
    username: string;
    role: string;
}

interface DashboardProps {
    user: User;
    logout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, logout }) => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [isHover, setIsHover] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // Get user from local storage
    const u = user || JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        // Load cached data
        try {
            const cachedLeaves = JSON.parse(localStorage.getItem("leaves") || "null");
            if (Array.isArray(cachedLeaves)) setLeaves(cachedLeaves);
        } catch (err) {
            console.error('Failed to read cache', err);
        }

        const fetchData = async () => {
            const name = u?.username;
            try {
                if (name) {
                    const res = await LeaveService.getEmployeeLeaves(name);
                    const data = res.data || [];
                    setLeaves(data);
                    localStorage.setItem('leaves', JSON.stringify(data));
                }
                setServerError(null);
            } catch (err) {
                console.error(err);
                setServerError("Backend is sleeping or unreachable. Please wait ~30s if using Render Free Tier.");
            }
        };
        fetchData();
    }, [u.username]);


    // Optimistic UI Helper: Replace temp ID with real ID from server
    const replaceLeave = (tempId: number, realLeave: Leave) => {
        setLeaves((prev) => {
            const updated = prev.map(l => (l.id === tempId ? realLeave : l));
            localStorage.setItem('leaves', JSON.stringify(updated));
            return updated;
        });
    };

    // Remove leave (for optimistic rollback on error)
    const removeLeave = (id: number) => {
        setLeaves((p) => {
            const updated = p.filter(l => l.id !== id);
            localStorage.setItem('leaves', JSON.stringify(updated));
            return updated;
        });
    };

    // FIX: Persist to localStorage when adding a leave
    const addLeave = (s: Leave) => {
        setLeaves((p) => {
            const updated = [...p, s];
            try {
                localStorage.setItem('leaves', JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to save leaves to localStorage", e);
            }
            return updated;
        });
    };


    const deleteLeave = (id: number) => {
        LeaveService.deleteLeave(id).then(() => {
            setLeaves((p) => {
                const next = p.filter(l => l.id !== id);
                try { localStorage.setItem('leaves', JSON.stringify(next)); } catch (e) { }
                return next;
            });
        }).catch(console.error);
    };

    return (
        <div style={{ minHeight: "100vh", padding: "30px", backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
            <div style={{ maxWidth: "1200px", margin: "auto", background: "rgba(255, 255, 255, 0.95)", padding: "25px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                    <button onClick={logout} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} style={{ padding: "8px 18px", borderRadius: "6px", background: isHover ? "#b71c1c" : "#e53935", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" }}>Logout</button>
                </div>
                {serverError && (
                    <div style={{ background: "#ffebee", color: "#c62828", padding: "15px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", border: "1px solid #ef9a9a" }}>
                        <strong>⚠️ {serverError}</strong>
                    </div>
                )}
                <div style={{ textAlign: "center" }}>
                    <div style={{ padding: "28px", borderRadius: "16px", marginBottom: "25px", background: "linear-gradient(135deg,#2c3e50,#4ca1af)", color: "#fff" }}>
                        <h1>Employee Dashboard</h1>
                        <p style={{ fontSize: "28px", fontWeight: "800" }}>Welcome <span style={{ background: "linear-gradient(90deg,#ffeb3b,#00e5ff,#ff4081)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{u.username}</span></p>
                    </div>
                    <LeaveForm addLeave={addLeave} replaceLeave={replaceLeave} removeLeave={removeLeave} />
                    <LeaveHistory leaves={leaves} isEmployee={true} onDelete={deleteLeave} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
