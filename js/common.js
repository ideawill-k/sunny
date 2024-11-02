// 기본 URL 설정
const BASE_URL = '/sunny';

// 로고 클릭 설정
function setupLogoClick() {
    document.querySelector('a[href="index.html"]').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = BASE_URL + '/';
    });
}

// 공통 유틸리티 함수
const utils = {
    // 모바일 체크
    isMobile() {
        return window.innerWidth <= 768;
    },

    // 스크롤 제어
    disableScroll() {
        document.body.style.overflow = 'hidden';
    },

    enableScroll() {
        document.body.style.overflow = '';
    }
};

// 모바일 메뉴 토글
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 메뉴 토글시 스타일 조정
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                utils.disableScroll(); // 메뉴 열릴 때 스크롤 방지
            } else {
                mobileMenu.classList.add('hidden');
                utils.enableScroll(); // 메뉴 닫힐 때 스크롤 허용
            }
        });

        // 모바일 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && 
                !mobileMenuButton.contains(event.target) && 
                !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                utils.enableScroll();
            }
        });

        // 모바일 메뉴 내부 링크 클릭시 자동으로 메뉴 닫기
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                utils.enableScroll();
            });
        });
    }
});