import { Carousel } from "flowbite-react";

const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const style = {
  root: {
    base: "relative h-full w-full",
    leftControl:
      "absolute left-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
    rightControl:
      "absolute right-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none",
  },
  indicators: {
    active: {
      off: "bg-white/50 hidden hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800",
      on: "bg-white dark:bg-gray-800",
    },
    base: "hidden h-3 w-3 rounded-full",
    wrapper: "absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3",
  },
  item: {
    base: "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2",
    wrapper: {
      off: "w-full flex-shrink-0 transform cursor-default snap-center",
      on: "w-full flex-shrink-0 transform cursor-grab snap-center",
    },
  },
  control: {
    base: "hidden inline-flex   h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10",
  },
  scrollContainer: {
    base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg",
    snap: "snap-x",
  },
};

export default function Hero({ selectedCoin, currency }) {
  const coinChunks = chunkArray(selectedCoin, 4);

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

  return (
    <div className="bgi">
      <div className="text-[#87CEEB] text-[60px] font-[700] text-center pt-[69px]">
        CRYPTOFOLIO WATCH LIST
      </div>
      <p className="text-[#A9A9A9] text-[14px] font-[500] text-center pt-[16px]">
        Get all the Info regarding your favorite Crypto Currency
      </p>
      <Carousel className="mt-[-80px]" theme={style}>
        {coinChunks.map((chunk, index) => (
          <div
            className="flex justify-center items-center gap-[228px]"
            key={index}
          >
            {chunk.map((coin) => (
              <div className="flex flex-col items-center" key={coin.id}>
                <img className="h-24 w-auto object-cover" src={coin.image} />
                <div className="flex items-center gap-2 pt-3">
                  <p className="text-[16px] font-[400]  text-white">
                    {coin.symbol}
                  </p>
                  <p className="text-[16px] font-[500]  text-[#0ECB81]">
                    +{coin.market_cap_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
                <div className="text-white">
                  {getCurrencySymbol()}
                  {coin.current_price}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
}
