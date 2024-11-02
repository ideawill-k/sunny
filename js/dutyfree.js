// 바코드 설정
const barcodeConfig = {
    format: "CODE128",
    width: 1.5,
    height: 40,
    displayValue: false,
    margin: 5,
    background: "#ffffff",
    lineColor: "#000000"
};

// 바코드 데이터
const barcodes = [
    { id: "barcode1", code: "00622034000001" },
    { id: "barcode2", code: "3230700008" },
    { id: "barcode3", code: "3240300013" },
    { id: "barcode4", code: "00622019000001" },
    { id: "barcode5", code: "3240300080" }
];

// 바코드 생성 함수
function generateBarcodes() {
    barcodes.forEach(({ id, code }) => {
        const element = document.getElementById(id);
        if (element) {
            try {
                JsBarcode(`#${id}`, code, barcodeConfig);
            } catch (err) {
                console.error(`Error generating barcode for ${id}:`, err);
            }
        }
    });
}

// 필터 기능
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const coupons = document.querySelectorAll('.duty-coupon');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성화된 버튼 스타일 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 필터 로직
            const filterValue = this.textContent.trim();
            
            if (filterValue === 'BEST 5') {
                coupons.forEach(coupon => {
                    coupon.style.display = 'block';
                    coupon.style.animation = 'fadeIn 0.3s ease-out';
                });
            } else {
                coupons.forEach(coupon => {
                    const locationTag = coupon.querySelector('.location-tag');
                    if (locationTag && locationTag.textContent.includes(filterValue)) {
                        coupon.style.display = 'block';
                        coupon.style.animation = 'fadeIn 0.3s ease-out';
                    } else {
                        coupon.style.display = 'none';
                    }
                });
            }
        });
    });
}

// 쿠폰 애니메이션
function initializeCouponAnimations() {
    const coupons = document.querySelectorAll('.duty-coupon');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    coupons.forEach(coupon => {
        coupon.style.opacity = '0';
        coupon.style.transform = 'translateY(20px)';
        observer.observe(coupon);
    });
}

// 클립보드 복사 기능
function initializeClipboardCopy() {
    const barcodeNumbers = document.querySelectorAll('.barcode-number');
    
    barcodeNumbers.forEach(number => {
        number.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // 복사 성공 표시
                const originalText = this.textContent;
                this.textContent = '복사완료!';
                this.style.color = '#2563eb';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.color = '#6b7280';
                }, 1000);
            }).catch(err => {
                console.error('클립보드 복사 실패:', err);
            });
        });

        // 호버 효과
        number.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
            this.style.color = '#2563eb';
        });

        number.addEventListener('mouseleave', function() {
            this.style.color = '#6b7280';
        });
    });
}

// 쿠폰 정렬 기능
function initializeSorting() {
    const grid = document.querySelector('.coupon-grid');
    const coupons = Array.from(grid.children);

    // 할인금액 기준 정렬
    function sortByDiscount() {
        return coupons.sort((a, b) => {
            const aAmount = parseInt(a.querySelector('.discount-amount').textContent.replace(/[^0-9]/g, ''));
            const bAmount = parseInt(b.querySelector('.discount-amount').textContent.replace(/[^0-9]/g, ''));
            return bAmount - aAmount;
        });
    }

    // 정렬된 쿠폰 재배치
    function reorderCoupons(sortedCoupons) {
        sortedCoupons.forEach(coupon => {
            grid.appendChild(coupon);
        });
    }

    // 초기 정렬
    reorderCoupons(sortByDiscount());
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 바코드 생성
    generateBarcodes();

    // 필터 초기화
    initializeFilters();

    // 쿠폰 애니메이션 초기화
    initializeCouponAnimations();

    // 클립보드 복사 기능 초기화
    initializeClipboardCopy();

    // 정렬 기능 초기화
    initializeSorting();

    // 모바일 터치 이벤트 최적화
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});

// 성능 최적화를 위한 이벤트 쓰로틀링
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 윈도우 리사이즈 이벤트 처리
window.addEventListener('resize', throttle(() => {
    // 바코드 리사이즈
    generateBarcodes();
}, 250));