import axiosInstance from "@/lib/axios.utils";
import { HatcheryType } from "@/types";
import { CalcFormData, ProductionDataMap } from "@/types/calculation";

export const getHatcheryList = async (): Promise<HatcheryType[]> => {
  const res = await axiosInstance.get(`/hatcheries?page=1&limit=6`);
  return res.data.data as HatcheryType[];
};

export const searchHatcheryList = async (
  searchName: string,
): Promise<HatcheryType[]> => {
  const res = await axiosInstance.get(
    `/hatcheries/search?name=${searchName}&page=1&limit=6`,
  );

  return res.data.data as HatcheryType[];
};

export const getChartData = async ({
  formData,
}: {
  formData: CalcFormData;
}) => {
  const res = await axiosInstance.post(`/calculations/data`, formData);
  const calculationData: ProductionDataMap = res.data;
  return calculationData;
};

export const getAverageStandard = async (): Promise<any> => {
  const res = await axiosInstance.get(
    `/calculations/average-standard-statistics`,
  );
  return res.data;
};

export const generateReportFile = async ({
  formData,
}: {
  formData: CalcFormData;
}) => {
  const res = await axiosInstance.post(`/report/generate`, formData, {
    responseType: "blob",
  });
  return res.data;
};
/*

{
    "totals": [
        {
            "productionType": "BGP_MEAT",
            "total": 278236
        },
        {
            "productionType": "BP_CHICK",
            "total": 83356
        },
        {
            "productionType": "BP_MEAT",
            "total": 277892
        },
        {
            "productionType": "B_MEAT",
            "total": 5746982
        },
        {
            "productionType": "B_CHICK",
            "total": 82722
        },
        {
            "productionType": "LP_MEAT",
            "total": 207130
        },
        {
            "productionType": "L_MEAT",
            "total": 7614412
        },
        {
            "productionType": "L_CHICK",
            "total": 107690
        },
        {
            "productionType": "L_EGG",
            "total": 3510779
        }
    ],
    "data": {
        "BGP_MEAT": [
            {
                "purpose": "BGP_MEAT",
                "date": "2026-06-04T18:15:00.000Z",
                "count": 278236
            }
        ],
        "BP_MEAT": [
            {
                "purpose": "BP_MEAT",
                "date": "2026-06-04T18:15:00.000Z",
                "count": 277892
            }
        ],
        "B_MEAT": [
            {
                "purpose": "B_MEAT",
                "date": "2026-11-27T18:15:00.000Z",
                "count": 15978
            },
            {
                "purpose": "B_MEAT",
                "date": "2026-12-04T18:15:00.000Z",
                "count": 44046
            },
            {
                "purpose": "B_MEAT",
                "date": "2026-12-11T18:15:00.000Z",
                "count": 151452
            },
            {
                "purpose": "B_MEAT",
                "date": "2026-12-18T18:15:00.000Z",
                "count": 178408
            },
            {
                "purpose": "B_MEAT",
                "date": "2026-12-25T18:15:00.000Z",
                "count": 189244
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-01-01T18:15:00.000Z",
                "count": 194524
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-01-08T18:15:00.000Z",
                "count": 198140
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-01-15T18:15:00.000Z",
                "count": 197584
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-01-22T18:15:00.000Z",
                "count": 196748
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-01-29T18:15:00.000Z",
                "count": 196192
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-02-05T18:15:00.000Z",
                "count": 193416
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-02-12T18:15:00.000Z",
                "count": 190356
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-02-19T18:15:00.000Z",
                "count": 187024
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-02-26T18:15:00.000Z",
                "count": 183964
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-03-05T18:15:00.000Z",
                "count": 180908
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-03-12T18:15:00.000Z",
                "count": 175908
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-03-19T18:15:00.000Z",
                "count": 172296
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-03-26T18:15:00.000Z",
                "count": 168960
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-04-02T18:15:00.000Z",
                "count": 165068
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-04-09T18:15:00.000Z",
                "count": 161180
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-04-16T18:15:00.000Z",
                "count": 157844
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-04-23T18:15:00.000Z",
                "count": 153952
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-04-30T18:15:00.000Z",
                "count": 150340
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-05-07T18:15:00.000Z",
                "count": 147004
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-05-14T18:15:00.000Z",
                "count": 143116
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-05-21T18:15:00.000Z",
                "count": 139780
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-05-28T18:15:00.000Z",
                "count": 135892
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-06-04T18:15:00.000Z",
                "count": 132000
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-06-11T18:15:00.000Z",
                "count": 128388
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-06-18T18:15:00.000Z",
                "count": 124496
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-06-25T18:15:00.000Z",
                "count": 120884
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-07-02T18:15:00.000Z",
                "count": 116992
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-07-09T18:15:00.000Z",
                "count": 113104
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-07-16T18:15:00.000Z",
                "count": 109768
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-07-23T18:15:00.000Z",
                "count": 105876
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-07-30T18:15:00.000Z",
                "count": 102264
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-08-06T18:15:00.000Z",
                "count": 98376
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-08-13T18:15:00.000Z",
                "count": 94760
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-08-20T18:15:00.000Z",
                "count": 45436
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-08-27T18:15:00.000Z",
                "count": 43630
            },
            {
                "purpose": "B_MEAT",
                "date": "2027-09-03T18:15:00.000Z",
                "count": 41684
            }
        ],
        "LP_MEAT": [
            {
                "purpose": "LP_MEAT",
                "date": "2026-06-04T18:15:00.000Z",
                "count": 207130
            }
        ],
        "L_MEAT": [
            {
                "purpose": "L_MEAT",
                "date": "2026-10-16T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-10-23T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-10-30T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-11-06T18:15:00.000Z",
                "count": 91144
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-11-13T18:15:00.000Z",
                "count": 122114
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-11-20T18:15:00.000Z",
                "count": 141559
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-11-27T18:15:00.000Z",
                "count": 150467
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-12-04T18:15:00.000Z",
                "count": 157183
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-12-11T18:15:00.000Z",
                "count": 161566
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-12-18T18:15:00.000Z",
                "count": 164818
            },
            {
                "purpose": "L_MEAT",
                "date": "2026-12-25T18:15:00.000Z",
                "count": 167433
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-01-01T18:15:00.000Z",
                "count": 167504
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-01-08T18:15:00.000Z",
                "count": 168281
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-01-15T18:15:00.000Z",
                "count": 167574
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-01-22T18:15:00.000Z",
                "count": 166867
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-01-29T18:15:00.000Z",
                "count": 166372
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-02-05T18:15:00.000Z",
                "count": 166230
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-02-12T18:15:00.000Z",
                "count": 165595
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-02-19T18:15:00.000Z",
                "count": 164888
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-02-26T18:15:00.000Z",
                "count": 164181
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-03-05T18:15:00.000Z",
                "count": 183768
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-03-12T18:15:00.000Z",
                "count": 162979
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-03-19T18:15:00.000Z",
                "count": 161564
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-03-26T18:15:00.000Z",
                "count": 160998
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-04-02T18:15:00.000Z",
                "count": 159090
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-04-09T18:15:00.000Z",
                "count": 158382
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-04-16T18:15:00.000Z",
                "count": 157039
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-04-23T18:15:00.000Z",
                "count": 156402
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-04-30T18:15:00.000Z",
                "count": 153786
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-05-07T18:15:00.000Z",
                "count": 153079
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-05-14T18:15:00.000Z",
                "count": 150674
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-05-21T18:15:00.000Z",
                "count": 149827
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-05-28T18:15:00.000Z",
                "count": 146856
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-06-04T18:15:00.000Z",
                "count": 145373
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-06-11T18:15:00.000Z",
                "count": 144100
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-06-18T18:15:00.000Z",
                "count": 142191
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-06-25T18:15:00.000Z",
                "count": 140351
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-07-02T18:15:00.000Z",
                "count": 138443
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-07-09T18:15:00.000Z",
                "count": 137877
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-07-16T18:15:00.000Z",
                "count": 135403
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-07-23T18:15:00.000Z",
                "count": 133634
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-07-30T18:15:00.000Z",
                "count": 131442
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-08-06T18:15:00.000Z",
                "count": 129676
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-08-13T18:15:00.000Z",
                "count": 126918
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-08-20T18:15:00.000Z",
                "count": 126281
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-08-27T18:15:00.000Z",
                "count": 125644
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-09-03T18:15:00.000Z",
                "count": 121897
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-09-10T18:15:00.000Z",
                "count": 121260
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-09-17T18:15:00.000Z",
                "count": 119494
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-09-24T18:15:00.000Z",
                "count": 117866
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-10-01T18:15:00.000Z",
                "count": 117302
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-10-08T18:15:00.000Z",
                "count": 114402
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-10-15T18:15:00.000Z",
                "count": 113766
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-10-22T18:15:00.000Z",
                "count": 111998
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-10-29T18:15:00.000Z",
                "count": 70998
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-11-05T18:15:00.000Z",
                "count": 70292
            },
            {
                "purpose": "L_MEAT",
                "date": "2027-11-12T18:15:00.000Z",
                "count": 69584
            }
        ],
        "BP_CHICK": [
            {
                "purpose": "BP_CHICK",
                "date": "2026-04-24T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-10-16T18:15:00.000Z",
                "count": 230
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-10-23T18:15:00.000Z",
                "count": 1268
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-10-30T18:15:00.000Z",
                "count": 2180
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-11-06T18:15:00.000Z",
                "count": 2568
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-11-13T18:15:00.000Z",
                "count": 2724
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-11-20T18:15:00.000Z",
                "count": 2800
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-11-27T18:15:00.000Z",
                "count": 2852
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-12-04T18:15:00.000Z",
                "count": 2844
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-12-11T18:15:00.000Z",
                "count": 2832
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-12-18T18:15:00.000Z",
                "count": 2824
            },
            {
                "purpose": "BP_CHICK",
                "date": "2026-12-25T18:15:00.000Z",
                "count": 2784
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-01-01T18:15:00.000Z",
                "count": 2740
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-01-08T18:15:00.000Z",
                "count": 2692
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-01-15T18:15:00.000Z",
                "count": 2648
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-01-22T18:15:00.000Z",
                "count": 2604
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-01-29T18:15:00.000Z",
                "count": 2532
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-02-05T18:15:00.000Z",
                "count": 2480
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-02-12T18:15:00.000Z",
                "count": 2432
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-02-19T18:15:00.000Z",
                "count": 2376
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-02-26T18:15:00.000Z",
                "count": 2320
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-03-05T18:15:00.000Z",
                "count": 2272
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-03-12T18:15:00.000Z",
                "count": 2216
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-03-19T18:15:00.000Z",
                "count": 2164
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-03-26T18:15:00.000Z",
                "count": 2116
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-04-02T18:15:00.000Z",
                "count": 2060
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-04-09T18:15:00.000Z",
                "count": 2012
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-04-16T18:15:00.000Z",
                "count": 1956
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-04-23T18:15:00.000Z",
                "count": 1900
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-04-30T18:15:00.000Z",
                "count": 1848
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-05-07T18:15:00.000Z",
                "count": 1792
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-05-14T18:15:00.000Z",
                "count": 1740
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-05-21T18:15:00.000Z",
                "count": 1684
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-05-28T18:15:00.000Z",
                "count": 1628
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-06-04T18:15:00.000Z",
                "count": 1580
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-06-11T18:15:00.000Z",
                "count": 1524
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-06-18T18:15:00.000Z",
                "count": 1472
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-06-25T18:15:00.000Z",
                "count": 1416
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-07-02T18:15:00.000Z",
                "count": 1364
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-07-09T18:15:00.000Z",
                "count": 654
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-07-16T18:15:00.000Z",
                "count": 628
            },
            {
                "purpose": "BP_CHICK",
                "date": "2027-07-23T18:15:00.000Z",
                "count": 600
            }
        ],
        "B_CHICK": [
            {
                "purpose": "B_CHICK",
                "date": "2026-10-16T18:15:00.000Z",
                "count": 230
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-10-23T18:15:00.000Z",
                "count": 634
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-10-30T18:15:00.000Z",
                "count": 2180
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-11-06T18:15:00.000Z",
                "count": 2568
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-11-13T18:15:00.000Z",
                "count": 2724
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-11-20T18:15:00.000Z",
                "count": 2800
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-11-27T18:15:00.000Z",
                "count": 2852
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-12-04T18:15:00.000Z",
                "count": 2844
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-12-11T18:15:00.000Z",
                "count": 2832
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-12-18T18:15:00.000Z",
                "count": 2824
            },
            {
                "purpose": "B_CHICK",
                "date": "2026-12-25T18:15:00.000Z",
                "count": 2784
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-01-01T18:15:00.000Z",
                "count": 2740
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-01-08T18:15:00.000Z",
                "count": 2692
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-01-15T18:15:00.000Z",
                "count": 2648
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-01-22T18:15:00.000Z",
                "count": 2604
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-01-29T18:15:00.000Z",
                "count": 2532
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-02-05T18:15:00.000Z",
                "count": 2480
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-02-12T18:15:00.000Z",
                "count": 2432
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-02-19T18:15:00.000Z",
                "count": 2376
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-02-26T18:15:00.000Z",
                "count": 2320
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-03-05T18:15:00.000Z",
                "count": 2272
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-03-12T18:15:00.000Z",
                "count": 2216
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-03-19T18:15:00.000Z",
                "count": 2164
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-03-26T18:15:00.000Z",
                "count": 2116
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-04-02T18:15:00.000Z",
                "count": 2060
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-04-09T18:15:00.000Z",
                "count": 2012
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-04-16T18:15:00.000Z",
                "count": 1956
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-04-23T18:15:00.000Z",
                "count": 1900
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-04-30T18:15:00.000Z",
                "count": 1848
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-05-07T18:15:00.000Z",
                "count": 1792
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-05-14T18:15:00.000Z",
                "count": 1740
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-05-21T18:15:00.000Z",
                "count": 1684
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-05-28T18:15:00.000Z",
                "count": 1628
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-06-04T18:15:00.000Z",
                "count": 1580
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-06-11T18:15:00.000Z",
                "count": 1524
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-06-18T18:15:00.000Z",
                "count": 1472
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-06-25T18:15:00.000Z",
                "count": 1416
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-07-02T18:15:00.000Z",
                "count": 1364
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-07-09T18:15:00.000Z",
                "count": 654
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-07-16T18:15:00.000Z",
                "count": 628
            },
            {
                "purpose": "B_CHICK",
                "date": "2027-07-23T18:15:00.000Z",
                "count": 600
            }
        ],
        "L_CHICK": [
            {
                "purpose": "L_CHICK",
                "date": "2026-09-04T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-09-11T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-09-18T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-09-25T18:15:00.000Z",
                "count": 1289
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-10-02T18:15:00.000Z",
                "count": 1727
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-10-09T18:15:00.000Z",
                "count": 2002
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-10-16T18:15:00.000Z",
                "count": 2128
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-10-23T18:15:00.000Z",
                "count": 2223
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-10-30T18:15:00.000Z",
                "count": 2285
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-11-06T18:15:00.000Z",
                "count": 2331
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-11-13T18:15:00.000Z",
                "count": 2368
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-11-20T18:15:00.000Z",
                "count": 2369
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-11-27T18:15:00.000Z",
                "count": 2380
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-12-04T18:15:00.000Z",
                "count": 2370
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-12-11T18:15:00.000Z",
                "count": 2360
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-12-18T18:15:00.000Z",
                "count": 2353
            },
            {
                "purpose": "L_CHICK",
                "date": "2026-12-25T18:15:00.000Z",
                "count": 2351
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-01-01T18:15:00.000Z",
                "count": 2342
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-01-08T18:15:00.000Z",
                "count": 2332
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-01-15T18:15:00.000Z",
                "count": 2322
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-01-22T18:15:00.000Z",
                "count": 2599
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-01-29T18:15:00.000Z",
                "count": 2305
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-02-05T18:15:00.000Z",
                "count": 2285
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-02-12T18:15:00.000Z",
                "count": 2277
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-02-19T18:15:00.000Z",
                "count": 2250
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-02-26T18:15:00.000Z",
                "count": 2240
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-03-05T18:15:00.000Z",
                "count": 2221
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-03-12T18:15:00.000Z",
                "count": 2212
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-03-19T18:15:00.000Z",
                "count": 2175
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-03-26T18:15:00.000Z",
                "count": 2165
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-04-02T18:15:00.000Z",
                "count": 2131
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-04-09T18:15:00.000Z",
                "count": 2119
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-04-16T18:15:00.000Z",
                "count": 2077
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-04-23T18:15:00.000Z",
                "count": 2056
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-04-30T18:15:00.000Z",
                "count": 2038
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-05-07T18:15:00.000Z",
                "count": 2011
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-05-14T18:15:00.000Z",
                "count": 1985
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-05-21T18:15:00.000Z",
                "count": 1958
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-05-28T18:15:00.000Z",
                "count": 1950
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-06-04T18:15:00.000Z",
                "count": 1915
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-06-11T18:15:00.000Z",
                "count": 1890
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-06-18T18:15:00.000Z",
                "count": 1859
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-06-25T18:15:00.000Z",
                "count": 1834
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-07-02T18:15:00.000Z",
                "count": 1795
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-07-09T18:15:00.000Z",
                "count": 1786
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-07-16T18:15:00.000Z",
                "count": 1777
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-07-23T18:15:00.000Z",
                "count": 1724
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-07-30T18:15:00.000Z",
                "count": 1715
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-08-06T18:15:00.000Z",
                "count": 1690
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-08-13T18:15:00.000Z",
                "count": 1667
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-08-20T18:15:00.000Z",
                "count": 1659
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-08-27T18:15:00.000Z",
                "count": 1618
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-09-03T18:15:00.000Z",
                "count": 1609
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-09-10T18:15:00.000Z",
                "count": 1584
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-09-17T18:15:00.000Z",
                "count": 1004
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-09-24T18:15:00.000Z",
                "count": 994
            },
            {
                "purpose": "L_CHICK",
                "date": "2027-10-01T18:15:00.000Z",
                "count": 984
            }
        ],
        "L_EGG": [
            {
                "purpose": "L_EGG",
                "date": "2027-01-08T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_EGG",
                "date": "2027-01-15T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_EGG",
                "date": "2027-01-22T18:15:00.000Z",
                "count": 0
            },
            {
                "purpose": "L_EGG",
                "date": "2027-01-29T18:15:00.000Z",
                "count": 2
            },
            {
                "purpose": "L_EGG",
                "date": "2027-02-05T18:15:00.000Z",
                "count": 29
            },
            {
                "purpose": "L_EGG",
                "date": "2027-02-12T18:15:00.000Z",
                "count": 128
            },
            {
                "purpose": "L_EGG",
                "date": "2027-02-19T18:15:00.000Z",
                "count": 307
            },
            {
                "purpose": "L_EGG",
                "date": "2027-02-26T18:15:00.000Z",
                "count": 585
            },
            {
                "purpose": "L_EGG",
                "date": "2027-03-05T18:15:00.000Z",
                "count": 954
            },
            {
                "purpose": "L_EGG",
                "date": "2027-03-12T18:15:00.000Z",
                "count": 1415
            },
            {
                "purpose": "L_EGG",
                "date": "2027-03-19T18:15:00.000Z",
                "count": 1958
            },
            {
                "purpose": "L_EGG",
                "date": "2027-03-26T18:15:00.000Z",
                "count": 2577
            },
            {
                "purpose": "L_EGG",
                "date": "2027-04-02T18:15:00.000Z",
                "count": 3267
            },
            {
                "purpose": "L_EGG",
                "date": "2027-04-09T18:15:00.000Z",
                "count": 4027
            },
            {
                "purpose": "L_EGG",
                "date": "2027-04-16T18:15:00.000Z",
                "count": 4841
            },
            {
                "purpose": "L_EGG",
                "date": "2027-04-23T18:15:00.000Z",
                "count": 5712
            },
            {
                "purpose": "L_EGG",
                "date": "2027-04-30T18:15:00.000Z",
                "count": 6639
            },
            {
                "purpose": "L_EGG",
                "date": "2027-05-07T18:15:00.000Z",
                "count": 7607
            },
            {
                "purpose": "L_EGG",
                "date": "2027-05-14T18:15:00.000Z",
                "count": 8629
            },
            {
                "purpose": "L_EGG",
                "date": "2027-05-21T18:15:00.000Z",
                "count": 9704
            },
            {
                "purpose": "L_EGG",
                "date": "2027-05-28T18:15:00.000Z",
                "count": 10799
            },
            {
                "purpose": "L_EGG",
                "date": "2027-06-04T18:15:00.000Z",
                "count": 11918
            },
            {
                "purpose": "L_EGG",
                "date": "2027-06-11T18:15:00.000Z",
                "count": 13030
            },
            {
                "purpose": "L_EGG",
                "date": "2027-06-18T18:15:00.000Z",
                "count": 14143
            },
            {
                "purpose": "L_EGG",
                "date": "2027-06-25T18:15:00.000Z",
                "count": 15257
            },
            {
                "purpose": "L_EGG",
                "date": "2027-07-02T18:15:00.000Z",
                "count": 16371
            },
            {
                "purpose": "L_EGG",
                "date": "2027-07-09T18:15:00.000Z",
                "count": 17459
            },
            {
                "purpose": "L_EGG",
                "date": "2027-07-16T18:15:00.000Z",
                "count": 18553
            },
            {
                "purpose": "L_EGG",
                "date": "2027-07-23T18:15:00.000Z",
                "count": 19641
            },
            {
                "purpose": "L_EGG",
                "date": "2027-07-30T18:15:00.000Z",
                "count": 20714
            },
            {
                "purpose": "L_EGG",
                "date": "2027-08-06T18:15:00.000Z",
                "count": 21779
            },
            {
                "purpose": "L_EGG",
                "date": "2027-08-13T18:15:00.000Z",
                "count": 22831
            },
            {
                "purpose": "L_EGG",
                "date": "2027-08-20T18:15:00.000Z",
                "count": 23882
            },
            {
                "purpose": "L_EGG",
                "date": "2027-08-27T18:15:00.000Z",
                "count": 24916
            },
            {
                "purpose": "L_EGG",
                "date": "2027-09-03T18:15:00.000Z",
                "count": 25942
            },
            {
                "purpose": "L_EGG",
                "date": "2027-09-10T18:15:00.000Z",
                "count": 26948
            },
            {
                "purpose": "L_EGG",
                "date": "2027-09-17T18:15:00.000Z",
                "count": 27939
            },
            {
                "purpose": "L_EGG",
                "date": "2027-09-24T18:15:00.000Z",
                "count": 28907
            },
            {
                "purpose": "L_EGG",
                "date": "2027-10-01T18:15:00.000Z",
                "count": 29856
            },
            {
                "purpose": "L_EGG",
                "date": "2027-10-08T18:15:00.000Z",
                "count": 30802
            },
            {
                "purpose": "L_EGG",
                "date": "2027-10-15T18:15:00.000Z",
                "count": 31724
            },
            {
                "purpose": "L_EGG",
                "date": "2027-10-22T18:15:00.000Z",
                "count": 32643
            },
            {
                "purpose": "L_EGG",
                "date": "2027-10-29T18:15:00.000Z",
                "count": 33538
            },
            {
                "purpose": "L_EGG",
                "date": "2027-11-05T18:15:00.000Z",
                "count": 34423
            },
            {
                "purpose": "L_EGG",
                "date": "2027-11-12T18:15:00.000Z",
                "count": 35305
            },
            {
                "purpose": "L_EGG",
                "date": "2027-11-19T18:15:00.000Z",
                "count": 36164
            },
            {
                "purpose": "L_EGG",
                "date": "2027-11-26T18:15:00.000Z",
                "count": 37002
            },
            {
                "purpose": "L_EGG",
                "date": "2027-12-03T18:15:00.000Z",
                "count": 37826
            },
            {
                "purpose": "L_EGG",
                "date": "2027-12-10T18:15:00.000Z",
                "count": 38623
            },
            {
                "purpose": "L_EGG",
                "date": "2027-12-17T18:15:00.000Z",
                "count": 39426
            },
            {
                "purpose": "L_EGG",
                "date": "2027-12-24T18:15:00.000Z",
                "count": 40207
            },
            {
                "purpose": "L_EGG",
                "date": "2027-12-31T18:15:00.000Z",
                "count": 40957
            },
            {
                "purpose": "L_EGG",
                "date": "2028-01-07T18:15:00.000Z",
                "count": 41708
            },
            {
                "purpose": "L_EGG",
                "date": "2028-01-14T18:15:00.000Z",
                "count": 42434
            },
            {
                "purpose": "L_EGG",
                "date": "2028-01-21T18:15:00.000Z",
                "count": 43148
            },
            {
                "purpose": "L_EGG",
                "date": "2028-01-28T18:15:00.000Z",
                "count": 43819
            },
            {
                "purpose": "L_EGG",
                "date": "2028-02-04T18:15:00.000Z",
                "count": 44405
            },
            {
                "purpose": "L_EGG",
                "date": "2028-02-11T18:15:00.000Z",
                "count": 44918
            },
            {
                "purpose": "L_EGG",
                "date": "2028-02-18T18:15:00.000Z",
                "count": 45353
            },
            {
                "purpose": "L_EGG",
                "date": "2028-02-25T18:15:00.000Z",
                "count": 45743
            },
            {
                "purpose": "L_EGG",
                "date": "2028-03-03T18:15:00.000Z",
                "count": 46082
            },
            {
                "purpose": "L_EGG",
                "date": "2028-03-10T18:15:00.000Z",
                "count": 46378
            },
            {
                "purpose": "L_EGG",
                "date": "2028-03-17T18:15:00.000Z",
                "count": 46627
            },
            {
                "purpose": "L_EGG",
                "date": "2028-03-24T18:15:00.000Z",
                "count": 46832
            },
            {
                "purpose": "L_EGG",
                "date": "2028-03-31T18:15:00.000Z",
                "count": 46994
            },
            {
                "purpose": "L_EGG",
                "date": "2028-04-07T18:15:00.000Z",
                "count": 47134
            },
            {
                "purpose": "L_EGG",
                "date": "2028-04-14T18:15:00.000Z",
                "count": 47212
            },
            {
                "purpose": "L_EGG",
                "date": "2028-04-21T18:15:00.000Z",
                "count": 47255
            },
            {
                "purpose": "L_EGG",
                "date": "2028-04-28T18:15:00.000Z",
                "count": 47267
            },
            {
                "purpose": "L_EGG",
                "date": "2028-05-05T18:15:00.000Z",
                "count": 47231
            },
            {
                "purpose": "L_EGG",
                "date": "2028-05-12T18:15:00.000Z",
                "count": 47166
            },
            {
                "purpose": "L_EGG",
                "date": "2028-05-19T18:15:00.000Z",
                "count": 47057
            },
            {
                "purpose": "L_EGG",
                "date": "2028-05-26T18:15:00.000Z",
                "count": 46931
            },
            {
                "purpose": "L_EGG",
                "date": "2028-06-02T18:15:00.000Z",
                "count": 46758
            },
            {
                "purpose": "L_EGG",
                "date": "2028-06-09T18:15:00.000Z",
                "count": 46567
            },
            {
                "purpose": "L_EGG",
                "date": "2028-06-16T18:15:00.000Z",
                "count": 46393
            },
            {
                "purpose": "L_EGG",
                "date": "2028-06-23T18:15:00.000Z",
                "count": 46197
            },
            {
                "purpose": "L_EGG",
                "date": "2028-06-30T18:15:00.000Z",
                "count": 45990
            },
            {
                "purpose": "L_EGG",
                "date": "2028-07-07T18:15:00.000Z",
                "count": 45780
            },
            {
                "purpose": "L_EGG",
                "date": "2028-07-14T18:15:00.000Z",
                "count": 45564
            },
            {
                "purpose": "L_EGG",
                "date": "2028-07-21T18:15:00.000Z",
                "count": 45349
            },
            {
                "purpose": "L_EGG",
                "date": "2028-07-28T18:15:00.000Z",
                "count": 45139
            },
            {
                "purpose": "L_EGG",
                "date": "2028-08-04T18:15:00.000Z",
                "count": 44932
            },
            {
                "purpose": "L_EGG",
                "date": "2028-08-11T18:15:00.000Z",
                "count": 44706
            },
            {
                "purpose": "L_EGG",
                "date": "2028-08-18T18:15:00.000Z",
                "count": 44482
            },
            {
                "purpose": "L_EGG",
                "date": "2028-08-25T18:15:00.000Z",
                "count": 44269
            },
            {
                "purpose": "L_EGG",
                "date": "2028-09-01T18:15:00.000Z",
                "count": 43566
            },
            {
                "purpose": "L_EGG",
                "date": "2028-09-08T18:15:00.000Z",
                "count": 42710
            },
            {
                "purpose": "L_EGG",
                "date": "2028-09-15T18:15:00.000Z",
                "count": 41770
            },
            {
                "purpose": "L_EGG",
                "date": "2028-09-22T18:15:00.000Z",
                "count": 40782
            },
            {
                "purpose": "L_EGG",
                "date": "2028-09-29T18:15:00.000Z",
                "count": 39770
            },
            {
                "purpose": "L_EGG",
                "date": "2028-10-06T18:15:00.000Z",
                "count": 38750
            },
            {
                "purpose": "L_EGG",
                "date": "2028-10-13T18:15:00.000Z",
                "count": 37715
            },
            {
                "purpose": "L_EGG",
                "date": "2028-10-20T18:15:00.000Z",
                "count": 36680
            },
            {
                "purpose": "L_EGG",
                "date": "2028-10-27T18:15:00.000Z",
                "count": 35639
            },
            {
                "purpose": "L_EGG",
                "date": "2028-11-03T18:15:00.000Z",
                "count": 34605
            },
            {
                "purpose": "L_EGG",
                "date": "2028-11-10T18:15:00.000Z",
                "count": 33578
            },
            {
                "purpose": "L_EGG",
                "date": "2028-11-17T18:15:00.000Z",
                "count": 32562
            },
            {
                "purpose": "L_EGG",
                "date": "2028-11-24T18:15:00.000Z",
                "count": 31547
            },
            {
                "purpose": "L_EGG",
                "date": "2028-12-01T18:15:00.000Z",
                "count": 30537
            },
            {
                "purpose": "L_EGG",
                "date": "2028-12-08T18:15:00.000Z",
                "count": 29551
            },
            {
                "purpose": "L_EGG",
                "date": "2028-12-15T18:15:00.000Z",
                "count": 28567
            },
            {
                "purpose": "L_EGG",
                "date": "2028-12-22T18:15:00.000Z",
                "count": 27577
            },
            {
                "purpose": "L_EGG",
                "date": "2028-12-29T18:15:00.000Z",
                "count": 26495
            },
            {
                "purpose": "L_EGG",
                "date": "2029-01-05T18:15:00.000Z",
                "count": 25528
            },
            {
                "purpose": "L_EGG",
                "date": "2029-01-12T18:15:00.000Z",
                "count": 24568
            },
            {
                "purpose": "L_EGG",
                "date": "2029-01-19T18:15:00.000Z",
                "count": 23625
            },
            {
                "purpose": "L_EGG",
                "date": "2029-01-26T18:15:00.000Z",
                "count": 22696
            },
            {
                "purpose": "L_EGG",
                "date": "2029-02-02T18:15:00.000Z",
                "count": 21770
            },
            {
                "purpose": "L_EGG",
                "date": "2029-02-09T18:15:00.000Z",
                "count": 20858
            },
            {
                "purpose": "L_EGG",
                "date": "2029-02-16T18:15:00.000Z",
                "count": 19961
            },
            {
                "purpose": "L_EGG",
                "date": "2029-02-23T18:15:00.000Z",
                "count": 19075
            },
            {
                "purpose": "L_EGG",
                "date": "2029-03-02T18:15:00.000Z",
                "count": 18199
            },
            {
                "purpose": "L_EGG",
                "date": "2029-03-09T18:15:00.000Z",
                "count": 17332
            },
            {
                "purpose": "L_EGG",
                "date": "2029-03-16T18:15:00.000Z",
                "count": 16488
            },
            {
                "purpose": "L_EGG",
                "date": "2029-03-23T18:15:00.000Z",
                "count": 15652
            },
            {
                "purpose": "L_EGG",
                "date": "2029-03-30T18:15:00.000Z",
                "count": 14829
            },
            {
                "purpose": "L_EGG",
                "date": "2029-04-06T18:15:00.000Z",
                "count": 14019
            },
            {
                "purpose": "L_EGG",
                "date": "2029-04-13T18:15:00.000Z",
                "count": 13218
            },
            {
                "purpose": "L_EGG",
                "date": "2029-04-20T18:15:00.000Z",
                "count": 12434
            },
            {
                "purpose": "L_EGG",
                "date": "2029-04-27T18:15:00.000Z",
                "count": 11672
            },
            {
                "purpose": "L_EGG",
                "date": "2029-05-04T18:15:00.000Z",
                "count": 10918
            },
            {
                "purpose": "L_EGG",
                "date": "2029-05-11T18:15:00.000Z",
                "count": 10174
            },
            {
                "purpose": "L_EGG",
                "date": "2029-05-18T18:15:00.000Z",
                "count": 9448
            },
            {
                "purpose": "L_EGG",
                "date": "2029-05-25T18:15:00.000Z",
                "count": 8736
            },
            {
                "purpose": "L_EGG",
                "date": "2029-06-01T18:15:00.000Z",
                "count": 8040
            },
            {
                "purpose": "L_EGG",
                "date": "2029-06-08T18:15:00.000Z",
                "count": 7353
            },
            {
                "purpose": "L_EGG",
                "date": "2029-06-15T18:15:00.000Z",
                "count": 6686
            },
            {
                "purpose": "L_EGG",
                "date": "2029-06-22T18:15:00.000Z",
                "count": 6022
            },
            {
                "purpose": "L_EGG",
                "date": "2029-06-29T18:15:00.000Z",
                "count": 5378
            },
            {
                "purpose": "L_EGG",
                "date": "2029-07-06T18:15:00.000Z",
                "count": 4751
            },
            {
                "purpose": "L_EGG",
                "date": "2029-07-13T18:15:00.000Z",
                "count": 4139
            },
            {
                "purpose": "L_EGG",
                "date": "2029-07-20T18:15:00.000Z",
                "count": 3537
            },
            {
                "purpose": "L_EGG",
                "date": "2029-07-27T18:15:00.000Z",
                "count": 2943
            },
            {
                "purpose": "L_EGG",
                "date": "2029-08-03T18:15:00.000Z",
                "count": 2363
            },
            {
                "purpose": "L_EGG",
                "date": "2029-08-10T18:15:00.000Z",
                "count": 1792
            },
            {
                "purpose": "L_EGG",
                "date": "2029-08-17T18:15:00.000Z",
                "count": 1228
            },
            {
                "purpose": "L_EGG",
                "date": "2029-08-24T18:15:00.000Z",
                "count": 816
            },
            {
                "purpose": "L_EGG",
                "date": "2029-08-31T18:15:00.000Z",
                "count": 404
            }
        ]
    }
}

*/
