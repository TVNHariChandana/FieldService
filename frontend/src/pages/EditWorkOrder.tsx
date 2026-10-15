import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditWorkOrder() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [slaDueAt, setSlaDueAt] = useState("");

    useEffect(() => {
        loadWorkOrder();
    }, []);

    const loadWorkOrder = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080/work-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const workOrder = response.data.find(
                (item: any) => item.id === Number(id)
            );

            if (workOrder) {
                setCode(workOrder.code || "");
                setTitle(workOrder.title || "");
                setDescription(workOrder.description || "");
                setPriority(workOrder.priority || "");
                setStatus(workOrder.status || "");
                setSlaDueAt(
                    workOrder.slaDueAt
                        ? workOrder.slaDueAt.slice(0, 16)
                        : ""
                );
            }
        } catch (error) {
            console.error("Failed to load work order:", error);
            alert("Failed to load work order.");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/work-orders/${id}`,
                {
                    code,
                    title,
                    description,
                    priority,
                    status,
                    slaDueAt: slaDueAt || null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Work order updated successfully!");

            navigate("/work-orders");
        } catch (error) {
            console.error("Failed to update work order:", error);
            alert("Failed to update work order.");
        }
    };

    return (
        <div>
            <h1>Edit Work Order</h1>

            <form onSubmit={handleUpdate}>
                <div>
                    <label>Code</label>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label>Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required
                    >
                        <option value="">Select Priority</option>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>
                </div>

                <div>
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="NEW">NEW</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="ON_HOLD">ON_HOLD</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CLOSED">CLOSED</option>
                        <option value="CANCELLED">CANCELLED</option>
                    </select>
                </div>

                <div>
                    <label>SLA Due At</label>
                    <input
                        type="datetime-local"
                        value={slaDueAt}
                        onChange={(e) => setSlaDueAt(e.target.value)}
                    />
                </div>

                <button type="submit">Update Work Order</button>

                <button
                    type="button"
                    onClick={() => navigate("/work-orders")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditWorkOrder;