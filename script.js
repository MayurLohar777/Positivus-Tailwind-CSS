// Testimonial Data
const testimonials = [
  {
    name: "John Smith",
    role: "Marketing Director at XYZ Corp",
    quote: "We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence."
  },
  {
    name: "Sarah Jenkins",
    role: "Founder & CEO at GlowFashion",
    quote: "Their expertise in PPC and SEO has helped our e-commerce brand scale beyond expectations. Communication is top-notch, and the weekly reporting keeps us fully aligned. They are not just an agency; they are true partners in growth."
  },
  {
    name: "Michael Chen",
    role: "VP of Growth at SaaSify",
    quote: "Outstanding work on our Google Ads strategy! Positivus optimized our campaigns to cut our customer acquisition costs by 40% while doubling conversions. Their data-driven approach is exactly what modern marketing teams need."
  },
  {
    name: "Emily Rodriguez",
    role: "Director of Communications at GreenTech",
    quote: "The team at Positivus is creative, strategic, and execution-oriented. They completely overhauled our content strategy and social media presence, driving highly qualified B2B leads to our sales funnel."
  },
  {
    name: "David Patel",
    role: "Head of Digital at FinSphere",
    quote: "Working with Positivus was a game-changer for our launch. They designed a landing page optimization plan that boosted our conversion rate from 2.1% to 5.4% in less than 3 months. Exceptional responsiveness and domain knowledge."
  }
];

let currentIndex = 0;
let autoplayInterval = null;
const AUTOPLAY_DELAY = 6000; // 6 seconds per slide for readable text

// Elements
const track = document.getElementById("slider-track");
const paginationContainer = document.getElementById("pagination-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const sliderContainer = document.getElementById("slider-container");

// Initialize Slider
function init() {
  renderSlides();
  renderPagination();
  updateSlider();
  startAutoplay();
  setupEventListeners();
}

// Render Testimonial Cards
function renderSlides() {
  track.innerHTML = "";
  testimonials.forEach((testimonial, index) => {
    const card = document.createElement("div");
    card.className = "carousel-card flex-shrink-0 w-full md:w-[600px] flex flex-col select-none";
    card.innerHTML = `
      <div class="relative border border-[#B9FF30] rounded-[30px] p-6 md:p-8 bg-[#191A23] text-white">
        <p class="text-base md:text-[18px] leading-relaxed font-normal">
          "${testimonial.quote}"
        </p>
        <div class="speech-bubble-tail"></div>
      </div>
      <div class="mt-6 md:mt-8 ml-12 text-left">
        <div class="text-[#B9FF30] font-medium text-[18px] md:text-[20px]">${testimonial.name}</div>
        <div class="text-white text-sm md:text-base mt-0.5 font-light">${testimonial.role}</div>
      </div>
    `;
    track.appendChild(card);
  });
}

// Render Pagination Star Indicators (4-pointed Star SVG)
function renderPagination() {
  paginationContainer.innerHTML = "";
  testimonials.forEach((_, index) => {
    const dotButton = document.createElement("button");
    dotButton.className = "pagination-dot text-white hover:text-[#B9FF30] focus:outline-none transition-all p-1 cursor-pointer";
    dotButton.setAttribute("aria-label", `Go to slide ${index + 1}`);
    // 4-pointed Star SVG
    dotButton.innerHTML = `
      <svg class="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.3 8.7L22 12L15.3 15.3L12 22L8.7 15.3L2 12L8.7 8.7Z"/>
      </svg>
    `;
    dotButton.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
      resetAutoplay();
    });
    paginationContainer.appendChild(dotButton);
  });
}

// Update Slider Position & Active State Styling
function updateSlider() {
  const cards = document.querySelectorAll(".carousel-card");
  const dots = document.querySelectorAll(".pagination-dot");
  
  if (cards.length === 0) return;

  const containerWidth = sliderContainer.offsetWidth;
  const activeCard = cards[currentIndex];
  const cardWidth = activeCard.offsetWidth;
  const cardOffsetLeft = activeCard.offsetLeft;

  // Formula to translate the track to center the active card perfectly
  const targetTranslate = (containerWidth / 2) - (cardOffsetLeft + cardWidth / 2);

  // Apply transition translate
  track.style.transform = `translateX(${targetTranslate}px)`;

  // Update card classes for opacity transitions
  cards.forEach((card, index) => {
    if (index === currentIndex) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Update active pagination indicator
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// Slider Actions
function prevSlide() {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  updateSlider();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % testimonials.length;
  updateSlider();
}

// Autoplay Handlers
function startAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
  autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayInterval) clearInterval(autoplayInterval);
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Setup Event Listeners (Clicks, Swipe, Keyboard, Resize)
function setupEventListeners() {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  // Pause on Hover
  sliderContainer.addEventListener("mouseenter", stopAutoplay);
  sliderContainer.addEventListener("mouseleave", startAutoplay);

  // Responsive Resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateSlider, 100);
  });

  // Swipe Gestures
  let startX = 0;
  let endX = 0;

  sliderContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  sliderContainer.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAutoplay();
    }
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoplay();
    }
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", init);
