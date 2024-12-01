import React from 'react'
import CategoryDetails from './_components/CategoryDetails'
import MainContainer from '@/components/container/main-container'

interface Params {
    params: Promise<{ categoryId: string }>
}

export default async function page({ params }: Params) {
    const { categoryId } = await params

    return (
        <MainContainer>
            <CategoryDetails categoryId={categoryId} />
        </MainContainer>
    )
}
