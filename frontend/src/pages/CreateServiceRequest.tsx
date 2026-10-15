import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function CreateServiceRequest() {

    // Temporary customer ID for testing
    const customerId = 6;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("MEDIUM");

    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    // ================================
    // CREATE SERVICE REQUEST
    // ================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");


        // Validation

        if (!title.trim()) {

            setErrorMessage(
                "Please enter a title."
            );

            return;
        }


        if (!description.trim()) {

            setErrorMessage(
                "Please enter a description."
            );

            return;
        }


        try {

            setSubmitting(true);

            const token =
                localStorage.getItem("token");


            if (!token) {

                setErrorMessage(
                    "You are not logged in."
                );

                return;
            }


            // Service request object

            const serviceRequest = {

                title: title.trim(),

                description:
                    description.trim(),

                status: "OPEN",

                priority: priority,

                customer: {
                    id: customerId
                }

            };


            // POST request

            await axios.post(
                "http://localhost:8080/service-requests",
                serviceRequest,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json"
                    }
                }
            );


            setSuccessMessage(
                "✓ Service request created successfully!"
            );


            // Clear form

            setTitle("");
            setDescription("");
            setPriority("MEDIUM");


        } catch (error) {

            console.error(
                "FAILED TO CREATE SERVICE REQUEST:",
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


            setErrorMessage(
                "Failed to create service request. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ================================
    // RETURN
    // ================================

    return (

        <div className="app-layout">

            <Navbar />

            <main className="main-content">


                {/* PAGE HEADER */}

                <div className="page-header">

                    <div>

                        <h1>
                            Create Service Request
                        </h1>

                        <p>
                            Tell us about the service
                            you need.
                        </p>

                    </div>

                </div>


                {/* FORM CARD */}

                <div className="dashboard-card service-request-form-card">


                    <form onSubmit={handleSubmit}>


                        {/* TITLE */}

                        <label className="feedback-label">

                            Request Title

                        </label>


                        <input
                            type="text"
                            className="feedback-select"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Example: AC is not working"
                        />


                        {/* DESCRIPTION */}

                        <label className="feedback-label">

                            Description

                        </label>


                        <textarea
                            className="feedback-comment"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe the issue in detail..."
                            rows={5}
                        />


                        {/* PRIORITY */}

                        <label className="feedback-label">

                            Priority

                        </label>


                        <select
                            className="feedback-select"
                            value={priority}
                            onChange={(e) =>
                                setPriority(
                                    e.target.value
                                )
                            }
                        >

                            <option value="LOW">
                                LOW
                            </option>

                            <option value="MEDIUM">
                                MEDIUM
                            </option>

                            <option value="HIGH">
                                HIGH
                            </option>

                            <option value="URGENT">
                                URGENT
                            </option>

                        </select>


                        {/* ERROR */}

                        {errorMessage && (

                            <div
                                style={{
                                    marginBottom: "15px",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    background: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    color: "#b91c1c"
                                }}
                            >
                                {errorMessage}
                            </div>

                        )}


                        {/* SUCCESS */}

                        {successMessage && (

                            <div
                                style={{
                                    marginBottom: "15px",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    background: "#f0fdf4",
                                    border: "1px solid #bbf7d0",
                                    color: "#166534",
                                    fontWeight: "600"
                                }}
                            >
                                {successMessage}
                            </div>

                        )}


                        {/* BUTTONS */}

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "10px"
                            }}
                        >

                            <button
                                type="submit"
                                className="action-btn"
                                disabled={submitting}
                            >

                                {submitting
                                    ? "Creating..."
                                    : "Create Service Request"}

                            </button>


                            <button
                                type="button"
                                className="feedback-cancel"
                                onClick={() =>
                                    window.location.href =
                                        "/customer"
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>

    );
}

export default CreateServiceRequest;