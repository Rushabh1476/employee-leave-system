import React from "react";
function LeaveHistory({ leaves, isAdmin, isEmployee, updateStatus, onDelete }) {
  if (leaves === null) return <h3 style={{textAlign:"center"}}>Loading history...</h3>;
  return (
    <div style={{ marginTop: "20px" }}>
      <h3 style={{ textAlign: "center" }}>Leave History ({leaves.length})</h3>
      <div style={{ overflowX: "auto" }}>
        <table width="100%" border="1" cellPadding="10" style={{ borderCollapse: "collapse", textAlign: "center", borderColor: "#eee" }}>
          <thead><tr style={{background:"#f8f9fa"}}><th>Employee</th><th>Date</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {leaves.length === 0 ? (<tr><td colSpan="5">No Records Found</td></tr>) : (
              leaves.map(l => (
                <tr key={l.id}>
                  <td>{l.employeeName}</td><td>{l.date}</td><td>{l.reason}</td>
                  <td><b style={{color: l.status === "Approved" ? "green" : l.status === "Rejected" ? "red" : "blue"}}>{l.status}</b></td>
                  <td>
                    {isAdmin && l.status === "Pending" && (
                      <>
                        <button onClick={() => updateStatus(l.id, "Approved")} style={{background:"#4CAF50", color:"white", border:"none", padding:"5px", marginRight:"5px", cursor:"pointer"}}>Approve</button>
                        <button onClick={() => updateStatus(l.id, "Rejected")} style={{background:"#f44336", color:"white", border:"none", padding:"5px", cursor:"pointer"}}>Reject</button>
                      </>
                    )}
                    {isEmployee && <button onClick={() => onDelete(l.id)} style={{background:"#555", color:"white", border:"none", padding:"5px", cursor:"pointer"}}>Delete</button>}
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
