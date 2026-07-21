import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'


export default async function Blog() {
    const payload = await getPayload({ config })
    const blog = await payload.find({ collection: "blog" })

    return (
        <div>
            {blog.docs.map((blogPost) => <Link href={`/blog/${blogPost.id}`}>{blogPost.title}</Link>)}
        </div>
    )
}