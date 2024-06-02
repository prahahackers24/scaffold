import React, { useEffect, useState } from 'react';
import CoinSelector from './CoinSelector';
import { useAccount } from 'wagmi';
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { formatUnits, parseEther } from 'viem';



const CoinsDonationComponent = ({pageId} : any) => {
  const [coinData, setCoinData] = useState<{ coinName: string, bigIntValue: bigint }[]>([]);
  const [amountarray, setAmountArrays] = useState();
  const {address} = useAccount();
  const { writeContractAsync: writemycontractasync } = useScaffoldWriteContract("DonationContract");
  const {writeContractAsync: writeGRT} = useScaffoldWriteContract("GRT");
  const {writeContractAsync: writeUSDC} = useScaffoldWriteContract("USDC");
  const {writeContractAsync: writeUNI} = useScaffoldWriteContract("UNI");
  const {writeContractAsync: writeEIGEN} = useScaffoldWriteContract("EIGEN");

  useEffect(() => {
    console.log('-----------PAGE ID -----------')
    console.log(pageId)
  }, [pageId])

   // { name: "USDC", ticker: "USDC" },
  // { name: "Optimism", ticker: "OP" },
  // { name: "Mantle", ticker: "MNT" },
  // { name: "Polygon", ticker: "MATIC" },
  // { name: "TheGraph", ticker: "GRT" },


  const contract_address_sepolia = "0x4095001D8d00C2c7f38b659173f9a2F2F1781A16"

  const {data: USDCAmount} = useScaffoldReadContract({
    contractName: "USDC",
    functionName: "balanceOf",
    args: [address]
  })

  const {data: approval} = useScaffoldReadContract({
    contractName: "USDC",
    functionName: "allowance",
    args: [address, contract_address_sepolia]
  })

  const {data: GRTAmount} = useScaffoldReadContract({
    contractName: "GRT",
    functionName: "balanceOf",
    args: [address]
  })

  const {data: EIGENAmount} = useScaffoldReadContract({
    contractName: "EIGEN",
    functionName: "balanceOf",
    args: [address]
  })

  const {data: UNIAmount} = useScaffoldReadContract({
    contractName: "UNI",
    functionName: "balanceOf",
    args: [address]
  });

  async function ApproveGRT() {
    try {
      await writeGRT({
        functionName: "approve",
        args: ["0x4095001D8d00C2c7f38b659173f9a2F2F1781A16", GRTAmount]
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
}

async function ApproveUSDC() {
  try {
    await writeUSDC({
      functionName: "approve",
      args: ["0x4095001D8d00C2c7f38b659173f9a2F2F1781A16", USDCAmount]
    });
  } catch (e) {
    console.error("Error setting greeting:", e);
  }
}

async function ApproveEIGEN() {
  try {
    await writeEIGEN({
      functionName: "approve",
      args: ["0x4095001D8d00C2c7f38b659173f9a2F2F1781A16", EIGENAmount]
    });
  } catch (e) {
    console.error("Error setting greeting:", e);
  }
}

async function ApproveUNI() {
  try {
    await writeUNI({
      functionName: "approve",
      args: ["0x4095001D8d00C2c7f38b659173f9a2F2F1781A16", UNIAmount]
    });
  } catch (e) {
    console.error("Error setting greeting:", e);
  }
}






  const tokenAddress={
    GRT: "0x83CB329AeaAfA1e87FF0E0dc576Bb13f3914fA97",
    OP: "0xaEeC496145a30e20B8FBe1c30151d46Cf2cC1e50",
    MNT: "0x4104D9a6258d55A8a958e71b4B7Cb5b6F9c0236C",
    MATIC: "0x3a2F4Ae59B2aaa7d2c9e85e9D3a6e0dB5EF6Fb45",
  }



  const handleValueChange = (coinName: string, value: number) => {
    setCoinData((prevData) => {
      const updatedData = prevData.filter(coin => coin.coinName !== coinName);
      const amountArrayData = [];
      const bigIntValue = parseEther(value.toString());
      updatedData.push({ coinName, bigIntValue });
      amountArrayData.push(bigIntValue);
      setAmountArrays(amountArrayData as any);
      console.log(amountArrayData)
      console.log(updatedData)
      return updatedData;
    });
  };


  useScaffoldWriteContract

  const handleDonate = () => {
    const coinNames = coinData.map(coin => coin.coinName);
    const coinAmounts = coinData.map(coin => coin.bigIntValue);
    console.log("Donating the following coins:", coinNames, coinAmounts);


    // You can now send this data to your backend or perform the donation action
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="card bg-base-100 shadow-xl m-2 p-0 flex-grow">
        
        {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={150} coinName='USDC' img={'/usdclogo.png'} onValueChange={handleValueChange} />
                {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={150} coinName='GRT' img={'/thegraphlogo.png'} onValueChange={handleValueChange} />
                {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={150} coinName='UNI' img={'/uniswaplogo.png'} onValueChange={handleValueChange} />
                {/* @ts-ignore */}
        <CoinSelector initialValue={0} maxValue={150} coinName='EIGEN' img={'/eigenlogo.jpg'} onValueChange={handleValueChange} />
      </div>
      <button 
        className="btn btn-primary m-4"
        onClick={async () => {
          try {
            await writemycontractasync({
              functionName: "donate",
              args:[[
                "0xbe2a7F5acecDc293Bf34445A0021f229DD2Edd49",
                "0x382658f1DCEB66ab4Df85E376b25e3699D6f1D83",
                "0xf83b36a40Cb1F0e88A8Ae74cbB2FdcB2670c5e48",
                "0x80679b7E30bb48aD81f1D5dD3dB2d037054DCf67",
              ], [
                coinData[0].bigIntValue,
               coinData[1].bigIntValue, 
               coinData[2].bigIntValue, 
               coinData[3].bigIntValue
              ],
                pageId]
            });
          } catch (e) {
            console.log(amountarray)
            console.error("Error setting greeting:", e);
          }
        }}
        disabled={coinData.length === 0}
      >
        Donate
      </button>
      <div className='grid grid-cols-4'>
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveUSDC()}
        >
        Approve USDC
  
        </button>
        
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveGRT()}
        >
        Approve GRT
        </button>
        
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveUNI()}
        >
        Approve UNI
        </button>
        
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveEIGEN()}
        >
        Approve EIGEN
        </button>
      </div>
      
    </div>
  );
}

export default CoinsDonationComponent;