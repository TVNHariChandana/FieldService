import { useEffect, useState } from "react";
import { getWorkOrders } from "../services/workOrderService";
import { useNavigate } from "react-router-dom";

function KanbanBoard() {
    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadWorkOrders();
    }, []);

    const loadWorkOrders = async () => {
        try {
            const data = await getWorkOrders();
            setWorkOrders(data);
        } catch (error) {
            console.error("Failed to load work orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        "NEW",
        "ASSIGNED",
        "IN_PROGRESS",
        "ON_HOLD",
        "COMPLETED",
        "CLOSED",
        "CANCELLED",
    ];

    if (loading) {
        return <p>Loading Kanban Board...</p>;
    }

    return (
        <div>
            <h1>Work Order Kanban Board</h1>

            <button onClick={() => navigate("/work-orders")}>
                Back to Work Orders
            </button>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    overflowX: "auto",
                    marginTop: "20px",
                    paddingBottom: "20px",
                }}
            >
                {columns.map((status) => {
                    const orders = workOrders.filter(
                        (workOrder) => workOrder.status === status
                    );

                    return (
                        <div
                            key={status}
                            style={{
                                minWidth: "280px",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "15px",
                                backgroundColor: "#f5f5f5",
                            }}
                        >
                            <h2>
                                {status} ({orders.length})
                            </h2>

                            {orders.length === 0 ? (
                                <p>No work orders</p>
                            ) : (
                                orders.map((workOrder) => (
                                    <div
                                        key={workOrder.id}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "6px",
                                            padding: "12px",
                                            marginBottom: "12px",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        <strong>{workOrder.code}</strong>

                                        <p>
                                            <strong>Title:</strong>{" "}
                                            {workOrder.title}
                                        </p>

                                        <p>
                                            <strong>Description:</strong>{" "}
                                            {workOrder.description}
                                        </p>

                                        <p>
                                            <strong>Priority:</strong>{" "}
                                            {workOrder.priority}
                                        </p>

                                        <p>
                                            <strong>Customer:</strong>{" "}
                                            {workOrder.customer?.name ||
                                                "Not assigned"}
                                        </p>

                                        <p>
                                            <strong>Site:</strong>{" "}
                                            {workOrder.site?.city ||
                                                "Not assigned"}
                                        </p>

                                        <p>
                                            <strong>Technician:</strong>{" "}
                                            {workOrder.technician?.name ||
                                                "Not assigned"}
                                        </p>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/work-orders/edit/${workOrder.id}`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default KanbanBoard;