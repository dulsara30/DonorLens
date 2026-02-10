// Unauthorized access page

import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>403</h1>
        <h2 style={styles.subtitle}>Unauthorized Access</h2>
        <p style={styles.message}>
          You don't have permission to access this page.
        </p>
        <Link to="/" style={styles.button}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "2rem",
  },
  content: {
    textAlign: "center",
    maxWidth: "500px",
  },
  title: {
    fontSize: "6rem",
    fontWeight: "800",
    color: "#14b8a6",
    margin: "0",
    lineHeight: "1",
  },
  subtitle: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "1rem 0",
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
    transition: "transform 0.2s ease",
  },
};

export default Unauthorized;
