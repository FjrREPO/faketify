import React from 'react'
import ArtistDetails from './_components/ArtistDetails'
import MainContainer from '@/components/container/main-container'

interface Params {
    params: Promise<{ artistId: string }>
}

export default async function Page({ params }: Params) {
    const { artistId } = await params;
    return (
        <MainContainer>
            <ArtistDetails artistId={artistId} />
        </MainContainer>
    )
}
