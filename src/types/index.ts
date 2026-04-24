export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  role: string;
  accessToken: string;
}

export interface ArticleHomeProps {
  id: number;
  heading: string;
  subHeading: string;
  createdAt?: string;
  imageUrl: string;
  articleContent: ArticleContent[];
}

export interface ArticleContent {
  id: number;
  content: string;
  contentType: string;
  order: number;
}

export interface LogInProps {
  email: string;
  password: string;
}

export interface UserRoleContextType {
  role: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MODERATOR"
  | "HATCHERY_MEMBER"
  | "ARTICLE_MANAGER"
  | "SUPER_ROLE";

export interface NavDataProps {
  name: string;
  link: string;
  subNav?: SubProps[];
}

export interface SubProps {
  subName: string;
  subLink: string;
}

export interface HomeCardProps {
  img: string;
  name: string;
  data: string;
}

export interface SidebarProps {
  icon: string;
  icon1?: string;
  title: string;
  link: string;
  allowedRoles: Role[];
}

export interface workDataProps {
  id: number;
  title: string;
  description: string;
  image: string;
}
export interface AccountProps {
  icon: React.JSX.Element;
  title: string;
  link: string;
  allowedRoles?: Role[];
}

export interface NewsCardProps {
  id?: number;
  img: string;
  title: string;
  des: string;
}

export interface NoticeProps {
  date: string;
  type: string;
  title: string;
  des: string;
}
export interface HeaderProps {
  title: string;
  des: string;
  button?: string;
  onClick?: () => void;
  onClick1?: () => void;
  button2?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export interface FlockPropsType {
  id: number;
  hatchery?: { id: number; hatcheryName: string; address: string };
  maleChickCount: number;
  femaleChickCount: number;
  breed?: { id: number; name: string };
  productionPurpose: string;
  dateOfBirth: string;
  maleChickCountFree: number;
  femaleChickCountFree: number;
  financials: { remainingDues: number };
}

export interface FlockFormType {
  maleChickCount: number;
  femaleChickCount: number;
  productionPurpose: string;
  sourceType: string;
  sourceAddress: string;
  dateOfPlacement: string;
  dateOfBirth: string;
  breedId?: number;
  hatcheryId?: number;
  parentBreed: number;
  maleChickCountFree: number;
  femaleChickCountFree: number;
}

export interface FlockModalProps {
  closeForm: () => void;
  onSubmit: (data: FlockFormType) => void;
}

export interface UserPropsType {
  isBanned: boolean;
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  roles?: string[];
  executiveMember?: string;
  unlinkHatchery?: string;
  profileUrl: string;
  photo?: File | null;
  isExecutive?: boolean;
  isActive?: boolean;
  hatchery?: {
    id: number;
    hatcheryName: string;
  };
  designation?: string;
}
export interface HatcheryMemberType extends UserPropsType {
  isBanned: boolean;
  isActive: boolean; // JSON field
  expiryDate: string | null; // JSON field
  hatcheryName: string;
}

export interface FlockModalPropsExtended extends FlockModalProps {
  preselectedHatchery?: { id: number; name: string };
}

export interface HatcheryType {
  id: number;
  hatcheryName: string;
  address: string;
  contactNumber: string;
  isActive: boolean;
}

export interface OverviewProps {
  title: string;
  icon: React.JSX.Element;
  data: number;
  des: string;
}

export interface UserFormType {
  id?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  roles: string[];
  photo?: File | null;
  isExecutive?: boolean;
  designation?: string;
  // status?: string;
  // file?: File | null;
  hatcheryId?: number | null;
}

export interface UserDataProps {
  data: UserPropsType[];
  metadata: {
    currentLimit: number;
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface InputField {
  name: string;
  title: string;
  placeholder: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type: string;
  value: string | number;
  disabled?: boolean;
  className?: string;
}

export interface OptionProps {
  value: string;
  title: string;
  name: string;
  options: OptionValues[];
  className?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
}

export interface OptionValues {
  value: string;
  option: string;
  disable?: boolean;
}

export interface UserModalProps {
  closeForm: () => void;
  onSubmit: (data: UserFormType) => void;
  title: string;
  des: string;
  roleToShow: "MODERATOR" | "HATCHERY_MEMBER";
  btn1: string;
}

export interface HatcheryPropsType {
  id?: string;
  registrationNumber: string;
  hatcheryName: string;
  address: string;
  ownerId?: number | null;
  ownerName: string;
  contactNumber: string;
  owner?: { id: string; firstname: string; lastname: string };
  isActive?: boolean;
  dues?: {
    remainingDues: number;
  };
  // yearEstablished: number;
}

export interface HatcheryFormType {
  hatcheryName: string;
  address: string;
  registrationNumber: string;
  // yearEstablished: number;
  ownerName: string;
  ownerId?: number | null;
  contactNumber: string;
}

export interface HatcheryModalProps {
  closeForm: () => void;
  onSubmit: (data: HatcheryPropsType) => void;
  title: string;
  des: string;
  btn: string;
}

export interface BreedTypeProp {
  id: string;
  name: string;
  generation: string;
  finalWeight?: number;
}

export interface individualBreedProps {
  id?: number;
  breedName: string;
  generation: GenerationType;
  data?: data[];
}

export interface data {
  id: string;
  week: string;
  eggProductionRate: string;
  cumulativeMortalityRate: string;
  damagedEggRate: string;
  day: string;
  weight: string;
  hatchableEggRate: string;
  hatchingEggRate: string;
}

export interface broilerData {
  id: string;
  day: string;
  weight: string;
  cumulativeMortalityRate: string;
}

export interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: "Error" | "bug" | "info" | "warning";
  target: string;
  created: string;
}

export interface PredictionProps {
  fertileEggs: number;
  hatchableCount: number;
  healthyChicks: number;
  mortalityCount: number;
  healthyAdults: number;
  diff1?: number;
  diff2?: number;
  diff3?: number;
  diff4?: number;
  diff5?: number;
}

export interface SimulationProps {
  title: string;
  des: string;
  item: PredictionProps;
}

export interface HatchDataProps {
  date: string;
  male: number;
  female: number;
}

export interface FlockPredictionDataProps {
  id: number;
  title: string;
  img: string;
  size: string;
  des: string;
}

export type GenerationType = "LAYER" | "BROILER" | "PARENT" | "GRANDPARENT";

export type ContentBlockType = "PARAGRAPH" | "HEADING" | "LIST" | "URL";

export interface ContentBlock {
  id: number;
  type: ContentBlockType;
  content: string;
  config?: {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    listType?: "ordered" | "unordered";
    alt?: string;
    previewUrl?: string;
    url?: string;
    file?: File;
  };
}

export interface DynamicFormData {
  heading: string;
  subHeading: string;
  image: File | null;
  articleContent: ContentBlock[];
}
