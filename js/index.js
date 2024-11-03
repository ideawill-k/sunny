// 배너 슬라이더 관련 변수
let isTransitioning = false;
let currentSlide = 1;
const totalSlides = 5;
const container = document.getElementById('banner-container');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// 도트 업데이트 함수
function updateDots() {
    const actualIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === actualIndex);
    });
}

// 슬라이드 이동 함수
function moveSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentSlide += direction;
    const offset = -(currentSlide * (100/7));
    
    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(${offset}%)`;
    
    // 트랜지션 완료 후 처리
    setTimeout(() => {
        container.style.transition = 'none';
        
        // 무한 슬라이드를 위한 위치 재조정
        if (currentSlide <= 0) {
            currentSlide = totalSlides;
            const resetOffset = -(currentSlide * (100/7));
            container.style.transform = `translateX(${resetOffset}%)`;
        } else if (currentSlide > totalSlides) {
            currentSlide = 1;
            const resetOffset = -(currentSlide * (100/7));
            container.style.transform = `translateX(${resetOffset}%)`;
        }
        
        requestAnimationFrame(() => {
            container.style.transition = 'transform 0.5s ease-in-out';
        });
        
        updateDots();
        isTransitioning = false;
    }, 500);
}

// 특정 슬라이드로 이동
function goToSlide(index) {
    if (isTransitioning) return;
    
    const direction = index + 1 - currentSlide;
    moveSlide(direction);
}

// 자동 슬라이드 시작
function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => moveSlide(1), 5000);
}

// 자동 슬라이드 정지
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// 터치 이벤트 처리
function setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    }

    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) { // 최소 스와이프 거리
            if (difference > 0) {
                moveSlide(1);
            } else {
                moveSlide(-1);
            }
        }
        startAutoSlide();
    }

    if (container) {
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true });
        container.addEventListener('touchend', handleTouchEnd);
    }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// 외부 클릭시 모바일 메뉴 닫기
function handleClickOutside(e) {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && !mobileMenu.contains(e.target) && 
        mobileMenuButton && !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
}

// 스크롤 애니메이션
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    sections.forEach(section => observer.observe(section));
}

// 이미지 지연 로딩
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// 배너 초기화
function initializeBanner() {
    if (!container) return;
    
    // 첫 번째와 마지막 슬라이드 복제
    const slides = container.children;
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    
    container.appendChild(firstSlide);
    container.insertBefore(lastSlide, slides[0]);
    
    // 초기 위치 설정
    currentSlide = 1;
    const initialOffset = -(currentSlide * (100/7));
    container.style.transform = `translateX(${initialOffset}%)`;
    
    updateDots();
    startAutoSlide();
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 배너 초기화
    initializeBanner();
    
    // 배너 마우스 이벤트
    const bannerWrapper = document.querySelector('.banner-wrapper');
    if (bannerWrapper) {
        bannerWrapper.addEventListener('mouseenter', stopAutoSlide);
        bannerWrapper.addEventListener('mouseleave', startAutoSlide);
    }

    // 터치 이벤트 초기화
    setupTouchEvents();
    
    // 모바일 메뉴 이벤트
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // 외부 클릭 이벤트
    document.addEventListener('click', handleClickOutside);
    
    // 스크롤 애니메이션 초기화
    setupScrollAnimations();
    
    // 이미지 지연 로딩 초기화
    setupLazyLoading();
});