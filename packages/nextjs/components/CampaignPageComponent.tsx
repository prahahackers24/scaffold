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

  const imageAndTitleMapping = {
    "0": {
      imgSrc: "/camp_codeminds.jpeg",
      title: "Support Our Programming School"
    },
    "1": {
      imgSrc: "/camp_ReFi_prague.webp",
      title: "Fundraiser for ReFi DAO Prague Pod"
    },
    "2": {
      imgSrc: "/camp_tornado.jpeg",
      title: "Legal Defense Fund support for Alexey Pertsev and Roman Storm"
    },
    "3": {
      imgSrc: "/camp_ukraine.jpeg",
      title: "We stand with Ukraine"
    },
   }

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const campaignId = 1; // Replace with the actual campaign ID you want to query
  const {address} = useAccount();

  

  const { data: campaignData } = useScaffoldReadContract({
    contractName: "DonationContract",
    functionName: "campaigns",
    args: [pageId],
  });




  useEffect(() => {
   console.log(campaignData)
  }, [campaignData])








  return (
      <div className='grid grid-cols-2 my-8'>

       {campaignData ? <CardWithProgress 
           //@ts-ignore
      imgSrc={imageAndTitleMapping[pageId].imgSrc}
          //@ts-ignore
      title={imageAndTitleMapping[pageId].title}
      //@ts-ignore
      donationGoal={parseInt(campaignData[3]) / 1e18} 
      description="" />
      : <div>loaidng...</div> } 


       
      <CoinsDonationComponent />
    </div>
  )
}

export default CampaignPageComponent