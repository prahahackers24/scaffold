import Link from "next/link";
import React from "react";
import { Address } from "./scaffold-eth";

// Define the type for your props
interface CardProps {
  imgSrc: string;
  title: any;
  description: string;
  isLive: boolean;
  campaignId: any;
  campaignOwner: string;
}

/**
 * Fundraiser Card
 */
export const Card: React.FC<CardProps> = ({ imgSrc, title, description, isLive, campaignId, campaignOwner }) => {

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
      imgSrc: "/dogshelter.jpeg",
      title: "Dog Shelter Fundraiser"
    },
    "4": {
      imgSrc: "/camp_warming.jpeg",
      title: "Climate Change Fund"
    },
    "5": {
      imgSrc: "/camp_india.jpeg",
      title: "Education Fund"
    },
   }

   return (
    <div className="card bg-base-100 shadow-xl m-2 p-0">
      <figure className="w-full h-48 overflow-hidden">
        {/* @ts-ignore */}
        <img src={imageAndTitleMapping[campaignId].imgSrc} alt="Shoes" className="w-full h-full object-cover" />
      </figure>
      <div className="card-body p-4">
        {/* @ts-ignore */}
        <h2 className="card-title text-md">
             {/* @ts-ignore */}
          {imageAndTitleMapping[campaignId].title.length > 21
          
            ? 
            
            imageAndTitleMapping[campaignId].title.slice(0, 21) + '...'
            : imageAndTitleMapping[campaignId].title}
        </h2>
        <p className="text-sm">{description}</p>
  
        <div className="flex flex-row text-sm opacity-50">
          <p>{'Owner: '}</p>
          <Address address={campaignOwner} size={"sm"} />
        </div>
  
        <div className="card-actions justify-center">
          <Link href={`/campaign/${campaignId}`}>
            <button className="btn btn-primary">Donate Now!</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
