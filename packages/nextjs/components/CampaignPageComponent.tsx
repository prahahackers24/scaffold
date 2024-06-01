import React, { useEffect, useState } from 'react'
import CardWithProgress from './CardWithProgress'
import CoinsDonationComponent from './CoinsDonationComponent'
import { useScaffoldReadContract } from '~~/hooks/scaffold-eth';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';



interface Campaign {
  campaignId: string;
  campaignOwner: string;
  isLive: boolean;
  campaignName: string;
}

const CampaignPageComponent = ({pageId} : any) => {


  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const campaignId = 1; // Replace with the actual campaign ID you want to query
  const {address} = useAccount();

  

  const { data: campaignData } = useScaffoldReadContract({
    contractName: "DonationContract",
    functionName: "campaigns",
    args: [pageId],
  });

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




  useEffect(() => {
   console.log(campaignData)
  }, [campaignData])








  return (
      <div className='grid grid-cols-2 my-8'>

       {campaignData ? <CardWithProgress 
           
      imgSrc="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
      title={`${campaignData[2]}`}
      //@ts-ignore
      donationGoal={parseInt(campaignData[3]) / 1e18} 
      description="description goes here..." />
      : <div>loaidng...</div> } 


       
      <CoinsDonationComponent />
    </div>
  )
}

export default CampaignPageComponent