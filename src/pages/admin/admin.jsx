import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import kycService from "../../services/kycService";
import adminService from "../../services/adminService";
import "./admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [loading, setLoading] = useState(true);
  const [kycData, setKycData] = useState([]);
  const [error, setError] = useState("");

  // ✅ Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  // ✅ Row-specific loading state for AI generation
  const [generatingIds, setGeneratingIds] = useState([]); // array of user._id currently generating

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const verifyResponse = await kycService.verifyEmail(email);
        const userType = verifyResponse.user?.type;

        if (userType !== "admin") {
          navigate("/user", { state: { email } });
          return;
        }

        const response = await adminService.getAllKycData(email);
        if (response.success) {
          setKycData(response.data);
        } else {
          setError(response.message || "Failed to fetch data.");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchAdminData();
  }, [email, navigate]);

  // ✅ Function to open modal
  const handleViewDescription = (description) => {
    setSelectedDescription(description || "No description available");
    setShowModal(true);
  };

  // ✅ Function to close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDescription("");
  };

  // ✅ Handle Go button click to generate AI description
  const handleGenerate = async (user) => {
    try {
      // Mark this row as loading
      setGeneratingIds((prev) => [...prev, user._id]);

      const response = await adminService.generateDescription(user);

      if (response.success) {
        // Update the user's status in the table
        setKycData((prevData) =>
          prevData.map((u) =>
            u._id === user._id ? { ...u, status: response.description } : u
          )
        );

        // Show the modal automatically
        setSelectedDescription(response.description);
        setShowModal(true);
      } else {
        alert(response.message || "Failed to generate AI description.");
      }
    } catch (err) {
      console.error("❌ Error generating AI description:", err);
      alert(err.message || "Something went wrong!");
    } finally {
      // Remove loading state
      setGeneratingIds((prev) => prev.filter((id) => id !== user._id));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {error && <p className="admin-error">{error}</p>}

      {kycData.length > 0 ? (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Description</th>
                <th>Type</th>
                <th>Generate</th>
              </tr>
            </thead>
            <tbody>
              {kycData.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>{new Date(user.dob).toLocaleDateString()}</td>
                  <td>{user.age}</td>
                  <td>{user.gender}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleViewDescription(user.status)}
                    >
                      View
                    </button>
                  </td>
                  <td>{user.type}</td>
                  <td>
                    <button
                      className="generate-btn"
                      onClick={() => handleGenerate(user)}
                      disabled={generatingIds.includes(user._id)}
                    >
                      {generatingIds.includes(user._id) ? "Generating..." : "Go"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-msg">No KYC data found.</p>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">AI Description</h3>
            <p className="modal-content">{selectedDescription}</p>
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );

}
