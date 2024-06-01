"use client";

import React from "react";

/**
 * Site header
 */
export const Info = () => {
  return (
    <div id="info" className="mx-auto max-w-[900px]">
      
      <h2 className="text-4xl font-bold  mt-24 mb-4">About the project</h2>
      <p>
        Unlike other donation dApp, this one accepts all kids of ERC20 tokens! All the memecoins, barely-worth-it
        airdrops and random legacy coins usually just lie in out wallets. With Donation Appreciation, we can put them
        all in one pile and have them do some good in the world.
      </p>
      <h3 className="text-xl font-bold  mt-12 mb-4">How it works?</h3>

      <ul className="list-disc pl-5">
        <li className="mb-2">
          <span className="">Onchain fundraisers can easily be created through our website. </span>
        </li>

        <li className="mb-2">
          <span className="">Donors can see all the ERC20s in their wallet and donate multiple ones at once.</span>
        </li>

        <li className="mb-2">
          <span>
            Once the pile of the donated tokens reaches the target value, either by price appreciation or donations, it
            all gets converted to USDC and sent to the donation address.
          </span>
        </li>
      </ul>

      <h3 className="text-xl font-bold mt-12 mb-4">What are the advantages</h3>

      <ul className="list-disc pl-5">
        <li className="mb-2">
          <span className="">Enables donations in almost any ERC20 token</span>
        </li>

        <li className="mb-2">
          <span className="">Small donation today could turn into a big one later</span>
        </li>

        <li className="mb-2">
          <span>Fully permission-less onchain donations</span>
        </li>

        <li className="mb-2">
          <span>Can solve tax implications of airdrops for the donors</span>
        </li>
      </ul>

      <h3 className="text-xl font-bold  mt-12 mb-4">Under the hood</h3>

      <ul className="list-disc pl-5">
        <li className="mb-2">
          <span className="">
            <b>The Graph subgraph</b> was built to monitor the contracts of the fundraising campaigns
          </span>
        </li>

        <li className="mb-2">
          <span className="">
            We have built a <b>custom EigenLayer AVS</b> to verify the target is reached before swapping all ERC20
            tokens to $USDC
          </span>
        </li>

        <li className="mb-2">
          <span>
            <b>UniSwap hooks</b> are used to swap all tokens for USDC, before transferring the USDC to the donation
            recipient address
          </span>
        </li>
      </ul>

      {/* Tech Used */}

      <h3 className="text-xl font-bold  mt-12 mb-4">Tech Used</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-2">
        <div className="flex justify-center items-center p-2 bg-white rounded-lg shadow">
          <img src="./eigen.jpg" alt="Logo 1" className="h-16 max-w-full object-contain" />
        </div>
        <div className="flex justify-center items-center p-2 bg-white rounded-lg shadow">
          <img src="./uniswap.png" alt="Logo 2" className="h-16 max-w-full object-contain" />
        </div>
        <div className="flex justify-center items-center p-2 bg-white rounded-lg shadow">
          <img src="./the-graph.jpeg" alt="Logo 3" className="h-16 max-w-full object-contain" />
        </div>
        <div className="flex justify-center items-center p-0 bg-white rounded-lg shadow">
          <img src="./thumbnail.jpg" alt="Logo 4" className="h-24 max-w-full object-contain" />
        </div>
      </div>

      {/* Built by at at */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-8 p-2">
        <div className="flex flex-col justify-left items-left p-2">
          <h3 className="text-xl font-bold  mt-12 mb-4">Team</h3>
          <ul>
            <li>
              <a href="https://x.com/_alexastro/" target="_blank">
                AlexAstro
              </a>
            </li>
            <li>
              <a href="https://x.com/arjanjohan/" target="_blank">
                arjanjohan
              </a>
            </li>
            <li>
              <a href="https://x.com/jacobjelen" target="_blank">
                JacobJelen.eth
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-left items-left p-2">
          <h3 className="text-xl font-bold  mt-12 mb-4">Source Code</h3>
          <a href="https://github.com/prahahackers24/scaffold">
          <img src="./github.png" alt="Logo 1" className="h-16 max-w-full object-contain" />
          </a>
        </div>

        <div className="flex flex-col justify-left items-left p-2">
          <h3 className="text-xl font-bold  mt-12 mb-4">Build at</h3>
          <div className="rounded-full overflow-hidden">
            <a href="https://ethprague.com//">
            <img src="./ethprague.jpeg" alt="Logo 4" className="h-16 max-w-full object-contain" />
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
};
