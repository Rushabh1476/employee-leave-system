package com.employee.leave.controller;

import com.employee.leave.entity.Leave;
import com.employee.leave.service.LeaveService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = {"*", "https://roaring-biscochitos-7296a2.netlify.app"})
public class LeaveController {

    private final LeaveService service;

    public LeaveController(LeaveService service) {
        this.service = service;
    }

    @PostMapping
    public Leave apply(@RequestBody Map<String, Object> body) {
        Leave leave = new Leave();
        
        leave.setEmployeeName((String) body.get("employeeName")); // DB column name check karein
        leave.setDate((String) body.get("date"));
        
        Object daysObj = body.get("days");
        if (daysObj != null) {
            leave.setDays(Integer.parseInt(daysObj.toString()));
        }

        leave.setReason((String) body.get("reason"));
        leave.setStatus((String) body.get("status"));

        // 🖼️ Base64 Image: Direct String save hogi
        Object proofObj = body.get("proof");
        if (proofObj != null) {
            leave.setProof(proofObj.toString()); 
        }

        return service.applyLeave(leave);
    }

    @GetMapping
    public List<Leave> getAllLeaves() {
        return service.getAll();
    }

    @GetMapping("/employee/{name}")
    public List<Leave> byEmployee(@PathVariable String name) {
        return service.getEmployeeLeaves(name);
    }

    @PutMapping("/{id}/{status}")
    public Leave update(@PathVariable Long id, @PathVariable String status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteLeave(id);
    }
}   