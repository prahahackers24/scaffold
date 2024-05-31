import React from "react";

// Define the type for your props
interface CardProps {
  imgSrc: string;
  title: string;
  description: string;
}

/**
 * Fundraiser Card
 */
export const Card: React.FC<CardProps> = ({ imgSrc, title, description }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={imgSrc} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Donate Now!</button>
        </div>
      </div>
    </div>
  );
};
