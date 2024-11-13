import { FrequencyEnum, TiersEnum } from "./pricing-types";

export const frequencies = [
  { key: FrequencyEnum.Yearly, label: "Pay Yearly", priceSuffix: "per year" },
  {
    key: FrequencyEnum.Quarterly,
    label: "Pay Quarterly",
    priceSuffix: "per quarter",
  },
];

export const tiers = [
  {
    key: TiersEnum.Free,
    title: "메인목차",
    price: "Free",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "체크 목차:0건",
    features: [
      "IFRS S1",
      "IFRS S2",
    ],
    buttonText: "Continue with Free",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Pro,
    title: "대제목",
    description: "체크 목차:0건",
    href: "#",
    mostPopular: true,
    price: {
      yearly: "$72",
      quarterly: "$24",
    },
    featured: false,
    features: {
      "IFRS S1":[
        "일반 요구 사항",
        "판단, 불확실성 및 오류",
      ],
      "IFRS S2":[
        "거버넌스",
        "전략",
        "위험관리",
        "지표 및 목표"
      ]
    },
    buttonText: "Get started",
    buttonColor: "primary",
    buttonVariant: "solid",
  },
  {
    key: TiersEnum.Team,
    title: "중제목",
    href: "#",
    featured: true,
    mostPopular: false,
    description: "체크 목차:0건",
    price: {
      yearly: "$90",
      quarterly: "$120",
    },
    priceSuffix: "per user",
    features: {
      "일반 요구 사항":[
        "보고서 개요",
        "보고서 기준",
        "승인"
      ],
      "판단, 불확실성 및 오류":[
        "판단",
        '측정불확실성 및 오류'
      ],
      "거버넌스":[
        "기후 관련 위험 및 기회에 관한 이사회 차원의 감독",
        "기후 관련 위험 및 기회에 관한 경영진의 역할",

      ],
      "전략":[
        "기후 관련 위험 및 기회",
        "사업모형과 가치사슬",
        "전략 및 의사결정",
        "재무상태 및 재무성과 영향",
        "기후회복력",
      ],
      '위험관리':[
        '기후 관련 위험 및 기회 관리 프로세스'
      ],
      "지표 및 목표":[
        '기후 관련 지표',
        "기후 관련 목표"
      ]

    },

    buttonText: "Contact us",
    buttonColor: "default",
    buttonVariant: "flat",
  },
  {
    key: TiersEnum.Free,
    title: "소제목",
    price: "Free",
    href: "#",
    featured: false,
    mostPopular: false,
    description: "체크 목차:0건",
    features: {
      '보고서 개요':[
        "목적",
        "보고 기간",
        "보고 범위"
      ],
      "보고서 기준":[
        "작성 기준",
        "연계된 정보"
      ],
      "승인":[
        "발행 승인일",
        "발행 승인자"
      ],
      "판단":[
        '지속가능성 관련 위험 및 기회의 식별',
        "적용 가능한 공시 요구사항의 식별",
        "지속가능성 관련 중요한 정보의 식별",
        "지속가능성 관련 위험 및 기회 재평가"
      ],
      "측정불확실성 및 오류":[
        "측정불확실성",
        "오류"
      ],
      "기후 관련 위험 및 기회에 관한 이사회 차원의 감독":[
        "이사회의 역할 및 책임",
        "관리 감독 체계"
      ],
      "기후 관련 위험 및 기회에 관한 경영진의 역할":[
        "경영진의 역할 및 감독 프로세스",
      ],
      "기후 관련 위험 및 기회":[
        "위험 및 기회의 식별",
        "식별된 위험 및 기회의 영향 기간 범위와 전략적 의사결정 계획 기간 간 연계"
      ],
      "사업모형과 가치사슬":[
        "사업모형과 가치사슬에 미치는 현재 및 예상 영향",
        "위험과 기회가 집중된 영역"
      ],
      "전략 및 의사결정":[
        "위험 및 기회 대응 및 계획",
        "자원조달 계획",
        "과거 보고기간에 공시된 계획의 진척도에 대한 양적 및 질적 정보",
        "기업이 고려한 기후 관련 위험 및 기회 간의 절충"
      ],
      "재무상태 및 재무성과 영향":[
        "당기 및 차기 재무제표에 미치는 영향",
        "대응 전략의 실행을 고려할 때 재무상태, 재무성과 및 현금흐름의 예상되는 변화"
      ],
      "기후회복력":[
        "전략과 사업모형에 대한 기업 평가의 시사점",
        "기후 관련 시나리오 분석 수행 방법"
      ],
      "기후 관련 위험 및 기회 관리 프로세스":[
        "기후 관련 위험 및 기회 관리 프로세스",
        "기후 관련 위험 및 기회 관리 프로세스와 전체 위험관리 프로세스의 통합"
      ],
      "기후 관련 지표":[
        "온실가스",
        "기후 관련 전환 위험에 취약한 자산 또는 사업활동",
        "기후 관련 물리적 위험에 취약한 자산 또는 사업활동",
        "기후 관련 기회에 부합하는 자산 또는 사업활동",
        "자본 배치",
        "내부 탄소 가격",
        "보상(경영진)",
        "산업 기반 지표"
      ],
      "기후 관련 목표":[
        "목표 설정에 사용된 지표 관련 정보(목표 지표, 목적, 적용 범위 등)",
        "목표에 대한 진척도 모니터링 방법",
        "목표 대비 성과 분석",
        "온실가스 배출량 감축 목표 관련 정보"
      ]
    },
    buttonText: "Continue with Free",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
