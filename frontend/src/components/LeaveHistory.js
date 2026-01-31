// ======================= LeaveHistory.js =======================
import React, { useState } from "react";

function LeaveHistory({
  leaves = [],
  isAdmin = false,
  isEmployee = false,
  isAdminHistory = false,
  updateStatus,
  onDelete,
  onAdminDelete
}) {
  // Button hover states ke liye local management
  const [hoveredId, setHoveredId] = useState(null);

  const getStatusStyle = (status) => {
    const base = {
      padding: "6px 15px",
      borderRadius: "10px",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      display: "inline-block",
      minWidth: "100px",
      textAlign: "center"
    };

    if (status === "Approved") return { ...base, background: "#FFD700", color: "#000" }; // ✅ Yellow
    if (status === "Rejected") return { ...base, background: "#EF5350" }; // ✅ Light Red
    return { ...base, background: "#2196F3" }; // Pending Blue
  };

  const openImage = (src) => {
    if (!src) return;
    const imgWindow = window.open("", "_blank");
    imgWindow.document.write(
      `<html><head><title>Proof</title></head>
       <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;">
       <img src="${src}" style="max-width:100%;max-height:100%;object-fit:contain;" />
       </body></html>`
    );
    imgWindow.document.close();
  };

  // Helper for Dark Red Delete Color
  const deleteBtnStyle = (id, type) => ({
    background: hoveredId === `${id}-${type}` ? "#8e0000" : "#c62828", // ✅ Dark Red
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "0.3s ease",
    marginLeft: type === "adminHistory" ? "6px" : "0"
  });

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Leave History</h3>
<div className="table-scroll">
      <table
        width="100%"
        cellPadding="10"
        style={{ borderCollapse: "collapse", textAlign: "center" }}
      >
        <thead style={{ background: "#eaeaea" }}>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Proof</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan="7">No Records</td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td>{leave.employeeName || "—"}</td>
                <td>{leave.date || "—"}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>
                  {leave.proof ? (
                    <img
                      src={leave.proof}
                      alt="proof"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        cursor: "pointer",
                        border: "1px solid #ddd"
                      }}
                      onClick={() => openImage(leave.proof)}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  {/* ✅ Status with Colors */}
                  <span style={getStatusStyle(leave.status)}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  {/* ✅ Is line ko dhyan se dekho, yahan div add kiya hai */}
{isAdmin && leave.status?.toUpperCase() === "PENDING" && (
  <div style={{ display: "flex", gap: "5px", justifyContent: "center", alignItems: "center" }}>
    <button
      onClick={() => updateStatus(leave.id, "Approved")}
      onMouseEnter={() => setHoveredId(`${leave.id}-app`)}
      onMouseLeave={() => setHoveredId(null)}
      style={{
        background: hoveredId === `${leave.id}-app` ? "#ccac00" : "gold",
        border: "none",
        padding: "6px 8px", // Padding thodi kam ki hai taki mobile me fit aaye
        borderRadius: "4px",
        cursor: "pointer",
        transition: "0.3s",
        fontWeight: "600",
        fontSize: "12px", // Mobile ke liye font size chota
        whiteSpace: "nowrap" // Taki text niche na gire
      }}
    >
      Approve
    </button>
    <button
      onClick={() => updateStatus(leave.id, "Rejected")}
      onMouseEnter={() => setHoveredId(`${leave.id}-rej`)}
      onMouseLeave={() => setHoveredId(null)}
      style={{
        background: hoveredId === `${leave.id}-rej` ? "#e57373" : "#ffcdd2",
        border: "none",
        padding: "6px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "0.3s",
        fontWeight: "600",
        fontSize: "12px",
        whiteSpace: "nowrap"
      }}
    >
      Reject
    </button>
  </div>
)}

                  {isEmployee && (
                    <button
                      onClick={() => onDelete(leave.id)}
                      onMouseEnter={() => setHoveredId(`${leave.id}-empDel`)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={deleteBtnStyle(leave.id, "empDel")}
                    >
                      Delete
                    </button>
                  )}

                  {isAdminHistory && (
                    <button
                      onClick={() => onAdminDelete(leave.id)}
                      onMouseEnter={() => setHoveredId(`${leave.id}-adminHistory`)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={deleteBtnStyle(leave.id, "adminHistory")}
                    >
                      Delete
                    </button>
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