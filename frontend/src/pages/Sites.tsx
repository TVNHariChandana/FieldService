import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";

function Sites() {
    const [sites, setSites] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [customerId, setCustomerId] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadSites();
        loadCustomers();
    }, []);

    const loadSites = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/sites",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSites(response.data);
        } catch (error) {
            console.error("Failed to load sites:", error);
        }
    };

    const loadCustomers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/customers",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCustomers(response.data);
        } catch (error) {
            console.error("Failed to load customers:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const selectedCustomer = customers.find(
                (customer) => customer.id === Number(customerId)
            );

            if (!selectedCustomer) {
                alert("Please select a customer.");
                return;
            }

            const siteData = {
                address,
                city,
                state,
                pincode,
                customer: selectedCustomer,
            };

            if (editingId) {
                await axios.put(
                    `http://localhost:8080/sites/${editingId}`,
                    siteData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("Site updated successfully!");
            } else {
                await axios.post(
                    "http://localhost:8080/sites",
                    siteData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("Site created successfully!");
            }

            clearForm();
            loadSites();

        } catch (error) {
            console.error("Site operation failed:", error);
            alert("Failed to save site.");
        }
    };

    const handleEdit = (site: any) => {
        setEditingId(site.id);

        setAddress(site.address || "");
        setCity(site.city || "");
        setState(site.state || "");
        setPincode(site.pincode || "");

        if (site.customer) {
            setCustomerId(String(site.customer.id));
        } else {
            setCustomerId("");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this site?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/sites/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Site deleted successfully!");

            loadSites();

        } catch (error) {
            console.error("Failed to delete site:", error);
            alert("Failed to delete site.");
        }
    };

    const clearForm = () => {
        setAddress("");
        setCity("");
        setState("");
        setPincode("");
        setCustomerId("");
        setEditingId(null);
    };

    return (
        <div className="app-layout">

            <Navbar />

            <main className="main-content">

                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>Sites</h1>
                        <p>
                            Manage customer service locations and site details.
                        </p>
                    </div>
                </div>

                {/* Site Form */}
                <div className="form-card">

                    <h2>
                        {editingId
                            ? "Edit Site"
                            : "Add New Site"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* Address */}
                            <div className="form-group full-width">
                                <label>Address</label>

                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                    placeholder="Enter site address"
                                    required
                                />
                            </div>

                            {/* City */}
                            <div className="form-group">
                                <label>City</label>

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                    placeholder="Enter city"
                                    required
                                />
                            </div>

                            {/* State */}
                            <div className="form-group">
                                <label>State</label>

                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) =>
                                        setState(e.target.value)
                                    }
                                    placeholder="Enter state"
                                    required
                                />
                            </div>

                            {/* Pincode */}
                            <div className="form-group">
                                <label>Pincode</label>

                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) =>
                                        setPincode(e.target.value)
                                    }
                                    placeholder="Enter pincode"
                                    required
                                />
                            </div>

                            {/* Customer */}
                            <div className="form-group">
                                <label>Customer</label>

                                <select
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Customer
                                    </option>

                                    {customers.map((customer) => (
                                        <option
                                            key={customer.id}
                                            value={customer.id}
                                        >
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="form-actions">

                            {editingId && (
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={clearForm}
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                {editingId
                                    ? "Update Site"
                                    : "Add Site"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* Sites List */}
                <div className="dashboard-card">

                    <div className="page-header">
                        <div>
                            <h2>Site List</h2>
                            <p>
                                View and manage customer service locations.
                            </p>
                        </div>
                    </div>

                    {sites.length === 0 ? (
                        <p>No sites available.</p>
                    ) : (
                        <div className="table-container">

                            <table>

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Address</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Pincode</th>
                                    <th>Customer</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {sites.map((site) => (
                                    <tr key={site.id}>

                                        <td>{site.id}</td>

                                        <td>{site.address}</td>

                                        <td>{site.city}</td>

                                        <td>{site.state}</td>

                                        <td>{site.pincode}</td>

                                        <td>
                                            {site.customer
                                                ? site.customer.name
                                                : "N/A"}
                                        </td>

                                        <td>

                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    handleEdit(site)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(site.id)
                                                }
                                            >
                                                Delete
                                            </button>

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

export default Sites;