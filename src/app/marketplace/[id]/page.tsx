"use client"
import Singlemarketplace from '@/modules/marketplace/Singlemarketplace'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const {id} = useParams()
  return (
    <div>
        <Singlemarketplace id={id as string} />
    </div>
  )
}

export default page