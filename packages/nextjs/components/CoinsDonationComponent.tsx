import React, { useState } from 'react';
import CoinSelector from './CoinSelector';
import { useAccount } from 'wagmi';
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import { formatUnits } from 'viem';



const CoinsDonationComponent: React.FC = () => {
  const [coinData, setCoinData] = useState<{ coinName: string, value: number }[]>([]);
  const {address} = useAccount();
   // { name: "USDC", ticker: "USDC" },
  // { name: "Optimism", ticker: "OP" },
  // { name: "Mantle", ticker: "MNT" },
  // { name: "Polygon", ticker: "MATIC" },
  // { name: "TheGraph", ticker: "GRT" },

  const {data: GRTAmount} = useScaffoldReadContract({
    contractName: "GRT",
    functionName: "balanceOf",
    args: [address]
  })

  const {data: OPAmount} = useScaffoldReadContract({
    contractName: "OP",
    functionName: "balanceOf",
    args: [address]
  })

  const {data: MNTAmount} = useScaffoldReadContract({
    contractName: "MNT",
    functionName: "balanceOf",
    args: [address]
  })

  const {data: MATICAmount} = useScaffoldReadContract({
    contractName: "MATIC",
    functionName: "balanceOf",
    args: [address]
  })



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
        
        {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={ GRTAmount ? parseInt(GRTAmount) / 1e18 : 0} coinName='GRT' img={'/thegraphlogo.png'} onValueChange={handleValueChange} />
                {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={OPAmount ? parseInt(OPAmount) / 1e18 : 0} coinName='OP' img={'/oplogo.png'} onValueChange={handleValueChange} />
                {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={MNTAmount ? parseInt(MNTAmount) / 1e18 : 0} coinName='MNT' img={'/mantlelogo.png'} onValueChange={handleValueChange} />
                {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={MATICAmount ? parseInt(MATICAmount) / 1e18 : 0} coinName='MATIC' img={'/maticlogo.png'} onValueChange={handleValueChange} />
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