import React, { useState } from "react";
import { Leave } from "../services/LeaveService";

interface LeaveHistoryProps {
    leaves: Leave[];
    isAdmin?: boolean;
    isEmployee?: boolean;
    isAdminHistory?: boolean; // Prop used in Dashboard logic
    updateStatus?: (id: number, status: string) => void;
    onDelete?: (id: number) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ leaves = [], isAdmin, isEmployee, updateStatus, onDelete }) => {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

    const openImage = (img: string) => setSelectedImage(img);
    const closeImage = () => setSelectedImage(undefined);

    return (
        <div style={{ marginTop: "20px" }}>
            <h3 style={{ textAlign: "center" }}>Leave History ({leaves.length})</h3>
            <div style={{ overflowX: "auto" }}>
                <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse", textAlign: "center", borderColor: "#eee", border: "1px solid #ddd" }}>
                    <thead><tr style={{ background: "#f8f9fa" }}><th>Employee</th><th>Date</th><th>Reason</th><th>Proof</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        {leaves.length === 0 ? (<tr><td colSpan={6}>No Records Found</td></tr>) : (
                            leaves.map(l => (
                                <tr key={l.id}>
                                    <td>{l.employeeName}</td><td>{l.date}</td><td>{l.reason}</td>
                                    <td>{l.proof ? <img src={l.proof} alt="proof" style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }} onClick={() => openImage(l.proof as string)} /> : "No Proof"}</td>
                                    <td><b style={{ color: l.status === "Approved" ? "green" : l.status === "Rejected" ? "red" : "blue" }}>{l.status}</b></td>
                                    <td>
                                        {isAdmin && l.status === "Pending" && updateStatus && (
                                            <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                                                <button onClick={() => updateStatus(l.id!, "Approved")} style={{ background: "gold", padding: "5px", cursor: "pointer" }}>Approve</button>
                                                <button onClick={() => updateStatus(l.id!, "Rejected")} style={{ background: "#ffcdd2", padding: "5px", cursor: "pointer" }}>Reject</button>
                                            </div>
                                        )}
                                        {isEmployee && onDelete && <button onClick={() => onDelete(l.id!)} style={{ background: "#c62828", color: "white", padding: "5px", cursor: "pointer", border: "none" }}>Delete</button>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>


            {/* Image Modal */}
            {
                selectedImage && (
                    <div className="modal-overlay" onClick={closeImage}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close-btn" onClick={closeImage}>&times;</span>
                            <img src={selectedImage} alt="Proof Full" style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }} />
                        </div>
                    </div>
                )
            }
        </div >
    );
}
export default LeaveHistory;
