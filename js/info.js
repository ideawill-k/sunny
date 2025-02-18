// info.js

// 카드 정보 및 링크 설정
const INFO_CARDS = {
    'airport': {
        url: '../pages/info/airport.html',
        title: '공항안내'
    },
    'dutyfree': {
        url: '../pages/info/dutyfree.html',
        title: '면세점소식'
    },
    'destination': {
        url: '../pages/info/destination.html',
        title: '여행지추천'
    },
    'supplies': {
        url: '../pages/info/supplies.html',
        title: '여행용품추천'
    }
};

// 마우스 이펙트 추가
function addMouseEffect(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 카드 내부에서의 마우스 위치를 백분율로 계산
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // 그라데이션 효과 적용
        card.style.background = `
            radial-gradient(
                circle at ${xPercent}% ${yPercent}%, 
                rgba(255,255,255,0.1) 0%, 
                transparent 50%
            ),
            ${getCardBaseColor(card)}
        `;
    });

    // 마우스가 떠났을 때 원래 스타일로 복구
    card.addEventListener('mouseleave', () => {
        card.style.background = getCardBaseColor(card);
    });
}

// 카드 종류에 따른 기본 배경색 반환
function getCardBaseColor(card) {
    if (card.classList.contains('airport-card')) {
        return 'linear-gradient(135deg, #fff, #ecfdf5)';
    } else if (card.classList.contains('dutyfree-card')) {
        return 'linear-gradient(135deg, #fff, #fff1f2)';
    } else if (card.classList.contains('destination-card')) {
        return 'linear-gradient(135deg, #fff, #fef3c7)';
    } else if (card.classList.contains('supplies-card')) {
        return 'linear-gradient(135deg, #fff, #eef2ff)';
    }
    return 'white';
}

// 카드 클릭 이벤트 초기화
function initializeCardEvents() {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        // 마우스 이펙트 추가
        addMouseEffect(card);

        // 클릭 이벤트
        card.addEventListener('click', () => {
            const cardType = card.dataset.type;
            if (cardType && INFO_CARDS[cardType]) {
                // 클릭 효과 추가
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = '';
                    window.location.href = INFO_CARDS[cardType].url;
                }, 150);
            }
        });
    });
}

// 스크롤 감지 및 애니메이션 효과
function initializeScrollEffects() {
    const cards = document.querySelectorAll('.info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '20px'
    });

    cards.forEach(card => observer.observe(card));
}

// 디바운스 함수
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

// Top 버튼 처리
function handleTopButton() {
    const topButton = document.getElementById('topButton');
    if (!topButton) return;

    const handleScroll = debounce(() => {
        if (window.scrollY > 200) {
            topButton.classList.add('visible');
        } else {
            topButton.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', handleScroll);

    topButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializeCardEvents();
    initializeScrollEffects();
    handleTopButton();
});