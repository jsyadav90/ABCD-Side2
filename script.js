document.addEventListener("DOMContentLoaded", () => {
  // --- Sidebar toggle ---
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("hide");
    });
  }

  // --- Apply table logic for ALL tables ---
  document.querySelectorAll(".table").forEach(table => {
    const selectAll = table.querySelector("thead input[type='checkbox']");
    const checkboxes = table.querySelectorAll("tbody input[type='checkbox']");

    if (selectAll) {
      selectAll.addEventListener("change", () => {
        checkboxes.forEach(cb => (cb.checked = selectAll.checked));
        updateIndeterminate();
      });

      checkboxes.forEach(cb => {
        cb.addEventListener("change", updateIndeterminate);
      });

      function updateIndeterminate() {
        const total = checkboxes.length;
        const checked = [...checkboxes].filter(cb => cb.checked).length;

        if (checked === 0) {
          selectAll.checked = false;
          selectAll.indeterminate = false;
        } else if (checked === total) {
          selectAll.checked = true;
          selectAll.indeterminate = false;
        } else {
          selectAll.checked = false;
          selectAll.indeterminate = true;
        }
      }
    }

    // Row selection highlight
    checkboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        cb.closest("tr").classList.toggle("selected", cb.checked);
      });
    });

    
  });






  //! --- Search filter (works with whichever table is currently visible) ---
const searchInput = document.querySelector(".search-form input");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
      let rowMatches = false;

      row.querySelectorAll("td").forEach(td => {
        // Remove previous highlights
        td.querySelectorAll("mark").forEach(mark => {
          mark.replaceWith(document.createTextNode(mark.textContent));
        });

        if (term === "") return; // skip highlighting

        const text = td.textContent;

        // Case-insensitive search anywhere in cell
        if (text.toLowerCase().includes(term.toLowerCase())) {
          rowMatches = true;

          // Highlight matched term(s)
          const regex = new RegExp(`(${term})`, "gi");
          td.innerHTML = text.replace(regex, "<mark>$1</mark>");
        }
      });

      // Show row only if it matches search
      row.style.display = rowMatches || term === "" ? "" : "none";
    });
  });
}

// Search end 




});









//! ------------------ This is table action script ------------------
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".action-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const dropdown = e.target.nextElementSibling;

      // Close all other open dropdowns
      document.querySelectorAll(".action-menu .dropdown").forEach((menu) => {
        if (menu !== dropdown) menu.style.display = "none";
      });

      // Toggle visibility
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
        dropdown.classList.remove("drop-up", "drop-left", "drop-right");
      } else {
        dropdown.style.display = "block";

        // Reset previous position classes
        dropdown.classList.remove("drop-up", "drop-left", "drop-right");

        // Positioning logic
        const rect = dropdown.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Space available
        const spaceBottom = vh - rect.bottom;
        const spaceTop = rect.top;
        const spaceRight = vw - rect.right;
        const spaceLeft = rect.left;

        // Default: dropdown opens down
        let position = "down";

        if (spaceBottom < dropdown.offsetHeight && spaceTop > dropdown.offsetHeight) {
          position = "up"; // open upwards
        } else if (spaceRight < dropdown.offsetWidth && spaceLeft > dropdown.offsetWidth) {
          position = "left"; // open left
        } else if (spaceRight > dropdown.offsetWidth) {
          position = "right"; // open right
        }

        if (position === "up") dropdown.classList.add("drop-up");
        if (position === "left") dropdown.classList.add("drop-left");
        if (position === "right") dropdown.classList.add("drop-right");
      }
    });
  });

  // Close dropdown if clicking outside
  window.addEventListener("click", (e) => {
    if (!e.target.closest(".action-menu")) {
      document.querySelectorAll(".action-menu .dropdown").forEach((menu) => {
        menu.style.display = "none";
        menu.classList.remove("drop-up", "drop-left", "drop-right");
      });
    }
  });
});

