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

// Smart Base URL:
// 1. If "localhost" or IP address (common for local dev), use port 8080.
// 2. If a domain name (Prod/Netlify), use relative path to use the proxy.
const isLocal = window.location.hostname === "localhost" || window.location.hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
const API_HOST = isLocal ? `http://${window.location.hostname}:8080` : "";
const BASE_URL = isLocal ? `${API_HOST}/api/leaves` : "/api/leaves";

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
