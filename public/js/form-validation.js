document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addVehicleForm");

  form.addEventListener("submit", (e) => {
    const make = form.make.value.trim();
    const model = form.model.value.trim();
    const year = form.year.value;
    const price = form.price.value;
    const color = form.color.value.trim();
    const classification = form.classification.value;

    let errors = [];

    if (make.length < 2) errors.push("Make must be at least 2 characters.");
    if (model.length < 2) errors.push("Model must be at least 2 characters.");
    if (year < 1886 || year > new Date().getFullYear()) errors.push("Enter a valid year.");
    if (price <= 0) errors.push("Price must be greater than 0.");
    if (color.length < 3) errors.push("Color must be at least 3 characters.");
    if (!classification) errors.push("Select a classification.");

    if (errors.length > 0) {
      e.preventDefault();
      alert("Please fix the following errors:\n\n" + errors.join("\n"));
    }
  });
});
