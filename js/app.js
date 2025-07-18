// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

  // --- CACHE DOM ELEMENTS ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('nav-links');
  const menuToggle = document.getElementById('menu-toggle');
  const topBtn = document.getElementById('topBtn');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const sectionsToAnimate = document.querySelectorAll('section:not(.hero-slider)');

  // --- NAVIGATION ---

  // 1. Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // 2. Close mobile menu when a link is clicked
  navLinks.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });

  // 3. Sticky Navbar on Scroll
  const handleScroll = () => {
    // Navbar style change
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (window.scrollY > 500) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', handleScroll);

  // --- HERO SLIDER ---
  let currentSlide = 0;

  function showSlide(index) {
    heroSlides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
  }

  // Automatically change slide every 5 seconds (5000 milliseconds)
  if (heroSlides.length > 1) {
    setInterval(nextSlide, 5000);
  }

  // --- SCROLL TO TOP BUTTON ---
  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- SCROLL-REVEAL ANIMATIONS ---
  const revealSection = (entries, observer) => {
    entries.forEach(entry => {
      // If the section is intersecting the viewport
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing the section once it has been revealed
        observer.unobserve(entry.target);
      }
    });
  };

  // Create an observer to watch for sections entering the viewport
  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null, // observes intersections relative to the viewport
    threshold: 0.15, // trigger when 15% of the section is visible
  });

  // Observe each section
  sectionsToAnimate.forEach(section => {
    sectionObserver.observe(section);
  });

});
