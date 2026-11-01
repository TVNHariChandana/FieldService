import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const role = localStorage.getItem("role");
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <aside className={`sidebar responsive-sidebar ${menuOpen ? "mobile-open" : ""}`}>
            <div className="logo">
                <div className="logo-icon">▦</div>
                <span>FieldService</span>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    ☰
                </button>
            </div>

            <nav className="side-nav" onClick={() => setMenuOpen(false)}>
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

                        <Link to="/chat" className="nav-item">
                            <span>☏</span> Chat & Conversations
                        </Link>

                        <Link to="/support" className="nav-item">
                            <span>♧</span> Support
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

                        <Link to="/chat" className="nav-item">
                            <span>☏</span> Chat & Conversations
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

                        <Link to="/chat" className="nav-item">
                            <span>☏</span> Chat & Conversations
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

                        <Link to="/chat" className="nav-item">
                            <span>☏</span> Chat & Conversations
                        </Link>

                        <Link to="/support" className="nav-item">
                            <span>♧</span> Support
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