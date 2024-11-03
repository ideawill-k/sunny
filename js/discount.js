// 모바일 메뉴 토글
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });

        // 메뉴 외부 클릭시 닫기
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            }
        });
    }
}

// 카드 애니메이션
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    cards.forEach(card => observer.observe(card));
}

// 할인 버튼 클릭 효과
function initializeDiscountButtons() {
    const buttons = document.querySelectorAll('.discount-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.className = 'ripple';
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// 스크롤 애니메이션
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => sectionObserver.observe(section));
}

// 쿠폰 복사 기능
function initializeCouponCopy() {
    const couponButtons = document.querySelectorAll('.copy-coupon');
    
    couponButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const couponCode = this.dataset.coupon;
            
            try {
                await navigator.clipboard.writeText(couponCode);
                
                // 복사 성공 표시
                const originalText = this.textContent;
                this.textContent = '복사완료!';
                
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1500);
            } catch (err) {
                console.error('쿠폰 복사 실패:', err);
            }
        });
    });
}

// 반응형 이미지 로딩
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 카테고리 필터링
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const cards = document.querySelectorAll('.discount-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // 버튼 활성화 상태 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 카드 필터링
            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('fade-in'), 10);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
                }
            });
        });
    });
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeCardAnimations();
    initializeDiscountButtons();
    initializeScrollAnimations();
    initializeCouponCopy();
    initializeLazyLoading();
    initializeFilters();
    
    // 윈도우 리사이즈 이벤트 처리
    window.addEventListener('resize', debounce(() => {
        // 리사이즈 시 필요한 조정 작업
    }, 250));

    // 터치 디바이스 감지
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});