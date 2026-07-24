import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import ProjectPost from '@/components/Projects/ProjectPost'
import { Carousel } from '@/components/ui/apple-cards-carousel'
import ProjectShowcase from '@/components/Projects/ProjectShowcase'


export default async function Projects() {
    const payload = await getPayload({ config })
    const projects = await payload.find({ collection: "projects" })

    return (
        <div className='max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-5xl mx-auto'>
            <ProjectShowcase projects={projects.docs} />
        </div>
    )
}