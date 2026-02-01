import React, { useEffect, useState } from "react";
import LeaveForm from "./LeaveForm";
import LeaveHistory from "./LeaveHistory";
import LeaveService from "../services/LeaveService";
function Dashboard({ user, logout }) {
  const [leaves, setLeaves] = useState(null);
  const [allHistory, setAllHistory] = useState([]);
  const u = user || JSON.parse(localStorage.getItem("user") || "{}");
  const isEmp = u?.role === "EMPLOYEE";
  const isAdmin = u?.role === "ADMIN";
  useEffect(() => {
    const load = () => {
      const name = u?.username || JSON.parse(localStorage.getItem("user") || "{}").username;
      if (isEmp && name) LeaveService.getEmployeeLeaves(name).then(r => setLeaves(r.data || [])).catch(() => setLeaves([]));
      if (isAdmin) LeaveService.getAllLeaves().then(r => setAllHistory(r.data || [])).catch(console.error);
    };
    load();
    if (isAdmin) { const i = setInterval(load, 5000); return () => clearInterval(i); }
  }, [u.username, isEmp, isAdmin]);
  return (
    <div style={{ minHeight: "100vh", padding: "30px", background: "#f4f7f6" }}>
      <div style={{ maxWidth: "1200px", margin: "auto", background: "#fff", padding: "20px", borderRadius: "8px" }}>
        <button onClick={logout} style={{ float: "right", background: "#e53935", color: "#fff", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
        {isEmp && (
          <div>
            <h1 style={{ textAlign: "center" }}>Welcome {u.username}</h1>
            <LeaveForm addLeave={(s) => setLeaves(p => [s, ...p])} />
            <LeaveHistory leaves={leaves} isEmployee onDelete={(id) => setLeaves(p => p.filter(l => l.id !== id))} />
          </div>
        )}
        {isAdmin && (
          <div>
            <h1 style={{ textAlign: "center" }}>Admin Panel</h1>
            <LeaveHistory leaves={allHistory} isAdmin updateStatus={(id, s) => setAllHistory(p => p.map(l => l.id === id ? {...l, status: s} : l))} />
          </div>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
