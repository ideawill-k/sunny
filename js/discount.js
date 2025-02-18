// discount.js
import { DISCOUNTS } from './data/discount-info.js';

// 이미지 미리 로드
function preloadImages(discountData) {
    discountData.forEach(discount => {
        const img = new Image();
        img.src = discount.imageUrl;
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
        travel: new Set(urlParams.getAll('travel')),
        region: new Set(urlParams.getAll('region')),
        service: new Set(urlParams.getAll('service'))
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
    if (filterState.travel.size) selectedFilters.push([...filterState.travel].join(', '));
    if (filterState.region.size) selectedFilters.push([...filterState.region].join(', '));
    if (filterState.service.size) selectedFilters.push([...filterState.service].join(', '));

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
    const filterGroups = ['travel', 'region', 'service'];
    
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

// 할인 상품 정렬
function sortDiscounts(discounts) {
    return [...discounts].sort((a, b) => {
        switch (currentSort) {
            case 'recommend':
                return a.id.localeCompare(b.id);
            case 'discount':
                // 할인율이 높은 순서대로 정렬
                const discountA = parseInt(a.discount) || 0;
                const discountB = parseInt(b.discount) || 0;
                return discountB - discountA;
            case 'popular':
                // ID 기준 정렬 (실제로는 조회수나 클릭수 데이터를 사용할 수 있습니다)
                return b.id.localeCompare(a.id);
            default:
                return 0;
        }
    });
}

// 할인 상품 엘리먼트 생성
function createDiscountElement(discount) {
    const discountDiv = document.createElement('div');
    discountDiv.className = 'discount-card';
    
    discountDiv.innerHTML = `
        <img src="${discount.imageUrl}" alt="${discount.title}" class="discount-image">
    `;

    discountDiv.addEventListener('click', () => handleDiscountClick(discount));
    
    return discountDiv;
}

// 할인 상품 클릭 처리
function handleDiscountClick(discount) {
    if (discount.externalUrl) {
        window.open(discount.externalUrl, '_blank');
    }
}

// 필터 상태 업데이트
function updateFilterState() {
    updateURL();
    updateSelectedFiltersDisplay();
    updateCategoryButtons();
    updateFilterButtons();
    loadDiscounts();
}

// 할인 상품 로드 및 필터링
function loadDiscounts() {
    const container = document.getElementById('discountsContainer');
    if (!container) return;

    // 필터링된 할인 정보 가져오기
    const filteredDiscounts = DISCOUNTS.filter(discount => {
        const travelMatch = filterState.travel.size === 0 || 
            discount.travelFilter.some(travel => filterState.travel.has(travel));
        
        const regionMatch = filterState.region.size === 0 || 
            discount.regionFilter.some(region => filterState.region.has(region));
            
        const serviceMatch = filterState.service.size === 0 || 
            discount.serviceFilter.some(service => filterState.service.has(service));
        
        return travelMatch && regionMatch && serviceMatch;
    });

    // 정렬
    const sortedDiscounts = sortDiscounts(filteredDiscounts);

    // 컨테이너 초기화
    container.innerHTML = '';

    // 필터링된 결과가 없는 경우
    if (sortedDiscounts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }

    // 할인 정보 표시
    sortedDiscounts.forEach(discount => {
        const discountElement = createDiscountElement(discount);
        container.appendChild(discountElement);
    });
}

// 필터 초기화
function initializeFilters() {
    // 이미지 미리 로드
    preloadImages(DISCOUNTS);

    // 카테고리 버튼 이벤트
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filterType = e.target.dataset.filter;
            filterState[filterType].clear();
            updateFilterState();
        });
    });

    // 필터 버튼 이벤트
    const filterGroups = ['travel', 'region', 'service'];
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
            loadDiscounts();
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