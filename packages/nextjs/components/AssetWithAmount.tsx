import React from 'react'
import Image from 'next/image'


const AssetWithAmount = ({imgSrc, amount, name}: any) => {
  return (
    <div className='flex'>
        <Image src={imgSrc} alt="logo" className='rounded-full' width={100} height={100}  />
        <div className='grid grid-cols-1'>
            <p>{amount}</p>
            <p>{name}</p>
        </div>
    </div>
  )
}

export default AssetWithAmount