
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.tsx";
import axios from "axios";

interface WorkOrder {
    id: number;
    code: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    slaDueAt: string | null;
    customer?: {
        id: number;
        name: string;
    };
    site?: {
        id: number;
        city: string;
        state: string;
    };
    technician?: {
        id: number;
        name: string;
    };
}

interface ServiceRequest {
    id: number;
    title: string | null;
    description: string;
    status: string;
    priority: string;
    customer?: {
        id: number;
        name: string;
        email?: string;
        phone?: string;
    };
    site?: {
        id: number;
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
    } | null;
}

function Dispatcher() {

    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

    const [loading, setLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(true);

    useEffect(() => {
        fetchWorkOrders();
        fetchServiceRequests();
    }, []);

    const fetchWorkOrders = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/work-orders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setWorkOrders(response.data);

        } catch (error) {

            console.error("Error fetching work orders:", error);
            alert("Failed to load work orders.");

        } finally {

            setLoading(false);

        }
    };

    const fetchServiceRequests = async () => {

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/service-requests",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("SERVICE REQUESTS:", response.data);

            setServiceRequests(response.data);

        } catch (error) {

            console.error("Error fetching service requests:", error);
            alert("Failed to load service requests.");

        } finally {

            setRequestLoading(false);

        }
    };

    return (
        <div className="app-layout">

            <Navbar />

            <main className="main-content">

                <div className="page-header">
                    <div>
                        <h1>Dispatcher Dashboard</h1>
                        <p>Manage service requests, work orders and technicians.</p>
                    </div>
                </div>

                {/* Dashboard Cards */}

                <div className="dashboard-grid">

                    <div className="dashboard-card">
                        <h3>Service Requests</h3>
                        <p>
                            {serviceRequests.length} service request(s) received.
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Work Orders</h3>
                        <p>
                            {workOrders.length} work order(s).
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Customers</h3>
                        <p>View and manage customers.</p>
                        <a href="/customers">
                            View Customers
                        </a>
                    </div>

                    <div className="dashboard-card">
                        <h3>Sites</h3>
                        <p>View and manage customer sites.</p>
                        <a href="/sites">
                            View Sites
                        </a>
                    </div>

                </div>

                {/* Service Requests */}

                <div
                    className="dashboard-card"
                    style={{ marginTop: "25px" }}
                >

                    <h2>Service Requests</h2>

                    {requestLoading ? (

                        <p>Loading service requests...</p>

                    ) : serviceRequests.length === 0 ? (

                        <p>No service requests found.</p>

                    ) : (

                        <div style={{ overflowX: "auto" }}>

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse"
                                }}
                            >

                                <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Customer</th>
                                    <th>Action</th>
                                </tr>

                                </thead>

                                <tbody>

                                {serviceRequests.map((request) => (

                                    <tr key={request.id}>

                                        <td>{request.id}</td>

                                        <td>
                                            {request.title || "Service Request"}
                                        </td>

                                        <td>
                                            {request.description}
                                        </td>

                                        <td>
                                            {request.priority}
                                        </td>

                                        <td>
                                            {request.status}
                                        </td>

                                        <td>
                                            {request.customer?.name || "Unknown"}
                                        </td>

                                        <td>

                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    window.location.href =
                                                        `/work-orders/create?serviceRequestId=${request.id}`
                                                }
                                            >
                                                Create Work Order
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                {/* Work Orders */}

                <div
                    className="dashboard-card"
                    style={{ marginTop: "25px" }}
                >

                    <h2>Work Orders</h2>

                    {loading ? (

                        <p>Loading work orders...</p>

                    ) : workOrders.length === 0 ? (

                        <p>No work orders found.</p>

                    ) : (

                        <div style={{ overflowX: "auto" }}>

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse"
                                }}
                            >

                                <thead>

                                <tr>
                                    <th>Code</th>
                                    <th>Title</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Customer</th>
                                    <th>Technician</th>
                                </tr>

                                </thead>

                                <tbody>

                                {workOrders.map((workOrder) => (

                                    <tr key={workOrder.id}>

                                        <td>{workOrder.code}</td>

                                        <td>{workOrder.title}</td>

                                        <td>{workOrder.priority}</td>

                                        <td>{workOrder.status}</td>

                                        <td>
                                            {workOrder.customer?.name || "Not assigned"}
                                        </td>

                                        <td>
                                            {workOrder.technician?.name || "Not assigned"}
                                        </td>

                                    </tr>

                                ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Dispatcher;