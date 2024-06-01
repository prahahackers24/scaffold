import React, { useState } from 'react';
import CoinSelector from './CoinSelector';
import { useAccount } from 'wagmi';
import { useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { formatUnits, parseEther } from 'viem';



const CoinsDonationComponent: React.FC = () => {
  const [coinData, setCoinData] = useState<{ coinName: string, bigIntValue: bigint }[]>([]);
  const [amountarray, setAmountArrays] = useState();
  const {address} = useAccount();
  const { writeContractAsync: writemycontractasync } = useScaffoldWriteContract("DonationContract");
  const {writeContractAsync: writeGRT} = useScaffoldWriteContract("GRT");
  const {writeContractAsync: writeOP} = useScaffoldWriteContract("OP");
  const {writeContractAsync: writeMNT} = useScaffoldWriteContract("MNT");
  const {writeContractAsync: writeMATIC} = useScaffoldWriteContract("MATIC");



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
  });

  async function ApproveGRT() {
    try {
      await writeGRT({
        functionName: "approve",
        args: ["0xb1b8f7b92144F7af1902D6c55d5069Ca4b3d86b1", GRTAmount]
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
    }
}

async function ApproveOP() {
  try {
    await writeOP({
      functionName: "approve",
      args: ["0xb1b8f7b92144F7af1902D6c55d5069Ca4b3d86b1", OPAmount]
    });
  } catch (e) {
    console.error("Error setting greeting:", e);
  }
}

async function ApproveMNT() {
  try {
    await writeMNT({
      functionName: "approve",
      args: ["0xb1b8f7b92144F7af1902D6c55d5069Ca4b3d86b1", MNTAmount]
    });
  } catch (e) {
    console.error("Error setting greeting:", e);
  }
}

async function ApproveMATIC() {
  try {
    await writeMATIC({
      functionName: "approve",
      args: ["0xb1b8f7b92144F7af1902D6c55d5069Ca4b3d86b1", MATICAmount]
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
        onClick={async () => {
          try {
            await writemycontractasync({
              functionName: "donate",
              args:[[
                "0x83CB329AeaAfA1e87FF0E0dc576Bb13f3914fA97",
                "0xaEeC496145a30e20B8FBe1c30151d46Cf2cC1e50",
                "0x4104D9a6258d55A8a958e71b4B7Cb5b6F9c0236C",
                "0x3a2F4Ae59B2aaa7d2c9e85e9D3a6e0dB5EF6Fb45",
              ], [coinData[0].bigIntValue, coinData[1].bigIntValue, coinData[2].bigIntValue, coinData[3].bigIntValue], parseEther(`0`)]
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
        onClick={() => ApproveGRT()}
        >
        Approve GRT
        </button>
        
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveOP()}
        >
        Approve OP
        </button>
        
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveMNT()}
        >
        Approve MNT
        </button>
        
      <button 
        className="btn btn-primary m-4"
        onClick={() => ApproveMATIC()}
        >
        Approve MATIC
        </button>
      </div>
      
    </div>
  );
}

export default CoinsDonationComponent;