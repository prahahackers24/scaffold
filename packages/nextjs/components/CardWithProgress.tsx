import React from "react";

// Define the type for your props
interface CardProps {
  imgSrc: string;
  title: string;
  description: string;
  donationGoal?: number;
}

/**
 * Fundraiser Card
 */
export const CardWithProgress: React.FC<CardProps> = ({ imgSrc, title, description, donationGoal }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-2 p-0">
      <figure>
        <img src={imgSrc} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div>
          <div className="flex justify-between">
            <div>
            <p className="opacity-50 text-xs m-0">Donated</p>
            <p className="font-bold text-primary text-xl m-0">40%</p>
              
            </div>
            <div>
            <p className="opacity-50 text-xs text-end m-0">Goal</p>
              <p className="font-bold text-primary text-xl text-end m-0">{donationGoal} USDC</p>
            </div>
          </div>
          <progress className="progress progress-primary h-3 w-full" value="40" max="100"></progress>
        </div>
      </div>
    </div>
  );
};

export default CardWithProgress;
