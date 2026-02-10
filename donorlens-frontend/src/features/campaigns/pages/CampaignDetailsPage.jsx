// src/features/campaigns/pages/CampaignDetailsPage.jsx
// Campaign details page - placeholder

import { useParams, Link } from "react-router-dom";

const CampaignDetailsPage = () => {
  const { id } = useParams();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Campaign Details</h1>
        <p style={styles.text}>Campaign ID: {id}</p>
        <p style={styles.message}>This page is under construction.</p>
        <Link to="/campaigns" style={styles.button}>
          Back to Campaigns
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "4rem 2rem",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.125rem",
    color: "#64748b",
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

export default CampaignDetailsPage;
