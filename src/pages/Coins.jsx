import React, { useContext, useEffect, useState } from "react";
import Hero from "../components/Hero";
import { Context } from "../context";
import { ACTION_TYPES } from "../store/reducer";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Drawer,
  Pagination,
} from "flowbite-react";
import { useNavigate } from "react-router";

const customTheme = {
  root: {
    base: "  w-full text-left text-sm text-gray-500 dark:text-gray-400  ",
    shadow:
      "absolute left-0 top-0 -z-10 h-full w-full rounded-lg   drop-shadow-md dark:bg-black",
    wrapper: "relative",
  },
  body: {
    base: "bg-[#16171A]  group/body",
    cell: {
      base: "px-[10px] py-1   group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg",
    },
  },
  head: {
    base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400 ",
    cell: {
      base: "bg-[#87CEEB]  px-3 py-4 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700",
    },
  },
  row: {
    base: "group/row  border-[#424243]",
    hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
    striped:
      "odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700",
  },
};
const style = {
  root: {
    base: "fixed z-40 overflow-y-auto bg-white p-4 transition-transform dark:bg-gray-800",
    backdrop: "fixed inset-0 z-30 bg-gray-900/50 dark:bg-gray-900/80",
    edge: "bottom-16",
    position: {
      top: {
        on: "left-0 right-0 top-0 w-full transform-none",
        off: "left-0 right-0 top-0 w-full -translate-y-full",
      },
      right: {
        on: "right-0 top-0 h-screen w-[400px] transform-none",
        off: "right-0 top-0 h-screen w-80 translate-x-full",
      },
      bottom: {
        on: "bottom-0 left-0 right-0 w-full transform-none",
        off: "bottom-0 left-0 right-0 w-full translate-y-full",
      },
      left: {
        on: "left-0 top-0 h-screen w-[400px] transform-none",
        off: "left-0 top-0 h-screen w-80 -translate-x-full",
      },
    },
  },
  header: {
    inner: {
      closeButton:
        "absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
      closeIcon: "h-4 w-4",
      titleIcon: "me-2.5 h-4 w-4",
      titleText:
        "mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400",
    },
    collapsed: {
      on: "hidden",
      off: "block",
    },
  },
  items: {
    base: "",
  },
};
const custom = {
  base: "",
  layout: {
    table: {
      base: "text-sm text-[#87CEEB] dark:text-gray-400",
      span: "font-semibold text-[#87CEEB]  dark:text-white",
    },
  },
  pages: {
    base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px ",
    showIcon: "inline-flex",
    previous: {
      base: "ml-0 rounded-l-lg   bg-[#14161A] px-3 py-2 leading-tight text-[#87CEEB]  enabled:hover:bg-blue-500 enabled:hover:text-white  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      icon: "h-5 w-5",
    },
    next: {
      base: "rounded-r-lg  bg-[#14161A] px-3 py-2 leading-tight text-[#87CEEB]  enabled:hover:bg-blue-500 enabled:hover:text-white  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      icon: "h-5 w-5",
    },
    selector: {
      base: "w-12   bg-[#14161A] py-2 leading-tight text-[#87CEEB]  enabled:hover:bg-blue-500 enabled:hover:text-white  dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 enabled:dark:hover:bg-gray-700 enabled:dark:hover:text-white",
      active:
        "bg-[#14161A] text-[#87CEEB]  hover:bg-cyan-100 hover:text-cyan-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
      disabled: "cursor-not-allowed opacity-50",
    },
  },
};

