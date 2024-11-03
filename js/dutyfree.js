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

// 바코드 생성
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

// 터치 이벤트 처리
function initializeTouchEvents() {
    const coupons = document.querySelectorAll('.duty-coupon');
    
    coupons.forEach(coupon => {
        coupon.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        coupon.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}

// 모바일 메뉴 초기화
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// 클립보드 복사 기능
function initializeClipboardCopy() {
    const barcodeNumbers = document.querySelectorAll('.barcode-number');
    
    barcodeNumbers.forEach(number => {
        number.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
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

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    generateBarcodes();
    initializeTouchEvents();
    initializeMobileMenu();
    initializeClipboardCopy();
});

// 윈도우 리사이즈 이벤트 처리 (디바운스 적용)
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(generateBarcodes, 250);
});