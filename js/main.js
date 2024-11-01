// 배너 슬라이더 클래스
class BannerSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.container = document.getElementById('banner-container');
        this.dots = document.querySelectorAll('.dot');
        this.slideInterval = null;
        
        // 클래스가 초기화될 때 바로 실행
        this.init();
    }

    init() {
        if (this.container && this.dots.length > 0) {
            this.updateDots();
            this.setupAutoPlay();
            this.setupEventListeners();
        }
    }

    updateDots() {
        this.dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === this.currentSlide);
        });
    }

    moveSlide(direction, event) {
        if (event) {
            event.stopPropagation();
        }
        
        this.currentSlide = (this.currentSlide + direction + this.totalSlides) % this.totalSlides;
        this.container.style.transform = `translateX(-${this.currentSlide * 20}%)`;
        this.updateDots();
    }

    goToSlide(index, event) {
        if (event) {
            event.stopPropagation();
        }

        this.currentSlide = index;
        this.container.style.transform = `translateX(-${this.currentSlide * 20}%)`;
        this.updateDots();
    }

    setupAutoPlay() {
        this.slideInterval = setInterval(() => this.moveSlide(1), 5000);
    }

    setupEventListeners() {
        // 마우스 이벤트
        this.container.addEventListener('mouseenter', () => {
            clearInterval(this.slideInterval);
        });

        this.container.addEventListener('mouseleave', () => {
            this.slideInterval = setInterval(() => this.moveSlide(1), 5000);
        });

        // 도트 네비게이션에 이벤트 리스너 추가
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => this.goToSlide(index, e));
        });
    }
}

// 면세점 페이지 클래스 (필요한 경우)
class DutyFreePage {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.category-button');
        this.init();
    }

    init() {
        if (this.categoryButtons.length > 0) {
            this.setupCategoryButtons();
        }
    }

    setupCategoryButtons() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => this.handleCategoryClick(button));
        });
    }

    handleCategoryClick(clickedButton) {
        // 카테고리 버튼 클릭 처리
        this.categoryButtons.forEach(button => {
            button.classList.remove('bg-black', 'text-white');
            button.classList.add('bg-gray-100', 'text-gray-800');
        });
        
        clickedButton.classList.remove('bg-gray-100', 'text-gray-800');
        clickedButton.classList.add('bg-black', 'text-white');
        
        // 여기에 필터링 로직 추가
    }
}

// 페이지별 초기화
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path === '/' || path.includes('index')) {
        // 메인 페이지일 때만 슬라이더 초기화
        window.bannerSlider = new BannerSlider();
    }
    
    if (path.includes('dutyfree')) {
        // 면세점 페이지일 때 초기화
        window.dutyFreePage = new DutyFreePage();
    }
});

// 전역에서 접근 가능하도록 함수 노출 (기존 코드와의 호환성을 위해)
function moveSlide(direction, event) {
    if (window.bannerSlider) {
        window.bannerSlider.moveSlide(direction, event);
    }
}

function goToSlide(index, event) {
    if (window.bannerSlider) {
        window.bannerSlider.goToSlide(index, event);
    }
}