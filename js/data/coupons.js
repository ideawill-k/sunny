// js/data/coupons.js

/**
 * 면세점 브랜드별 테마 컬러 정의
 * - 각 브랜드의 아이덴티티 컬러를 사용
 * - 쿠폰의 테두리, 텍스트, 아이콘 등에 적용
 */
export const BRAND_COLORS = {
    '경복궁': '#7b001d',
    '시티': '#0f7be7',
    '현대': '#c61d23',
    '신세계': '#d0aa64',
    '부산': '#5e4e90'
};

/**
 * 쿠폰 데이터
 * @property {string} brand - 면세점 브랜드명
 * @property {string} brandLogo - 브랜드 로고 이미지 경로
 * @property {string} discount - 할인 금액 또는 비율
 * @property {string} discountType - 할인 유형 (예: "원 할인", "% 할인")
 * @property {string|null} barcode - 바코드 번호 (없는 경우 null)
 * @property {string} location - 사용 가능 위치 표시 텍스트
 * @property {string[]} locationFilter - 위치 필터링용 키워드 배열
 * @property {string} product - 사용 조건 표시 텍스트
 * @property {string[]} productFilter - 품목 필터링용 키워드 배열
 * @property {number} recommendOrder - 추천순 정렬용 순서 (낮을수록 상위 노출)
 * @property {number} discountRate - 할인율 (정렬용, 퍼센트)
 * @property {number} clickCount - 클릭수 (인기순 정렬용)
 * @property {string|null} imageUrl - 쿠폰 이미지 경로 (없는 경우 null)
 * @property {string|null} externalUrl - 외부 링크 URL (없는 경우 null)
 */
export const COUPONS = [
    {
        brand: "경복궁",
        brandLogo: "../images/brands/경복궁면세점.png",
        discount: "21,000",
        discountType: "원 할인",
        barcode: "3231200024",
        location: "인천공항1,2터미널",
        locationFilter: ["인천1터미널", "인천2터미널"],
        product: "담배3보루 구매시",
        productFilter: ["담배"],
        recommendOrder: 1,
        discountRate: 30,
        clickCount: 250,
        imageUrl: null,
        externalUrl: null
    },
    {
        brand: "시티",
        brandLogo: "../images/brands/시티면세점.png",
        discount: "12,000",
        discountType: "원 할인",
        barcode: "0062203400001",
        location: "인천공항1,2터미널",
        locationFilter: ["인천1터미널", "인천2터미널"],
        product: "담배2보루 구매시",
        productFilter: ["담배"],
        recommendOrder: 2,
        discountRate: 25,
        clickCount: 180,
        imageUrl: null,
        externalUrl: null
    },
    {
        brand: "경복궁",
        brandLogo: "../images/brands/경복궁면세점.png",
        discount: "13,000",
        discountType: "원 할인",
        barcode: "3240400013",
        location: "인천공항1,2터미널",
        locationFilter: ["인천1터미널", "인천2터미널"],
        product: "담배2보루 구매시",
        productFilter: ["담배"],
        recommendOrder: 3,
        discountRate: 20,
        clickCount: 220,
        imageUrl: null,
        externalUrl: null
    },
    {
        brand: "부산",
        brandLogo: "../images/brands/부산면세점.png",
        discount: "주류 41",
        discountType: "% 할인",
        barcode: null,
        location: "인터넷면세점",
        locationFilter: ["인터넷면세점"],
        product: "5대위스키 최저가",
        productFilter: ["주류"],
        recommendOrder: 4,
        discountRate: 41,
        clickCount: 300,
        imageUrl: null,
        externalUrl: "https://dutyfree-price.com/whisky365?companyId=8"
    },
    {
        brand: "시티",
        brandLogo: "../images/brands/시티면세점.png",
        discount: "10,000",
        discountType: "원 할인",
        barcode: "00622019000001",
        location: "인천공항1,2터미널",
        locationFilter: ["인천1터미널", "인천2터미널"],
        product: "$80 이상 구매시",
        productFilter: ["주류"],
        recommendOrder: 5,
        discountRate: 15,
        clickCount: 150,
        imageUrl: "../images/coupons/시티10000원할인쿠폰.jpg",
        externalUrl: null
    }
];