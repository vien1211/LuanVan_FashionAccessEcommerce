import {useMemo} from 'react'
import {generateRange} from '../ultils/helper'
import { PiDotsThreeBold } from "react-icons/pi";

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
  const paginationRange = useMemo(() => {
    const pageSize = process.env.REACT_APP_LIMIT || 10
    const paginationCount = Math.ceil(totalProductCount / pageSize)
    const totalPaginationItem = siblingCount + 5

    if(paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)
    
    const isShowleft = currentPage - siblingCount > 2
    const isShowRight = paginationCount + siblingCount < paginationCount - 1

    if(isShowleft && !isShowRight){
        const rightStart = paginationCount - 4
        const rightRange = generateRange(rightStart, paginationCount)

        return [1, <PiDotsThreeBold />, ...rightRange]
    }

    if(!isShowleft && isShowRight){
        const leftRange = generateRange(1,5)
        return [...leftRange, <PiDotsThreeBold />, paginationCount]
    }

    const siblingLeft = Math.max(currentPage - siblingCount, 1)
    const siblingRight = Math.min(currentPage + siblingCount, paginationCount)

    if(isShowleft && isShowRight){
        const middleRange = generateRange(siblingLeft, siblingRight)
        return [1, <PiDotsThreeBold />, ...middleRange, <PiDotsThreeBold />, paginationCount]
    }

  }, [totalProductCount, currentPage, siblingCount]) 
    return paginationRange
}

export default usePagination