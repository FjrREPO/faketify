import React from 'react'
import CategoryDetails from './_components/CategoryDetails'
import MainContainer from '@/components/container/main-container'

interface Params {
    params: {
        categoryId: string
    }
}

export default function page({ params }: Params) {
    const { categoryId } = params

    return (
        <MainContainer>
            <CategoryDetails categoryId={categoryId} />
        </MainContainer>
    )
}
