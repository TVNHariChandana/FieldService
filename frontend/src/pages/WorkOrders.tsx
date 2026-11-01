import { Fragment, useEffect, useState } from "react";
import { getWorkOrders,getCustomerWorkOrders } from "../services/workOrderService";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";
import {
    uploadAttachment,
    deleteAttachment,
    type Attachment, downloadAttachment,
} from "../services/attachmentService";
import {useNavigate, useSearchParams} from "react-router-dom";

function WorkOrders() {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [searchParams] = useSearchParams();
    const workOrderId = searchParams.get("id");

    useEffect(() => {
        if (workOrderId) {
            setSearchTerm(workOrderId);
            setCurrentPage(1);
        }
    }, [workOrderId]);
    const [attachments, setAttachments] = useState<Record<number, Attachment[]>>({});
    const [uploadingWorkOrder, setUploadingWorkOrder] = useState<number | null>(null);
    const [attachmentErrors, setAttachmentErrors] = useState<Record<number, string>>({});
    const [expandedAttachmentOrder, setExpandedAttachmentOrder] = useState<number | null>(null);

    const [selectedTechnician, setSelectedTechnician] = useState<Record<number, string>>({});
    const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});

    const itemsPerPage = 5;

    useEffect(() => {
        void loadWorkOrders();

        if (role === "MANAGER" || role === "DISPATCHER") {
            void loadTechnicians();
        }
        // Initial load only; role comes from localStorage for this session.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadWorkOrders = async () => {
        try {
            const data =
                role === "CUSTOMER"
                    ? await getCustomerWorkOrders()
                    : await getWorkOrders();

            setWorkOrders(data);
        } catch (error) {
            console.error("Failed to load work orders:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to load work orders."
            );
        } finally {
            setLoading(false);
        }
    };


    const loadTechnicians = async () => {
        try {
            const data = await apiRequest("/technicians");
            setTechnicians(data);
        } catch (error) {
            console.error("Failed to load technicians:", error);
        }
    };

    const handleAssignTechnician = async (workOrderId: number) => {
        const technicianId = selectedTechnician[workOrderId];

        if (!technicianId) {
            alert("Please select a technician first.");
            return;
        }

        try {
            await apiRequest(`/work-orders/${workOrderId}/assign/${technicianId}`, {
                method: "PUT",
            });
            alert("Technician assigned successfully!");
            setSelectedTechnician((previous) => ({ ...previous, [workOrderId]: "" }));
            await loadWorkOrders();
        } catch (error) {
            console.error("Failed to assign technician:", error);
            alert(error instanceof Error ? `Failed to assign technician: ${error.message}` : "Failed to assign technician.");
        }
    };

    const handleStatusUpdate = async (workOrderId: number) => {
        const status = selectedStatus[workOrderId];
        if (!status) {
            alert("Please select a status.");
            return;
        }

        try {
            await apiRequest(
                `/work-orders/${workOrderId}/status?status=${encodeURIComponent(status)}`,
                { method: "PUT" }
            );
            alert("Work order status updated successfully!");
            setSelectedStatus((previous) => ({ ...previous, [workOrderId]: "" }));
            await loadWorkOrders();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert(error instanceof Error ? `Status update failed: ${error.message}` : "Status update failed. Please check the backend response.");
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this work order?");
        if (!confirmDelete) return;

        try {
            await apiRequest(`/work-orders/${id}`, { method: "DELETE" });
            alert("Work order deleted successfully!");
            await loadWorkOrders();
        } catch (error) {
            console.error("Failed to delete work order:", error);
            alert(error instanceof Error ? `Failed to delete work order: ${error.message}` : "Failed to delete work order.");
        }
    };

    const loadAttachments = async (workOrderId: number) => {
        try {
            const data = await apiRequest(`/attachment/work-order/${workOrderId}`);
            setAttachments((previous) => ({ ...previous, [workOrderId]: data as Attachment[] }));
            setAttachmentErrors((previous) => ({ ...previous, [workOrderId]: "" }));
        } catch (error) {
            console.error("Failed to load attachments:", error);
            setAttachmentErrors((previous) => ({
                ...previous,
                [workOrderId]: error instanceof Error ? error.message : "Failed to load attachments.",
            }));
        }
    };

    const handleAttachmentUpload = async (workOrderId: number, file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            alert("Maximum file size is 10 MB.");
            return;
        }

        const allowedTypes = ["image/png", "image/jpeg", "video/mp4"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only PNG, JPEG, and MP4 files are allowed.");
            return;
        }

        setUploadingWorkOrder(workOrderId);
        setAttachmentErrors((previous) => ({ ...previous, [workOrderId]: "" }));
        try {
            await uploadAttachment(workOrderId, file);
            alert("File uploaded successfully!");
            await loadAttachments(workOrderId);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Upload failed.";
            setAttachmentErrors((previous) => ({ ...previous, [workOrderId]: message }));
            alert(`Upload failed: ${message}`);
        } finally {
            setUploadingWorkOrder(null);
        }
    };

    const handleAttachmentDelete = async (workOrderId: number, attachmentId: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this attachment?");
        if (!confirmed) return;

        try {
            await deleteAttachment(attachmentId);
            await loadAttachments(workOrderId);
            alert("Attachment deleted successfully!");
        } catch (error) {
            alert(error instanceof Error ? `Delete failed: ${error.message}` : "Delete failed.");
        }
    };

    const toggleAttachments = async (workOrderId: number) => {
        if (expandedAttachmentOrder === workOrderId) {
            setExpandedAttachmentOrder(null);
            return;
        }
        setExpandedAttachmentOrder(workOrderId);
        await loadAttachments(workOrderId);
    };

    const filteredWorkOrders = workOrders.filter((workOrder) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            String(workOrder.id).includes(search) ||
            workOrder.code?.toLowerCase().includes(search) ||
            workOrder.title?.toLowerCase().includes(search) ||
            workOrder.description?.toLowerCase().includes(search) ||
            workOrder.priority?.toLowerCase().includes(search) ||
            workOrder.status?.toLowerCase().includes(search);
               const matchesStatus = statusFilter === "" || workOrder.status === statusFilter;
        const matchesPriority = priorityFilter === "" || workOrder.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedWorkOrders = filteredWorkOrders.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPriorityFilter(e.target.value);
        setCurrentPage(1);
    };

    const columnCount =
        5 +
        (role !== "CUSTOMER" ? 1 : 0) +
        1 +
        (role === "MANAGER" ? 1 : 0);

    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <div className="page-header work-orders-header">
                    <div>
                        <h1>{role === "TECHNICIAN" ? "My Work Orders" : "Work Orders"}</h1>
                        <p>
                            {role === "TECHNICIAN"
                                ? "View your assigned work orders and update their status."
                                : "Manage, assign and track your field service work orders."}
                        </p>
                    </div>
                    <div className="header-actions">
                        {(role === "MANAGER" || role === "DISPATCHER") && (
                            <button className="secondary-btn" onClick={() => navigate("/work-orders/board")}>
                                Kanban Board
                            </button>
                        )}
                        {role === "MANAGER" && (
                            <button className="primary-btn" onClick={() => navigate("/work-orders/create")}>
                                + Create Work Order
                            </button>
                        )}
                    </div>
                </div>

                <div className="dashboard-card work-order-filters">
                    <div className="filter-row">
                        <div className="search-box">
                            <label>Search</label>
                            <input type="text" placeholder="Search work orders..." value={searchTerm} onChange={handleSearchChange} />
                        </div>
                        <div className="filter-box">
                            <label>Status</label>
                            <select value={statusFilter} onChange={handleStatusFilterChange}>
                                <option value="">All Statuses</option>
                                <option value="NEW">NEW</option>
                                <option value="ASSIGNED">ASSIGNED</option>
                                <option value="IN_PROGRESS">IN_PROGRESS</option>
                                <option value="ON_HOLD">ON_HOLD</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CLOSED">CLOSED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>
                        <div className="filter-box">
                            <label>Priority</label>
                            <select value={priorityFilter} onChange={handlePriorityFilterChange}>
                                <option value="">All Priorities</option>
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                                <option value="CRITICAL">CRITICAL</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card work-orders-list-card">
                    <div className="table-header">
                        <div>
                            <h2>{role === "TECHNICIAN" ? "My Work Order List" : "Work Order List"}</h2>
                            <p>{filteredWorkOrders.length} work order{filteredWorkOrders.length !== 1 ? "s" : ""} found</p>
                        </div>
                    </div>

                    {loading ? (
                        <p>Loading work orders...</p>
                    ) : workOrders.length === 0 ? (
                        <div className="empty-state">
                            <h2>No Work Orders</h2>
                            <p>{role === "TECHNICIAN" ? "No work orders are currently assigned to you." : "Create a work order to get started."}</p>
                            {role === "MANAGER" && (
                                <button className="primary-btn" onClick={() => navigate("/work-orders/create")}>
                                    + Create Work Order
                                </button>
                            )}
                        </div>
                    ) : filteredWorkOrders.length === 0 ? (
                        <div className="empty-state">
                            <h2>No Matching Work Orders</h2>
                            <p>Try changing your search or filters.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    {role !== "CUSTOMER" && <th>Technician</th>}
                                    <th>Change Status</th>
                                    {role === "MANAGER" && <th>Actions</th>}
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedWorkOrders.map((workOrder) => (
                                    <Fragment key={workOrder.id}>
                                        <tr>
                                            <td><strong>{workOrder.code}</strong></td>
                                            <td>
                                                <div>
                                                    <strong>{workOrder.title}</strong>
                                                    <div style={{ marginTop: "8px" }}>
                                                        <button
                                                            type="button"
                                                            className="secondary-btn"
                                                            onClick={() => void toggleAttachments(workOrder.id)}
                                                        >
                                                            {expandedAttachmentOrder === workOrder.id ? "Hide Attachments" : "Attachments"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><div className="description-cell">{workOrder.description}</div></td>
                                            <td>
                                                    <span className={`priority-badge priority-${workOrder.priority?.toLowerCase()}`}>
                                                        {workOrder.priority}
                                                    </span>
                                            </td>
                                            <td>
                                                    <span className={`status-badge status-${workOrder.status?.toLowerCase()}`}>
                                                        {workOrder.status}
                                                    </span>
                                            </td>
                                            {role !== "CUSTOMER" && (
                                                <td>
                                                    {(role === "MANAGER" || role === "DISPATCHER") ? (
                                                        <div className="inline-action">
                                                            <span>{workOrder.technician?.name || "Not assigned"}</span>
                                                            <select
                                                                value={selectedTechnician[workOrder.id] || ""}
                                                                onChange={(e) => setSelectedTechnician((previous) => ({ ...previous, [workOrder.id]: e.target.value }))}
                                                            >
                                                                <option value="">Select Technician</option>
                                                                {technicians.map((technician) => (
                                                                    <option key={technician.id} value={technician.id}>{technician.name}</option>
                                                                ))}
                                                            </select>
                                                            <button className="small-primary-btn" onClick={() => void handleAssignTechnician(workOrder.id)}>
                                                                {workOrder.technician?.name ? "Reassign" : "Assign"}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span>{workOrder.technician?.name || "Not assigned"}</span>
                                                    )}
                                                </td>
                                            )}
                                            <td>
                                                {(role === "MANAGER" || role === "TECHNICIAN") ? (
                                                    <div className="inline-action">
                                                        <select
                                                            value={selectedStatus[workOrder.id] || ""}
                                                            onChange={(e) => setSelectedStatus((previous) => ({ ...previous, [workOrder.id]: e.target.value }))}
                                                        >
                                                            <option value="">Select Status</option>
                                                            {workOrder.status === "ASSIGNED" && <option value="IN_PROGRESS">IN_PROGRESS</option>}
                                                            {workOrder.status === "IN_PROGRESS" && (
                                                                <>
                                                                    <option value="ON_HOLD">ON_HOLD</option>
                                                                    <option value="COMPLETED">COMPLETED</option>
                                                                </>
                                                            )}
                                                            {workOrder.status === "ON_HOLD" && <option value="IN_PROGRESS">IN_PROGRESS</option>}
                                                            {workOrder.status === "COMPLETED" && role === "MANAGER" && <option value="CLOSED">CLOSED</option>}
                                                        </select>
                                                        <button className="small-primary-btn" onClick={() => void handleStatusUpdate(workOrder.id)}>Update</button>
                                                    </div>
                                                ) : <span>—</span>}
                                            </td>
                                            {role === "MANAGER" && (
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="edit-btn" onClick={() => navigate(`/work-orders/edit/${workOrder.id}`)}>Edit</button>
                                                        <button className="delete-btn" onClick={() => void handleDelete(workOrder.id)}>Delete</button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>

                                        {expandedAttachmentOrder === workOrder.id && (
                                            <tr>
                                                <td colSpan={columnCount}>
                                                    <div className="dashboard-card work-order-attachments" style={{ margin: "12px 0" }}>
                                                        <h3>Attachments — {workOrder.code}</h3>
                                                        <p>Upload PNG, JPEG, or MP4 files (maximum 10 MB).</p>
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,video/mp4"
                                                            disabled={uploadingWorkOrder === workOrder.id}
                                                            onChange={(event) => {
                                                                const file = event.currentTarget.files?.[0];
                                                                if (file) void handleAttachmentUpload(workOrder.id, file);
                                                                event.currentTarget.value = "";
                                                            }}
                                                        />
                                                        {uploadingWorkOrder === workOrder.id && <p>Uploading file...</p>}
                                                        {attachmentErrors[workOrder.id] && <p role="alert">{attachmentErrors[workOrder.id]}</p>}
                                                        {!attachmentErrors[workOrder.id] && (attachments[workOrder.id] ?? []).length === 0 && (
                                                            <p>No attachments found for this work order.</p>
                                                        )}
                                                        {(attachments[workOrder.id] ?? []).map((attachment) => (
                                                            <div
                                                                key={attachment.id}
                                                                style={{
                                                                    display: "flex",
                                                                    flexWrap: "wrap",
                                                                    alignItems: "center",
                                                                    gap: "12px",
                                                                    padding: "10px 0",
                                                                    borderBottom: "1px solid #ddd",
                                                                }}
                                                            >
                                                                    <span>
                                                                        <strong>{attachment.fileName}</strong>{" "}
                                                                        ({(attachment.sizeOfFile / 1024).toFixed(1)} KB)
                                                                    </span>
                                                                <button
                                                                    type="button"
                                                                    className="secondary-btn"
                                                                    onClick={() => {
                                                                        void downloadAttachment(attachment.id, attachment.fileName)
                                                                            .catch((error: unknown) => {
                                                                                alert(
                                                                                    error instanceof Error
                                                                                        ? error.message
                                                                                        : "Failed to download attachment."
                                                                                );
                                                                            });
                                                                    }}
                                                                >
                                                                    Open / Download
                                                                </button>
                                                                {role === "MANAGER" && (
                                                                    <button
                                                                        type="button"
                                                                        className="delete-btn"
                                                                        onClick={() => void handleAttachmentDelete(workOrder.id, attachment.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && filteredWorkOrders.length > 0 && (
                        <div className="pagination">
                            <button className="secondary-btn" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button className="secondary-btn" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default WorkOrders;
