document.addEventListener("DOMContentLoaded", () => {  
  // ---------------- Add Item Page Code ----------------
  const itemType = document.getElementById("itemType");
      const fieldGroups = document.querySelectorAll(".field-group");
      const form = document.getElementById("addItemForm");

      function showFieldsForType(type) {
        fieldGroups.forEach((group) => {
          if (group.dataset.type === type) {
            group.classList.remove("hide");
          } else {
            group.classList.add("hide");
          }
        });
      }

      function updateURLParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, "", url);
      }

      window.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        if (type) {
          itemType.value = type;
          showFieldsForType(type);
        }
      });

      itemType.addEventListener("change", (e) => {
        const selectedType = e.target.value;
        showFieldsForType(selectedType);
        updateURLParam("type", selectedType);
      });

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedType = itemType.value;
        console.log("Form Submitted for", selectedType);

        form.reset();
        itemType.value = selectedType;
        showFieldsForType(selectedType);
        updateURLParam("type", selectedType);
      });
});
