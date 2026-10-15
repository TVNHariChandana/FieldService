import { Link } from "react-router-dom";

function RoleSelection() {
    return (
        <div className="role-selection-page">

            {/* Header */}
            <div className="role-selection-header">

                <div className="role-logo">
                    <div className="role-logo-icon">▦</div>
                    <h1>FieldService</h1>
                </div>

                <p>
                    Field Service Management Platform
                </p>

                <h2>
                    Welcome Back
                </h2>


            </div>


            {/* Role Cards */}
            <div className="role-cards">

                {/* Manager */}
                <div className="role-card">

                    <div className="role-icon">
                        👨‍💼
                    </div>

                    <h3>
                        Manager
                    </h3>

                    <p>
                        Manage work orders, customers,
                        sites, technicians and reports.
                    </p>

                    <Link
                        to="/manager-login"
                        className="role-login-btn"
                    >
                        Manager Login
                    </Link>

                </div>


                {/* Dispatcher */}
                <div className="role-card">

                    <div className="role-icon">
                        📋
                    </div>

                    <h3>
                        Dispatcher
                    </h3>

                    <p>
                        Manage work orders and assign
                        technicians to service tasks.
                    </p>

                    <Link
                        to="/dispatcher-login"
                        className="role-login-btn"
                    >
                        Dispatcher Login
                    </Link>

                </div>


                {/* Technician */}
                <div className="role-card">

                    <div className="role-icon">
                        🔧
                    </div>

                    <h3>
                        Technician
                    </h3>

                    <p>
                        View assigned work orders and
                        update service progress.
                    </p>

                    <Link
                        to="/technician-login"
                        className="role-login-btn"
                    >
                        Technician Login
                    </Link>

                </div>


                {/* Customer */}
                <div className="role-card">

                    <div className="role-icon">
                        👤
                    </div>

                    <h3>
                        Customer
                    </h3>

                    <p>
                        Track service requests, work orders
                        and customer sites.
                    </p>

                    <Link
                        to="/customer-login"
                        className="role-login-btn"
                    >
                        Customer Login
                    </Link>

                </div>

            </div>


            {/* Footer */}
            <div className="role-selection-footer">
                <p>
                    Secure access based on your assigned role
                </p>
            </div>

        </div>
    );
}

export default RoleSelection;