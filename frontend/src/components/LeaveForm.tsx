import React, { useState } from "react";
import LeaveService, { Leave } from "../services/LeaveService";

interface LeaveFormProps {
    addLeave: (leave: Leave) => void;
    replaceLeave?: (tempId: number, realLeave: Leave) => void;
    removeLeave?: (id: number) => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ addLeave, replaceLeave, removeLeave }) => {
    const [date, setDate] = useState<string>("");
    const [days, setDays] = useState<number>(1);
    const [reason, setReason] = useState<string>("");
    const [proof, setProof] = useState<string>(""); // Base64 string
    const [isSubmitHover, setIsSubmitHover] = useState<boolean>(false);

    // Get logged user from local storage
    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProof(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !reason) {
            alert("Please select date and reason");
            return;
        }

        const tempId = Date.now();
        const payload: Leave = {
            id: tempId,
            employeeName: loggedUser.username,
            date: date,
            days: Number(days),
            reason: reason,
            proof: proof,
            status: "Pending"
        };

        // Optimistic Update: Show immediately
        addLeave(payload);
        alert("Leave Applied Successfully (Syncing...) ⏳");

        // Reset form immediately
        setDate("");
        setDays(1);
        setReason("");
        setProof("");

        try {
            // Actual API Call
            const res = await LeaveService.applyLeave({ ...payload, id: undefined }); // Don't send temp ID to backend

            // Replace temp ID with real ID
            if (replaceLeave) replaceLeave(tempId, res.data);

            // Optional: Update alert or let user know sync finished? 
            // Usually optimistic UI implies silent success if no error.

        } catch (err) {
            console.error(err);
            console.error(err);
            alert("❌ Submission FAILED. Backend is unreachable.\nThe request has been cancelled. Please check your connection or try again later.");
            // Rollback
            if (removeLeave) removeLeave(tempId);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                maxWidth: "500px",
                margin: "0 auto 30px",
                padding: "25px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.9)", // Glass effect background
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}
        >
            <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
                New Leave Request
            </h3>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Days</label>
                <input
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Reason</label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box"
                    }}
                >
                    <option value="">-- Select Reason --</option>
                    <option>Sick Leave</option>
                    <option>Personal Work</option>
                    <option>Casual Leave</option>
                    <option>Emergency</option>
                    <option>Vacation</option>
                </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Medical / Proof Attachment</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: "100%" }}
                />
            </div>

            {/* Image Preview Box */}
            {proof && (
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                    <p style={{ fontSize: "12px", color: "#666" }}>Preview:</p>
                    <img
                        src={proof}
                        alt="preview"
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "8px",
                            border: "2px solid #4CAF50",
                            objectFit: "cover"
                        }}
                    />
                </div>
            )}

            {/* Submit Button with Hover Logic */}
            <button
                type="submit"
                onMouseEnter={() => setIsSubmitHover(true)}
                onMouseLeave={() => setIsSubmitHover(false)}
                style={{
                    width: "100%",
                    marginTop: "15px",
                    padding: "12px",
                    background: isSubmitHover ? "#1565c0" : "#1976d2", // Hover par dark blue
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    transition: "0.3s ease",
                    boxShadow: isSubmitHover ? "0 4px 12px rgba(0,0,0,0.2)" : "none"
                }}
            >
                Submit Leave Request
            </button>
        </form>
    );
}

export default LeaveForm;
