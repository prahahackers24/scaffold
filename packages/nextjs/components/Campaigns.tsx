import React, { useEffect, useState } from 'react'
import { Card } from './Card'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

interface Campaign {
  campaignId: string;
  campaignOwner: string;
  isLive: boolean;
  campaignName: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);



  const APIURL = 'https://api.studio.thegraph.com/query/72991/donation/version/latest'

const tokensQuery = `
query CampaignsQuery {
  campaigns(first: 20) {
    campaignId,
    campaignOwner,
    isLive,
    campaignName
  }
}
`

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
})


useEffect(() => {
  const fetchData = async () => {
    try {
      const { data } = await client.query({
        query: gql(tokensQuery),
        fetchPolicy: 'no-cache',
      });
      setCampaigns(data.campaigns);
    } catch (err) {
      console.log('Error fetching data: ', err);
    }
  };

  fetchData();
}, []);


  return (
    <div className="grid  grid-cols-4 mx-auto mt-8 items-center">
         {campaigns.map((campaign) => (
        <Card
          key={campaign.campaignId}
          imgSrc="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          title={campaign.campaignName}
          campaignOwner={`${campaign.campaignOwner}`}
          isLive={campaign.isLive}
          campaignId={campaign.campaignId}
          description={'Tester campaign'}
        />
      ))}
    </div>
  )
}

export default Campaigns