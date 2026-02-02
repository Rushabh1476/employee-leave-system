package com.employee.leave.controller;

import com.employee.leave.entity.Leave;
import com.employee.leave.service.LeaveService;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveController {

    private final LeaveService service;
    // Image save karne ka path
    private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    public LeaveController(LeaveService service) {
        this.service = service;
    }

    @PostMapping
    public Leave apply(@RequestBody Map<String, Object> body) {
        Leave leave = new Leave();
        
        String empName = (String) body.get("employeeName");
        String leaveDate = (String) body.get("date");

        leave.setEmployeeName(empName);
        leave.setDate(leaveDate);
        leave.setDays((Integer) body.get("days"));
        leave.setReason((String) body.get("reason"));
        leave.setStatus((String) body.get("status"));

        // 🖼️ Handling Image (Save to Folder, not DB)
        Object proofObj = body.get("proof");
        if (proofObj != null && proofObj.toString().contains(",")) {
            try {
                // Folder create karein agar nahi hai
                File folder = new File(UPLOAD_DIR);
                if (!folder.exists()) {
                    folder.mkdirs();
                }

                // Base64 string se image data nikalna
                String base64Image = proofObj.toString();
                String base64Data = base64Image.split(",")[1];
                byte[] imageBytes = Base64.getDecoder().decode(base64Data);

                // Unique File Name: employeeName_date.jpg
                String fileName = empName + "_" + leaveDate + ".jpg";
                Path path = Paths.get(UPLOAD_DIR + fileName);
                
                // Save to folder
                Files.write(path, imageBytes);
                System.out.println("Image saved successfully: " + fileName);

            } catch (Exception e) {
                System.err.println("Error saving image: " + e.getMessage());
            }
        }

        return service.applyLeave(leave);
    }

    @GetMapping
    public List<Leave> getAllLeaves() {
        return service.getAll();
    }

    @GetMapping("/employee/{name}")
    public List<Leave> byEmployee(@PathVariable String name) {
        try {
            if (name == null || name.isEmpty()) {
                return List.of();
            }
            return service.getEmployeeLeaves(name);
        } catch (Exception e) {
            System.err.println("Error in byEmployee: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    @PutMapping("/{id}/approve")
    public Leave approveLeave(@PathVariable Long id) {
        try {
            return service.updateStatus(id, "APPROVED");
        } catch (Exception e) {
            System.err.println("Error in approveLeave: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/{id}/reject")
    public Leave rejectLeave(@PathVariable Long id) {
        try {
            return service.updateStatus(id, "REJECTED");
        } catch (Exception e) {
            System.err.println("Error in rejectLeave: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteLeave(id);
    }
}