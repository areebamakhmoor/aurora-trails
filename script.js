const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const backToTop = document.querySelector(".back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevButton = document.querySelector(".slider-btn--prev");
const nextButton = document.querySelector(".slider-btn--next");
const dotsContainer = document.querySelector(".slider-dots");
const tripForm = document.querySelector("#trip-form");
const formStatus = document.querySelector("#form-status");

let activeTestimonial = 0;
let testimonialTimer;

function updateHeaderState() {
  const isScrolled = window.scrollY > 40;
  header.classList.toggle("is-scrolled", isScrolled);
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
}

function closeMobileMenu() {
  navToggle.classList.remove("is-open");
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16
  });

  revealItems.forEach((item) => observer.observe(item));
}

function createTestimonialDots() {
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      showTestimonial(index);
      restartTestimonialTimer();
    });
    dotsContainer.appendChild(dot);
  });
}

function showTestimonial(index) {
  activeTestimonial = (index + testimonialCards.length) % testimonialCards.length;

  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-active", cardIndex === activeTestimonial);
  });

  dotsContainer.querySelectorAll("button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeTestimonial);
  });
}

function restartTestimonialTimer() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(() => {
    showTestimonial(activeTestimonial + 1);
  }, 5500);
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (!tripForm.checkValidity()) {
    formStatus.textContent = "Please complete the required fields.";
    return;
  }

  const name = document.querySelector("#name").value.trim().split(" ")[0] || "traveler";
  formStatus.textContent = `Thank you, ${name}. Your enquiry is ready to be reviewed.`;
  tripForm.reset();
}

navToggle.addEventListener("click", toggleMobileMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth >= 920) {
    closeMobileMenu();
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

prevButton.addEventListener("click", () => {
  showTestimonial(activeTestimonial - 1);
  restartTestimonialTimer();
});

nextButton.addEventListener("click", () => {
  showTestimonial(activeTestimonial + 1);
  restartTestimonialTimer();
});

tripForm.addEventListener("submit", handleFormSubmit);

updateHeaderState();
revealOnScroll();
createTestimonialDots();
showTestimonial(activeTestimonial);
restartTestimonialTimer();
