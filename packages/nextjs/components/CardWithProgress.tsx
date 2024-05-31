import React from 'react'

// Define the type for your props
interface CardProps {
    imgSrc: string;
    title: string;
    description: string;
  }
  
  /**
   * Fundraiser Card
   */
  export const CardWithProgress: React.FC<CardProps> = ({ imgSrc, title, description }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-2 p-0">
    <figure>
      <img src={imgSrc} alt="Shoes" />
    </figure>
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <div>
        <div className='flex justify-between'>
         <p className='font-bold text-success text-xl'>40%</p>
         <p className='font-bold text-white text-xl text-end'>500USDT</p>
        </div>
      <progress className="progress progress-success h-3 w-full" value="40" max="100"></progress>
      </div>
    </div>
  </div>
  )
}

export default CardWithProgress