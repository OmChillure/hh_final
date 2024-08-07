"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/Apiheader";
import TradeChart from "@/components/TradeChart";

const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const CryptoWidget = ({ coin }: { coin: string }) => {
  useEffect(() => {
    loadScript('https://www.livecoinwatch.com/static/lcw-widget.js')
      .then(() => console.log('LiveCoinWatch script loaded'))
      .catch((error) => console.error('Failed to load LiveCoinWatch script:', error));

    return () => {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('livecoinwatch')) {
          scripts[i].remove();
          break;
        }
      }
    };
  }, [coin]);

  return (
    <div 
      className="livecoinwatch-widget-1" 
      lcw-coin={coin} 
      lcw-base="USD" 
      lcw-secondary="BTC" 
      lcw-period="d" 
      lcw-color-tx="#ffffff" 
      lcw-color-pr="#00d084" 
      lcw-color-bg="#000000" 
      lcw-border-w="1"
    ></div>
  );
};

const GeneralMarketWidget = () => {
  useEffect(() => {
    loadScript('https://www.livecoinwatch.com/static/lcw-widget.js')
      .then(() => console.log('LiveCoinWatch script loaded'))
      .catch((error) => console.error('Failed to load LiveCoinWatch script:', error));
  }, []);

  return (
    <div 
      className="livecoinwatch-widget-3" 
      lcw-base="USD" 
      lcw-d-head="true" 
      lcw-d-name="true" 
      lcw-d-code="true" 
      lcw-d-icon="true" 
      lcw-color-tx="#ffffff" 
      lcw-color-bg="#000000" 
      lcw-border-w="1"
    ></div>
  );
};

const MarqueeWidget = () => {
  useEffect(() => {
    loadScript('https://www.livecoinwatch.com/static/lcw-widget.js')
      .then(() => console.log('LiveCoinWatch script loaded'))
      .catch((error) => console.error('Failed to load LiveCoinWatch script:', error));
  }, []);

  return (
    <div 
      className="livecoinwatch-widget-5" 
      lcw-base="USD" 
      lcw-color-tx="#999999" 
      lcw-marquee-1="coins" 
      lcw-marquee-2="movers" 
      lcw-marquee-items="10"
    ></div>
  );
};

const ApiPage = () => {
  const [currentCoin, setCurrentCoin] = useState("TRX");
  const coins = ["TRX", "SOL", "NEAR", "ETH", "AVAX", "DOT"];

  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCurrentCoin(e.target.value);
  };

  return (
    <div className="bg-black min-h-screen">
      <Header />
      <div className="relative">
        <div className="w-full bg-black">
          <MarqueeWidget />
        </div>
        <div className="flex flex-wrap p-5">
          <div className="h-[55vh] w-[63%] lg:mb-0 ml-4">
            <TradeChart />
          </div>
            <div className="mt-[-4%] z-10 ml-[9%]">
              <GeneralMarketWidget />
            </div>
          </div>
        </div>
      </div>
  );
};

export default ApiPage;