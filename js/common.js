// 모바일 메뉴 토글
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 모바일 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
});

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