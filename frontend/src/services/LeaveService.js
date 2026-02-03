import axios from "axios";

const API_HOST = process.env.REACT_APP_API_URL || "http://localhost:8080";
const BASE_URL = `${API_HOST}/api/leaves`;


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
    return axios.put(`${BASE_URL}/${id}/Approved`);
  }

  rejectLeave(id) {
    return axios.put(`${BASE_URL}/${id}/Rejected`);
  }

  deleteLeave(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}     

export default new LeaveService();
