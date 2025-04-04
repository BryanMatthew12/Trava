import React from 'react'
import RowDataTrending from './RowDataTrending'

const TrendingRow = ({province}) => {

  return (

     <div className="mb-6">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Trending</h3>
              <span>See all</span>
            </div>
            <RowDataTrending province={province} />
          </div>
  )
}

export default TrendingRow