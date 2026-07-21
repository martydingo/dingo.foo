import config from '@payload-config'
import ProjectPost from "@/components/Projects/ProjectPost"
import { getPayload } from 'payload'

export default async function Project({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const payload = await getPayload({ config })
    const project = await payload.findByID({ collection: "projects", id: id })
    console.log(project.content)
    return (
        <div className='container mx-auto'>
            <ProjectPost project={project} />
        </div>
    )
} 