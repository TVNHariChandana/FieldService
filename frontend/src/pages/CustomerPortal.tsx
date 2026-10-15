import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

interface ServiceRequest {
    id: number;
    title: string | null;
    description: string;
    status: string;
    priority: string;
}

interface WorkOrder {
    id: number;
    code: string;
    title: string;
    status: string;
}

interface Feedback {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    workOrder?: {
        id: number;
        code: string;
        title: string;
        status: string;
    };
}

function CustomerPortal() {

    // Temporary customer ID for testing
    const customerId = 6;

    // ================================
    // STATES
    // ================================

    const [serviceRequests, setServiceRequests] =
        useState<ServiceRequest[]>([]);

    const [workOrders, setWorkOrders] =
        useState<WorkOrder[]>([]);

    const [feedback, setFeedback] =
        useState<Feedback[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [feedbackLoading, setFeedbackLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [feedbackError, setFeedbackError] =
        useState("");

    // ================================
    // FEEDBACK FORM STATES
    // ================================

    const [showFeedbackForm, setShowFeedbackForm] =
        useState(false);

    const [selectedWorkOrder, setSelectedWorkOrder] =
        useState("");

    const [rating, setRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");


    // ================================
    // LOAD DATA
    // ================================

    useEffect(() => {

        loadServiceRequests();
        loadWorkOrders();
        loadFeedback();

    }, []);


    // ================================
    // LOAD SERVICE REQUESTS
    // ================================

    const loadServiceRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "You are not logged in."
                );

                return;
            }

            const response = await axios.get(
                `http://localhost:8080/service-requests/customer/${customerId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setServiceRequests(
                response.data
            );

        } catch (error) {

            console.error(
                "FAILED TO LOAD SERVICE REQUESTS:",
                error
            );

            setError(
                "Unable to load service requests."
            );

        } finally {

            setLoading(false);

        }
    };


    // ================================
    // LOAD WORK ORDERS
    // ================================

    const loadWorkOrders = async () => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/work-orders/customer/${customerId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "CUSTOMER WORK ORDERS:",
                response.data
            );

            setWorkOrders(
                response.data
            );

        } catch (error) {

            console.error(
                "FAILED TO LOAD WORK ORDERS:",
                error
            );

        }
    };


    // ================================
    // LOAD FEEDBACK
    // ================================

    const loadFeedback = async () => {

        try {

            setFeedbackLoading(true);
            setFeedbackError("");

            const token =
                localStorage.getItem("token");

            if (!token) {

                setFeedbackError(
                    "You are not logged in."
                );

                return;
            }

            const response = await axios.get(
                `http://localhost:8080/feedback/customer/${customerId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "CUSTOMER FEEDBACK:",
                response.data
            );

            setFeedback(
                response.data
            );

        } catch (error) {

            console.error(
                "FAILED TO LOAD FEEDBACK:",
                error
            );

            setFeedbackError(
                "Unable to load feedback."
            );

        } finally {

            setFeedbackLoading(false);

        }
    };


    // ================================
    // CLOSED WORK ORDERS
    // WITHOUT FEEDBACK
    // ================================

    const closedWorkOrders =
        workOrders.filter(
            (workOrder) =>
                workOrder.status === "CLOSED" &&
                !feedback.some(
                    (item) =>
                        item.workOrder?.id ===
                        workOrder.id
                )
        );


    // ================================
    // OPEN FEEDBACK FORM
    // ================================

    const openFeedbackForm = () => {

        setSuccessMessage("");

        setFeedbackError("");

        if (closedWorkOrders.length === 0) {

            alert(
                "No closed work orders are available for feedback yet."
            );

            return;
        }

        setShowFeedbackForm(true);
    };


    // ================================
    // CANCEL FEEDBACK FORM
    // ================================

    const cancelFeedbackForm = () => {

        setShowFeedbackForm(false);

        setSelectedWorkOrder("");

        setRating(0);

        setComment("");

        setSuccessMessage("");

    };


    // ================================
    // SUBMIT FEEDBACK
    // ================================

    const submitFeedback = async () => {

        setSuccessMessage("");

        // Check work order

        if (!selectedWorkOrder) {

            alert(
                "Please select a work order."
            );

            return;
        }


        // Check rating

        if (rating === 0) {

            alert(
                "Please select a rating."
            );

            return;
        }


        // Check comment

        if (!comment.trim()) {

            alert(
                "Please enter your comment."
            );

            return;
        }


        try {

            setSubmitting(true);

            const token =
                localStorage.getItem("token");


            if (!token) {

                alert(
                    "You are not logged in."
                );

                return;
            }


            // POST feedback

            await axios.post(

                `http://localhost:8080/feedback/work-order/${selectedWorkOrder}/customer/${customerId}`,

                null,

                {
                    params: {

                        rating: rating,

                        comment:
                            comment.trim()

                    },

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }
                }

            );


            // Clear form

            setSelectedWorkOrder("");

            setRating(0);

            setComment("");


            // Success message

            setSuccessMessage(
                "✓ Feedback submitted successfully!"
            );


            // Close form

            setShowFeedbackForm(false);


            // Reload feedback

            await loadFeedback();


            // Reload work orders

            await loadWorkOrders();


        } catch (error) {

            console.error(
                "FAILED TO SUBMIT FEEDBACK:",
                error
            );


            if (
                axios.isAxiosError(error) &&
                error.response?.data
            ) {

                console.log(
                    "BACKEND ERROR:",
                    error.response.data
                );

            }


            alert(
                "Failed to submit feedback. Please check the work order status."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ================================
    // RETURN UI
    // ================================

    return (

        <div className="app-layout">

            <Navbar />

            <main className="main-content">


                {/* ================================= */}
                {/* PAGE HEADER */}
                {/* ================================= */}

                <div className="page-header">

                    <div>

                        <h1>
                            Customer Portal
                        </h1>

                        <p>
                            View your service requests
                            and work orders.
                        </p>

                    </div>

                </div>


                <div className="dashboard-grid">


                    {/* ================================= */}
                    {/* MY WORK ORDERS */}
                    {/* ================================= */}

                    <div className="dashboard-card">

                        <h3>
                            My Work Orders
                        </h3>

                        <p>
                            View your service work orders
                            and track their current status.
                        </p>

                        <button
                            className="action-btn"
                            onClick={() =>
                                window.location.href =
                                    "/work-orders"
                            }
                        >
                            View My Work Orders
                        </button>

                    </div>


                    {/* ================================= */}
                    {/* MY SITES */}
                    {/* ================================= */}

                    <div className="dashboard-card">

                        <h3>
                            My Sites
                        </h3>

                        <p>
                            View the sites associated
                            with your organization.
                        </p>

                        <button
                            className="action-btn"
                            onClick={() =>
                                window.location.href =
                                    "/sites"
                            }
                        >
                            View My Sites
                        </button>

                    </div>


                    {/* ================================= */}
                    {/* SERVICE REQUESTS */}
                    {/* ================================= */}

                    <div className="dashboard-card">

                        <h3>
                            Service Requests
                        </h3>

                        <p>
                            View and track your
                            service requests.
                        </p>


                        {/* Loading */}

                        {loading && (

                            <p>
                                Loading service requests...
                            </p>

                        )}


                        {/* Error */}

                        {!loading &&
                            error && (

                                <p
                                    style={{
                                        color: "red"
                                    }}
                                >
                                    {error}
                                </p>

                            )}


                        {/* No requests */}

                        {!loading &&
                            !error &&
                            serviceRequests.length === 0 && (

                                <p>
                                    No service requests found.
                                </p>

                            )}


                        {/* Requests */}

                        {!loading &&
                            !error &&
                            serviceRequests.length > 0 && (

                                <div>

                                    <p>

                                        You have{" "}

                                        <strong>
                                            {
                                                serviceRequests.length
                                            }
                                        </strong>{" "}

                                        service request(s).

                                    </p>


                                    {serviceRequests.map(
                                        (request) => (

                                            <div
                                                key={request.id}
                                                style={{
                                                    marginBottom:
                                                        "15px",

                                                    padding:
                                                        "15px",

                                                    border:
                                                        "1px solid #e2e8f0",

                                                    borderRadius:
                                                        "8px",

                                                    background:
                                                        "#f8fafc"
                                                }}
                                            >

                                                <h4
                                                    style={{
                                                        marginTop:
                                                            0
                                                    }}
                                                >

                                                    {
                                                        request.title ||
                                                        "Service Request"
                                                    }

                                                </h4>


                                                <p>
                                                    {
                                                        request.description
                                                    }
                                                </p>


                                                <p>

                                                    <strong>
                                                        Priority:
                                                    </strong>{" "}

                                                    {
                                                        request.priority
                                                    }

                                                </p>


                                                <p>

                                                    <strong>
                                                        Status:
                                                    </strong>{" "}

                                                    {
                                                        request.status
                                                    }

                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}


                        <button
                            className="action-btn"
                            onClick={() =>
                                window.location.href =
                                    "/service-requests/create"
                            }
                        >
                            + Create Service Request
                        </button>

                    </div>


                    {/* ================================= */}
                    {/* FEEDBACK */}
                    {/* ================================= */}

                    <div className="dashboard-card">


                        {/* FEEDBACK TITLE */}

                        <h3>
                            💬 Feedback
                        </h3>


                        <p>
                            Share your experience
                            with our service.
                        </p>


                        {/* ================================= */}
                        {/* SUCCESS MESSAGE */}
                        {/* ================================= */}

                        {successMessage && (

                            <div
                                style={{
                                    marginTop:
                                        "15px",

                                    marginBottom:
                                        "15px",

                                    padding:
                                        "12px",

                                    borderRadius:
                                        "8px",

                                    background:
                                        "#f0fdf4",

                                    border:
                                        "1px solid #bbf7d0",

                                    color:
                                        "#166534",

                                    fontWeight:
                                        "600"
                                }}
                            >

                                {successMessage}

                            </div>

                        )}


                        {/* ================================= */}
                        {/* SUBMIT FEEDBACK BUTTON */}
                        {/* ================================= */}

                        {!showFeedbackForm && (

                            <button
                                className="action-btn feedback-open-btn"
                                onClick={
                                    openFeedbackForm
                                }
                            >
                                Submit Feedback
                            </button>

                        )}


                        {/* ================================= */}
                        {/* FEEDBACK FORM */}
                        {/* ================================= */}

                        {showFeedbackForm && (

                            <div
                                className="feedback-form"
                            >


                                <h4>
                                    Submit Feedback
                                </h4>


                                {/* WORK ORDER */}

                                <label
                                    className="feedback-label"
                                >
                                    Work Order
                                </label>


                                <select
                                    className="feedback-select"
                                    value={
                                        selectedWorkOrder
                                    }
                                    onChange={(e) =>
                                        setSelectedWorkOrder(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Work Order
                                    </option>


                                    {closedWorkOrders.map(
                                        (workOrder) => (

                                            <option
                                                key={
                                                    workOrder.id
                                                }
                                                value={
                                                    workOrder.id
                                                }
                                            >

                                                {
                                                    workOrder.code
                                                }{" "}

                                                -{" "}

                                                {
                                                    workOrder.title
                                                }

                                            </option>

                                        )
                                    )}

                                </select>


                                {/* RATING */}

                                <label
                                    className="feedback-label"
                                >
                                    How was the service?
                                </label>


                                <div
                                    className="feedback-stars"
                                >

                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (

                                            <button
                                                key={star}
                                                type="button"
                                                className="feedback-star"
                                                onClick={() =>
                                                    setRating(
                                                        star
                                                    )
                                                }
                                                aria-label={
                                                    `Rate ${star} stars`
                                                }
                                            >

                                                {
                                                    star <=
                                                    rating
                                                        ? "★"
                                                        : "☆"
                                                }

                                            </button>

                                        )
                                    )}

                                </div>


                                {/* COMMENT */}

                                <label
                                    className="feedback-label"
                                >
                                    Your comments
                                </label>


                                <textarea
                                    className="feedback-comment"
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Tell us about your experience..."
                                    rows={4}
                                />


                                {/* SUBMIT BUTTON */}

                                <button
                                    className="feedback-submit action-btn"
                                    onClick={
                                        submitFeedback
                                    }
                                    disabled={
                                        submitting
                                    }
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : "⭐ Submit Feedback"}

                                </button>


                                {/* CANCEL BUTTON */}

                                <button
                                    type="button"
                                    className="feedback-cancel"
                                    onClick={
                                        cancelFeedbackForm
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        )}


                        {/* ================================= */}
                        {/* FEEDBACK LOADING */}
                        {/* ================================= */}

                        {feedbackLoading && (

                            <p>
                                Loading your feedback...
                            </p>

                        )}


                        {/* ================================= */}
                        {/* FEEDBACK ERROR */}
                        {/* ================================= */}

                        {!feedbackLoading &&
                            feedbackError && (

                                <p
                                    style={{
                                        color: "red"
                                    }}
                                >
                                    {feedbackError}
                                </p>

                            )}


                        {/* ================================= */}
                        {/* SUBMITTED FEEDBACK */}
                        {/* ================================= */}

                        {!feedbackLoading &&
                            !feedbackError &&
                            feedback.length > 0 && (

                                <div
                                    className="submitted-feedback"
                                >

                                    <h4>
                                        Your Submitted Feedback
                                    </h4>


                                    {feedback.map(
                                        (item) => (

                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="submitted-feedback-item"
                                            >


                                                {/* WORK ORDER */}

                                                <p>

                                                    <strong>
                                                        Work Order:
                                                    </strong>{" "}

                                                    {
                                                        item
                                                            .workOrder
                                                            ?.code ||
                                                        "Work Order"
                                                    }

                                                </p>


                                                {/* RATING */}

                                                <p>

                                                    <strong>
                                                        Rating:
                                                    </strong>{" "}

                                                    <span
                                                        className="submitted-rating"
                                                    >

                                                        {
                                                            "★".repeat(
                                                                item.rating
                                                            )
                                                        }

                                                    </span>

                                                </p>


                                                {/* COMMENT */}

                                                <p>

                                                    <strong>
                                                        Comment:
                                                    </strong>{" "}

                                                    {
                                                        item.comment
                                                    }

                                                </p>


                                                {/* DATE */}

                                                <p>

                                                    <strong>
                                                        Submitted:
                                                    </strong>{" "}

                                                    {
                                                        new Date(
                                                            item.createdAt
                                                        ).toLocaleDateString()
                                                    }

                                                </p>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </div>

                </div>

            </main>

        </div>

    );
}

export default CustomerPortal;