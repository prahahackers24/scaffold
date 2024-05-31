import React from 'react'
import Image from 'next/image'


const AssetWithAmount = ({imgSrc, amount, name}: any) => {
  return (
    <div className='flex'>
        <Image src={imgSrc} alt="logo" />
        <div className='grid grid-cols-1'>
            <p>{amount}</p>
            <p>{name}</p>
        </div>
    </div>
  )
}

export default AssetWithAmount