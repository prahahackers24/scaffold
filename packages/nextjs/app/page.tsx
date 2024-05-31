"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card } from "~~/components/Card";
import { Address } from "~~/components/scaffold-eth";
import Campaigns from "~~/components/Campaigns";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
    <div className="">
     <Campaigns />
     </div>
    </>
  );
};

export default Home;
