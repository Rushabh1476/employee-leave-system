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