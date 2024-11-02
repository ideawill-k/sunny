// 배너 슬라이더 관련 변수
let currentSlide = 0;
const totalSlides = 5;
const container = document.getElementById('banner-container');
const dots = document.querySelectorAll('.dot');

// 도트 업데이트 함수
function updateDots() {
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
    });
}

// 슬라이드 이동 함수
function moveSlide(direction, event) {
    if (event) {
        event.stopPropagation();
    }
    
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    container.style.transform = `translateX(-${currentSlide * 20}%)`;
    updateDots();
}

// 특정 슬라이드로 이동
function goToSlide(index, event) {
    if (event) {
        event.stopPropagation();
    }

    currentSlide = index;
    container.style.transform = `translateX(-${currentSlide * 20}%)`;
    updateDots();
}

// 자동 슬라이드 설정
let slideInterval = setInterval(() => moveSlide(1), 5000);

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

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 배너 초기화
    if (container) {
        updateDots();
        
        // 배너 마우스 이벤트
        const bannerWrapper = document.querySelector('.banner-wrapper');
        if (bannerWrapper) {
            bannerWrapper.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            bannerWrapper.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => moveSlide(1), 5000);
            });
        }

        // 터치 이벤트 처리
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const diffX = touchStartX - touchEndX;
            if (Math.abs(diffX) > 50) { // 최소 스와이프 거리
                if (diffX > 0) {
                    moveSlide(1);
                } else {
                    moveSlide(-1);
                }
            }
        }
    }

    // 카드 애니메이션 설정
    setupCardAnimations();

    // 이미지 프리로드
    preloadImages();

    // 스크롤 애니메이션
    const sections = document.querySelectorAll('.section-container');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
});