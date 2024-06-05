import { useEffect, useRef, useState } from "react";
import { DataRecordType } from "./activeMonitoring/data/dataRecordType";
import { getData } from "./activeMonitoring/data/loadDataUtil";
import { Chart } from "./activeMonitoring/views/Chart";

function App() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [dataList, setDataList] = useState<DataRecordType[]>([]);
  const [dimenions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    getData(50).then((newData) => {
      setDataList([...dataList, ...newData]);
    });
  }, []);

  useEffect(() => {
    const containerRect = chartContainerRef.current?.getBoundingClientRect();
    setDimensions({ height: containerRect?.height || 0, width: containerRect?.width || 0 });
  }, [chartContainerRef])

  return (
    <div ref={chartContainerRef} id="chart-container" className="block mt-12 mx-auto h-96 w-4/5 border-slate-300 border-4 rounded-lg">
      {dataList.length > 0 && <Chart
        loadMoreData={() => {
          getData(50, dataList.length).then((newData) => {
            setDataList([...dataList, ...newData]);
          })
        }}
        data={dataList}
        dimensions={dimenions}
        margins={{ top: 30, bottom: 50, left: 30, right: 30 }}
      />}
    </div>
  )
}

export default App
