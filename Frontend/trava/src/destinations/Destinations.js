import React from 'react'
import DestinationBanner from './destinationComponent/DestinationBanner'
import ProvinceComponent from './destinationComponent/ProvinceComponent'

const Destinations = () => {
  return (
    <div className="flex flex-col items-center space-y-6">
      <DestinationBanner/>
      <ProvinceComponent/>
    </div>
  )
}

export default Destinations