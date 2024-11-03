// 모바일 메뉴 토글
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });
    }
}

// 카드 애니메이션 초기화
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.group');
    
    // Intersection Observer 설정
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // 한 번 애니메이션이 실행되면 관찰 중단
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // 각 카드 관찰 시작
    cards.forEach(card => {
        observer.observe(card);
    });
}

// 스크롤 애니메이션 부드럽게 처리
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 현재 활성화된 네비게이션 링크 표시
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('text-blue-600');
            link.classList.add('font-semibold');
        }
    });
}

// 반응형 이미지 로딩 최적화
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 윈도우 리사이즈 이벤트 핸들러
const handleResize = debounce(() => {
    // 리사이즈 시 필요한 조정 작업
    const isMobile = window.innerWidth < 768;
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!isMobile && mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
}, 250);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCardAnimations();
    initializeSmoothScroll();
    highlightCurrentPage();
    lazyLoadImages();
    
    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleResize);
    
    // 터치 디바이스 감지
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
});