import { useEffect, useState } from "react";
import { getWorkOrders } from "../services/workOrderService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function WorkOrders() {

    // Get logged-in user's role
    const role = localStorage.getItem("role");

    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [technicians, setTechnicians] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedTechnician, setSelectedTechnician] = useState<{
        [key: number]: string;
    }>({});

    const [selectedStatus, setSelectedStatus] = useState<{
        [key: number]: string;
    }>({});

    const itemsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        loadWorkOrders();

        // Only Manager and Dispatcher need technician list
        if (role === "MANAGER" || role === "DISPATCHER") {
            loadTechnicians();
        }
    }, []);

    // ==============================
    // LOAD WORK ORDERS
    // ==============================

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

    // ==============================
    // LOAD TECHNICIANS
    // ==============================

    const loadTechnicians = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/technicians",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load technicians");
            }

            const data = await response.json();
            setTechnicians(data);

        } catch (error) {
            console.error("Failed to load technicians:", error);
        }
    };

    // ==============================
    // ASSIGN TECHNICIAN
    // ==============================

    const handleAssignTechnician = async (workOrderId: number) => {

        const technicianId = selectedTechnician[workOrderId];

        if (!technicianId) {
            alert("Please select a technician.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/work-orders/${workOrderId}/assign/${technicianId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to assign technician");
            }

            alert("Technician assigned successfully!");

            setSelectedTechnician((previous) => ({
                ...previous,
                [workOrderId]: "",
            }));

            loadWorkOrders();

        } catch (error) {
            console.error("Failed to assign technician:", error);
            alert("Failed to assign technician.");
        }
    };

    // ==============================
    // UPDATE STATUS
    // ==============================

    const handleStatusUpdate = async (workOrderId: number) => {

        const status = selectedStatus[workOrderId];

        if (!status) {
            alert("Please select a status.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/work-orders/${workOrderId}/status?status=${status}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Invalid status transition");
            }

            alert("Work order status updated successfully!");

            setSelectedStatus((previous) => ({
                ...previous,
                [workOrderId]: "",
            }));

            loadWorkOrders();

        } catch (error) {
            console.error("Failed to update status:", error);

            alert(
                "Status update failed. Please check whether this is a valid workflow transition."
            );
        }
    };

    // ==============================
    // DELETE WORK ORDER
    // ==============================

    const handleDelete = async (id: number) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this work order?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/work-orders/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete work order");
            }

            alert("Work order deleted successfully!");

            loadWorkOrders();

        } catch (error) {
            console.error("Failed to delete work order:", error);
            alert("Failed to delete work order.");
        }
    };

    // ==============================
    // SEARCH + FILTER
    // ==============================

    const filteredWorkOrders = workOrders.filter((workOrder) => {

        const search = searchTerm.toLowerCase();

        const matchesSearch =
            workOrder.code?.toLowerCase().includes(search) ||
            workOrder.title?.toLowerCase().includes(search) ||
            workOrder.description?.toLowerCase().includes(search) ||
            workOrder.priority?.toLowerCase().includes(search) ||
            workOrder.status?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "" ||
            workOrder.status === statusFilter;

        const matchesPriority =
            priorityFilter === "" ||
            workOrder.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    // ==============================
    // PAGINATION
    // ==============================

    const totalPages = Math.ceil(
        filteredWorkOrders.length / itemsPerPage
    );

    const startIndex =
        (currentPage - 1) * itemsPerPage;

    const paginatedWorkOrders =
        filteredWorkOrders.slice(
            startIndex,
            startIndex + itemsPerPage
        );

    // ==============================
    // SEARCH HANDLER
    // ==============================

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // ==============================
    // STATUS FILTER HANDLER
    // ==============================

    const handleStatusFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    // ==============================
    // PRIORITY FILTER HANDLER
    // ==============================

    const handlePriorityFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {

        setPriorityFilter(e.target.value);
        setCurrentPage(1);
    };

    return (

        <div className="app-layout">

            <Navbar />

            <main className="main-content">

                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <div className="page-header work-orders-header">

                    <div>

                        <h1>
                            {role === "TECHNICIAN"
                                ? "My Work Orders"
                                : "Work Orders"}
                        </h1>

                        <p>
                            {role === "TECHNICIAN"
                                ? "View your assigned work orders and update their status."
                                : "Manage, assign and track your field service work orders."}
                        </p>

                    </div>

                    <div className="header-actions">

                        {/* Kanban only for Manager and Dispatcher */}
                        {(role === "MANAGER" ||
                            role === "DISPATCHER") && (

                            <button
                                className="secondary-btn"
                                onClick={() =>
                                    navigate(
                                        "/work-orders/board"
                                    )
                                }
                            >
                                Kanban Board
                            </button>

                        )}

                        {/* Create only for Manager */}
                        {role === "MANAGER" && (

                            <button
                                className="primary-btn"
                                onClick={() =>
                                    navigate(
                                        "/work-orders/create"
                                    )
                                }
                            >
                                + Create Work Order
                            </button>

                        )}

                    </div>

                </div>


                {/* =====================================
                    FILTERS
                ====================================== */}

                <div className="dashboard-card work-order-filters">

                    <div className="filter-row">

                        {/* Search */}

                        <div className="search-box">

                            <label>Search</label>

                            <input
                                type="text"
                                placeholder="Search work orders..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />

                        </div>


                        {/* Status */}

                        <div className="filter-box">

                            <label>Status</label>

                            <select
                                value={statusFilter}
                                onChange={
                                    handleStatusFilterChange
                                }
                            >

                                <option value="">
                                    All Statuses
                                </option>

                                <option value="NEW">
                                    NEW
                                </option>

                                <option value="ASSIGNED">
                                    ASSIGNED
                                </option>

                                <option value="IN_PROGRESS">
                                    IN_PROGRESS
                                </option>

                                <option value="ON_HOLD">
                                    ON_HOLD
                                </option>

                                <option value="COMPLETED">
                                    COMPLETED
                                </option>

                                <option value="CLOSED">
                                    CLOSED
                                </option>

                                <option value="CANCELLED">
                                    CANCELLED
                                </option>

                            </select>

                        </div>


                        {/* Priority */}

                        <div className="filter-box">

                            <label>Priority</label>

                            <select
                                value={priorityFilter}
                                onChange={
                                    handlePriorityFilterChange
                                }
                            >

                                <option value="">
                                    All Priorities
                                </option>

                                <option value="LOW">
                                    LOW
                                </option>

                                <option value="MEDIUM">
                                    MEDIUM
                                </option>

                                <option value="HIGH">
                                    HIGH
                                </option>

                                <option value="CRITICAL">
                                    CRITICAL
                                </option>

                            </select>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    WORK ORDERS TABLE
                ====================================== */}

                <div className="dashboard-card">

                    <div className="table-header">

                        <div>

                            <h2>
                                {role === "TECHNICIAN"
                                    ? "My Work Order List"
                                    : "Work Order List"}
                            </h2>

                            <p>

                                {filteredWorkOrders.length} work order
                                {filteredWorkOrders.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                found

                            </p>

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <p>Loading work orders...</p>

                    ) : workOrders.length === 0 ? (

                        <div className="empty-state">

                            <h2>
                                No Work Orders
                            </h2>

                            <p>
                                {role === "TECHNICIAN"
                                    ? "No work orders are currently assigned to you."
                                    : "Create a work order to get started."}
                            </p>

                            {/* Create button only Manager */}

                            {role === "MANAGER" && (

                                <button
                                    className="primary-btn"
                                    onClick={() =>
                                        navigate(
                                            "/work-orders/create"
                                        )
                                    }
                                >
                                    + Create Work Order
                                </button>

                            )}

                        </div>

                    ) : filteredWorkOrders.length === 0 ? (

                        <div className="empty-state">

                            <h2>
                                No Matching Work Orders
                            </h2>

                            <p>
                                Try changing your search or filters.
                            </p>

                        </div>

                    ) : (

                        <div className="table-container">

                            <table>

                                <thead>

                                <tr>

                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Title
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    {/* Technician column */}
                                    {role !== "CUSTOMER" && (

                                        <th>
                                            Technician
                                        </th>

                                    )}

                                    <th>
                                        Change Status
                                    </th>

                                    {/* Actions only Manager */}
                                    {role === "MANAGER" && (

                                        <th>
                                            Actions
                                        </th>

                                    )}

                                </tr>

                                </thead>


                                <tbody>

                                {paginatedWorkOrders.map(
                                    (workOrder) => (

                                        <tr
                                            key={workOrder.id}
                                        >

                                            {/* CODE */}

                                            <td>

                                                <strong>
                                                    {workOrder.code}
                                                </strong>

                                            </td>


                                            {/* TITLE */}

                                            <td>
                                                {workOrder.title}
                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>

                                                <div className="description-cell">

                                                    {
                                                        workOrder.description
                                                    }

                                                </div>

                                            </td>


                                            {/* PRIORITY */}

                                            <td>

                                                <span
                                                    className={`priority-badge priority-${workOrder.priority?.toLowerCase()}`}
                                                >
                                                    {
                                                        workOrder.priority
                                                    }
                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge status-${workOrder.status?.toLowerCase()}`}
                                                >
                                                    {
                                                        workOrder.status
                                                    }
                                                </span>

                                            </td>


                                            {/* =================================
                                                TECHNICIAN
                                            ================================== */}

                                            {role !== "CUSTOMER" && (

                                                <td>

                                                    {workOrder.technician?.name ? (

                                                        <span>
                                                            {
                                                                workOrder
                                                                    .technician
                                                                    .name
                                                            }
                                                        </span>

                                                    ) : (

                                                        /* Only Manager and Dispatcher
                                                           can assign */

                                                        (role === "MANAGER" ||
                                                            role === "DISPATCHER") && (

                                                            <div className="inline-action">

                                                                <select
                                                                    value={
                                                                        selectedTechnician[
                                                                            workOrder.id
                                                                            ] || ""
                                                                    }
                                                                    onChange={(e) =>
                                                                        setSelectedTechnician(
                                                                            (
                                                                                previous
                                                                            ) => ({
                                                                                ...previous,
                                                                                [workOrder.id]:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            })
                                                                        )
                                                                    }
                                                                >

                                                                    <option value="">
                                                                        Select Technician
                                                                    </option>

                                                                    {technicians.map(
                                                                        (
                                                                            technician
                                                                        ) => (

                                                                            <option
                                                                                key={
                                                                                    technician.id
                                                                                }
                                                                                value={
                                                                                    technician.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    technician.name
                                                                                }
                                                                            </option>

                                                                        )
                                                                    )}

                                                                </select>


                                                                <button
                                                                    className="small-primary-btn"
                                                                    onClick={() =>
                                                                        handleAssignTechnician(
                                                                            workOrder.id
                                                                        )
                                                                    }
                                                                >
                                                                    Assign
                                                                </button>

                                                            </div>

                                                        )

                                                    )}

                                                </td>

                                            )}


                                            {/* =================================
                                                CHANGE STATUS
                                            ================================== */}

                                            <td>

                                                {/* Manager and Technician can
                                                    update status */}

                                                {(role === "MANAGER" ||
                                                    role === "TECHNICIAN") ? (

                                                    <div className="inline-action">

                                                        <select
                                                            value={
                                                                selectedStatus[
                                                                    workOrder.id
                                                                    ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setSelectedStatus(
                                                                    (
                                                                        previous
                                                                    ) => ({
                                                                        ...previous,
                                                                        [workOrder.id]:
                                                                        e
                                                                            .target
                                                                            .value,
                                                                    })
                                                                )
                                                            }
                                                        >

                                                            <option value="">
                                                                Select Status
                                                            </option>


                                                            {workOrder.status ===
                                                                "ASSIGNED" && (

                                                                    <option value="IN_PROGRESS">
                                                                        IN_PROGRESS
                                                                    </option>

                                                                )}


                                                            {workOrder.status ===
                                                                "IN_PROGRESS" && (

                                                                    <>

                                                                        <option value="ON_HOLD">
                                                                            ON_HOLD
                                                                        </option>

                                                                        <option value="COMPLETED">
                                                                            COMPLETED
                                                                        </option>

                                                                    </>

                                                                )}


                                                            {workOrder.status ===
                                                                "ON_HOLD" && (

                                                                    <option value="IN_PROGRESS">
                                                                        IN_PROGRESS
                                                                    </option>

                                                                )}


                                                            {workOrder.status ===
                                                                "COMPLETED" && (

                                                                    <option value="CLOSED">
                                                                        CLOSED
                                                                    </option>

                                                                )}

                                                        </select>


                                                        <button
                                                            className="small-primary-btn"
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    workOrder.id
                                                                )
                                                            }
                                                        >
                                                            Update
                                                        </button>

                                                    </div>

                                                ) : (

                                                    <span>
                                                        —
                                                    </span>

                                                )}

                                            </td>


                                            {/* =================================
                                                ACTIONS
                                            ================================== */}

                                            {role === "MANAGER" && (

                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/work-orders/edit/${workOrder.id}`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    workOrder.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            )}

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* =====================================
                        PAGINATION
                    ====================================== */}

                    {!loading &&
                        filteredWorkOrders.length > 0 && (

                            <div className="pagination">

                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage - 1
                                        )
                                    }
                                    disabled={
                                        currentPage === 1
                                    }
                                >
                                    Previous
                                </button>


                                <span>

                                    Page {currentPage} of{" "}
                                    {totalPages}

                                </span>


                                <button
                                    className="secondary-btn"
                                    onClick={() =>
                                        setCurrentPage(
                                            currentPage + 1
                                        )
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                >
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