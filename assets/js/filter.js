document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const tableBody = document.getElementById("userTableBody");
  const filterControls = document.getElementById("filterControls");
  const applyBtn = document.getElementById("applyFilter");
  const resetBtn = document.getElementById("resetFilter");

  if (!tableBody || !filterControls) return;

  let allUsers = []; // store fetched users

  // Set default status filter to active
  const statusSelect = filterControls.querySelector('select[data-column="7"]');
  if (statusSelect) statusSelect.value = "active";

  // Toggle filter visibility
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterControls.style.display =
        getComputedStyle(filterControls).display === "none" ? "block" : "none";
    });
  });

  // Helper: update odd/even row styling
  function updateRowStripes(rows) {
    rows.forEach((row, index) => {
      row.classList.remove("odd", "even");
      row.classList.add(index % 2 === 0 ? "even" : "odd");
    });
  }

  // Function to render filtered rows
  function renderRows(filtered) {
    tableBody.innerHTML = "";
    filtered.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" /></td>
        <td>${user.userId}</td>
        <td>${user.fullName}</td>
        <td>${user.designation || "-"}</td>
        <td>${user.department || "-"}</td>
        <td>${user.email}</td>
        <td>${user.phone || "-"}</td>
        <td>${user.status}</td>
        <td>${user.remarks || "-"}</td>
      `;
      tableBody.appendChild(row);
    });

    updateRowStripes(Array.from(tableBody.querySelectorAll("tr")));
  }

  // Apply filters
  function applyFilters() {
    const inputs = filterControls.querySelectorAll(".filter-input");
    let filtered = allUsers.filter((user) => {
      let show = true;

      inputs.forEach((input) => {
        const colIndex = parseInt(input.dataset.column, 10);
        const filterValue = (input.value || "").trim().toLowerCase();

        if (!filterValue) return;

        let field = "";
        switch (colIndex) {
          case 2: field = user.fullName || ""; break;
          case 4: field = user.department || ""; break;
          case 7: field = user.status || ""; break;
        }

        if (input.tagName === "SELECT") {
          if (field.toLowerCase() !== filterValue) show = false;
        } else {
          if (!field.toLowerCase().includes(filterValue)) show = false;
        }
      });

      return show;
    });

    renderRows(filtered);
  }

  if (applyBtn) applyBtn.addEventListener("click", applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      filterControls.querySelectorAll(".filter-input").forEach((input) => {
        if (input.tagName === "SELECT") input.selectedIndex = 0;
        else input.value = "";
      });
      renderRows(allUsers); // reset to all users
    });
  }

  // Fetch users and render initially
  async function fetchUsers() {
    try {
      const response = await fetch(`${BASE_URL}/api/users`);
      if (!response.ok) throw new Error("Network error");

      allUsers = await response.json();

      // Apply default filter immediately
      applyFilters();
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }

  fetchUsers();

  // Expose for other scripts if needed
  window.applyTableFilters = applyFilters;
});
