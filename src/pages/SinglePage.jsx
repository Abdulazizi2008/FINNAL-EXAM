import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context";
import { ACTION_TYPES } from "../store/reducer";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "flowbite-react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function SinglePage() {
  const { id } = useParams();
  const { state, dispatch } = useContext(Context);
  const { singleCoin } = state;
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch({ type: ACTION_TYPES.single_coin, payload: data });
      } catch (error) {
        console.error("Failed to fetch coin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id, dispatch]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=1`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHistoricalData(data.prices);
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      }
    };
    if (id) {
      fetchHistoricalData();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!singleCoin) return <p>Coin not found.</p>;

  const chartData = {
    labels: historicalData.map((point) =>
      new Date(point[0]).toLocaleTimeString()
    ),
    datasets: [
      {
        label: `Price (Past 1 Day) in USD`,
        data: historicalData.map((point) => point[1]),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 30,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="container">
      <div className="flex pt-6 gap-6">
        <div key={singleCoin.id} className="max-w-[547px]">
          <div className="flex flex-col justify-center items-center gap-[4px]">
            <img src={singleCoin.image.large} className="w-52 h-52" />
            <h1 className="text-white text-[48px] font-[700]">
              {singleCoin.name}
            </h1>
          </div>
          <div className="p-[20px]">
            <p className="text-white">
              {singleCoin.description.en.slice(0, 220)}
            </p>
            <div className="text-white text-[24px] font-[700] pb-[20px] pt-[20px]">
              Rank:{" "}
              <span className="text-white text-[24px] font-[400]">
                {singleCoin.market_cap_rank}
              </span>
            </div>
            <div className="text-white text-[24px] font-[700] pb-[20px] ">
              Current price:{" "}
              <span className="text-white text-[24px] font-[400]">
                ${singleCoin.market_data.current_price.usd}
              </span>
            </div>
            <div className="text-white text-[24px] font-[700]">
              Market Cap:{" "}
              <span className="text-white text-[24px] font-[400]">
                ${singleCoin.market_data.market_cap.usd}
              </span>
            </div>
          </div>
        </div>
        <div className="w-[2px] h-[790px] bg-[#808080]"></div>
        <div className="relative w-[1000px] h-[650px]  mt-8">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="flex items-center gap-[38px] pl-[550px] mt-[-100px]">
        <button className="w-[200px] border-[1px] border-[#87CEEB] duration-500 text-white py-[6px] pl-[21px] flex justify-start hover:bg-[#87CEEB] hover:text-black">
          24 Hours
        </button>
        <button className="w-[200px] border-[1px] border-[#87CEEB] duration-500 text-white py-[6px] pl-[21px] flex justify-start hover:bg-[#87CEEB] hover:text-black">
          30 Days
        </button>
        <button className="w-[200px] border-[1px] border-[#87CEEB] duration-500 text-white py-[6px] pl-[21px] flex justify-start hover:bg-[#87CEEB] hover:text-black">
          3 Months
        </button>
        <button className="w-[200px] border-[1px] border-[#87CEEB] duration-500 text-white py-[6px] pl-[21px] flex justify-start hover:bg-[#87CEEB] hover:text-black">
          1 Year
        </button>
      </div>
    </div>
  );
}

export default SinglePage;
