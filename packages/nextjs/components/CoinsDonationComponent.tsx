import React from 'react';
import CoinSelector from './CoinSelector';


export default function CoinsDonationComponent() {
    return (
        <div className="">
          <div className="card bg-base-100 shadow-xl m-2 p-0">
            <CoinSelector initialValue={24} maxValue={694} coinName='MEME' />
            <CoinSelector initialValue={59} maxValue={2500} coinName='PEPE' />
            <CoinSelector initialValue={320} maxValue={4300} coinName='BOBB' />
          </div>
        </div>
    )
}