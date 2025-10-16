document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    const tableBodyId = btn.dataset.targetTable;
    const tableBody = document.getElementById(tableBodyId);
    const filterControls = document.getElementById("filterControls");
    const applyBtn = document.getElementById("applyFilter");
    const resetBtn = document.getElementById("resetFilter");

    if (!tableBody || !filterControls) return;

    // Toggle filter visibility
    btn.addEventListener("click", () => {
      filterControls.style.display =
        getComputedStyle(filterControls).display === "none" ? "block" : "none";
    });

    // Apply filters
    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        const rows = Array.from(tableBody.getElementsByTagName("tr"));
        const inputs = filterControls.querySelectorAll(".filter-input");

        rows.forEach((row) => {
          let showRow = true;

          inputs.forEach((input) => {
            const colIndex = parseInt(input.dataset.column, 10);
            const filterValue = (input.value || "").trim().toLowerCase();
            const cellText = (row.cells[colIndex]?.textContent || "").trim().toLowerCase();

            if (!filterValue) return;

            if (input.tagName === "SELECT") {
              // Exact match for dropdowns
              if (cellText !== filterValue) showRow = false;
            } else {
              // Partial match for text inputs
              if (!cellText.includes(filterValue)) showRow = false;
            }
          });

          row.style.display = showRow ? "" : "none";
        });
      });
    }

    // Reset filters
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const rows = Array.from(tableBody.getElementsByTagName("tr"));
        const inputs = filterControls.querySelectorAll(".filter-input");

        inputs.forEach((input) => {
          if (input.tagName === "SELECT") input.selectedIndex = 0;
          else input.value = "";
        });

        rows.forEach((row) => (row.style.display = ""));
      });
    }
  });
});
