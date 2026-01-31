import axios from "axios";

const BASE_URL = "https://employee-leave-app.onrender.com/api/leaves";


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

export default new LeaveService();
