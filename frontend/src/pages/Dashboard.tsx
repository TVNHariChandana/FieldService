
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function Dashboard() {
    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="top-bar">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back! Here's your field service overview.</p>
                    </div>

                    <Link to="/work-orders/create" className="primary-btn">
                        + New Work Order
                    </Link>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">▤</div>
                        <div>
                            <p>Total Work Orders</p>
                            <h2>24</h2>
                            <span>All work orders</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">◷</div>
                        <div>
                            <p>Open Orders</p>
                            <h2>12</h2>
                            <span>Needs attention</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">⚙</div>
                        <div>
                            <p>In Progress</p>
                            <h2>7</h2>
                            <span>Currently active</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">✓</div>
                        <div>
                            <p>Completed</p>
                            <h2>5</h2>
                            <span>Successfully completed</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Work Order Overview</h2>
                            <span>Current status</span>
                        </div>

                        <div className="status-row">
                            <span>New</span>
                            <strong>8</strong>
                        </div>

                        <div className="progress">
                            <div className="progress-blue"></div>
                        </div>

                        <div className="status-row">
                            <span>In Progress</span>
                            <strong>7</strong>
                        </div>

                        <div className="progress">
                            <div className="progress-orange"></div>
                        </div>

                        <div className="status-row">
                            <span>Completed</span>
                            <strong>5</strong>
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