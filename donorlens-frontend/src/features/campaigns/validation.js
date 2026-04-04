export function validateBasicInfo(form) {
  const errors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required";
  } else if (form.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters";
  }

  if (!form.sdgGoalNumber) {
    errors.sdgGoalNumber = "SDG Goal is required";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required";
  } else if (form.description.trim().length > 5000) {
    errors.description = "Description cannot exceed 5000 characters";
  }

  if (!form.endDate) {
    errors.endDate = "End date is required";
  } else {
    const selectedDate = new Date(form.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      errors.endDate = "End date must be in the future";
    }
  }

  if (!form.location.locationName) {
    errors.location = "Location is required";
  }

  return errors;
}

export function validateMedia(form) {
  const errors = {};

  if (!form.coverImage) {
    errors.coverImage = "Cover image is required";
  }

  return errors;
}

export function validateFinancialBreakdown(form) {
  const errors = {};

  if (!form.financialBreakdown.length) {
    errors.financialBreakdown = "At least one budget item is required";
    return errors;
  }

  const itemErrors = form.financialBreakdown.map((item) => {
    const itemError = {};

    if (!item.itemName.trim()) {
      itemError.itemName = "Item name is required";
    }

    if (item.cost === "" || Number(item.cost) < 0) {
      itemError.cost = "Valid cost is required";
    }

    if (item.description && item.description.length > 500) {
      itemError.description = "Description max length is 500";
    }

    return itemError;
  });

  errors.itemErrors = itemErrors;
  return errors;
}