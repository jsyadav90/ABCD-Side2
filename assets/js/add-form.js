document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const endpoint = form.dataset.endpoint; // set in each HTML form
      if (!endpoint) throw new Error("No endpoint specified for this form");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save data");

      alert("Saved successfully!");
      window.location.href = form.dataset.redirect || "index.html"; // set redirect per page
    } catch (err) {
      console.error(err);
      alert("Error saving data: " + err.message);
    }
  });
});
