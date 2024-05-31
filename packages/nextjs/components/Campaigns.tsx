import React from 'react'
import { Card } from './Card'

const Campaigns = () => {
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