document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".hero-slide");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.add("active");
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  setInterval(nextSlide, 5000); // Change slide every 5 seconds

  function toggleMenu() {
    const menu = document.querySelector(".nav-links");
    menu.classList.toggle("active");
  }

  window.onscroll = function () {
    const navbar = document.querySelector(".navbar");
    const topBtn = document.getElementById("topBtn");
    if (window.scrollY > 100) {
      navbar.classList.add("sticky");
      topBtn.style.display = "block";
    } else {
      navbar.classList.remove("sticky");
      topBtn.style.display = "none";
    }
  };

  // Attach scrollToTop only after DOM is ready
  document.getElementById("topBtn").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
// Toggle nav menu on mobile
const toggleBtn = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

toggleBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Close menu when link is clicked (optional enhancement)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

// Optional: Close when clicking outside nav
window.addEventListener("click", (e) => {
  if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
    navLinks.classList.remove("active");
  }
});
