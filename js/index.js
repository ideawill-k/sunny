// 배너 관련 변수
let currentSlide = 0;
const totalSlides = 5;
const container = document.getElementById('banner-container');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// 도트 업데이트
function updateDots() {
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
}

// 슬라이드 이동
function moveSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    const offset = -currentSlide * 20; // 20%씩 이동
    container.style.transform = `translateX(${offset}%)`;
    updateDots();
}

// 특정 슬라이드로 이동
function goToSlide(index) {
    currentSlide = index;
    const offset = -currentSlide * 20;
    container.style.transform = `translateX(${offset}%)`;
    updateDots();
    resetAutoSlide();
}

// 자동 슬라이드 시작
function startAutoSlide() {
    slideInterval = setInterval(moveSlide, 5000);
}

// 자동 슬라이드 리셋
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// 배너 초기화
function initializeBanner() {
    if (!container) return;
    
    updateDots();
    startAutoSlide();
    
    // 마우스 오버시 일시정지
    container.parentElement.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    container.parentElement.addEventListener('mouseleave', startAutoSlide);
}

// 터치 이벤트 처리
function setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        clearInterval(slideInterval);
    }

    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }

    function handleTouchEnd() {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                moveSlide();
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
    if ('IntersectionObserver' in window) {
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
}

// 카드 애니메이션
function setupCardAnimations() {
    const cards = document.querySelectorAll('.section-container .group');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 배너 초기화
    initializeBanner();
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
    
    // 카드 애니메이션 초기화
    setupCardAnimations();
});