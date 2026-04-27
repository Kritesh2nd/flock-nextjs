import {
  SidebarProps,
  OptionValues,
  PredictionProps,
  FlockPredictionDataProps,
  NavDataProps,
  HomeCardProps,
  NoticeProps,
} from "@/types";

export const NavData: NavDataProps[] = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Executives", link: "/executives" },
  { name: "Work & Activities", link: "/works&activities" },
  {
    name: "Articles",
    link: "/articles",
  },
  { name: "Contact", link: "/contact" },
];

export const HomeCardData: HomeCardProps[] = [
  {
    img: "/home-icon/card3.png",
    data: "3.0B",
    name: "Weekly Broiler Chick Output",
  },
  {
    img: "/home-icon/card2.png",
    data: "160B",
    name: "Total Industry Investment",
  },
  {
    img: "/home-icon/card1.png",
    data: "120",
    name: "Active Broiler Hatcheries",
  },
];

export const SidebarData: SidebarProps[] = [
  {
    icon: "/icons/overview.png",
    icon1: "/icons/overview.svg",
    title: "Overview",
    link: "/dashboard/overview",
    allowedRoles: [
      "SUPER_ADMIN",
      "ADMIN",
      "MODERATOR",
      "HATCHERY_MEMBER",
      "SUPER_ROLE",
    ],
  },
  {
    icon: "/icons/user.png",
    icon1: "/icons/user.svg",
    title: "User Management",
    link: "/dashboard/user-management",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPER_ROLE"],
  },
  {
    icon: "/icons/breed.png",
    icon1: "/icons/breed.svg",
    title: "Breeds",
    link: "/dashboard/breed",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPER_ROLE"],
  },
  {
    icon: "/icons/breedStandard.png",
    icon1: "/icons/breed-standard.svg",
    title: "Breed Standards",
    link: "/dashboard/breed-standards",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPER_ROLE"],
  },
  {
    icon: "/icons/hatchery.png",
    icon1: "/icons/hatchery.svg",
    title: "All Hatcheries",
    link: "/dashboard/all-hatcheries",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPER_ROLE"],
  },

  {
    icon: "/icons/calculation.png",
    icon1: "/icons/calculation.svg",
    title: "Calculation",
    link: "/dashboard/calculation",
    allowedRoles: [
      "SUPER_ADMIN",
      "ADMIN",
      "MODERATOR",
      "HATCHERY_MEMBER",
      "SUPER_ROLE",
    ],
  },
];

export const worksData = [
  {
    id: 1,
    title: "१९ औँ वार्षिक साधारण सभा",
    description:
      "मिति २०८२ पौष ११ गते बसेको नेपाल ह्याचरी उद्योग संघको १९औ वार्षिक साधारण सभा तथा दशौं अधिवेशन होटेल मर्कियोरमा नेपाल कृषि तथा पशुपंछी विकास मन्त्रालयका पशुपन्छी अन्तर्गतका सचिव डा. दीपक कुमार खरालको प्रमुख आतिथ्यता पशु सेवा बिभागका महानिर्देशक डा राम नन्दन तिवारी तथा नेपाल पोल्ट्री महासङ्घका अध्यक्ष एवं नेपाल ह्याचरी उद्योग संघका संस्थापक अध्यक्ष श्री गुणचन्द्र बिष्ट (स्वामीजी) को विशिष्ट आतिथ्यतामा भव्यताका साथ सुसम्पन्न भयो।",
    image: "/home-icon/executive.jpeg",
  },
  {
    id: 2,
    title: "Advanced Hatchery Management Training",
    description: `Organized the "Advanced Hatchery Management Training" (16–22 September, 2020) in collaboration with veterinary experts, covering incubation technology, biosecurity protocols, and hatchery hygiene for poultry professionals across Nepal.`,
    image: "/works/work2.png",
  },
  {
    id: 3,
    title: "Joint AGM with Nepal Feed Industries",
    description:
      "Hosted the 8th Nepal Hatchery Association Annual General Meeting jointly with the 4th Nepal Feed Industries AGM at Hotel Hyatt Regency, Kathmandu. Over 200 delegates attended, including poultry entrepreneurs and high-ranked government veterinary officers — the first joint AGM of its kind.",
    image: "/works/work3.png",
  },
  {
    id: 4,
    title: "Post-COVID Industry Recovery Efforts",
    description:
      "Responded to the crisis where 236 hatcheries closed across the country after the pandemic. Coordinated with Nepal Poultry Federation and government bodies to address the collapse in day-old chick demand and support affected hatchery operators.",
    image: "/works/work4.png",
  },
  {
    id: 5,
    title: "International Partnership with Norel",
    description:
      "Partnered with Norel Animal Nutrition (Spain), who sponsored the joint AGM event. Facilitating technology transfer and adoption of modern nutritional solutions to improve hatchery performance across Nepal.",
    image: "/works/work5.png",
  },
];

