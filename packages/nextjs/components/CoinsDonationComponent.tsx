import React, { useState } from 'react';
import CoinSelector from './CoinSelector';



const CoinsDonationComponent: React.FC = () => {
  const [coinData, setCoinData] = useState<{ coinName: string, value: number }[]>([]);

  const handleValueChange = (coinName: string, value: number) => {
    setCoinData((prevData) => {
      const updatedData = prevData.filter(coin => coin.coinName !== coinName);
      updatedData.push({ coinName, value });
      return updatedData;
    });
  };

  const handleDonate = () => {
    const coinNames = coinData.map(coin => coin.coinName);
    const coinAmounts = coinData.map(coin => coin.value);
    console.log("Donating the following coins:", coinNames, coinAmounts);
    // You can now send this data to your backend or perform the donation action
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="card bg-base-100 shadow-xl m-2 p-0 flex-grow">
        <CoinSelector initialValue={24} maxValue={694} coinName='MEME' onValueChange={handleValueChange} />
        <CoinSelector initialValue={59} maxValue={2500} coinName='PEPE' onValueChange={handleValueChange} />
        <CoinSelector initialValue={320} maxValue={4300} coinName='BOBB' onValueChange={handleValueChange} />
        <CoinSelector initialValue={320} maxValue={4300} coinName='BOBB' onValueChange={handleValueChange} />
        <CoinSelector initialValue={320} maxValue={4300} coinName='BOBB' onValueChange={handleValueChange} />
      </div>
      <button 
        className="btn btn-primary m-4"
        onClick={handleDonate}
        disabled={coinData.length === 0}
      >
        Donate
      </button>
    </div>
  );
}

export default CoinsDonationComponent;