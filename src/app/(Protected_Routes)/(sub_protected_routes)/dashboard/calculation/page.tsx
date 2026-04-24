"use client";

import {
  ComponentType,
  SVGProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "@/components/common/Header";
import { useAuthStore } from "@/store/authstore";
import {
  searchHatcheryList,
  getHatcheryList,
  generateReportFile,
} from "./action";
import { useBreedStore } from "@/store/breedStandardStore";
import { HatcheryType } from "@/types";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import InputCard from "@/components/common/InputField";
import SelectCard from "@/components/common/SelectCard";
import { LuEgg, LuLoaderCircle } from "react-icons/lu";
import Image from "next/image";
import ReactECharts from "echarts-for-react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import {
  CalcFormData,
  CalcParamFormDataType,
  StandardPoultryData,
} from "@/types/calculation";
import { useCalculationStore } from "@/store/calculationStore";
import { GiRoastChicken } from "react-icons/gi";
import { PiBird } from "react-icons/pi";
import { IoDocumentText } from "react-icons/io5";
import toast from "react-hot-toast";

type TimeOption = {
  value: string;
  option: string;
};

type Production = "" | "week" | "month" | "year";

type Generation = "GRANDPARENT" | "PARENT" | "LAYER" | "BROILER";
type Breed = {
  id: number;

  name: string;

  generation: Generation;

  finalWeight: number;
};

const GENERATION_ORDER = ["GRANDPARENT", "PARENT", "LAYER", "BROILER"] as const;

type ProductionDataProp = {
  title: string;
  subTitle: string;
  count: number;
  Icon: ComponentType<SVGProps<SVGSVGElement>> | null;
  iconUrl: string;
  rate: number;
  color: string;
  code: string;
};

const allProductionData: ProductionDataProp[] = [
  {
    title: "Meat Production",
    subTitle: "Broiler Grand Parent Meat Production",
    count: 123456789,
    Icon: GiRoastChicken,
    iconUrl: "",
    rate: 5.4,
    color: "E53935",
    code: "BGP_MEAT",
  },
  {
    title: "Meat Production",
    subTitle: "Broiler Parent Meat Production",
    count: 123456789,
    Icon: GiRoastChicken,
    iconUrl: "",
    rate: -5.4,
    color: "FB8C00",
    code: "BP_MEAT",
  },
  {
    title: "Meat Production",
    subTitle: "Broiler Meat Production",
    count: 123456789,
    Icon: GiRoastChicken,
    iconUrl: "",
    rate: 0,
    color: "FDD835",
    code: "B_MEAT",
  },
  {
    title: "Meat Production",
    subTitle: "Layer Parent Meat Production",
    count: 123456789,
    Icon: GiRoastChicken,
    iconUrl: "",
    rate: 5.4,
    color: "43A047",
    code: "LP_MEAT",
  },
  {
    title: "Meat Production",
    subTitle: "Layer Meat Production",
    count: 123456789,
    Icon: GiRoastChicken,
    iconUrl: "",
    rate: 5.4,
    color: "00897B",
    code: "L_MEAT",
  },
  {
    title: "Chick Production",
    subTitle: "Broiler Parent Chick Production",
    count: 123456789,
    Icon: PiBird,
    iconUrl: "",
    rate: 5.4,
    color: "1E88E5",
    code: "BP_CHICK",
  },
  {
    title: "Chick Production",
    subTitle: "Broiler Chick Production",
    count: 123456789,
    Icon: PiBird,
    iconUrl: "",
    rate: 5.4,
    color: "3949AB",
    code: "B_CHICK",
  },
  {
    title: "Chick Production",
    subTitle: "Layer Chick Production",
    count: 123456789,
    Icon: PiBird,
    iconUrl: "",
    rate: 5.4,
    color: "8E24AA",
    code: "L_CHICK",
  },
  {
    title: "Egg Production",
    subTitle: "Unfertile Eggs Production",
    count: 123456789,
    Icon: LuEgg,
    iconUrl: "",
    rate: 5.4,
    color: "6D4C41",
    code: "L_EGG",
  },
];

