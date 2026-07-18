import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'


export default async function Projects() {
    const payload = await getPayload({ config })
    const projects = await payload.find({ collection: "projects" })

    return (
        <div>
            {projects.docs.map((project) => <Link href={`/projects/${project.id}`}>{project.title}</Link>)}
        </div>
    )
}