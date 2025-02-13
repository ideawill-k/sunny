// Banner related variables
let currentSlide = 0;
const totalSlides = 8;
const bannerContainer = document.getElementById('banner-container');
const bannerWrapper = document.querySelector('.banner-wrapper');
let autoSlideInterval;
let isTransitioning = false;

// Initialize banner dots
function initializeDots() {
    const dotsContainer = document.querySelector('.banner-dots');
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dot.setAttribute('aria-label', `배너 ${i + 1}번으로 이동`);
        dotsContainer.appendChild(dot);
    }
}

// Update dots
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Go to specific slide
function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentSlide = index;
    updateSlidePosition();
    updateDots();
    resetAutoSlide();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

// Update slide position
function updateSlidePosition() {
    const offset = -(currentSlide * (100 / totalSlides));
    bannerContainer.style.transform = `translateX(${offset}%)`;
}

// Next slide
function nextSlide() {
    if (isTransitioning) return;
    goToSlide((currentSlide + 1) % totalSlides);
}

// Previous slide
function prevSlide() {
    if (isTransitioning) return;
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

// Start auto slide
function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000);
}

// Reset auto slide
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Top Button Functions
function handleTopButton() {
    const topButton = document.getElementById('topButton');
    
    // 스크롤 이벤트 처리
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            topButton.classList.add('visible');
        } else {
            topButton.classList.remove('visible');
        }
    });

    // 클릭 이벤트 처리
    topButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize banner
function initializeBanner() {
    if (!bannerContainer) return;

    initializeDots();

    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isTransitioning) {
                prevSlide();
                resetAutoSlide();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isTransitioning) {
                nextSlide();
                resetAutoSlide();
            }
        });
    }

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    bannerWrapper.addEventListener('touchstart', (e) => {
        if (isTransitioning) return;
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    }, { passive: true });

    bannerWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging || isTransitioning) return;
        touchEndX = e.touches[0].clientX;
        
        clearInterval(autoSlideInterval);
    }, { passive: true });

    bannerWrapper.addEventListener('touchend', () => {
        if (!isDragging || isTransitioning) return;
        isDragging = false;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            updateSlidePosition();
        }
        
        startAutoSlide();
    });

    // Mouse events for desktop
    bannerWrapper.addEventListener('mousedown', (e) => {
        if (isTransitioning) return;
        e.preventDefault();
        touchStartX = e.clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });

    bannerWrapper.addEventListener('mousemove', (e) => {
        if (!isDragging || isTransitioning) return;
        e.preventDefault();
        touchEndX = e.clientX;
    });

    bannerWrapper.addEventListener('mouseup', () => {
        if (!isDragging || isTransitioning) return;
        isDragging = false;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            updateSlidePosition();
        }
        
        startAutoSlide();
    });

    bannerWrapper.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            updateSlidePosition();
        }
        startAutoSlide();
    });

    // Prevent default drag behavior
    bannerWrapper.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Pause auto slide on hover
    bannerWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    bannerWrapper.addEventListener('mouseleave', startAutoSlide);

    // Initial auto slide start
    startAutoSlide();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeBanner();
    handleTopButton();
});