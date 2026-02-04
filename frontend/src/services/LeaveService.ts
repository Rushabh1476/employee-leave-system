import axios from "axios";

// Define Leave interface
export interface Leave {
    id?: number;
    employeeName: string;
    date: string;
    days: number;
    reason: string;
    status: string;
    proof?: string;
}

// Use current machine IP if running locally
const API_HOST = window.location.hostname === "localhost" ? "http://localhost:8080" : `http://${window.location.hostname}:8080`;
const BASE_URL = `${API_HOST}/api/leaves`;

class LeaveService {
    getAllLeaves() {
        return axios.get<Leave[]>(BASE_URL);
    }

    applyLeave(leave: Leave) {
        return axios.post<Leave>(BASE_URL, leave);
    }

    getEmployeeLeaves(name: string) {
        return axios.get<Leave[]>(`${BASE_URL}/employee/${name}`);
    }

    approveLeave(id: number) {
        return axios.put(`${BASE_URL}/${id}/Approved`);
    }

    rejectLeave(id: number) {
        return axios.put(`${BASE_URL}/${id}/Rejected`);
    }

    deleteLeave(id: number) {
        return axios.delete(`${BASE_URL}/${id}`);
    }
}

export default new LeaveService();
