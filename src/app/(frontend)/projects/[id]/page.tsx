import config from '@payload-config'
import ProjectPost from "@/components/Projects/ProjectPost"
import { getPayload } from 'payload'
import Content from '@/components/Content'
import Footer from '@/components/Footer'
import { Suspense } from 'react'

export const dynamicParams = true

export default async function Project({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const payload = await getPayload({ config })
    const project = await payload.findByID({ collection: "projects", id: id })
    return (
        <div className='container mx-auto'>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
            <Content post={project} />
            {/* </Suspense> */}
            <div className='w-full mt-8 xl:mt-24'>
                <Footer />
            </div>
        </div>
    )
} 