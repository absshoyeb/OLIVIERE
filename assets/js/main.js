(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const scrollTopButton = document.querySelector(".scroll-top");
  const mobileNavToggleButton = document.querySelector(".mobile-nav-toggle");

  const navMenuLinks = [...document.querySelectorAll(".navmenu a")].filter(
    link => link.hash && document.querySelector(link.hash)
  );

  let scrollTicking = false;

  /**
   * Header scrolled state
   */
  function updateHeaderState() {
    if (!header) return;

    const isSticky =
      header.classList.contains("scroll-up-sticky") ||
      header.classList.contains("sticky-top") ||
      header.classList.contains("fixed-top");

    if (!isSticky) return;

    body.classList.toggle("scrolled", window.scrollY > 100);
  }

  /**
   * Scroll-to-top button visibility
   */
  function updateScrollTopButton() {
    if (!scrollTopButton) return;

    scrollTopButton.classList.toggle("active", window.scrollY > 100);
  }

  /**
   * Navigation scrollspy
   */
  function updateNavigationState() {
    const currentPosition = window.scrollY + 200;
    let activeLink = null;

    navMenuLinks.forEach(link => {
      const section = document.querySelector(link.hash);

      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (currentPosition >= sectionTop && currentPosition <= sectionBottom) {
        activeLink = link;
      }
    });

    document.querySelectorAll(".navmenu a.active").forEach(link => {
      link.classList.remove("active");
    });

    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  /**
   * Optimized scroll handler
   */
  function handleScroll() {
    if (scrollTicking) return;

    scrollTicking = true;

    window.requestAnimationFrame(() => {
      updateHeaderState();
      updateScrollTopButton();
      updateNavigationState();

      scrollTicking = false;
    });
  }

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  /**
   * Mobile navigation
   */
  function toggleMobileNavigation() {
    if (!mobileNavToggleButton) return;

    body.classList.toggle("mobile-nav-active");
    mobileNavToggleButton.classList.toggle("bi-list");
    mobileNavToggleButton.classList.toggle("bi-x");
  }

  mobileNavToggleButton?.addEventListener("click", toggleMobileNavigation);

  document.querySelectorAll("#navmenu a").forEach(link => {
    link.addEventListener("click", () => {
      if (body.classList.contains("mobile-nav-active")) {
        toggleMobileNavigation();
      }
    });
  });

  /**
   * Mobile dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach(toggle => {
    toggle.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      const parentItem = toggle.parentElement;
      const dropdownMenu = parentItem?.nextElementSibling;

      parentItem?.classList.toggle("active");
      dropdownMenu?.classList.toggle("dropdown-active");
    });
  });

  /**
   * Preloader
   */
  function removePreloader() {
    const preloader = document.querySelector("#preloader");

    if (!preloader) return;

    preloader.style.opacity = "0";
    preloader.style.pointerEvents = "none";

    window.setTimeout(() => {
      preloader.remove();
    }, 300);
  }

  /**
   * Scroll-to-top action
   */
  scrollTopButton?.addEventListener("click", event => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /**
   * AOS animations
   */
  function initializeAOS() {
    if (typeof window.AOS === "undefined") return;

    window.AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  /**
   * GLightbox
   */
  function initializeLightbox() {
    if (typeof window.GLightbox === "undefined") return;

    window.GLightbox({
      selector: ".glightbox",
    });
  }

  /**
   * Isotope filtering
   */
  function initializeIsotope() {
    if (
      typeof window.Isotope === "undefined" ||
      typeof window.imagesLoaded === "undefined"
    ) {
      return;
    }

    document.querySelectorAll(".isotope-layout").forEach(layoutElement => {
      const container = layoutElement.querySelector(".isotope-container");

      if (!container) return;

      const layoutMode = layoutElement.getAttribute("data-layout") || "masonry";

      const defaultFilter =
        layoutElement.getAttribute("data-default-filter") || "*";

      const sortBy =
        layoutElement.getAttribute("data-sort") || "original-order";

      let isotopeInstance = null;

      window.imagesLoaded(container, () => {
        isotopeInstance = new window.Isotope(container, {
          itemSelector: ".isotope-item",
          layoutMode,
          filter: defaultFilter,
          sortBy,
        });
      });

      layoutElement
        .querySelectorAll(".isotope-filters li")
        .forEach(filterButton => {
          filterButton.addEventListener("click", () => {
            if (!isotopeInstance) return;

            layoutElement
              .querySelectorAll(".isotope-filters .filter-active")
              .forEach(activeFilter => {
                activeFilter.classList.remove("filter-active");
              });

            filterButton.classList.add("filter-active");

            isotopeInstance.arrange({
              filter: filterButton.getAttribute("data-filter") || "*",
            });

            if (typeof window.AOS !== "undefined") {
              window.AOS.refresh();
            }
          });
        });
    });
  }

  /**
   * Swiper sliders
   */
  function initializeSwipers() {
    if (typeof window.Swiper === "undefined") return;

    const eventsSlider = document.querySelector(".events .swiper");

    if (eventsSlider) {
      new window.Swiper(eventsSlider, {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".events .swiper-pagination",
          clickable: true,
        },
      });
    }

    const testimonialsSlider = document.querySelector(".testimonials .swiper");

    if (testimonialsSlider) {
      new window.Swiper(testimonialsSlider, {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 40,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".testimonials .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      });
    }
  }

  /**
   * Scroll to URL hash
   */
  function scrollToCurrentHash() {
    const hash = window.location.hash;

    if (!hash) return;

    const section = document.querySelector(hash);

    if (!section) return;

    window.setTimeout(() => {
      const scrollMarginTop =
        Number.parseInt(window.getComputedStyle(section).scrollMarginTop, 10) ||
        0;

      window.scrollTo({
        top: section.offsetTop - scrollMarginTop,
        behavior: "smooth",
      });
    }, 100);
  }

  /**
   * Main initialization
   */
  function initializeWebsite() {
    removePreloader();
    initializeAOS();
    initializeLightbox();
    initializeIsotope();
    initializeSwipers();

    updateHeaderState();
    updateScrollTopButton();
    updateNavigationState();
    scrollToCurrentHash();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeWebsite, {
      once: true,
    });
  } else {
    initializeWebsite();
  }

  /**
   * Safety fallback:
   * remove the preloader even if another script causes an error.
   */
  window.addEventListener(
    "load",
    () => {
      removePreloader();

      if (typeof window.AOS !== "undefined") {
        window.AOS.refresh();
      }
    },
    { once: true }
  );
})();
