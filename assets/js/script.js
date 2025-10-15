document.addEventListener("DOMContentLoaded", () => {
  // --- Sidebar toggle ---
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("hide");
    });
  }

  // --- Generalized Table Checkbox Logic (delegation-friendly) ---
  function initTableCheckboxes(table) {
    if (!table) return;

    const theadCheckbox = table.querySelector("thead input[type='checkbox']");
    const tbody = table.querySelector("tbody");
    if (!theadCheckbox || !tbody) return;

    // If this table hasn't been initialized, attach listeners (only once)
    if (!table.dataset.checkboxInit) {
      // 1) Select-all listener
      theadCheckbox.addEventListener("change", () => {
        const rowCbs = tbody.querySelectorAll("input[type='checkbox']");
        rowCbs.forEach(cb => (cb.checked = theadCheckbox.checked));
        updateIndeterminate();
        // toggle row highlight for all rows
        rowCbs.forEach(cb => {
          const tr = cb.closest("tr");
          if (tr) tr.classList.toggle("selected", cb.checked);
        });
      });

      // 2) Delegated listener on tbody for individual checkbox changes
      tbody.addEventListener("change", (e) => {
        const target = e.target;
        if (!target || !target.matches("input[type='checkbox']")) return;

        // toggle row highlight
        const tr = target.closest("tr");
        if (tr) tr.classList.toggle("selected", target.checked);

        // recalc header checkbox state
        updateIndeterminate();
      });

      table.dataset.checkboxInit = "true";
    }

    // Helper: compute checked / indeterminate state based on current rows
    function updateIndeterminate() {
      const rowCbs = tbody.querySelectorAll("input[type='checkbox']");
      const total = rowCbs.length;
      const checked = [...rowCbs].filter(cb => cb.checked).length;

      if (total === 0) {
        theadCheckbox.checked = false;
        theadCheckbox.indeterminate = false;
      } else if (checked === 0) {
        theadCheckbox.checked = false;
        theadCheckbox.indeterminate = false;
      } else if (checked === total) {
        theadCheckbox.checked = true;
        theadCheckbox.indeterminate = false;
      } else {
        theadCheckbox.checked = false;
        theadCheckbox.indeterminate = true;
      }
    }

    // Set initial state (useful if rows already exist)
    updateIndeterminate();
  }

  // Initialize all existing tables on page load
  document.querySelectorAll(".table").forEach(initTableCheckboxes);

  // Expose a refresh function to call after you add/replace rows dynamically
  // (e.g. after fetch/populating rows)
  window.refreshTableCheckboxes = () => {
    document.querySelectorAll(".table").forEach(initTableCheckboxes);
  };

  // --- Search filter logic (unchanged) ---
  const searchInput = document.querySelector(".search-form input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.trim().toLowerCase();
      const rows = document.querySelectorAll("table tbody tr");

      rows.forEach(row => {
        let rowMatches = false;

        row.querySelectorAll("td").forEach(td => {
          td.querySelectorAll("mark").forEach(mark => {
            mark.replaceWith(document.createTextNode(mark.textContent));
          });

          if (term === "") return;

          const text = td.textContent;
          if (text.toLowerCase().includes(term)) {
            rowMatches = true;
            const regex = new RegExp(`(${term})`, "gi");
            td.innerHTML = text.replace(regex, "<mark>$1</mark>");
          }
        });

        row.style.display = rowMatches || term === "" ? "" : "none";
      });
    });
  }
});
