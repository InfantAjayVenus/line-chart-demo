import dayjs from "dayjs";
import { DataRecordType } from "./dataRecordType";
import { fetchData } from "./fetchDataService";

let cachedData: DataRecordType[] = [];
export async function getData(count: number, offset: number = cachedData.length): Promise<DataRecordType[]> {

    const expectedCacheLength = offset + count;
    if(cachedData.length < expectedCacheLength) {

        const latestTimeStamp = cachedData[cachedData.length]?.timestamp || dayjs();
        const toppedBatchSize = offset > cachedData.length ? offset - cachedData.length + count : count;

        const fetchedData = await fetchData(latestTimeStamp, Math.ceil(toppedBatchSize * 1.25));
        
        cachedData.push(...fetchedData);
    }

    return cachedData.slice(offset + 1, count);
}