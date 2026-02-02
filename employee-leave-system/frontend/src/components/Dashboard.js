import React, { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import LeaveHistory from "./LeaveHistory";
import LeaveService from "../services/LeaveService";

function Dashboard({ user, logout }) {
  const [leaves, setLeaves] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isLogoutHover, setIsLogoutHover] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser?.role === "ADMIN";
  const isEmployee = currentUser?.role === "EMPLOYEE";

  // Initial load and refresh for employees
  useEffect(() => {
    if (!isEmployee || !currentUser?.username) return;

    const fetchEmployeeLeaves = () => {
      LeaveService.getEmployeeLeaves(currentUser.username)
        .then((res) => {
          console.log("Fetched employee leaves:", res.data);
          const data = (res.data || []).map((l) => ({
              ...l,
              id: l.id,
              employeeName: l.employeeName || currentUser.username,
              date: l.date || "",
              status: l.status || "PENDING",
              proof: l.proof 
            }));
          setLeaves(data);
        })
        .catch((err) => console.error("Error fetching employee leaves:", err));
    };
    
    // Fetch immediately on mount
    fetchEmployeeLeaves();
    
    // Then poll every 3 seconds
    const interval = setInterval(fetchEmployeeLeaves, 3000);
    return () => clearInterval(interval);
  }, [isEmployee, currentUser?.username, refreshKey]);

  // Admin data fetching
  useEffect(() => {
    if (!isAdmin) return;
    
    const loadAdminLeaves = () => {
      LeaveService.getAllLeaves()
        .then((res) => {
          console.log("Fetched all leaves for admin:", res.data);
          const data = (res.data || []).map(l => ({
              ...l,
              proof: l.proof
          }));
          setAllHistory(data);
        })
        .catch((err) => console.error("Error fetching all leaves:", err));
    };
    
    // Fetch immediately on mount
    loadAdminLeaves();
    
    // Then poll every 2 seconds
    const interval = setInterval(loadAdminLeaves, 2000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const addLeave = (savedLeave) => {
    console.log("Adding leave:", savedLeave);
    
    const normalized = {
      ...savedLeave,
      employeeName: savedLeave.employeeName || currentUser.username,
      date: savedLeave.date || "",
      status: savedLeave.status || "PENDING",
      proof: savedLeave.proof 
    };
    
    // Add to local state immediately
    setLeaves((p) => [...p, normalized]);
    setAllHistory((p) => [...p, normalized]);
    
    // Force a refresh from backend after 1 second
    setTimeout(() => {
      setRefreshKey(prev => prev + 1);
    }, 1000);
  };

  const updateStatus = (id, status) => {
    const api = status === "Approved" ? LeaveService.approveLeave(id) : LeaveService.rejectLeave(id);
    api.then(() => {
      setAllHistory((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
      setLeaves((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
    }).catch(console.error);
  };

  const deleteEmployeeLeave = (id) => {
    LeaveService.deleteLeave(id).then(() => {
      setLeaves((p) => p.filter((l) => l.id !== id));
      setAllHistory((p) => p.filter((l) => l.id !== id));
    }).catch(console.error);
  };

  const deleteAdminLeave = (id) => {
    LeaveService.deleteLeave(id).then(() => {
      setAllHistory((p) => p.filter((l) => l.id !== id));
      setLeaves((p) => p.filter((l) => l.id !== id));
    }).catch(console.error);
  };

  const pendingLeaves = allHistory.filter((l) => l.status?.toUpperCase() === "PENDING");

  return (
    <div style={{ minHeight: "100vh", padding: "30px", backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')", backgroundSize: "cover", backgroundAttachment: "fixed", backgroundPosition: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "auto", background: "rgba(255, 255, 255, 0.95)", padding: "25px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button onClick={logout} onMouseEnter={() => setIsLogoutHover(true)} onMouseLeave={() => setIsLogoutHover(false)} style={{ padding: "8px 18px", borderRadius: "6px", background: isLogoutHover ? "#b71c1c" : "#e53935", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600", transition: "0.3s ease" }}>Logout</button>
        </div>
        {isEmployee && (
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "28px", borderRadius: "16px", marginBottom: "25px", background: "linear-gradient(135deg,#2c3e50,#4ca1af)", color: "#fff" }}>
              <h1>Employee Dashboard</h1>
              <p style={{ fontSize: "28px", fontWeight: "800" }}>Welcome <span style={{ background: "linear-gradient(90deg,#ffeb3b,#00e5ff,#ff4081)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{currentUser.username}💕</span></p>
            </div>
            <LeaveForm addLeave={addLeave} />
            <LeaveHistory leaves={leaves} isEmployee onDelete={deleteEmployeeLeave} />
          </div>
        )}
        {isAdmin && (
          <div>
            <div style={{ padding: "22px", borderRadius: "12px", marginBottom: "25px", background: "#ffffff", border: "1px solid #e0e0e0", textAlign: "center" }}>
              <h1>Admin Dashboard</h1>
              <p>Welcome <strong>{currentUser.username}</strong></p>
            </div>
            <button onClick={() => setShowAllHistory(!showAllHistory)} style={{ marginBottom: "20px", padding: "10px 20px", borderRadius: "6px", background: "#ffffff", color: "#1976d2", border: "1px solid #1976d2", cursor: "pointer", fontWeight: "600" }}>{showAllHistory ? "Current Leaves" : "All History"}</button>
            <LeaveHistory leaves={showAllHistory ? allHistory : pendingLeaves} isAdmin={!showAllHistory} isAdminHistory={showAllHistory} updateStatus={updateStatus} onAdminDelete={deleteAdminLeave} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;