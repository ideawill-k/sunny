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

// 페이지 로드 관리
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupLogoClick();
});

// 네비게이션 설정
function setupNavigation() {
    document.querySelectorAll('a[href^="pages/"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const pageName = href.replace('pages/', '').replace('.html', '');
            loadPage(pageName);
        });
    });
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

        // 페이지 로드 후 바코드 생성 실행
        if (pageName === 'dutyfree') {
            JsBarcode("#barcode1", "00622034000001", {
                format: "CODE128",
                width: 1.5,
                height: 40,
                displayValue: false,
                margin: 5,
                background: "#ffffff",
                lineColor: "#000000"
            });
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