type GenKey = keyof CalcParamFormDataType;
type TypeOptions = {
  typeName: string;
  title: string;
  productionType: string;
};

const typeOptions: TypeOptions[] = [
  {
    typeName: "BGP_MEAT",
    title: "Broiler Grand Parent",
    productionType: "meat",
  },
  { typeName: "BP_MEAT", title: "Broiler Parent", productionType: "meat" },
  { typeName: "B_MEAT", title: "Broiler", productionType: "meat" },
  { typeName: "LP_MEAT", title: "Layer Parent", productionType: "meat" },
  { typeName: "L_MEAT", title: "Layer", productionType: "meat" },
  { typeName: "BP_CHICK", title: "Broiler Parent", productionType: "chick" },
  { typeName: "B_CHICK", title: "Broiler", productionType: "chick" },
  { typeName: "L_CHICK", title: "Layer", productionType: "chick" },
  { typeName: "L_EGG", title: "Layer", productionType: "egg" },
];

const groupedOptions = typeOptions.reduce<Record<string, TypeOptions[]>>(
  (acc, item) => {
    (acc[item.productionType] ??= []).push(item);
    return acc;
  },
  {},
);

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));

const DisplayChart = () => {
  const { calculationData } = useCalculationStore();

  if (!calculationData) return <div>No calculation</div>;

  const defaultType = "B_MEAT" as keyof typeof calculationData.data;

  const [type, setType] =
    useState<keyof typeof calculationData.data>(defaultType);

  const chartData = useMemo(() => {
    const raw = calculationData.data?.[type] ?? [];
    return raw.map(({ date, count }) => ({
      date: formatDate(date),
      count: +count,
    }));
  }, [calculationData.data, type]);

  const option = useMemo(() => {
    const dates = new Array(chartData.length);
    const counts = new Array(chartData.length);

    for (let i = 0; i < chartData.length; i++) {
      dates[i] = chartData[i].date;
      counts[i] = chartData[i].count;
    }

    return {
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: dates },
      yAxis: { type: "value" },
      series: [
        {
          name: type,
          type: "line",
          smooth: true,
          data: counts,
        },
      ],
    };
  }, [chartData, type]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col flex-1">
        <div className="flex justify-between pt-5 px-5">
          <h2 className="flex flex-col text-base text-primary font-medium xl:text-xl pb-1">
            Chart
          </h2>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as keyof typeof calculationData.data)
            }
            className="border border-blue-500/30 py-1 px-2 rounded-md focus:outline-0 text-base capitalize"
          >
            {Object.entries(groupedOptions).map(([group, options]) => (
              <optgroup key={group} label={group.toUpperCase()}>
                {options.map(({ typeName, title }) => (
                  <option key={typeName} value={typeName}>
                    {title} - {group}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="h-full w-full scale-115 -ml-5">
            <ReactECharts
              option={option}
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
function sumWithClamp(a: number, b: number): number {
  const sum = -a + b;

  if (sum >= -1 && sum <= 1) {
    return 0;
  }

  return sum;
}
export const applyAdjustedParameters = (
  data: StandardPoultryData,
  setData: (data: StandardPoultryData) => void,
  formData: CalcParamFormDataType,
) => {
  const updatedData: StandardPoultryData = {
    grandParent: {
      ...data.grandParent,
      adjustedParameter: {
        averageHatchableEggRate: sumWithClamp(
          data.grandParent.averageParameter.averageHatchableEggRate,
          formData.grandparent.averageHatchableEggRate,
        ),

        averageHatchingEggRate: sumWithClamp(
          data.grandParent.averageParameter.averageHatchingEggRate,
          formData.grandparent.averageHatchingEggRate,
        ),

        averageCumulativeMortalityRate: sumWithClamp(
          data.grandParent.averageParameter.averageCumulativeMortalityRate,
          formData.grandparent.averageCumulativeMortalityRate,
        ),
      },
    },

    parent: {
      ...data.parent,
      adjustedParameter: {
        averageHatchableEggRate: sumWithClamp(
          data.parent.averageParameter.averageHatchableEggRate,
          formData.parent.averageHatchableEggRate,
        ),

        averageHatchingEggRate: sumWithClamp(
          data.parent.averageParameter.averageHatchingEggRate,
          formData.parent.averageHatchingEggRate,
        ),

        averageCumulativeMortalityRate: sumWithClamp(
          data.parent.averageParameter.averageCumulativeMortalityRate,
          formData.parent.averageCumulativeMortalityRate,
        ),
      },
    },

    layer: {
      ...data.layer,
      adjustedParameter: {
        eggProductionRate: sumWithClamp(
          data.layer.averageParameter.eggProductionRate,
          formData.layer.eggProductionRate,
        ),

        damagedEggRate: sumWithClamp(
          data.layer.averageParameter.damagedEggRate,
          formData.layer.damagedEggRate,
        ),

        cumulativeMortalityRate: sumWithClamp(
          data.layer.averageParameter.cumulativeMortalityRate,
          formData.layer.cumulativeMortalityRate,
        ),
      },
    },

    broiler: {
      ...data.broiler,
      adjustedParameter: {
        weight: sumWithClamp(
          data.broiler.averageParameter.weight,
          formData.broiler.weight,
        ),

        cumulativeMortalityRate: sumWithClamp(
          data.broiler.averageParameter.cumulativeMortalityRate,
          formData.broiler.cumulativeMortalityRate,
        ),
      },
    },
  };

  setData(updatedData);
};

const DisplaySimulationAdjustment = () => {
  const { data, formData, setData } = useCalculationStore();
  const [calcFormData, setCalcParamFormData] =
    useState<CalcParamFormDataType>(formData);

  const [selected, setSelected] = useState<GenKey>("grandparent");

  const handleChange = (gen: GenKey, field: string, value: number) => {
    // console.log("CalcFormData", calcFormData);
    const newCalcFormData: CalcParamFormDataType = {
      ...calcFormData,
      [gen]: {
        ...calcFormData[gen],
        [field]: value,
      },
    };

    setCalcParamFormData(newCalcFormData);
    applyAdjustedParameters(data, setData, newCalcFormData);
  };

  const clickRestore = () => {
    setCalcParamFormData(formData);
  };

  const renderField = (gen: GenKey) => {
    const singleGendata = calcFormData[gen];

    return Object.entries(singleGendata).map(([key, value]) => {
      const isWeight = key === "weight";

      return (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-base tracking-wide capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </label>

          {isWeight ? (
            <input
              type="number"
              className="border rounded-md p-2 w-full"
              value={value}
              onChange={(e) => handleChange(gen, key, Number(e.target.value))}
            />
          ) : (
            <div className="flex gap-2">
              <input
                type="range"
                min={0}
                max={100}
                className="w-full"
                value={value}
                onChange={(e) => handleChange(gen, key, Number(e.target.value))}
              />{" "}
              <div className="text-sm text-gray-900 w-12 flex justify-center">
                {value} %
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    console.log("data asd", data);
  }, [data]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col flex-1  p-4 ">
        <div className="flex justify-between pb-4">
          <h2 className="flex flex-col text-base text-primary font-medium xl:text-xl pb-1">
            Adjustment
          </h2>
          <button
            className="px-6 py-0.5 flex items-center bg-white border border-gray-500/50 transition-colors duration-300 hover:bg-gray-100 text-gray-500 text-xs 2xl:text-base  rounded-md cursor-pointer"
            onClick={clickRestore}
          >
            Restore
          </button>
        </div>

        {/* Radio Switch */}
        <div className="w-full pb-4 bg-white">
          <div className="grid grid-cols-2 gap-3">
            {(["grandparent", "parent", "broiler", "layer"] as GenKey[]).map(
              (opt) => {
                const active = selected === opt;

                return (
                  <label
                    key={opt}
                    className={`cursor-pointer flex items-center justify-between px-3 py-3 rounded-xl border transition-all duration-200
              ${
                active
                  ? "border-black bg-black text-white shadow-md"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100"
              }`}
                  >
                    <span className="capitalize text-sm font-medium">
                      {opt}
                    </span>

                    <div className="relative">
                      <input
                        type="radio"
                        name="gen"
                        value={opt}
                        checked={selected === opt}
                        onChange={() => setSelected(opt)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${active ? "border-white" : "border-gray-400"}`}
                      >
                        {active && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </label>
                );
              },
            )}
          </div>
        </div>

        {/* Dynamic Form (Portrait Layout) */}
        <div className="flex flex-col gap-4">{renderField(selected)}</div>
      </div>
    </div>
  );
};

const ProductionDataCard = ({
  productionDataProp,
}: {
  productionDataProp: ProductionDataProp;
}) => {
  const { title, subTitle, Icon, iconUrl, color, code } = productionDataProp;
  const { calculationData } = useCalculationStore();

  if (calculationData == null) return <div>No data found</div>;

  const { totals } = calculationData;

  const newCount = totals
    .filter((dt) => {
      console.log("dt.productionType === code", dt.productionType, code);
      return dt.productionType === code;
    })
    .reduce((sum, dt) => sum + Number(dt.total), 0);

  const formatNepaliNumber = (n: number) =>
    n
      .toString()
      .replace(
        /^(-?\d+)(\d{3})/,
        (_, a, b) => a.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + b,
      );
  return (
    <div
      style={{ backgroundColor: `#${color}` }}
      className={`rounded-2xl flex justify-end w-full h-full`}
    >
      <div className="w-[calc(100%-6px)] flex flex-col rounded-2xl bg-white px-5 pt-5 py-4 border border-stone-500/50 shadow-[0_5px_8px_-5px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between pb-4 ">
          <span>{title}</span>
          <span style={{ color: `#${color}` }} className="text-3xl">
            {Icon && <Icon />}
            {iconUrl && (
              <Image src={iconUrl} width={40} height={40} alt={title} />
            )}
          </span>
        </div>
        <div className="flex justify-between pb-1 text-base">
          <span className="">{formatNepaliNumber(newCount)}</span>
        </div>
        <div className="font-light tracking-wider text-stone-900 text-sm w-[200px]">
          {subTitle}
        </div>
      </div>
    </div>
  );
};

const HatcherySearchDropdown = ({
  display,
  formData,
  setFormData,
}: {
  display: boolean;
  formData: CalcFormData;
  setFormData: (data: CalcFormData) => void;
}) => {
  const [search, setSearch] = useState("");
  const [list, setList] = useState<HatcheryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!display) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        let data: HatcheryType[];

        if (search.trim() === "") {
          data = await getHatcheryList();
        } else {
          data = await searchHatcheryList(search);
        }

        if (isMounted) setList(data);
      } catch (err) {
        console.error("Failed to fetch hatchery list", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [search, display]);

  useEffect(() => {
    if (!display) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [display]);

  if (!display) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-primary text-base tracking-wide mb-1">
        Select Hatchery
      </label>

      <input
        type="text"
        value={search}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
          setFormData({ ...formData, hatcheryId: 0 });
        }}
        placeholder="Search hatchery..."
        className="w-full bg-white text-primary rounded-md py-2 px-3 text-sm mt-1 shadow-xs border border-gray-300 outline-0 focus:outline-1 focus:outline-blue-300 transition duration-200"
      />

      {open && (
        <div className="absolute top-full w-full max-h-62.5 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-10">
          {loading && (
            <div className="px-2.5 py-2 text-sm text-gray-500">Loading...</div>
          )}

          {!loading && list && list.length === 0 && (
            <div className="px-2.5 py-2 text-sm text-gray-500">
              No results found
            </div>
          )}

          {!loading &&
            list.map((item) => (
              <div
                key={item.id}
                className="flex items-center px-2.5 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSearch(item.hatcheryName);
                  setFormData({ ...formData, hatcheryId: item.id });
                  setOpen(false);
                }}
              >
                {item.hatcheryName}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const BreedDropdown = ({
  formData,
  setFormData,
  breedOpen,
  setBreedOpen,
}: {
  formData: CalcFormData;
  setFormData: (data: CalcFormData) => void;
  breedOpen: boolean;
  setBreedOpen: (value: boolean) => void;
}) => {
  const { loadBreed } = useBreedStore();
  // const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const grouped = useMemo(() => {
    const map: Record<string, Breed[]> = {};

    GENERATION_ORDER.forEach((gen) => (map[gen] = []));

    loadBreed.forEach((item) => {
      map[item.generation].push({
        id: Number(item.id),
        name: item.name,
        generation: item.generation as Generation,
        finalWeight: item.finalWeight ?? 0,
      });
    });

    return map;
  }, [loadBreed]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

    setFormData({
      ...formData,
      breedIds: formData.breedIds.includes(id)
        ? formData.breedIds.filter((x) => x !== id)
        : [...formData.breedIds, id],
    });
  };

  return (
    loadBreed && (
      <div className="relative w-full">
        <label className="text-primary text-base tracking-wide mb-1">
          Select Breed
        </label>
        {/* Debug output */}
        <div style={{ marginTop: 10, fontSize: 12 }} className="hidden">
          Selected IDs: {JSON.stringify(selectedIds)}
        </div>
        {/* Trigger */}
        <div
          onClick={() => setBreedOpen(!breedOpen)}
          className="flex justify-between items-center border border-gray-400 py-2 px-2.5 text-sm mt-1 rounded-sm cursor-pointer"
        >
          <span>Select Breeds</span>{" "}
          <span className="">
            <FaChevronDown />
          </span>
        </div>

        {/* Dropdown */}
        {breedOpen && (
          <div className="absolute top-full w-full max-h-125 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-md z-10">
            {GENERATION_ORDER.map((gen) =>
              grouped[gen].length > 0 ? (
                <div key={gen}>
                  {/* Group title */}
                  <div className="px-2.5 py-2 font-bold bg-gray-200 text-xs">
                    {gen}
                  </div>

                  {/* Items */}
                  {grouped[gen].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center px-2.5 py-1.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        style={{ marginRight: 8 }}
                      />
                      {item.name}
                      {/* ({item.finalWeight}) */}
                    </label>
                  ))}
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    )
  );
};

const getPeriodDates = (
  period: Production,
): { start: string | null; end: string | null } => {
  if (!period) return { start: null, end: null };

  const today = new Date();

  if (period === "week") {
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay()); // Sunday
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6); // Saturday
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  if (period === "month") {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  if (period === "year") {
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  }

  return { start: null, end: null };
};

const CalculationFilter = () => {
  const { calcFormData: calculationForm, data: simData } =
    useCalculationStore();

  const mainFilterData: CalcFormData = {
    ...calculationForm,
    simulation: simData,
  };
  const user = useAuthStore((s) => s.user);
  const roles: string[] = user?.roles ?? [];
  const timeOptions: TimeOption[] = [
    { value: "", option: "Select Time Period" },
    { value: "week", option: "Current Week" },
    { value: "month", option: "Current Month" },
    { value: "year", option: "Current Year" },
  ];

  const showHatcheryForm = roles.includes("SUPER_ROLE");
  const [breedOpen, setBreedOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const { setCalcFormData, fetchCalculationData } = useCalculationStore();

  const [calcFormData, setCalcParamFormData] = useState<CalcFormData>({
    startDate: null,
    endDate: null,
    breedIds: [],
    hatcheryId: 0,
    simulation: null,
  });

  const makeCalculation = () => {
    console.log("clicking");
    setBreedOpen(false);
    setCalcFormData(calcFormData);
    fetchCalculationData();
  };

  const generateReport = async () => {
    if (reportLoading) toast.error("Report is generating");

    console.log("Generte report");
    setReportLoading(true);

    const res = await generateReportFile({ formData: mainFilterData });

    const blob = new Blob([res]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Report.pdf";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
    setReportLoading(false);
  };

  useEffect(() => {
    console.log("calcFormData", calcFormData);
  }, [calcFormData]);

  return (
    <div className="flex flex-col">
      <div className="flex gap-5">
        <div className="borderr outlinee flex-3 ">
          <BreedDropdown
            formData={calcFormData}
            setFormData={setCalcParamFormData}
            breedOpen={breedOpen}
            setBreedOpen={setBreedOpen}
          />
        </div>
        <div
          className={`${showHatcheryForm ? "" : "hidden"} borderr flex-3 outlinee`}
        >
          <HatcherySearchDropdown
            display={showHatcheryForm}
            formData={calcFormData}
            setFormData={setCalcParamFormData}
          />
        </div>
        <div className="flex-2 outlinee">
          <InputCard
            title="Start Date"
            name="startDate"
            type="date"
            value={calcFormData.startDate ?? ""}
            onChange={(e) =>
              setCalcParamFormData((prev) => ({
                ...prev,
                startDate: e.target.value || null,
              }))
            }
            placeholder=""
          />
        </div>
        <div className=" flex-2 outlinee">
          <InputCard
            title="End Date"
            name="endDate"
            type="date"
            value={calcFormData.endDate ?? ""}
            onChange={(e) =>
              setCalcParamFormData((prev) => ({
                ...prev,
                endDate: e.target.value || null,
              }))
            }
            placeholder=""
          />
        </div>
        <div className=" flex-2 outlinee">
          <SelectCard
            name="production"
            title="Production period"
            value={""}
            onChange={(e) => {
              const value = e.target.value as Production;
              const { start, end } = getPeriodDates(value);

              setCalcParamFormData((prev) => ({
                ...prev,
                startDate: start,
                endDate: end,
              }));
            }}
            options={timeOptions}
          />
        </div>
      </div>
      <div className="flex justify-end pt-4 gap-4">
        <button
          className="add-btn h-9 px-5 gap-2 flex items-center"
          onClick={generateReport}
        >
          {reportLoading ? (
            <div className="animate-spin">
              <LuLoaderCircle />
            </div>
          ) : (
            <IoDocumentText />
          )}

          <span>Generate Report</span>
        </button>
        <button className="add-btn h-9 px-6" onClick={makeCalculation}>
          <span>Calculate</span>
        </button>
      </div>
    </div>
  );
};

const Calculation = () => {
  // return <FlockPrediction />;

  return (
    <div className="flex flex-col h-full ">
      {/* section 1 */}
      <div className=" flex flex-col flex-2 py-1 pt-2.5 pb-4 px-4 mb-5 rounded-xl border border-stone-500/50 shadow-md">
        <div>
          <h1 className="text-lg text-primary font-medium 2xl:text-xl">
            Flock Data
          </h1>
        </div>
        <CalculationFilter />
      </div>
      {/* section 2 */}
      <div className="flex-2 flex relative">
        <div className="w-full flex justify-between gap-5 pb-5 ">
          <button className="custom-button-P z-10 absolute -left-4.5 top-1/2 -translate-y-1/2 text-base md:text-4xl text-black bg-black/0  md:block cursor-pointer rounded-full p-3 opacity-50 hover:opacity-100 hover:bg-black/30 transition-all duration-300 ">
            <FaChevronLeft />
          </button>
          <button className="custom-button-N absolute -right-4.5 top-1/2 -translate-y-1/2 z-10 text-base md:text-4xl text-black md:block cursor-pointer rounded-full p-3 opacity-50 hover:opacity-100 hover:bg-black/30 transition-all duration-300 ">
            <FaChevronRight />
          </button>
          <Swiper
            className=""
            modules={[Navigation]}
            spaceBetween={20}
            loop={allProductionData.length > 3}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2.5, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 3.5, spaceBetween: 25 },
            }}
            navigation={{
              nextEl: ".custom-button-N",
              prevEl: ".custom-button-P",
            }}
          >
            {allProductionData.map((data, index) => (
              <SwiperSlide key={index}>
                <ProductionDataCard key={index} productionDataProp={data} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* section 3 */}
      <div className="flex flex-8 gap-5">
        <div className="flex w-5/7 rounded-xl border border-stone-500/50 shadow-md">
          <DisplayChart />
        </div>
        <div className="flex w-2/7 rounded-xl border border-stone-500/50 shadow-md">
          <DisplaySimulationAdjustment />
        </div>
      </div>
    </div>
  );
};

export default Calculation;
