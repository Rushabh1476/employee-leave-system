import React, { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import LeaveHistory from "./LeaveHistory";
import LeaveService from "../services/LeaveService";
function Dashboard({ user, logout }) {
  const [leaves, setLeaves] = useState([]);
  const [allHistory, setAllHistory] = useState([]);
  const u = user || JSON.parse(localStorage.getItem("user") || "{}");
  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const name = u?.username || stored.username;
      const role = u?.role || stored.role;
      if (name && role === "EMPLOYEE") {
        LeaveService.getEmployeeLeaves(name).then(r => setLeaves(r.data || [])).catch(console.error);
      } else if (role === "ADMIN") {
        LeaveService.getAllLeaves().then(r => setAllHistory(r.data || [])).catch(console.error);
      }
    };
    load();
    const i = setInterval(load, 5000);
    return () => clearInterval(i);
  }, [u.username]);
  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f4f7f6" }}>
      <div style={{ maxWidth: "1200px", margin: "auto", background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <button onClick={logout} style={{ float: "right", background: "#e53935", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
        { (u?.role === "EMPLOYEE" || JSON.parse(localStorage.getItem("user")||"{}").role === "EMPLOYEE") ? (
          <div>
            <h1 style={{textAlign:"center"}}>Employee Dashboard</h1>
            <LeaveForm addLeave={(s) => setLeaves(p => [s, ...p])} />
            <LeaveHistory leaves={leaves} isEmployee onDelete={(id) => setLeaves(p => p.filter(l => l.id !== id))} />
          </div>
        ) : (
          <div>
            <h1 style={{textAlign:"center"}}>Admin Dashboard</h1>
            <LeaveHistory leaves={allHistory} isAdmin updateStatus={(id, s) => setAllHistory(p => p.map(l => l.id === id ? {...l, status: s} : l))} />
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
