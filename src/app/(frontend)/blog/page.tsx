import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import BlogBento from '@/components/Blog/BlogPost/BlogBento/BlogBento'


export default async function Blog() {
    const payload = await getPayload({ config })
    const blog = await payload.find({ collection: "blog" })

    return (
        <div>
            <BlogBento blog={blog.docs} />
        </div>
    )
}