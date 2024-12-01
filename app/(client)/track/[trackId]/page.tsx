import React from 'react'
import TrackDetails from './_components/TrackDetails'
import MainContainer from '@/components/container/main-container'

interface Params {
    params: {
        trackId: string
    }
}

export default function page({ params }: Params) {
    const { trackId } = params
    return (
        <MainContainer>
            <TrackDetails trackId={trackId} />
        </MainContainer>
    )
}
