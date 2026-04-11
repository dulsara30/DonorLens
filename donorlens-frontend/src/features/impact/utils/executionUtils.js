/**
 * Shared Execution Utilities
 * Common functions for execution calculations and formatting
 */

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function calculateProgress(fundsUsed, totalPlannedCost) {
  if (!totalPlannedCost || fundsUsed === undefined || fundsUsed === null) {
    return 0;
  }
  return Math.min((fundsUsed / totalPlannedCost) * 100, 100);
}

export function canEditExecution(execution) {
  if (!execution.createdAt) return false;

  const createdTime = new Date(execution.createdAt).getTime();
  const now = new Date().getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

  return now - createdTime < twentyFourHoursInMs;
}

export function getTimeRemainingToEdit(execution) {
  if (!execution.createdAt) return null;

  const createdTime = new Date(execution.createdAt).getTime();
  const now = new Date().getTime();
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
  const timeRemaining = twentyFourHoursInMs - (now - createdTime);

  if (timeRemaining <= 0) return "Expired";

  const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
  const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getDefaultLaunchExecution(campaign) {
  return {
    _id: "default-launch",
    title: "Campaign Launched",
    date: campaign?.createdAt || new Date(),
    description: `We are excited to launch this campaign for ${campaign?.description || "our cause"}.`,
    fundsUsed: 0,
    progress: 0,
    evidencePhotos: [],
    receipts: [],
    isDefault: true,
  };
}

/**
 * Extract photo URL from different formats
 * Handles both object format { secure_url, public_id } and string format
 */
export function extractPhotoUrl(photo) {
  if (typeof photo === "string") {
    return photo;
  } else if (photo && typeof photo === "object") {
    return photo.secure_url || photo.url || photo.path || "";
  }
  return "";
}

/**
 * Extract file URL and filename from different formats
 */
export function extractFileInfo(receipt) {
  let fileUrl = "";
  let fileName = "Document";

  if (typeof receipt === "string") {
    fileUrl = receipt;
    fileName = receipt.split("/").pop() || fileName;
  } else if (receipt && typeof receipt === "object") {
    fileUrl = receipt.secure_url || receipt.url || receipt.path || "";
    fileName = receipt.fileName || receipt.filename || receipt.name || fileName;
  }

  return { fileUrl, fileName };
}

/**
 * Calculate cumulative percentage for executions
 * Used for both NGO dashboard and donor side
 * Calculates based on cumulative funds, not rounding percentages
 */
export function calculateExecutionProgress(executions, totalPlannedCost) {
  if (!executions || executions.length === 0) return [];

  // Sort by date (oldest first for cumulative calculation)
  const sorted = [...executions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  const plannedCost = Number(totalPlannedCost || 0);
  let cumulativeFundsUsed = 0;

  const withProgress = sorted.map((execution) => {
    // Add this execution's funds to cumulative total
    cumulativeFundsUsed += Number(execution.fundsUsed || 0);

    // Calculate percentage from cumulative funds: (cumulativeFundsUsed / totalPlannedCost) * 100
    const progressPercentage =
      plannedCost > 0
        ? Math.min(Math.round((cumulativeFundsUsed / plannedCost) * 100), 100)
        : 0;

    return {
      ...execution,
      cumulativeFundsUsed,
      progressPercentage,
    };
  });

  // Sort back to most recent first for display
  return withProgress.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}
