// 공통 유틸리티 클래스
class Utils {
    static isMobile() {
        return window.innerWidth <= 768;
    }

    static disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    static enableScroll() {
        document.body.style.overflow = '';
    }
}

// 모바일 메뉴 클래스
class MobileMenu {
    constructor() {
        this.button = document.getElementById('mobile-menu-button');
        this.menu = document.getElementById('mobile-menu');
        this.isOpen = false;
        
        if (this.button && this.menu) {
            this.init();
        }
    }

    init() {
        // 메뉴 버튼 클릭 이벤트
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        // 외부 클릭 이벤트
        this.setupOutsideClickListener();
        
        // 메뉴 내부 링크 클릭 이벤트
        this.setupMenuLinksListener();
    }

    toggleMenu() {
        if (this.menu.classList.contains('hidden')) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }

    openMenu() {
        this.menu.classList.remove('hidden');
        Utils.disableScroll();
        this.isOpen = true;
    }

    closeMenu() {
        this.menu.classList.add('hidden');
        Utils.enableScroll();
        this.isOpen = false;
    }

    setupOutsideClickListener() {
        document.addEventListener('click', (event) => {
            if (this.isOpen && 
                !this.menu.contains(event.target) && 
                !this.button.contains(event.target)) {
                this.closeMenu();
            }
        });
    }

    setupMenuLinksListener() {
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }
}

// 페이지 네비게이션 클래스 (페이지 전환 관리)
class PageNavigation {
    constructor() {
        this.setupNavigationListeners();
    }

    setupNavigationListeners() {
        // 모든 네비게이션 링크에 대한 이벤트 리스너
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.href.includes(window.location.origin)) {
                link.addEventListener('click', (e) => this.handleNavigation(e, link));
            }
        });
    }

    handleNavigation(e, link) {
        // 여기에 페이지 전환 관련 로직 추가 가능
        // 예: 페이지 전환 애니메이션 등
    }
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 모바일 메뉴 초기화
    window.mobileMenu = new MobileMenu();
    
    // 페이지 네비게이션 초기화
    window.pageNavigation = new PageNavigation();
    
    // 추가적인 공통 기능 초기화
    console.log('Common features initialized');
});

// 전역에서 Utils 사용 가능하도록 설정
window.Utils = Utils;