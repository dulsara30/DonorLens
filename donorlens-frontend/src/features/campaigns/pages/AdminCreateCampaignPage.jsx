// src/features/campaigns/pages/AdminCreateCampaignPage.jsx
// Admin page to create new campaign - placeholder

import { Link } from "react-router-dom";

const AdminCreateCampaignPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Campaign</h1>
      <p style={styles.message}>Campaign creation form coming soon...</p>
      <Link to="/admin" style={styles.button}>
        Back to Dashboard
      </Link>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.125rem",
    color: "#64748b",
    marginBottom: "2rem",
  },
  button: {
    display: "inline-block",
    padding: "0.875rem 2rem",
    background: "linear-gradient(135deg, #14b8a6, #0891b2)",
    color: "white",
    borderRadius: "30px",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default AdminCreateCampaignPage;
