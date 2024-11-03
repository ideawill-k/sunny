// 배너 슬라이더 관련 변수
let isTransitioning = false;
let currentSlide = 1; // 실제 첫 번째 슬라이드 (복제 슬라이드 다음)
const totalSlides = 5;
const container = document.getElementById('banner-container');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// 도트 업데이트 함수
function updateDots() {
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === (currentSlide - 1));
    });
}

// 슬라이드 이동 함수
function moveSlide(direction, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentSlide = (currentSlide + direction);
    const offset = -(currentSlide * (100/7)); // 7은 전체 슬라이드 수 (5 + 2개 복제)
    
    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(${offset}%)`;
    
    // 트랜지션 완료 후 처리
    setTimeout(() => {
        if (currentSlide === 0) { // 처음으로 돌아갈 때
            container.style.transition = 'none';
            currentSlide = totalSlides;
            const resetOffset = -(currentSlide * (100/7));
            container.style.transform = `translateX(${resetOffset}%)`;
        } else if (currentSlide === totalSlides + 1) { // 마지막으로 갈 때
            container.style.transition = 'none';
            currentSlide = 1;
            const resetOffset = -(currentSlide * (100/7));
            container.style.transform = `translateX(${resetOffset}%)`;
        }
        
        updateDots();
        isTransitioning = false;
    }, 500);
}

// 특정 슬라이드로 이동
function goToSlide(index, event) {
    if (event) {
        event.stopPropagation();
    }
    
    currentSlide = index + 1;
    const offset = -(currentSlide * (100/7));
    container.style.transition = 'transform 0.5s ease-in-out';
    container.style.transform = `translateX(${offset}%)`;
    updateDots();
}

// 자동 슬라이드 시작
function startAutoSlide() {
    slideInterval = setInterval(() => moveSlide(1), 5000);
}

// 자동 슬라이드 정지
function stopAutoSlide() {
    clearInterval(slideInterval);
}

// 메인 페이지 카드 애니메이션 설정
function setupCardAnimations() {
    const cards = document.querySelectorAll('.section-container .group');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
}

// 이미지 프리로드
function preloadImages() {
    const bannerSlides = document.querySelectorAll('.banner-slide img');
    bannerSlides.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
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

// Intersection Observer를 사용한 애니메이션
function setupIntersectionObserver() {
    const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // 섹션 애니메이션
    const sections = document.querySelectorAll('.section-container');
    sections.forEach(section => observer.observe(section));
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 배너 초기화
    if (container) {
        // 초기 위치 설정
        currentSlide = 1;
        const initialOffset = -(currentSlide * (100/7));
        container.style.transform = `translateX(${initialOffset}%)`;
        updateDots();
        startAutoSlide();
        
        // 배너 마우스 이벤트
        const bannerWrapper = document.querySelector('.banner-wrapper');
        if (bannerWrapper) {
            bannerWrapper.addEventListener('mouseenter', stopAutoSlide);
            bannerWrapper.addEventListener('mouseleave', startAutoSlide);
        }

        // 터치 이벤트 초기화
        setupTouchEvents();
    }

    // 카드 애니메이션 설정
    setupCardAnimations();

    // 이미지 프리로드
    preloadImages();

    // 섹션 애니메이션 초기화
    setupIntersectionObserver();
});