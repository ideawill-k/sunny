// dutyfree.js
import { COUPONS, BRAND_COLORS } from './data/coupons.js';

// 이미지 미리 로드
function preloadImages(couponData) {
    const images = couponData.map(coupon => coupon.brandLogo);
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// URL 파라미터에서 정렬 상태 가져오기
function getInitialSort() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');
    // sort 파라미터가 유효한 값인지 확인
    return ['recommend', 'discount', 'popular'].includes(sortParam) ? sortParam : 'recommend';
}

// 현재 정렬 상태
let currentSort = getInitialSort();

// URL 파라미터에서 초기 필터 상태 가져오기
function getInitialFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        brand: new Set(urlParams.getAll('brand')),
        location: new Set(urlParams.getAll('location')),
        product: new Set(urlParams.getAll('product'))
    };
}

// 필터 상태 관리
const filterState = getInitialFilters();

// URL 업데이트
function updateURL() {
    const params = new URLSearchParams();
    
    // 필터 파라미터 추가
    Object.entries(filterState).forEach(([key, values]) => {
        values.forEach(value => {
            params.append(key, value);
        });
    });

    // 정렬 파라미터 추가
    if (currentSort !== 'recommend') {
        params.append('sort', currentSort);
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newURL);
}

// 선택된 필터 표시 업데이트
function updateSelectedFiltersDisplay() {
    const container = document.querySelector('.selected-filters');
    if (!container) return;

    const selectedFilters = [];
    if (filterState.brand.size) selectedFilters.push([...filterState.brand].join(', '));
    if (filterState.location.size) selectedFilters.push([...filterState.location].join(', '));
    if (filterState.product.size) selectedFilters.push([...filterState.product].join(', '));

    container.innerHTML = selectedFilters.length > 0 
        ? `<span>${selectedFilters.join(' · ')}</span>`
        : '';
}

// 카테고리 버튼 상태 업데이트
function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        const filterType = btn.dataset.filter;
        btn.classList.toggle('active', filterState[filterType].size === 0);
    });
}

// 필터 버튼 상태 업데이트
function updateFilterButtons() {
    const filterGroups = ['brand', 'location', 'product'];
    
    filterGroups.forEach(group => {
        const container = document.getElementById(`${group}Filters`);
        if (!container) return;

        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', filterState[group].has(btn.dataset.filter));
        });
    });
}

// 정렬 버튼 상태 업데이트
function updateSortButtons() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === currentSort);
    });
}

// 쿠폰 정렬
function sortCoupons(coupons) {
    return [...coupons].sort((a, b) => {
        switch (currentSort) {
            case 'recommend':
                return a.recommendOrder - b.recommendOrder;
            case 'discount':
                return b.discountRate - a.discountRate;
            case 'popular':
                return b.clickCount - a.clickCount;
            default:
                return 0;
        }
    });
}

// 쿠폰 엘리먼트 생성
function createCouponElement(coupon) {
    const couponDiv = document.createElement('div');
    couponDiv.className = 'coupon-card';
    
    couponDiv.style.setProperty('--brand-color', BRAND_COLORS[coupon.brand]);
    
    couponDiv.innerHTML = `
        <div class="coupon-header">
            <div class="brand-container">
                <img src="${coupon.brandLogo}" alt="${coupon.brand}" class="brand-logo">
            </div>
            <div class="discount-container">
                <div class="discount-wrapper">
                    <span class="discount-amount">${coupon.discount}</span>
                    <span class="discount-type">${coupon.discountType}</span>
                </div>
            </div>
        </div>
        <div class="coupon-content">
            ${coupon.barcode ? `
                <div class="barcode-container">
                    <svg class="barcode"
                        jsbarcode-format="code128"
                        jsbarcode-value="${coupon.barcode}"
                        jsbarcode-width="2"
                        jsbarcode-height="45"
                        jsbarcode-fontSize="12"
                        jsbarcode-textmargin="0">
                    </svg>
                </div>
            ` : `
                <div class="click-instead">Click↗</div>
            `}
        </div>
        <div class="coupon-footer">
            <div class="location-info">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>${coupon.location}</span>
            </div>
            <div class="product-info">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>${coupon.product}</span>
            </div>
        </div>
    `;

    couponDiv.addEventListener('click', () => showCouponModal(coupon));
    
    return couponDiv;
}

// 모달 관련 함수
function showCouponModal(coupon) {
    // 이미지나 외부 URL이 없는 경우 모달을 띄우지 않음
    if (!coupon.imageUrl && !coupon.externalUrl) {
        return;
    }

    if (coupon.externalUrl) {
        window.open(coupon.externalUrl, '_blank');
        return;
    }

    const modal = document.getElementById('couponModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = coupon.imageUrl;
    modal.style.display = "block";
}

// 모달 닫기
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('couponModal').style.display = "none";
});

// 필터 상태 업데이트
function updateFilterState() {
    updateURL();
    updateSelectedFiltersDisplay();
    updateCategoryButtons();
    updateFilterButtons();
    loadCoupons();
}

// 쿠폰 로드 및 필터링
function loadCoupons() {
    const container = document.getElementById('couponsContainer');
    if (!container) return;

    // 필터링된 쿠폰 가져오기
    const filteredCoupons = COUPONS.filter(coupon => {
        const brandMatch = filterState.brand.size === 0 || filterState.brand.has(coupon.brand);
        const locationMatch = filterState.location.size === 0 || 
            coupon.locationFilter.some(loc => filterState.location.has(loc));
        const productMatch = filterState.product.size === 0 || 
            coupon.productFilter.some(prod => filterState.product.has(prod));
        
        return brandMatch && locationMatch && productMatch;
    });

    // 정렬
    const sortedCoupons = sortCoupons(filteredCoupons);

    // 컨테이너 초기화
    container.innerHTML = '';

    // 필터링된 결과가 없는 경우
    if (sortedCoupons.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }

    // 쿠폰 표시
    sortedCoupons.forEach(coupon => {
        const couponElement = createCouponElement(coupon);
        container.appendChild(couponElement);
    });

    // 바코드 생성
    generateBarcodes();
}

// 바코드 생성
function generateBarcodes() {
    JsBarcode(".barcode").init();
}

// 필터 초기화
function initializeFilters() {
    // 이미지 미리 로드
    preloadImages(COUPONS);

    // 카테고리 버튼 이벤트
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterType = e.target.dataset.filter;
            filterState[filterType].clear();
            updateFilterState();
        });
    });

    // 필터 버튼 이벤트
    const filterGroups = ['brand', 'location', 'product'];
    filterGroups.forEach(group => {
        const container = document.getElementById(`${group}Filters`);
        if (!container) return;

        container.addEventListener('click', (e) => {
            if (!e.target.classList.contains('filter-btn')) return;

            const value = e.target.dataset.filter;
            if (filterState[group].has(value)) {
                filterState[group].delete(value);
            } else {
                filterState[group].add(value);
            }
            updateFilterState();
        });
    });

    // 정렬 버튼 이벤트
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentSort = e.target.dataset.sort;
            updateSortButtons();
            updateURL();  // URL에 정렬 상태 반영
            loadCoupons();
        });
    });

    // 초기 상태 설정
    updateSortButtons();  // 정렬 버튼 초기 상태 설정
    updateFilterState();
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();

    // Top 버튼 기능
    const topButton = document.getElementById('topButton');
    if (topButton) {
        // 스크롤시 버튼 표시/숨김
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                topButton.classList.add('visible');
            } else {
                topButton.classList.remove('visible');
            }
        });

        // 클릭시 최상단으로 이동
        topButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});