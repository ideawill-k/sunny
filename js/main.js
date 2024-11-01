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
    // 초기 도트 상태 설정
    updateDots();

    // 배너 마우스 이벤트
    container.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    container.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => moveSlide(1), 5000);
    });

    // 모바일 메뉴 토글
    document.getElementById('mobile-menu-button').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const isHidden = mobileMenu.classList.contains('hidden');
        
        // 메뉴 토글
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            // 약간의 지연 후 트랜지션 적용
            requestAnimationFrame(() => {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            });
        } else {
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.opacity = '0';
            // 트랜지션이 완료된 후 hidden 클래스 추가
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    });

    // 모바일 메뉴 외부 클릭시 닫기
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        
        if (!mobileMenu.contains(event.target) && 
            !mobileMenuButton.contains(event.target) && 
            !mobileMenu.classList.contains('hidden')) {
            
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.opacity = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        }
    });
});