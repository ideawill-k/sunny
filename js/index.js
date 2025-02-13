// Banner related variables
let currentSlide = 0;
const totalSlides = 8;
const bannerContainer = document.getElementById('banner-container');
const bannerWrapper = document.querySelector('.banner-wrapper');
let autoSlideInterval;

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
    currentSlide = index;
    updateSlidePosition();
    updateDots();
    resetAutoSlide();
}

// Update slide position
function updateSlidePosition() {
    const offset = -(currentSlide * (100 / totalSlides));
    bannerContainer.style.transform = `translateX(${offset}%)`;
}

// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
    updateDots();
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
    updateDots();
}

// Start auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
}

// Reset auto slide
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Adjust banner size
function adjustBannerSize() {
    const banner = document.querySelector('.banner-wrapper');
    if (banner) {
        const width = window.innerWidth;
        if (width <= 768) {
            banner.style.height = '270px';
            // 모바일에서 이미지 크기 조정
            const images = banner.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '100%';
                img.style.height = '270px';
            });
        } else {
            banner.style.height = '540px';
            // PC에서 이미지 크기 복원
            const images = banner.querySelectorAll('img');
            images.forEach(img => {
                img.style.width = '1140px';
                img.style.height = '540px';
            });
        }
    }
}

// Initialize banner
function initializeBanner() {
    if (!bannerContainer) return;

    // Initialize dots
    initializeDots();

    // Add click event listeners to navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
    }

    // Add touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    bannerWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    }, { passive: true });

    bannerWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.touches[0].clientX;
        const difference = touchStartX - touchEndX;
        const offset = -(currentSlide * (100 / totalSlides)) - (difference / bannerWrapper.offsetWidth * 100);
        
        // Add resistance at the edges
        if ((currentSlide === 0 && difference < 0) || 
            (currentSlide === totalSlides - 1 && difference > 0)) {
            bannerContainer.style.transform = `translateX(${offset / 3}%)`; // Reduced movement
        } else {
            bannerContainer.style.transform = `translateX(${offset}%)`;
        }
    }, { passive: true });

    bannerWrapper.addEventListener('touchend', () => {
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

    // Add mouse events for desktop drag
    bannerWrapper.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        isDragging = true;
        clearInterval(autoSlideInterval);
    });

    bannerWrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        touchEndX = e.clientX;
        const difference = touchStartX - touchEndX;
        const offset = -(currentSlide * (100 / totalSlides)) - (difference / bannerWrapper.offsetWidth * 100);
        bannerContainer.style.transform = `translateX(${offset}%)`;
    });

    bannerWrapper.addEventListener('mouseup', () => {
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
            startAutoSlide();
        }
    });

    // Prevent default drag behavior
    bannerWrapper.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Start auto slide
    startAutoSlide();

    // Pause auto slide on hover
    bannerWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    bannerWrapper.addEventListener('mouseleave', startAutoSlide);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeBanner();
    adjustBannerSize();

    // Add resize event listener for responsive banner
    window.addEventListener('resize', adjustBannerSize);
});