(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });

    // 2. Tax Toggle
    const taxSwitch = document.getElementById("switchCheckDefault");
    if (taxSwitch) {
      taxSwitch.addEventListener("click", () => {
        const taxInfo = document.getElementsByClassName("tax-info");
        for (let info of taxInfo) {
          info.style.display = (info.style.display === "inline") ? "none" : "inline";
        }
      });
    }

    // 3. Scroll to Top
    const scrollBtn = document.getElementById("scrollToTopBtn");
    if (scrollBtn) {
      window.addEventListener("scroll", () => {
        scrollBtn.style.display = window.scrollY > 300 ? "flex" : "none";
      });

      scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // 4. Filter Dropdown Toggle
    const filterBtn = document.getElementById('countryFilterBtn');
    const dropdown = document.getElementById('countryFilterDropdown');

    if (filterBtn && dropdown) {
      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent dropdown close on icon click
        dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== filterBtn) {
          dropdown.style.display = 'none';
        }
      });
    }

    // 5. Footer Scroll Links
    const links = document.querySelectorAll('.footer-hover-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  });
})();
