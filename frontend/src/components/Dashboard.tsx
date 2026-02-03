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
    const [allHistory, setAllHistory] = useState<Leave[]>([]);
    const [showAllHistory, setShowAllHistory] = useState<boolean>(false);
    const [isHover, setIsHover] = useState<boolean>(false);

    // Fallback if prop user is missing, though App.js should provide it
    const u = user || JSON.parse(localStorage.getItem("user") || "{}");
    const isEmp = u?.role === "EMPLOYEE";
    const isAdmin = u?.role === "ADMIN";

    useEffect(() => {
        // Load cached data first (so refresh shows data immediately)
        try {
            const cachedLeaves = JSON.parse(localStorage.getItem("leaves") || "null");
            const cachedAll = JSON.parse(localStorage.getItem("allHistory") || "null");
            if (isEmp && Array.isArray(cachedLeaves)) setLeaves(cachedLeaves);
            if (isAdmin && Array.isArray(cachedAll)) setAllHistory(cachedAll);
        } catch (err) {
            console.error('Failed to read cache', err);
        }

        const fetchData = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const name = u?.username || storedUser.username;
            try {
                if (isEmp && name) {
                    const res = await LeaveService.getEmployeeLeaves(name);
                    const data = res.data || [];
                    setLeaves(data);
                    localStorage.setItem('leaves', JSON.stringify(data));
                }
                if (isAdmin) {
                    const res = await LeaveService.getAllLeaves();
                    const data = res.data || [];
                    setAllHistory(data);
                    localStorage.setItem('allHistory', JSON.stringify(data));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
        if (isAdmin) {
            const inv = setInterval(fetchData, 4000);
            return () => clearInterval(inv);
        }
    }, [isEmp, isAdmin, u.username]);

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

    const updateStatus = (id: number, s: string) => {
        (s === "Approved" ? LeaveService.approveLeave(id) : LeaveService.rejectLeave(id)).then(() => {
            setAllHistory((p) => {
                const updated = p.map((l) => (l.id === id ? { ...l, status: s } : l));
                try { localStorage.setItem('allHistory', JSON.stringify(updated)); } catch (e) { }
                return updated;
            });
            // Also update 'leaves' if meaningful
            setLeaves((p) => {
                const updated = p.map((l) => (l.id === id ? { ...l, status: s } : l));
                try { localStorage.setItem('leaves', JSON.stringify(updated)); } catch (e) { }
                return updated;
            });
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
                {isEmp && (
                    <div style={{ textAlign: "center" }}>
                        <div style={{ padding: "28px", borderRadius: "16px", marginBottom: "25px", background: "linear-gradient(135deg,#2c3e50,#4ca1af)", color: "#fff" }}>
                            <h1>Employee Dashboard</h1>
                            <p style={{ fontSize: "28px", fontWeight: "800" }}>Welcome <span style={{ background: "linear-gradient(90deg,#ffeb3b,#00e5ff,#ff4081)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{u.username}</span></p>
                        </div>
                        <LeaveForm addLeave={addLeave} />
                        <LeaveHistory leaves={leaves} isEmployee={true} onDelete={deleteLeave} />
                    </div>
                )}
                {isAdmin && (
                    <div>
                        <div style={{ padding: "22px", borderRadius: "12px", marginBottom: "25px", background: "#ffffff", border: "1px solid #e0e0e0", textAlign: "center" }}>
                            <h1>Admin Dashboard</h1>
                            <p>Welcome <strong>{u.username}</strong></p>
                        </div>
                        <button onClick={() => setShowAllHistory(!showAllHistory)} style={{ marginBottom: "20px", padding: "10px 20px", borderRadius: "6px", background: "#ffffff", color: "#1976d2", border: "1px solid #1976d2", cursor: "pointer", fontWeight: "600" }}>{showAllHistory ? "Current Leaves" : "All History"}</button>
                        <LeaveHistory leaves={showAllHistory ? allHistory : allHistory.filter(l => l.status === "Pending")} isAdmin={!showAllHistory} isAdminHistory={showAllHistory} updateStatus={updateStatus} />
                    </div>
                )}
            </div>
        </div>
    );
}
export default Dashboard;
