import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import { useSearchParams } from "react-router-dom";

function CreateWorkOrder() {

    // =========================================
    // SERVICE REQUEST
    // =========================================

    const [searchParams] = useSearchParams();

    const serviceRequestId =
        searchParams.get("serviceRequestId");


    // =========================================
    // WORK ORDER FIELDS
    // =========================================

    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [slaDueAt, setSlaDueAt] = useState("");


    // =========================================
    // CUSTOMER + SITE
    // =========================================

    const [customers, setCustomers] = useState<any[]>([]);
    const [sites, setSites] = useState<any[]>([]);

    const [customerId, setCustomerId] = useState("");
    const [siteId, setSiteId] = useState("");


    // =========================================
    // LOAD DATA
    // =========================================

    useEffect(() => {

        loadCustomers();
        loadSites();

        // If opened from a Service Request,
        // load that request automatically.
        if (serviceRequestId) {
            loadServiceRequest();
        }

    }, [serviceRequestId]);


    // =========================================
    // LOAD CUSTOMERS
    // =========================================

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

            console.error(
                "Failed to load customers:",
                error
            );

        }

    };


    // =========================================
    // LOAD SITES
    // =========================================

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

            console.error(
                "Failed to load sites:",
                error
            );

        }

    };


    // =========================================
    // LOAD SERVICE REQUEST
    // =========================================

    const loadServiceRequest = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080/service-requests/${serviceRequestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const request = response.data;

            console.log(
                "SERVICE REQUEST:",
                request
            );


            // Automatically fill Work Order details

            setTitle(
                request.title || ""
            );

            setDescription(
                request.description || ""
            );

            setPriority(
                request.priority || ""
            );


            // Automatically select customer

            if (request.customer?.id) {

                setCustomerId(
                    String(request.customer.id)
                );

            }


            // Automatically select site
            // if Service Request has one

            if (request.site?.id) {

                setSiteId(
                    String(request.site.id)
                );

            }

        } catch (error) {

            console.error(
                "Failed to load service request:",
                error
            );

            alert(
                "Failed to load service request."
            );

        }

    };


    // =========================================
    // CREATE WORK ORDER
    // =========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        // Basic validation

        if (!customerId) {

            alert(
                "Please select a customer."
            );

            return;

        }


        if (!priority) {

            alert(
                "Please select a priority."
            );

            return;

        }


        try {

            const token =
                localStorage.getItem("token");


            // Send only IDs for relationships

            await axios.post(
                "http://localhost:8080/work-orders",
                {

                    code,

                    title,

                    description,

                    priority,

                    status: "NEW",

                    slaDueAt:
                        slaDueAt || null,

                    customer: {
                        id: Number(customerId),
                    },

                    site: siteId
                        ? {
                            id: Number(siteId),
                        }
                        : null,

                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            alert(
                "Work order created successfully!"
            );


            // Clear form

            setCode("");
            setTitle("");
            setDescription("");
            setPriority("");
            setSlaDueAt("");
            setCustomerId("");
            setSiteId("");


            // Go back to Work Orders

            window.location.href =
                "/work-orders";


        } catch (error) {

            console.error(
                "Failed to create work order:",
                error
            );

            alert(
                "Failed to create work order."
            );

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div className="app-layout">

            <Navbar />


            <main className="main-content">


                {/* =====================================
                    PAGE HEADER
                ====================================== */}

                <div className="page-header">

                    <div>

                        <h1>
                            Create Work Order
                        </h1>

                        <p>

                            {serviceRequestId
                                ? "Create a work order from the selected service request."
                                : "Create a new work order and assign it to a customer site."}

                        </p>

                    </div>

                </div>


                {/* =====================================
                    FORM
                ====================================== */}

                <div className="form-card">


                    <form onSubmit={handleSubmit}>


                        <div className="form-grid">


                            {/* =================================
                                CODE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Code
                                </label>

                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) =>
                                        setCode(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter work order code"
                                    required
                                />

                            </div>


                            {/* =================================
                                TITLE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter work order title"
                                    required
                                />

                            </div>


                            {/* =================================
                                DESCRIPTION
                            ================================== */}

                            <div className="form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe the work required"
                                    rows={4}
                                    required
                                />

                            </div>


                            {/* =================================
                                PRIORITY
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={priority}
                                    onChange={(e) =>
                                        setPriority(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Priority
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


                            {/* =================================
                                CUSTOMER
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Customer
                                </label>

                                <select
                                    value={customerId}
                                    onChange={(e) =>
                                        setCustomerId(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Customer
                                    </option>


                                    {customers.map(
                                        (customer) => (

                                            <option
                                                key={
                                                    customer.id
                                                }
                                                value={
                                                    customer.id
                                                }
                                            >

                                                {
                                                    customer.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================
                                SITE
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    Site (Optional)
                                </label>

                                <select
                                    value={siteId}
                                    onChange={(e) =>
                                        setSiteId(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Site
                                    </option>


                                    {sites.map(
                                        (site) => (

                                            <option
                                                key={
                                                    site.id
                                                }
                                                value={
                                                    site.id
                                                }
                                            >

                                                {
                                                    site.address
                                                }

                                                {" - "}

                                                {
                                                    site.city
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================
                                SLA
                            ================================== */}

                            <div className="form-group">

                                <label>
                                    SLA Due At
                                </label>

                                <input
                                    type="datetime-local"
                                    value={slaDueAt}
                                    onChange={(e) =>
                                        setSlaDueAt(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                        </div>


                        {/* =====================================
                            BUTTONS
                        ====================================== */}

                        <div className="form-actions">


                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() =>
                                    (
                                        window.location.href =
                                            "/work-orders"
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                Create Work Order
                            </button>


                        </div>


                    </form>

                </div>

            </main>

        </div>

    );

}

export default CreateWorkOrder;