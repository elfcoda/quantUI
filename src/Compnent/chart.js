// refer to https://klinecharts.com/guide/getting-started.html

import { useEffect, useState } from 'react'
import React from 'react'
import { init, dispose } from 'klinecharts'


function Chart() {
    const [apiData, setApiData] = useState(null);

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
            // const response = await fetch('http://127.0.0.1:8000/test/');
            const response = await fetch('http://127.0.0.1:8000/analyse/');

            if (!response.ok) {
              throw new Error('Network request failed');
            }
    
            const data = await response.json();
    
            // 将获取的数据设置到状态中
            setApiData([...data["short"], ...data["long"]]);
          } catch (error) {
            console.error('Error fetching data:', error.message);
          }
        };
    
        // 调用 fetchData 函数
        fetchData();
      }, []);


    useEffect(() => {
        if (apiData && apiData.length !== 0) {

            apiData.forEach((kLine, index) => {
                // 初始化图表
                const chart = init('chart' + index)

                const candleSticks = kLine[0].map((stick, index) => 
                ((index === kLine[1] || index === kLine[2]) ? {
                    timestamp: parseFloat(stick[HISTORY_CANDLES_TS]),
                    open: parseFloat(stick[HISTORY_CANDLES_OPEN]),
                    high: parseFloat(stick[HISTORY_CANDLES_HIGH]),
                    low: parseFloat(stick[HISTORY_CANDLES_LOW]) - 1000, // TODO
                    close: parseFloat(stick[HISTORY_CANDLES_CLOSE]),
                    volume: parseFloat(stick[HISTORY_CANDLES_VOL]),
                } :
                {
                    timestamp: parseFloat(stick[HISTORY_CANDLES_TS]),
                    open: parseFloat(stick[HISTORY_CANDLES_OPEN]),
                    high: parseFloat(stick[HISTORY_CANDLES_HIGH]),
                    low: parseFloat(stick[HISTORY_CANDLES_LOW]),
                    close: parseFloat(stick[HISTORY_CANDLES_CLOSE]),
                    volume: parseFloat(stick[HISTORY_CANDLES_VOL]),
                }))

                // 为图表添加数据
                chart.applyNewData(candleSticks)
                chart.createIndicator("MACD")
            });
            
            
            return () => {
                // 销毁图表
                apiData.forEach((kLine, index) => {
                    dispose('chart' + index)
                });
            }
        }
      }, [apiData])

    return (
        <>
            <div>{ "apiData: " } { apiData ? apiData.length : 0 }</div>
            <div style={{  }}>
                {
                    apiData && apiData.length !== 0 && (apiData.map((kLine, index) => (
                        <div key={index} id={`chart${index}`} style={{ width: 400, height: 400, display: "inline-block", margin: "10px" }}/>
                    )))
                }
            </div>
        </>
        
    );
}

export default Chart;


  