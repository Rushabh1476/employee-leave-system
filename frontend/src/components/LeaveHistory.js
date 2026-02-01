import React, { useState } from "react";
function LeaveHistory({ leaves = [], isAdmin, isEmployee, isAdminHistory, updateStatus, onDelete, onAdminDelete }) {
  const [hoveredId, setHoveredId] = useState(null);
  const getStatusStyle = (s) => {
    const b = { padding: "6px 15px", borderRadius: "10px", fontSize: "14px", fontWeight: "bold", color: "#fff", display: "inline-block", minWidth: "90px", textAlign: "center" };
    if (s === "Approved") return { ...b, background: "#FFD700", color: "#000" };
    if (s === "Rejected") return { ...b, background: "#EF5350" };
    return { ...b, background: "#2196F3" };
  };
  const delStyle = (id, t) => ({ background: hoveredId === `${id}-${t}` ? "#8e0000" : "#c62828", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", transition: "0.3s" });
  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Leave Applications</h3>
      <div style={{ overflowX: "auto" }}>
        <table width="100%" style={{ borderCollapse: "collapse", background: "#fff" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Employee</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Date</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Reason</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Proof</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Status</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "20px", color: "#888" }}>No leave records found.</td></tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                  <td style={{ padding: "12px" }}>{l.employeeName}</td>
                  <td style={{ padding: "12px" }}>{l.date}</td>
                  <td style={{ padding: "12px" }}>{l.reason}</td>
                  <td style={{ padding: "12px" }}>
                    {l.proof ? <img src={l.proof} alt="p" style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer", borderRadius: "4px" }} onClick={() => window.open(l.proof, "_blank")} /> : "—"}
                  </td>
                  <td style={{ padding: "12px" }}><span style={getStatusStyle(l.status)}>{l.status}</span></td>
                  <td style={{ padding: "12px" }}>
                    {isAdmin && l.status === "Pending" && (
                      <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                        <button onClick={() => updateStatus(l.id, "Approved")} style={{ background: "gold", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Approve</button>
                        <button onClick={() => updateStatus(l.id, "Rejected")} style={{ background: "#ffcdd2", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Reject</button>
                      </div>
                    )}
                    {isEmployee && (
                      <button onClick={() => onDelete(l.id)} onMouseEnter={() => setHoveredId(`${l.id}-e`)} onMouseLeave={() => setHoveredId(null)} style={delStyle(l.id, "e")}>Delete</button>
                    )}
                    {isAdminHistory && (
                      <button onClick={() => onAdminDelete(l.id)} onMouseEnter={() => setHoveredId(`${l.id}-a`)} onMouseLeave={() => setHoveredId(null)} style={delStyle(l.id, "a")}>Delete</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default LeaveHistory;
