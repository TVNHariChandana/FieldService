import { Link } from "react-router-dom";

function Navbar() {
    const role = localStorage.getItem("role");

    return (
        <aside className="sidebar">

            <div className="logo">
                <div className="logo-icon">▦</div>
                <span>FieldService</span>
            </div>

            <nav className="side-nav">

                {/* Manager */}
                {role === "MANAGER" && (
                    <>
                        <Link to="/dashboard" className="nav-item">
                            <span>⌂</span> Dashboard
                        </Link>

                        <Link to="/work-orders" className="nav-item">
                            <span>▤</span> Work Orders
                        </Link>

                        <Link to="/customers" className="nav-item">
                            <span>♙</span> Customers
                        </Link>

                        <Link to="/sites" className="nav-item">
                            <span>⌖</span> Sites
                        </Link>

                        <Link to="/parts" className="nav-item">
                            <span>◈</span> Parts
                        </Link>
                    </>
                )}

                {/* Dispatcher */}
                {role === "DISPATCHER" && (
                    <>
                        <Link to="/dispatcher" className="nav-item">
                            <span>⌂</span> Dashboard
                        </Link>

                        <Link to="/work-orders" className="nav-item">
                            <span>▤</span> Work Orders
                        </Link>

                        <Link to="/customers" className="nav-item">
                            <span>♙</span> Customers
                        </Link>

                        <Link to="/sites" className="nav-item">
                            <span>⌖</span> Sites
                        </Link>
                    </>
                )}

                {/* Technician */}
                {role === "TECHNICIAN" && (
                    <>
                        <Link to="/technician" className="nav-item">
                            <span>⌂</span> Dashboard
                        </Link>

                        <Link to="/work-orders" className="nav-item">
                            <span>▤</span> My Work Orders
                        </Link>

                        <Link to="/parts" className="nav-item">
                            <span>◈</span> Parts
                        </Link>
                    </>
                )}

                {/* Customer */}
                {role === "CUSTOMER" && (
                    <>
                        <Link to="/customer" className="nav-item">
                            <span>⌂</span> Dashboard
                        </Link>

                        <Link to="/work-orders" className="nav-item">
                            <span>▤</span> My Work Orders
                        </Link>

                        <Link to="/sites" className="nav-item">
                            <span>⌖</span> My Sites
                        </Link>
                    </>
                )}

            </nav>

            <div className="sidebar-bottom">
                <p>Field Service</p>
                <small>Management Platform</small>
            </div>

        </aside>
    );
}

export default Navbar;