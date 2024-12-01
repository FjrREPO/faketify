import React from 'react'
import ArtistDetails from './_components/ArtistDetails'
import MainContainer from '@/components/container/main-container'

interface Params {
    params: {
        artistId: string
    }
}

export default function page({ params }: Params) {
    const { artistId } = params
    return (
        <MainContainer>
            <ArtistDetails artistId={artistId} />
        </MainContainer>
    )
}
