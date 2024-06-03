import dayjs from "dayjs";
import { getRandomIntInRange } from "../../utilities/getRandomIntInRange";
import { DataRecordType } from "./dataRecordType";

export async function fetchData(latestTimeStamp = dayjs(), batchSize = 200): Promise<DataRecordType[]> {
    const dataList = new Array(batchSize)
        .fill(0)
        .map((_, index) => {
            return {
                timestamp: latestTimeStamp.subtract(index * 5, 'seconds'),
                value: getRandomIntInRange(100, 200)
            };
        })

   return dataList; 
}