import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import Navbar from "../components/Navbar";

function Parts() {
    const [parts, setParts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [partNumber, setPartNumber] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadParts();
    }, []);
    const loadParts = async () => {
        try {
            const data = await apiRequest("/parts");
            setParts(data);
        } catch (error) {
            console.error("Failed to load parts:", error);
            alert("Failed to load parts.");
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const partData = {
                name,
                partNumber,
                stockQuantity: Number(stockQuantity),
                price: Number(price),
                quantity: Number(quantity),
            };

            if (editingId !== null) {
                await apiRequest(`/parts/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(partData),
                });

                alert("Part updated successfully!");
            } else {
                await apiRequest("/parts", {
                    method: "POST",
                    body: JSON.stringify(partData),
                });

                alert("Part added successfully!");
            }

            clearForm();
            await loadParts();
        } catch (error) {
            console.error("Part operation failed:", error);
            alert(
                error instanceof Error
                    ? `Failed to save part: ${error.message}`
                    : "Failed to save part."
            );
        }
    };
    const handleEdit = (part: any) => {
        setEditingId(part.id);

        setName(part.name || "");
        setPartNumber(part.partNumber || "");
        setStockQuantity(
            part.stockQuantity !== null && part.stockQuantity !== undefined
                ? String(part.stockQuantity)
                : ""
        );
        setPrice(
            part.price !== null && part.price !== undefined
                ? String(part.price)
                : ""
        );
        setQuantity(
            part.quantity !== null && part.quantity !== undefined
                ? String(part.quantity)
                : ""
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this part?")) {
            return;
        }

        try {
            await apiRequest(`/parts/${id}`, {
                method: "DELETE",
            });

            alert("Part deleted successfully!");
            await loadParts();
        } catch (error) {
            console.error("Failed to delete part:", error);
            alert(
                error instanceof Error
                    ? `Failed to delete part: ${error.message}`
                    : "Failed to delete part."
            );
        }
    };
    const clearForm = () => {
        setName("");
        setPartNumber("");
        setStockQuantity("");
        setPrice("");
        setQuantity("");
        setEditingId(null);
    };

    return (
        <div className="app-layout">

            <Navbar />

            <main className="main-content">

                {/* Page Header */}
                <div className="page-header">
                    <div>
                        <h1>Parts & Inventory</h1>
                        <p>
                            Manage parts, stock availability and inventory.
                        </p>
                    </div>
                </div>

                {/* Add / Edit Part Form */}
                <div className="form-card">

                    <h2>
                        {editingId
                            ? "Edit Part"
                            : "Add New Part"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* Part Name */}
                            <div className="form-group">
                                <label>Part Name</label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter part name"
                                    required
                                />
                            </div>

                            {/* Part Number */}
                            <div className="form-group">
                                <label>Part Number</label>

                                <input
                                    type="text"
                                    value={partNumber}
                                    onChange={(e) =>
                                        setPartNumber(e.target.value)
                                    }
                                    placeholder="Enter part number"
                                    required
                                />
                            </div>

                            {/* Stock Quantity */}
                            <div className="form-group">
                                <label>Stock Quantity</label>

                                <input
                                    type="number"
                                    min="0"
                                    value={stockQuantity}
                                    onChange={(e) =>
                                        setStockQuantity(e.target.value)
                                    }
                                    placeholder="Enter stock quantity"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div className="form-group">
                                <label>Price</label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    placeholder="Enter price"
                                    required
                                />
                            </div>

                            {/* Quantity */}
                            <div className="form-group">
                                <label>Quantity</label>

                                <input
                                    type="number"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(e.target.value)
                                    }
                                    placeholder="Enter quantity"
                                    required
                                />
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
                                    ? "Update Part"
                                    : "Add Part"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* Parts List */}
                <div className="dashboard-card">

                    <div className="page-header">
                        <div>
                            <h2>Parts Inventory</h2>
                            <p>
                                View and manage available parts and stock.
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading parts...</p>
                    ) : parts.length === 0 ? (

                        <div>
                            <h2>No Parts Available</h2>
                            <p>
                                Add parts to start managing your inventory.
                            </p>
                        </div>

                    ) : (

                        <div className="table-container">

                            <table>

                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Part Name</th>
                                    <th>Part Number</th>
                                    <th>Stock Quantity</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>

                                <tbody>

                                {parts.map((part) => (
                                    <tr key={part.id}>

                                        <td>{part.id}</td>

                                        <td>{part.name}</td>

                                        <td>{part.partNumber}</td>

                                        <td>
                                            {part.stockQuantity}
                                        </td>

                                        <td>
                                            ₹{part.price}
                                        </td>

                                        <td>
                                            {part.quantity}
                                        </td>

                                        <td>

                                            <button
                                                className="secondary-btn"
                                                onClick={() =>
                                                    handleEdit(part)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(part.id)
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

export default Parts;