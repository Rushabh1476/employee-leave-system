import axios from "axios";

const BASE_URL = "http://localhost:8080/api/leaves";

class LeaveService {
  getAllLeaves() {
    return axios.get(BASE_URL);
  }

  applyLeave(leave) {
    return axios.post(BASE_URL, leave);
  }

  getEmployeeLeaves(name) {
    return axios.get(`${BASE_URL}/employee/${name}`);
  }

  approveLeave(id) {
    return axios.put(`${BASE_URL}/${id}/approve`);
  }

  rejectLeave(id) {
    return axios.put(`${BASE_URL}/${id}/reject`);
  }

  deleteLeave(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

const leaveService = new LeaveService();
export default leaveService;
