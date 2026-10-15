import Navbar from "../components/Navbar";

function Technician() {
    return (
        <div className="app-layout">

            <Navbar />

            <main className="main-content">

                <div className="page-header">
                    <div>
                        <h1>Technician Dashboard</h1>

                        <p>
                            View your assigned work orders and update
                            their status.
                        </p>
                    </div>
                </div>

                <div className="dashboard-grid">

                    {/* My Work Orders */}
                    <div className="dashboard-card">

                        <h3>My Work Orders</h3>

                        <p>
                            View the work orders assigned to you.
                        </p>

                        <button
                            className="action-btn"
                            onClick={() =>
                                window.location.href = "/work-orders"
                            }
                        >
                            View My Work Orders
                        </button>

                    </div>

                    {/* Status Updates */}
                    <div className="dashboard-card">

                        <h3>Status Updates</h3>

                        <p>
                            Update the progress of your assigned
                            work orders.
                        </p>

                        <button
                            className="action-btn"
                            onClick={() =>
                                window.location.href = "/work-orders"
                            }
                        >
                            Update Status
                        </button>

                    </div>

                    {/* Parts */}
                    <div className="dashboard-card">

                        <h3>Parts</h3>

                        <p>
                            View parts required for your service work.
                        </p>

                        <button
                            className="action-btn"
                            onClick={() =>
                                window.location.href = "/parts"
                            }
                        >
                            View Parts
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Technician;