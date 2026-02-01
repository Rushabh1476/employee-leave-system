import React, { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import LeaveHistory from "./LeaveHistory";
import LeaveService from "../services/LeaveService";
const getLS = (k) => JSON.parse(localStorage.getItem(k) || "[]");
const setLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
function Dashboard({ user, logout }) {
  const [leaves, setLeaves] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [isLogoutHover, setIsLogoutHover] = useState(false);
  const u = user || JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = u?.role === "ADMIN";
  const isEmployee = u?.role === "EMPLOYEE";
  useEffect(() => {
    const username = u?.username || JSON.parse(localStorage.getItem("user") || "{}").username;
    if (isEmployee && username) {
      LeaveService.getEmployeeLeaves(username).then((res) => {
        const deletedIds = getLS("EMP_DELETED_IDS");
        setLeaves((res.data || []).filter((l) => !deletedIds.includes(l.id)));
      }).catch(console.error);
    }
  }, [isEmployee, u]);
  useEffect(() => {
    if (!isAdmin) return;
    const load = () => {
      LeaveService.getAllLeaves().then((res) => {
        const adminDeleted = getLS("ADMIN_DELETED_IDS");
        setAllHistory((res.data || []).filter((l) => !adminDeleted.includes(l.id)));
      }).catch(console.error);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [isAdmin]);
  const addLeave = (s) => setLeaves((p) => [...p, s]);
  const updateStatus = (id, status) => {
    (status === "Approved" ? LeaveService.approveLeave(id) : LeaveService.rejectLeave(id)).then(() => {
      setAllHistory((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
      setLeaves((p) => p.map((l) => (l.id === id ? { ...l, status } : l)));
    });
  };
  const deleteEmployeeLeave = (id) => {
    setLS("EMP_DELETED_IDS", [...getLS("EMP_DELETED_IDS"), id]);
    setLeaves((p) => p.filter((l) => l.id !== id));
  };
  const deleteAdminLeave = (id) => {
    setLS("ADMIN_DELETED_IDS", [...getLS("ADMIN_DELETED_IDS"), id]);
    setAllHistory((p) => p.filter((l) => l.id !== id));
  };
  return (
    <div style={{ minHeight: "100vh", padding: "30px", backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      <div style={{ maxWidth: "1200px", margin: "auto", background: "rgba(255, 255, 255, 0.95)", padding: "25px", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button onClick={logout} onMouseEnter={()=>setIsLogoutHover(true)} onMouseLeave={()=>setIsLogoutHover(false)} style={{ padding: "8px 18px", borderRadius: "6px", background: isLogoutHover ? "#b71c1c" : "#e53935", color: "#fff", border: "none", cursor: "pointer", fontWeight: "600" }}>Logout</button>
        </div>
        {isEmployee && (
          <div style={{ textAlign: "center" }}>
            <div style={{ padding: "28px", borderRadius: "16px", marginBottom: "25px", background: "linear-gradient(135deg,#2c3e50,#4ca1af)", color: "#fff" }}>
              <h1>Employee Dashboard</h1>
              <p style={{ fontSize: "28px", fontWeight: "800" }}>Welcome <span style={{ background: "linear-gradient(90deg,#ffeb3b,#00e5ff,#ff4081)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{u.username}??</span></p>
            </div>
            <LeaveForm addLeave={addLeave} />
            <LeaveHistory leaves={leaves} isEmployee onDelete={deleteEmployeeLeave} />
          </div>
        )}
        {isAdmin && (
          <div>
            <div style={{ padding: "22px", borderRadius: "12px", marginBottom: "25px", background: "#ffffff", border: "1px solid #e0e0e0", textAlign: "center" }}>
              <h1>Admin Dashboard</h1>
              <p>Welcome <strong>{u.username}</strong></p>
            </div>
            <button onClick={() => setShowAllHistory(!showAllHistory)} style={{ marginBottom: "20px", padding: "10px 20px", borderRadius: "6px", background: "#ffffff", color: "#1976d2", border: "1px solid #1976d2", cursor: "pointer", fontWeight: "600" }}>{showAllHistory ? "Current Leaves" : "All History"}</button>
            <LeaveHistory leaves={showAllHistory ? allHistory : allHistory.filter(l=>l.status==="Pending")} isAdmin={!showAllHistory} isAdminHistory={showAllHistory} updateStatus={updateStatus} onAdminDelete={deleteAdminLeave} />
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
