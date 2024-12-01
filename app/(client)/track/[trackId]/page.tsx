import React from 'react'
import TrackDetails from './_components/TrackDetails'
import MainContainer from '@/components/container/main-container'

interface Params {
    params: Promise<{ trackId: string }>
}

export default async function page({ params }: Params) {
    const { trackId } = await params
    return (
        <MainContainer>
            <TrackDetails trackId={trackId} />
        </MainContainer>
    )
}