export const Status: OptionValues[] = [
  { value: "Active", option: "Active", disable: false },
  { value: "Inactive", option: "Inactive", disable: false },
];
export const Type: OptionValues[] = [
  { value: "", option: "Select Complaint Type", disable: true },
  { value: "COMPLAINT", option: "COMPLAINT", disable: false },
  { value: "ISSUE", option: "ISSUE", disable: false },
  { value: "FEATURE_REQUEST", option: "FEATURE_REQUEST", disable: false },
];

export const Mod: OptionValues[] = [
  { value: "MODERATOR", option: "MODERATOR", disable: false },
];
export const Hatch: OptionValues[] = [
  { value: "HATCHERY_MEMBER", option: "HATCHERY_MEMBER", disable: false },
];

export const SimulationData: OptionValues[] = [
  { value: "Choose a breed", option: "chooseABreed", disable: true },
  { value: "Local", option: "Local", disable: false },
  { value: "Broiler", option: "Broiler", disable: false },
];

export const Prediction: PredictionProps[] = [
  {
    fertileEggs: 40000,
    hatchableCount: 3650,
    healthyChicks: 32000,
    mortalityCount: 2100,
    healthyAdults: 30500,
  },
  {
    fertileEggs: 37250,
    hatchableCount: 33000,
    healthyChicks: 31680,
    mortalityCount: 5200,
    healthyAdults: 28000,
    diff1: 4.7,
    diff2: 8.6,
    diff3: 6.7,
    diff4: 4.7,
    diff5: 2.2,
  },
];

export const FlockPredictionData: FlockPredictionDataProps[] = [
  {
    id: 1,
    img: "/flockpredicon/Egg.png",
    title: "Egg Production",
    des: "Estimated Fertile eggs ",
    size: "167,890",
  },
  {
    id: 2,
    img: "/flockpredicon/roast.png",
    title: "Meat Production",
    des: "Predicted mature adults",
    size: "110,352",
  },
  {
    id: 3,
    img: "/flockpredicon/chick.png",
    title: "Chicks Production",
    des: "Predicted healthy hatchlings",
    size: "126,021",
  },
];

export const Breed: OptionValues[] = [
  { value: "local", option: "Local", disable: false },
  { value: "broiler", option: "Broiler", disable: false },
];

export const Purpose1: OptionValues[] = [
  { value: "", option: "Select Purpose", disable: true },
  { value: "BROILER", option: "BROILER", disable: false },
  { value: "LAYER", option: "LAYER", disable: false },
  { value: "BREEDER", option: "BREEDER", disable: false },
];
export const Purpose: OptionValues[] = [
  { value: "", option: "Select Generation", disable: true },
  { value: "BROILER", option: "BROILER", disable: false },
  { value: "LAYER", option: "LAYER", disable: false },
  { value: "GRANDPARENT", option: "GRANDPARENT", disable: false },
  { value: "PARENT", option: "PARENT", disable: false },
];
export const Source: OptionValues[] = [
  { value: "", option: "Select Source", disable: true },
  { value: "LOCAL", option: "LOCAL", disable: false },
  { value: "IMPORTED", option: "IMPORTED", disable: false },
];

export const Gender: OptionValues[] = [
  { value: "", option: "Select Gender", disable: true },
  { value: "male", option: "Male", disable: false },
  { value: "female", option: "Female", disable: false },
];

export const FooterData: NavDataProps[] = [
  { name: "Home", link: "/" },
  { name: "About Us", link: "/about" },
  { name: "Contact Us", link: "/contact" },
  { name: "Articles", link: "/articles" },
  { name: "Work & Activities", link: "/works&activities" },
  { name: "Executives", link: "/executives" },
  { name: "Privacy Policy", link: "/privacy-policy" },
  { name: "Terms of Service", link: "/termsofservice" },
];

export const TimelineData = [
  {
    year: "1999",
    title: "Foundation",
    desc: "Nepal Hatchery Industries Association was established by visionary poultry entrepreneurs to strengthen the industry through collective action and knowledge sharing.",
  },
  {
    year: "2000–2010",
    title: "Early Growth",
    desc: "Established industry best practices, facilitated knowledge exchange through annual conferences, and advocated for favorable government policies supporting hatchery development.",
  },
  {
    year: "2010–2020",
    title: "Industry Expansion",
    desc: "Nepal’s hatchery industry grew to over 28 registered hatcheries, contributing significantly to the nation’s food security.",
  },
  {
    year: "2020–2024",
    title: "Digital Innovation",
    desc: "Recognized the limitations of manual data management and began developing cutting-edge digital solutions to transform industry operations.",
  },
  {
    year: "2025",
    title: "Digital Launch",
    desc: "Launched the National Hatchery Data & Production Management System providing real-time analytics and automated tracking.",
  },
  {
    year: "Today",
    title: "Leading Forward",
    desc: "Representing 109 active breeder and layer hatcheries across Nepal, supporting policies that promote innovation and sustainability.",
  },
];
