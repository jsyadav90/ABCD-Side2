document.addEventListener("DOMContentLoaded", async () => {
  const form = document.querySelector("form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const endpoint = form.dataset.endpoint;
  const redirectUrl = form.dataset.redirect || "index.html";

  const userIdInput = document.getElementById("userId");
  if (userIdInput) {
    try {
      const res = await fetch("http://localhost:5000/api/users/next-id");
      const data = await res.json();
      userIdInput.value = data.nextId;
    } catch (err) {
      console.error("Failed to fetch next ID:", err);
      alert("Error fetching next User ID");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect and validate form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // FormData does NOT include disabled controls. Some pages (like add-user)
    // render the generated `userId` as disabled. Include disabled fields
    // manually so validation and backend receive the value.
    form.querySelectorAll('input[disabled], select[disabled], textarea[disabled]').forEach((el) => {
      if (el.name && !(el.name in data)) data[el.name] = el.value;
    });

    const error = validateForm(data);
    if (error) {
      alert(error);
      return;
    }

    try {
      if (!endpoint) throw new Error("Form endpoint not specified.");

      // Disable button while submitting
      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";

      // Get token if available
      const token = localStorage.getItem("token");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to save data.");
      }

      alert("User added successfully!");
      form.reset();

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1000);
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.message || "Something went wrong."));
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.textContent = "Save";
    }
  });

  // -----------------------------
  // Helper Functions
  // -----------------------------

  function validateForm(data) {
    const userId = (data.userId || "").toString().trim();
    const fullName = (data.fullName || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const phone = (data.phone || "").toString().trim();
    const department = (data.department || "").toString().trim();

    if (!userId) return "User ID is required.";
    if (!fullName) return "Full Name is required.";
    if (!email || !email.includes("@")) return "Please enter a valid email.";
    if (!/^[0-9]{10}$/.test(phone)) return "Phone number must be 10 digits.";
    if (!department) return "Please select a department.";
    return null;
  }
});
