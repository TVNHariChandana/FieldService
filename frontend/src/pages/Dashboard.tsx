import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";
import NotificationBell from "../components/NotificationBell";
interface ServiceRequest {
    id: number;
    title: string | null;
    description: string;
    status: string;
    priority: string;
    customer?: {
        id: number;
        name: string;
    };
}

function Dashboard() {
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(0);
    const [inProgress, setInProgress] = useState(0);
    const [completed, setCompleted] = useState(0);

    const [serviceRequests, setServiceRequests] =
        useState<ServiceRequest[]>([]);

    const [requestLoading, setRequestLoading] = useState(true);

    useEffect(() => {


        const loadDashboard = async () => {
            try {

                const [totalData, openData, progressData, completedData] =
                    await Promise.all([
                        apiRequest("/dashboard/total-work-orders"),
                        apiRequest("/dashboard/open-work-orders"),
                        apiRequest("/dashboard/in-progress-work-orders"),
                        apiRequest("/dashboard/completed-work-orders"),
                    ]);

                setTotal(Number(totalData));
                setOpen(Number(openData));
                setInProgress(Number(progressData));
                setCompleted(Number(completedData));

            } catch (error) {
                console.error("Failed to load dashboard:", error);
            }
        };

        loadDashboard();
    }, []);
    useEffect(() => {
        const loadServiceRequests = async () => {
            try {
                const data = await apiRequest("/service-requests");
                setServiceRequests(data);
            } catch (error) {
                console.error("Failed to load service requests:", error);
            } finally {
                setRequestLoading(false);
            }
        };

        loadServiceRequests();
    }, []);
    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="top-bar dashboard-page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back! Here's your field service overview.</p>
                    </div>

                    <div className="top-bar-actions">
                        <NotificationBell />

                        <Link to="/work-orders/create" className="primary-btn">
                            + New Work Order
                        </Link>
                    </div>
                </div>

                <div className="stats-grid dashboard-stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">▤</div>
                        <div>
                            <p>Total Work Orders</p>
                            <h2>{total}</h2>
                            <span>All work orders</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">◷</div>
                        <div>
                            <p>Open Orders</p>
                            <h2>{open}</h2>
                            <span>Needs attention</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">⚙</div>
                        <div>
                            <p>In Progress</p>
                            <h2>{inProgress}</h2>
                            <span>Currently active</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">✓</div>
                        <div>
                            <p>Completed</p>
                            <h2>{completed}</h2>
                            <span>Successfully completed</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card" style={{ marginBottom: "25px" }}>
                    <div className="card-header">
                        <h2>Customer Service Requests</h2>
                        <span>{serviceRequests.length} request(s)</span>
                    </div>

                    {requestLoading ? (
                        <p>Loading service requests...</p>
                    ) : serviceRequests.length === 0 ? (
                        <p>No service requests found.</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                                        <td>{request.title || "Service Request"}</td>
                                        <td>{request.description}</td>
                                        <td>{request.priority}</td>
                                        <td>{request.status}</td>
                                        <td>{request.customer?.name || "Unknown"}</td>
                                        <td>
                                            <Link
                                                to={`/work-orders/create?serviceRequestId=${request.id}`}
                                                className="action-btn"
                                            >
                                                Create Work Order
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Work Order Overview</h2>
                            <span>Current status</span>
                        </div>

                        <div className="status-row">
                            <span>New</span>
                            <strong>{open}</strong>
                        </div>

                        <div className="progress">
                            <div className="progress-blue"></div>
                        </div>

                        <div className="status-row">
                            <span>In Progress</span>
                            <strong>{inProgress}</strong>
                        </div>

                        <div className="progress">
                            <div className="progress-orange"></div>
                        </div>

                        <div className="status-row">
                            <span>Completed</span>
                            <strong>{completed}</strong>
                        </div>

                        <div className="progress">
                            <div className="progress-green"></div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Quick Actions</h2>
                        </div>

                        <Link
                            to="/work-orders/create"
                            className="action-btn"
                        >
                            + Create Work Order
                        </Link>
                        <Link
                            to="/work-orders"
                            className="action-btn"
                        >
                            View Work Orders
                        </Link>


                        <Link
                            to="/customers"
                            className="action-btn"
                        >
                            Manage Customers
                        </Link>

                        <Link
                            to="/sites"
                            className="action-btn"
                        >
                            Manage Sites
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;