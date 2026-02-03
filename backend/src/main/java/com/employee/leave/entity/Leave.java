package com.employee.leave.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "leaves")
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_name")
    private String employeeName;

    private String date;
    private int days;
    private String reason;
    private String status;

    @Lob 
    @Column(columnDefinition = "LONGTEXT")
    private String proof;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProof() { return proof; }
    public void setProof(String proof) { this.proof = proof; }
}