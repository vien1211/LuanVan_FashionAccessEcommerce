import React, {memo} from 'react'
import {PuffLoader} from 'react-spinners'

const Loading = () => {
  return (
    <div>
        <PuffLoader color='#6D8777' />
    </div>
  )
}

export default memo(Loading)