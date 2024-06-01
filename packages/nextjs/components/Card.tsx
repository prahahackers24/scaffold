import Link from "next/link";
import React from "react";
import { Address } from "./scaffold-eth";

// Define the type for your props
interface CardProps {
  imgSrc: string;
  title: string;
  description: string;
  isLive: boolean;
  campaignId: string;
  campaignOwner: string;
}

/**
 * Fundraiser Card
 */
export const Card: React.FC<CardProps> = ({ imgSrc, title, description, isLive, campaignId, campaignOwner }) => {
  return (
    <div className="card bg-base-100 shadow-xl m-2 p-0">
      <figure>
        <img src={imgSrc} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{'Owner'}</p>
        <Address  address={campaignOwner} />
        <div className="card-actions justify-end">
          <Link href={`/campaign/${campaignId}`}>
          <button className="btn btn-primary">Donate Now!</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
