import React from 'react'
import CardWithProgress from './CardWithProgress'
import CoinsDonationComponent from './CoinsDonationComponent'


const CampaignPageComponent = () => {
  return (
    <div className='grid grid-cols-2'>
    <CardWithProgress  imgSrc="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
             title="Fundraiser title"
             description="description goes here..." />
     
    <CoinsDonationComponent />
  </div>
  )
}

export default CampaignPageComponent