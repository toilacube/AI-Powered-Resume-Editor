export const validateResumeData = (data) => {
  const requiredKeys = [
    "name",
    "title",
    "contact",
    "education",
    "skills",
    "experience",
    "projects",
  ];

  for (const key of requiredKeys) {
    if (!(key in data)) {
      return `Validation failed: Missing required key "${key}"`;
    }
  }

  // Additional validations
  if (!data.contact.email || !data.contact.phone) {
    return "Contact information (email and phone) is required";
  }

  return null; // No errors
};
