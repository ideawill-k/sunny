// dutyfree.js
import { COUPONS, BRAND_COLORS } from './data/coupons.js';

// 현재 정렬 상태
let currentSort = 'recommend';

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
    
    for (const [key, values] of Object.entries(filterState)) {
        values.forEach(value => {
            params.append(key, value);
        });
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
            const isActive = filterState[group].has(btn.dataset.filter);
            btn.classList.toggle('active', isActive);
            if (isActive) {
                btn.style.backgroundColor = BRAND_COLORS[btn.dataset.filter] || '#FF6B8B';
            } else {
                btn.style.backgroundColor = '';
            }
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

// 모달 관련 함수
function showCouponModal(coupon) {
    if (coupon.externalUrl) {
        window.open(coupon.externalUrl, '_blank');
        return;
    }

    if (!coupon.imageUrl) return;

    const modal = document.getElementById('couponModal');
    const modalImg = document.getElementById('modalImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');

    modalImg.src = coupon.imageUrl;
    modal.style.display = "block";
    
    // 다운로드 버튼 이벤트
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.href = coupon.imageUrl;
        link.download = `${coupon.brand}_${coupon.discount}${coupon.discountType}.jpg`;
        link.click();
    };

    // 공유 버튼 이벤트
    shareBtn.onclick = async () => {
        try {
            await navigator.share({
                title: `${coupon.brand} ${coupon.discount}${coupon.discountType}`,
                text: `${coupon.location} - ${coupon.product}`,
                url: window.location.href
            });
        } catch (err) {
            console.log('공유하기가 지원되지 않는 환경입니다.');
        }
    };
}

// 모달 닫기
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('couponModal').style.display = "none";
});

// 필터 초기화
function initializeFilters() {
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
            loadCoupons();
        });
    });

    updateFilterState();
}

// 필터 상태 업데이트
function updateFilterState() {
    updateURL();
    updateSelectedFiltersDisplay();
    updateCategoryButtons();
    updateFilterButtons();
    loadCoupons();
}

// 쿠폰 데이터 로드 및 필터링
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

    // 필터링된 쿠폰 렌더링
    if (sortedCoupons.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }

    sortedCoupons.forEach(coupon => {
        const couponElement = createCouponElement(coupon);
        container.appendChild(couponElement);
    });

    // 바코드 생성
    generateBarcodes();
}

// 쿠폰 엘리먼트 생성
function createCouponElement(coupon) {
    const couponDiv = document.createElement('div');
    couponDiv.className = 'coupon-card';
    const themeColor = BRAND_COLORS[coupon.brand];
    
    couponDiv.style.setProperty('--brand-color', themeColor);
    couponDiv.style.borderColor = themeColor;
    
    const barcodeContent = coupon.barcode ? `
        <div class="barcode-container">
            <svg class="barcode"
                jsbarcode-format="code128"
                jsbarcode-value="${coupon.barcode}"
                jsbarcode-width="2"
                jsbarcode-height="60"
                jsbarcode-fontSize="12"
                jsbarcode-textmargin="0">
            </svg>
        </div>
    ` : `
        <div class="click-instead" style="color: ${themeColor}">
            Click
        </div>
    `;

    couponDiv.innerHTML = `
        <div class="coupon-header" style="border-color: ${themeColor}">
            <img src="${coupon.brandLogo}" alt="${coupon.brand}" class="brand-logo">
            <div class="discount-wrapper" style="color: ${themeColor}">
                <span class="discount-amount">${coupon.discount}</span>
                <span class="discount-type">${coupon.discountType}</span>
            </div>
        </div>
        <div class="coupon-content" style="border-color: ${themeColor}">
            ${barcodeContent}
        </div>
        <div class="coupon-footer">
            <div class="location-info">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${themeColor}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span style="color: ${themeColor}">${coupon.location}</span>
            </div>
            <div class="product-info">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${themeColor}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span style="color: ${themeColor}">${coupon.product}</span>
            </div>
        </div>
    `;

    couponDiv.addEventListener('click', () => showCouponModal(coupon));
    
    return couponDiv;
}

// 바코드 생성
function generateBarcodes() {
    JsBarcode(".barcode").init();
}

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
    updateSortButtons();
});