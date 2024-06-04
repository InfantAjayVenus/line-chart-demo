import dayjs from "dayjs";
import { getRandomIntInRange } from "../../utilities/getRandomIntInRange";
import { DataRecordType } from "./dataRecordType";

export async function fetchData(latestTimeStamp=new Date(), batchSize = 200): Promise<DataRecordType[]> {
    const timestamp = dayjs(latestTimeStamp);
    const dataList = new Array(batchSize)
        .fill(0)
        .map((_, index) => {
            return {
                timestamp: timestamp.subtract(index * 5, 'seconds').toDate(),
                value: getRandomIntInRange(100, 200)
            };
        })

   return dataList; 
}