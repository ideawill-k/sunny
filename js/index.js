// 배너 슬라이더 관련 변수
let currentSlide = 0;
const totalSlides = 5;
const container = document.getElementById('banner-container');
const dots = document.querySelectorAll('.dot');
let slideInterval;

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

// 반응형 그리드 조정
function adjustGridLayout() {
   const grid = document.querySelector('.grid');
   if (grid) {
       if (window.innerWidth <= 640) {
           grid.classList.remove('grid-cols-2');
           grid.classList.add('grid-cols-1');
       } else {
           grid.classList.remove('grid-cols-1');
           grid.classList.add('grid-cols-2');
       }
   }
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
   // 배너 초기화
   if (container) {
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

   // 초기 그리드 레이아웃 설정
   adjustGridLayout();

   // 리사이즈 이벤트 처리
   window.addEventListener('resize', adjustGridLayout);
});