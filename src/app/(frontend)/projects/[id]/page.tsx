import config from '@payload-config'
import ProjectPost from "@/components/Projects/ProjectPost"
import { getPayload } from 'payload'
import Content from '@/components/Content'
import Footer from '@/components/Footer'

export default async function Project({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const payload = await getPayload({ config })
    const project = await payload.findByID({ collection: "projects", id: id })
    console.log(project.content)
    return (
        <div className='container mx-auto'>
            <Content post={project} />
            <div className='w-full mt-8 xl:mt-24'>
                <Footer />
            </div>
        </div>
    )
} 