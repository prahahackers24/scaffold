"use client";

import React from 'react'
import CampaignPageComponent from '~~/components/CampaignPageComponent';
import CardWithProgress from '~~/components/CardWithProgress';



const CampaignPage = ({ params }: { params: { id: string } }) => {


  return (
   <>
   <div className='flex justify-center'>
   <CampaignPageComponent pageId={params.id} />

   </div>
   </>
  )
}

export default CampaignPage