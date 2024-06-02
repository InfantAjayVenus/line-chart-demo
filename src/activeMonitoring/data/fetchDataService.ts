import dayjs from "dayjs"
import { getRandomIntInRange } from "../../utilities/getRandomIntInRange";

export async function fetchData(latestTimeStamp = dayjs(), batchSize = 200) {
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