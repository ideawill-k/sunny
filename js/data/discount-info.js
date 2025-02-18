// discount-info.js

export const DISCOUNTS = [
    {
        id: 'tourmoz-domestic',
        title: '국내여행자보험',
        subtitle: '가족여행을 위한',
        description: '맞춤형 보험서비스',
        category: '보험',
        travelFilter: ['패키지'],
        regionFilter: ['글로벌'],
        serviceFilter: ['보험'],
        imageUrl: '../images/discount/tourmoz_국내여행자보험.png',
        externalUrl: 'https://www.tourmoz.com'
    },
    {
        id: 'tourmoz-overseas',
        title: '해외여행자보험',
        subtitle: '한눈에 꼼꼼비교',
        description: '맞춤형 보험서비스',
        category: '보험',
        travelFilter: ['패키지'],
        regionFilter: ['글로벌'],
        serviceFilter: ['보험'],
        imageUrl: '../images/discount/tourmoz_해외여행자보험.png',
        externalUrl: 'https://www.tourmoz.com'
    },
    {
        id: 'biccamera',
        title: '빅카메라 할인쿠폰',
        subtitle: '최대 17% 할인',
        description: '일본 빅카메라 전 지점 사용가능',
        category: '쇼핑',
        travelFilter: ['미식'],
        regionFilter: ['일본'],
        serviceFilter: ['쇼핑'],
        imageUrl: '../images/discount/빅카메라.jpg',
        externalUrl: 'https://www.biccamera.com'
    },
    {
        id: 'kkday',
        title: 'KKday 할인코드',
        subtitle: '이달의 할인코드',
        description: '글로벌 투어/티켓 예약',
        category: '투어/티켓',
        travelFilter: ['투어/티켓'],
        regionFilter: ['글로벌', '일본', '베트남', '태국', '대만'],
        serviceFilter: ['기타'],
        imageUrl: '../images/discount/이달의_할인코드_kkday.png',
        externalUrl: 'https://www.kkday.com'
    },
    {
        id: 'klook',
        title: 'Klook 할인코드',
        subtitle: '이달의 할인코드',
        description: '글로벌 투어/티켓 예약',
        category: '투어/티켓',
        travelFilter: ['투어/티켓'],
        regionFilter: ['글로벌', '일본', '베트남', '태국', '대만'],
        serviceFilter: ['기타'],
        imageUrl: '../images/discount/이달의_할인코드_klook.png',
        externalUrl: 'https://www.klook.com'
    },
    {
        id: 'myrealtrip',
        title: '마이리얼트립 할인코드',
        subtitle: '이달의 할인코드',
        description: '글로벌 투어/티켓 예약',
        category: '투어/티켓',
        travelFilter: ['투어/티켓'],
        regionFilter: ['글로벌', '일본', '베트남', '태국', '대만'],
        serviceFilter: ['기타'],
        imageUrl: '../images/discount/이달의_할인코드_마이리얼트립.png',
        externalUrl: 'https://www.myrealtrip.com'
    },
    {
        id: 'agoda',
        title: '아고다 할인코드',
        subtitle: '이달의 할인코드',
        description: '글로벌 호텔 예약',
        category: '숙소',
        travelFilter: ['숙소'],
        regionFilter: ['글로벌', '일본', '베트남', '태국', '대만', '미국', '유럽'],
        serviceFilter: ['기타'],
        imageUrl: '../images/discount/이달의_할인코드_아고다.png',
        externalUrl: 'https://www.agoda.com'
    },
    {
        id: 'trip',
        title: 'Trip.com 커피쿠폰',
        subtitle: '매달 10명 스타벅스',
        description: '글로벌 호텔 예약',
        category: '숙소',
        travelFilter: ['숙소'],
        regionFilter: ['글로벌', '일본', '베트남', '태국', '대만', '미국', '유럽'],
        serviceFilter: ['기타'],
        imageUrl: '../images/discount/이달의_할인코드_트립닷컴.png',
        externalUrl: 'https://www.trip.com'
    },
    {
        id: 'donki',
        title: '돈키호테 할인쿠폰',
        subtitle: 'UP TO 15% 할인',
        description: '일본 돈키호테 전지점 사용가능',
        category: '쇼핑',
        travelFilter: ['미식'],
        regionFilter: ['일본'],
        serviceFilter: ['쇼핑'],
        imageUrl: '../images/discount/일본_돈키호테.jpg',
        externalUrl: 'https://www.donki.com'
    },
    {
        id: 'trip365-esim',
        title: '해외 E-SIM',
        subtitle: '최대 98% 할인',
        description: '글로벌 이심 할인',
        category: '통신',
        travelFilter: ['기타'],
        regionFilter: ['글로벌', '일본', '미국', '베트남', '태국', '유럽', '필리핀', '대만'],
        serviceFilter: ['통신'],
        imageUrl: '../images/discount/트립365_해외ESIM.jpg',
        externalUrl: 'https://trip365.co.kr'
    },
    {
        id: 'trip365-usim',
        title: '해외 USIM',
        subtitle: '최대 89% 할인',
        description: '글로벌 유심 할인',
        category: '통신',
        travelFilter: ['기타'],
        regionFilter: ['글로벌', '일본', '미국', '베트남', '태국', '유럽', '필리핀', '대만'],
        serviceFilter: ['통신'],
        imageUrl: '../images/discount/트립365_해외USIM.jpg',
        externalUrl: 'https://trip365.co.kr'
    }
];