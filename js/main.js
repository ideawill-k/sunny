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

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    updateDots();
    
    // 배너 마우스 이벤트
    if (container) {
        container.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        container.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => moveSlide(1), 5000);
        });
    }
});