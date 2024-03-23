// refer to https://klinecharts.com/guide/getting-started.html

import { useEffect, useState } from 'react'
import React from 'react'
import { init, dispose } from 'klinecharts'


function Chart() {
    const [apiData, setApiData] = useState(null);
    const [hide, setHide] = useState(true);
    const [pid, setPid] = useState(-1)

    const HISTORY_CANDLES_TS = 0;
    const HISTORY_CANDLES_OPEN = 1;
    const HISTORY_CANDLES_HIGH = 2;
    const HISTORY_CANDLES_LOW = 3;
    const HISTORY_CANDLES_CLOSE = 4;
    const HISTORY_CANDLES_VOL = 5;

    useEffect(() => {
        // 在 useEffect 中进行网络请求
        const fetchData = async () => {
          try {
            const response = await fetch('http://127.0.0.1:8000/days/');
            // const response = await fetch('http://127.0.0.1:8000/fourhours/?pid=' + pid);

            // const response = await fetch('http://127.0.0.1:8000/test/');
            // const response = await fetch('http://127.0.0.1:8000/pattern/');
            // const response = await fetch('http://127.0.0.1:8000/analyse/');
            // const response = await fetch('http://127.0.0.1:8000/weekends/');
            // const response = await fetch('http://127.0.0.1:8000/analyseMACD/');

            if (!response.ok) {
              throw new Error('Network request failed');
            }
    
            const data = await response.json();
    
            // 将获取的数据设置到状态中
            // setApiData([...data["short"], ...data["long"]]);
            // setApiData(data["long"]);
            setApiData(data["rsp"]);
          } catch (error) {
            console.error('Error fetching data:', error.message);
          }
        };
    
        // 调用 fetchData 函数
        fetchData();
      }, [pid]);


    useEffect(() => {
        if (apiData && apiData.length !== 0) {

            apiData.forEach((kLine, index) => {
                // 初始化图表
                const chart = init('chart' + index)

                const candleSticks = kLine[0].map((stick, index) => 
                (((index === kLine[1] || index === kLine[2]) && !hide) ? {
                    timestamp: parseFloat(stick[HISTORY_CANDLES_TS]),
                    open: parseFloat(stick[HISTORY_CANDLES_OPEN]),
                    high: parseFloat(stick[HISTORY_CANDLES_HIGH]),
                    low: parseFloat(stick[HISTORY_CANDLES_LOW]) - 0,
                    close: parseFloat(stick[HISTORY_CANDLES_CLOSE]),
                    // volume: parseFloat(stick[HISTORY_CANDLES_VOL]),
                } :
                {
                    timestamp: parseFloat(stick[HISTORY_CANDLES_TS]),
                    open: parseFloat(stick[HISTORY_CANDLES_OPEN]),
                    high: parseFloat(stick[HISTORY_CANDLES_HIGH]),
                    low: parseFloat(stick[HISTORY_CANDLES_LOW]),
                    close: parseFloat(stick[HISTORY_CANDLES_CLOSE]),
                    // volume: parseFloat(stick[HISTORY_CANDLES_VOL]),
                }))

                // 为图表添加数据
                chart.applyNewData(candleSticks)
                chart.createIndicator("MACD")
                // chart.createIndicator("MA")
            });
            
            
            return () => {
                // 销毁图表
                apiData.forEach((kLine, index) => {
                    dispose('chart' + index)
                });
            }
        }
      }, [apiData, hide])

      function toggleHide() {
        setHide(!hide)
      }

      function showGraph(pid) {
        setPid(pid)
      }

    return (
        <>
            <div>{ "apiData: " } { apiData ? apiData.length : 0 }</div>
            <div onClick={toggleHide} style={{ position: "fixed", left: "10px", top: "350px" }}>toggleHide</div>

            <div onClick={() => showGraph(0)} style={{ position: "fixed", left: "10px", top: "380px" }}>show wenjie</div>
            <div onClick={() => showGraph(1)} style={{ position: "fixed", left: "10px", top: "410px" }}>show ziyan</div>
            <div onClick={() => showGraph(-1)} style={{ position: "fixed", left: "10px", top: "440px" }}>show all</div>
            <div>
                {
                    apiData && apiData.length !== 0 && (apiData.map((kLine, index) => (
                        <div key={index} id={`chart${index}`} style={{ width: 420, height: 420, display: "inline-block", margin: "10px" }}>
                          <span>{kLine[3]}</span>
                        </div>
                    )))
                }
            </div>
        </>
        
    );
}

export default Chart;


  