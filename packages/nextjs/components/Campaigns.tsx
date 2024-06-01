import React, { useEffect } from 'react'
import { Card } from './Card'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const Campaigns = () => {


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

useEffect(() => {client
  .query({
    query: gql(tokensQuery),
    fetchPolicy: 'no-cache',
  })

  .then((data) => console.log(data.data))
  .catch((err) => {
    console.log('Error fetching data: ', err)
  })
}, [])


  return (
    <div className="grid grid-cols-3 mx-auto mt-8 items-center">
          <Card
              imgSrc="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              title="Fundraiser title"
              description="description goes here..."
            />
            <Card
              imgSrc="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              title="Fundraiser title"
              description="description goes here..."
            />
            <Card
              imgSrc="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              title="Fundraiser title"
              description="description goes here..."
            />
    </div>
  )
}

export default Campaigns