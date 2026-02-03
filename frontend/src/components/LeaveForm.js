import React, { useState } from "react";
import LeaveService from "../services/LeaveService";

function LeaveForm({ addLeave }) {
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState(""); // Base64 string yahan store hogi
  const [isSubmitHover, setIsSubmitHover] = useState(false); // Hover State

  // LocalStorage se logged user nikalna (key: 'user')
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

  // File ko Base64 mein badalne ka function
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // Ye pure image ko Base64 string mein convert kar deta hai
      setProof(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !reason) {
      alert("Please select date and reason");
      return;
    }

    try {
      const payload = {
        employeeName: loggedUser.username,
        date: date,
        days: Number(days),
        reason: reason,
        proof: proof, // Backend ise folder mein save karega
        status: "Pending"
      };

      const res = await LeaveService.applyLeave(payload);
      
      // Dashboard state update karne ke liye (parent persists to localStorage)
      addLeave(res.data);

      alert("Leave Applied Successfully ✅");

      // Form reset karne ke liye
      setDate("");
      setDays(1);
      setReason("");
      setProof("");

    } catch (err) {
      console.error(err);
      alert("Error applying leave ❌");
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
          onChange={(e) => setDays(e.target.value)}
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