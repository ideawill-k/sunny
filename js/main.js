// Base URL 설정 - GitHub Pages
const BASE_URL = window.location.hostname === 'ideawill-k.github.io' 
    ? '/sunny'  // GitHub Pages
    : '';       // 로컬 개발

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

// 페이지별 초기화 함수들
const pageInitializers = {
    // 메인 페이지 초기화
    index: function() {
        if (container) {
            updateDots();
            // 배너 마우스 이벤트
            container.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            container.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => moveSlide(1), 5000);
            });
        }
    },

    // 면세점 페이지 초기화
    dutyfree: function() {
        const barcodeConfig = {
            format: "CODE128",
            width: 1.5,
            height: 40,
            displayValue: false,
            margin: 5
        };

        const barcodes = [
            { id: "barcode1", code: "00622034000001" },
            { id: "barcode2", code: "3230700008" },
            { id: "barcode3", code: "3240300013" },
            { id: "barcode4", code: "00622019000001" },
            { id: "barcode5", code: "3240300080" }
        ];

        barcodes.forEach(({ id, code }) => {
            const element = document.getElementById(id);
            if (element) {
                JsBarcode(`#${id}`, code, barcodeConfig);
            }
        });

        // 필터 버튼 이벤트 설정
        const filterButtons = document.querySelectorAll('.flex.flex-wrap.gap-2 button');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-black', 'text-white');
                    btn.classList.add('bg-gray-100', 'text-gray-800');
                });
                
                this.classList.remove('bg-gray-100', 'text-gray-800');
                this.classList.add('bg-black', 'text-white');
            });
        });
    },

    // 여행할인 페이지 초기화
    discount: function() {
        // 여행할인 페이지 관련 초기화 코드
    },

    // 여행정보 페이지 초기화
    info: function() {
        // 여행정보 페이지 관련 초기화 코드
    },

    // About 페이지 초기화
    about: function() {
        // About 페이지 관련 초기화 코드
    }
};

// 모바일 메뉴 토글 함수
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

// 네비게이션 설정
function setupNavigation() {
    // 모바일 메뉴 버튼 이벤트
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // 네비게이션 링크 이벤트
    document.querySelectorAll('a[href^="pages/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const pageName = href.replace('pages/', '').replace('.html', '');
            loadPage(pageName);
            
            // 모바일 메뉴가 열려있다면 닫기
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });
}

// 로고 클릭 설정
function setupLogoClick() {
    const logo = document.querySelector('a[href="index.html"]');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = BASE_URL + '/';
        });
    }
}

// 페이지 콘텐츠 로드 함수
async function loadPage(pageName) {
    try {
        const contentArea = document.getElementById('content');
        
        const response = await fetch(`${BASE_URL}/pages/${pageName}.html`);
        if (!response.ok) {
            console.error('Page not found');
            return;
        }
        
        const content = await response.text();
        contentArea.innerHTML = content;

        // 해당 페이지의 초기화 함수 실행
        if (pageInitializers[pageName]) {
            pageInitializers[pageName]();
        }

        // URL 업데이트
        history.pushState({page: pageName}, '', `${BASE_URL}/pages/${pageName}.html`);

    } catch (error) {
        console.error('Page load error:', error);
    }
}

// 브라우저 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', function(event) {
    const path = window.location.pathname;
    const match = path.match(/pages\/([^/]+)\.html$/);
    
    if (match) {
        loadPage(match[1]);
    } else if (path === BASE_URL + '/' || path === BASE_URL + '/index.html') {
        window.location.reload();
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기본 설정
    setupNavigation();
    setupLogoClick();
    
    // 현재 페이지 확인 및 초기화
    const path = window.location.pathname;
    const match = path.match(/pages\/([^/]+)\.html$/);
    
    if (match && pageInitializers[match[1]]) {
        pageInitializers[match[1]]();
    } else {
        // index 페이지 초기화
        pageInitializers.index();
    }
});