function Coins({ currency, isOpen, setIsOpen }) {
  const { state, dispatch } = useContext(Context);
  const { coins, selectedCoin } = state;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coinsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    async function fetchCoins() {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=${currentPage}&sparkline=false&price_change_percentage=24h`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        dispatch({ type: ACTION_TYPES.fetch_coins, payload: data });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCoins();
  }, [currency, dispatch, currentPage]);

  const getCurrencySymbol = () => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "JPY":
        return "¥";
      default:
        return "$";
    }
  };

  const handleSelectCoin = (coin) => {
    const isSelected = selectedCoin.find((c) => c.id === coin.id);

    if (isSelected) {
      dispatch({ type: ACTION_TYPES.set_unselected_coin, payload: coin });
    } else {
      dispatch({ type: ACTION_TYPES.set_selected_coin, payload: coin });
    }

    const updatedSelectedCoins = isSelected
      ? selectedCoin.filter((c) => c.id !== coin.id)
      : [...selectedCoin, coin];

    localStorage.setItem("selectedCoins", JSON.stringify(updatedSelectedCoins));
  };

  const handleNavigate = (coinId) => {
    navigate(`/coins/${coinId}`);
  };

  const onPageChange = (page) => setCurrentPage(page);

  return (
    <div>
      <Drawer
        theme={style}
        position="right"
        className="bg-[#515151]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Drawer.Items>
          <div>
            <h2 className="text-center font-bold mb-4">WATCHLIST</h2>
            <div className="flex flex-wrap gap-5">
              {selectedCoin.length === 0 ? (
                <p>No countries selected</p>
              ) : (
                selectedCoin.map((coin) => (
                  <div
                    key={coin.id}
                    className="w-[150px] h-[200px] bg-[#14161A] rounded-[25px] flex flex-col items-center justify-center gap-[10px]"
                  >
                    <img src={coin.image} className="w-[80px] h-[80px]" />
                    <p className="font-[400] text-[20px] text-white ">
                      {getCurrencySymbol()}
                      {coin.current_price}
                    </p>
                    <button
                      className="w-[100px] h-[30px]  bg-[#FF0000] text-white text-[16px] font-semibold hover:bg-red-500"
                      onClick={() => handleSelectCoin(coin)}
                    >
                      REMOVE
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Drawer.Items>
      </Drawer>
      <Hero selectedCoin={selectedCoin} currency={currency} />
      <div className="text-white text-[34px] font-[400] text-center pt-[18px]">
        Cryptocurrency Prices by Market Cap
      </div>
      {loading && <p>Loading...</p>}
      <div className="max-w-[1140px] mx-auto ">
        <Table theme={customTheme} className="mt-[40px]">
          <TableHead>
            <Table.HeadCell>Coin</Table.HeadCell>
            <Table.HeadCell>Price</Table.HeadCell>
            <Table.HeadCell>24h Change</Table.HeadCell>
            <Table.HeadCell>Market Cap</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Select</span>
            </Table.HeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {coins.map((coin) => {
              const isSelected = selectedCoin.find((c) => c.id === coin.id);
              return (
                <TableRow key={coin.id}>
                  <div className="flex items-center">
                    <TableCell>
                      <img src={coin.image} className="w-[40px] h-[40px]" />
                    </TableCell>
                    <div className="flex items-left flex-col justify-center">
                      <TableCell className="text-white text-[22px] font-[400]">
                        {coin.symbol}
                      </TableCell>
                      <TableCell className="text-[#A9A9A9] text-[14px] font-[400]">
                        {coin.name}
                      </TableCell>
                    </div>
                  </div>
                  <TableCell>
                    {getCurrencySymbol()}
                    {coin.current_price}
                  </TableCell>
                  <TableCell>
                    +{coin.market_cap_change_percentage_24h.toFixed(2)}%
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleNavigate(coin.id)}
                  >
                    {getCurrencySymbol()}
                    {coin.market_cap}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleSelectCoin(coin)}
                      className={`${
                        isSelected ? "bg-green-500" : "bg-transparent"
                      } p-[4px] rounded`}
                    >
                      <img src="/Eye.png" alt="Select Coin" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination
          className="pt-11"
          theme={custom}
          pageSize={coinsPerPage}
          currentPage={currentPage}
          totalPages={Math.ceil(1460 / coinsPerPage)}
          onPageChange={onPageChange}
          showIcons
        />
      </div>
    </div>
  );
}

export default Coins;
