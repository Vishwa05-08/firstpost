// Wait for the entire HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  // --- PRELOADER ---
  // =================================================================
  const preloader = document.getElementById('preloader');
  // Use window.onload to ensure all assets (like images) are loaded before hiding
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('loaded');
    }
  });


  // =================================================================
  // --- ADVANCED ANIMATIONS ---
  // =================================================================

  // 1. Animated Headline Text Reveal
  function setupLetterAnimation(headline) {
    // Prevent re-animating if it's already done
    if (headline.classList.contains('is-animated')) return;

    const text = headline.getAttribute('data-text') || headline.textContent;
    headline.setAttribute('data-text', text); // Store original text
    headline.innerHTML = ''; // Clear original text
    headline.classList.add('is-animated');

    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      // Use non-breaking space for actual spaces to maintain layout
      span.innerHTML = char === ' ' ? '&nbsp;' : char;
      span.style.animationDelay = `${index * 0.04}s`;
      headline.appendChild(span);
    });
  }

  // Initial setup for the first active slide
  const initialHeadline = document.querySelector('.hero-slide.active .animated-headline');
  if (initialHeadline) {
    setupLetterAnimation(initialHeadline);
  }


  // 2. Magnetic Buttons
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  if (magneticButtons.length > 0) {
    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Move the button with a magnetic effect
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        this.style.transition = 'transform 0.1s ease-out';
      });

      button.addEventListener('mouseleave', function() {
        // Return to original position smoothly
        this.style.transform = 'translate(0, 0)';
        this.style.transition = 'transform 0.3s ease-in-out';
      });
    });
  }

  // 3. Hero Mouse Parallax
  const heroSlider = document.getElementById('hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mousemove', (e) => {
      // Check if it's not a touch device to avoid issues on mobile
      if (window.matchMedia("(pointer: fine)").matches) {
        const { clientX, clientY } = e;
        const { offsetWidth, offsetHeight } = heroSlider;
        const xPos = (clientX / offsetWidth - 0.5) * 40; // The '40' controls intensity
        const yPos = (clientY / offsetHeight - 0.5) * 40;

        const activeBackground = heroSlider.querySelector('.hero-slide.active .hero-background');
        if (activeBackground) {
          activeBackground.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }
      }
    });
  }


  // --- CACHE DOM ELEMENTS ---
  const navbar = document.getElementById('navbar');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('#nav-links a');
  const menuToggle = document.getElementById('menu-toggle');
  const topBtn = document.getElementById('topBtn');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const sections = document.querySelectorAll('section[id]');
  const sectionsToAnimate = document.querySelectorAll('section:not(.hero-slider)');

  // --- NAVIGATION ---

  if(menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });
  }

  if(navLinksContainer) {
    navLinksContainer.addEventListener('click', () => {
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.classList.remove('active');
      }
    });
  }

  // --- SCROLL HANDLING ---
  const handleScroll = () => {
    // Sticky Navbar
    if (navbar && window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else if (navbar) {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button visibility
    if (topBtn && window.scrollY > 500) {
      topBtn.classList.add('show');
    } else if (topBtn) {
      topBtn.classList.remove('show');
    }

    // Scroll Spy for Navigation
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= sectionTop - 150) { // 150 is an offset for better timing
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-link');
      const href = link.getAttribute('href');
      if (href && href.length > 1 && href.includes(currentSection)) {
        link.classList.add('active-link');
      }
    });

    // Handle home link separately for the top of the page
    const homeLink = document.querySelector('#nav-links a[href="#"]');
    if (currentSection === '' || currentSection === 'hero-slider') {
      if(homeLink) homeLink.classList.add('active-link');
    } else {
      if(homeLink) homeLink.classList.remove('active-link');
    }
  };

  window.addEventListener('scroll', handleScroll);

  // --- HERO SLIDER ---
  let currentHeroSlide = 0;

  function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
      slide.classList.remove('active');
      const headline = slide.querySelector('.animated-headline');
      if(headline) headline.classList.remove('is-animated');

      if (i === index) {
        slide.classList.add('active');
        const newHeadline = slide.querySelector('.animated-headline');
        if (newHeadline) {
          setupLetterAnimation(newHeadline);
        }
      }
    });
  }

  function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
    showHeroSlide(currentHeroSlide);
  }

  if (heroSlides.length > 1) {
    setInterval(nextHeroSlide, 6000);
  }

  // --- SCROLL TO TOP BUTTON ---
  if(topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- SCROLL-REVEAL ANIMATIONS ---
  const revealSection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  sectionsToAnimate.forEach(section => {
    sectionObserver.observe(section);
  });

  // =================================================================
  // --- TESTIMONIAL SLIDER ---
  // =================================================================
  const slidesContainer = document.querySelector('.testimonial-slides');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  let currentTestimonialSlide = 0;

  function showTestimonialSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      if (i === index) {
        slide.classList.add('active');
      }
    });
    if (slidesContainer) {
      slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  if (slides.length > 0) {
    showTestimonialSlide(currentTestimonialSlide);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentTestimonialSlide = (currentTestimonialSlide + 1) % slides.length;
        showTestimonialSlide(currentTestimonialSlide);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentTestimonialSlide = (currentTestimonialSlide - 1 + slides.length) % slides.length;
        showTestimonialSlide(currentTestimonialSlide);
      });
    }

    setInterval(() => {
      currentTestimonialSlide = (currentTestimonialSlide + 1) % slides.length;
      showTestimonialSlide(currentTestimonialSlide);
    }, 5000);
  }


  // =================================================================
  // --- AI CHATBOT (WITH HISTORY) ---
  // =================================================================
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbot = document.querySelector('.chatbot');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotMessages = document.getElementById('chatbot-messages');
  let chatHistory = []; // Initialize chat history array

  // Function to save chat history to localStorage
  function saveChatHistory() {
    localStorage.setItem('firstlookChatHistory', JSON.stringify(chatHistory));
  }

  // Function to add a message to the UI and optionally to history
  function addMessage(text, sender, save = true) {
    const messageElement = document.createElement('li');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = text;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    if (save) {
      chatHistory.push({ text, sender });
      saveChatHistory();
    }
  }

  // Function to load chat history from localStorage
  function loadChatHistory() {
    const savedHistory = localStorage.getItem('firstlookChatHistory');
    if (savedHistory && JSON.parse(savedHistory).length > 0) {
      chatHistory = JSON.parse(savedHistory);
      chatbotMessages.innerHTML = ''; // Clear default message from HTML
      chatHistory.forEach(message => {
        addMessage(message.text, message.sender, false); // Add to UI without saving again
      });
    } else {
      // If no history, add the default welcome message to our history array
      const firstMessage = "Hello! How can I help you today?";
      chatHistory.push({ text: firstMessage, sender: 'bot' });
      saveChatHistory();
    }
  }

  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
      chatbot.classList.toggle('open');
    });
  }

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userInput = chatbotInput.value.trim();
      if (userInput) {
        addMessage(userInput, 'user'); // This will now save automatically
        chatbotInput.value = '';
        getBotResponse(userInput);
      }
    });
  }

  function showTypingIndicator() {
    const typingElement = document.createElement('li');
    typingElement.className = 'message bot typing-indicator';
    typingElement.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(typingElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return typingElement;
  }

  function getBotResponse(userInput) {
    const typingIndicator = showTypingIndicator();
    const lowerCaseInput = userInput.toLowerCase();
    let response = "I'm sorry, I'm not sure how to answer that. Could you ask about our services, team, or how to contact us?";

    if (lowerCaseInput.includes('hello') || lowerCaseInput.includes('hi')) {
      response = "Hello there! How can I assist you with our services today?";
    } else if (lowerCaseInput.includes('service')) {
      response = "We offer Web Development, Marketing, and Brand Strategy. Which one are you most interested in?";
    } else if (lowerCaseInput.includes('web') || lowerCaseInput.includes('development')) {
      response = "Our Web Development service focuses on creating modern, responsive websites to help your business succeed online.";
    } else if (lowerCaseInput.includes('marketing')) {
      response = "We create effective marketing strategies to help you reach your target audience and grow your brand.";
    } else if (lowerCaseInput.includes('brand') || lowerCaseInput.includes('strategy')) {
      response = "Our Brand Strategy service helps you build a powerful and memorable brand identity.";
    } else if (lowerCaseInput.includes('team') || lowerCaseInput.includes('who')) {
      response = "Our team consists of experienced professionals: John Doe (CEO), Jane Smith (Marketing Head), and Alex Lee (Lead Developer).";
    } else if (lowerCaseInput.includes('contact') || lowerCaseInput.includes('phone') || lowerCaseInput.includes('email')) {
      response = "You can contact us via phone at +880 1934 781924 or by email at example@mail.com.";
    } else if (lowerCaseInput.includes('thank')) {
      response = "You're welcome! Is there anything else I can help you with?";
    }

    setTimeout(() => {
      chatbotMessages.removeChild(typingIndicator);
      addMessage(response, 'bot'); // This will now save automatically
    }, 1500);
  }

  // Load chat history when the chatbot section is initialized
  if (chatbot) {
    loadChatHistory();
  }

});
