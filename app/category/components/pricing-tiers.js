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
    features: [
      "20 users included",
      "10 GB of storage",
      "Help center access",
      "Priority email support",
    ],

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
    features: [
      "50 users included",
      "30 GB of storage",
      "Help center access",
      "Phone & email support",
    ],

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
    features: [
      "10 users included",
      "2 GB of storage",
      "Help center access",
      "Email support",
    ],
    buttonText: "Continue with Free",
    buttonColor: "default",
    buttonVariant: "flat",
  },
];
