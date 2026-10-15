import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";

function Customers() {
    const [customers, setCustomers] = useState<any[]>([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadCustomers();
    }, []);

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

            const customerData = {
                name,
                email,
                phone,
            };

            if (editingId) {
                await axios.put(
                    `http://localhost:8080/customers/${editingId}`,
                    customerData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("Customer updated successfully!");
            } else {
                await axios.post(
                    "http://localhost:8080/customers",
                    customerData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert("Customer created successfully!");
            }

            setName("");
            setEmail("");
            setPhone("");
            setEditingId(null);

            loadCustomers();

        } catch (error) {
            console.error("Customer operation failed:", error);
            alert("Failed to save customer.");
        }
    };

    const handleEdit = (customer: any) => {
        setEditingId(customer.id);
        setName(customer.name);
        setEmail(customer.email);
        setPhone(customer.phone);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/customers/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Customer deleted successfully!");

            loadCustomers();

        } catch (error) {
            console.error("Failed to delete customer:", error);
            alert("Failed to delete customer.");
        }
    };

    const handleCancel = () => {
        setName("");
        setEmail("");
        setPhone("");
        setEditingId(null);
    };

    return (
        <div className="app-layout">

            <Navbar />

            <main className="main-content">

                <div className="page-header">
                    <div>
                        <h1>Customers</h1>
                        <p>
                            Manage customers and their contact information.
                        </p>
                    </div>
                </div>

                {/* Customer Form */}
                <div className="form-card">

                    <h2>
                        {editingId
                            ? "Edit Customer"
                            : "Add New Customer"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Name</label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter customer name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>

                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-actions">

                            {editingId && (
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                {editingId
                                    ? "Update Customer"
                                    : "Add Customer"}
                            </button>

                        </div>

                    </form>
                </div>

                {/* Customer List */}
                <div className="dashboard-card">

                    <div className="page-header">
                        <div>
                            <h2>Customer List</h2>
                            <p>View and manage existing customers.</p>
                        </div>
                    </div>

                    {customers.length === 0 ? (
                        <p>No customers available.</p>
                    ) : (
                        <div className="table-container">

                            <table>

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {customers.map((customer) => (
                                    <tr key={customer.id}>

                                        <td>{customer.id}</td>

                                        <td>{customer.name}</td>

                                        <td>{customer.email}</td>

                                        <td>{customer.phone}</td>

                                        <td>

                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    handleEdit(customer)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(customer.id)
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

export default Customers;