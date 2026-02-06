import React, { useEffect, useState } from "react";
import LeaveHistory from "./LeaveHistory";
import LeaveService, { Leave } from "../services/LeaveService";

interface User {
    username: string;
    role: string;
}

interface AdminDashboardProps {
    user: User;
    logout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, logout }) => {
    const [allHistory, setAllHistory] = useState<Leave[]>([]);
    const [showAllHistory, setShowAllHistory] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            // Using relative path via LeaveService (/api/leaves)
            const res = await LeaveService.getAllLeaves();
            const data = res.data || [];
            setAllHistory(data);
            localStorage.setItem('allHistory', JSON.stringify(data));
            setServerError(null);
        } catch (err) {
            console.error("Admin Fetch Error:", err);
            setServerError("Backend sync failed. Retrying...");
        }
    };

    useEffect(() => {
        // Initial load
        const cached = localStorage.getItem("allHistory");
        if (cached) setAllHistory(JSON.parse(cached));

        fetchData();

        // Polling every 5 seconds for admin sync
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = (id: number, s: string) => {
        (s === "Approved" ? LeaveService.approveLeave(id) : LeaveService.rejectLeave(id))
            .then(() => {
                setAllHistory((prev) => prev.map(l => l.id === id ? { ...l, status: s } : l));
            })
            .catch(err => alert("Failed to update status."));
    };

    return (
        <div style={{ minHeight: "100vh", padding: "30px", backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')", backgroundSize: "cover" }}>
            <div style={{ maxWidth: "1200px", margin: "auto", background: "rgba(255, 255, 255, 0.95)", padding: "25px", borderRadius: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h1>Admin Dashboard</h1>
                    <button onClick={logout} style={{ padding: "8px 18px", background: "#e53935", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Logout</button>
                </div>

                {serverError && <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{serverError}</div>}

                <div style={{ marginBottom: "20px" }}>
                    <p>Welcome, <strong>{user.username}</strong> (Admin)</p>
                    <button
                        onClick={() => setShowAllHistory(!showAllHistory)}
                        style={{ padding: "10px 20px", borderRadius: "6px", background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}
                    >
                        {showAllHistory ? "View Pending Only" : "View All History"}
                    </button>
                </div>

                <LeaveHistory
                    leaves={showAllHistory ? allHistory : allHistory.filter(l => l.status === "Pending")}
                    isAdmin={!showAllHistory}
                    isAdminHistory={showAllHistory}
                    updateStatus={updateStatus}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
