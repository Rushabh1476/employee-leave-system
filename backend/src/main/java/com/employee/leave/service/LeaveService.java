package com.employee.leave.service;

import com.employee.leave.entity.Leave;
import com.employee.leave.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {
	

    private final LeaveRepository repo;

    public LeaveService(LeaveRepository repo) {
        this.repo = repo;
    }

    public Leave applyLeave(Leave leave) {
    	
        // Use capitalized 'Pending' to match frontend display
        leave.setStatus("Pending");
        return repo.save(leave);
    }


    public List<Leave> getAll() {
        return repo.findAll();
    }

    public List<Leave> getEmployeeLeaves(String name) {
        return repo.findByEmployeeName(name);
    }

    public Leave updateStatus(Long id, String status) {
        Leave leave = repo.findById(id).orElseThrow();
        leave.setStatus(status);
        return repo.save(leave);
    }

    public void deleteLeave(Long id) {
        repo.deleteById(id);
    }

//	public Leave applyLeave(Leave leave) {
//		// TODO Auto-generated method stub
//		return null;
//	}
}
