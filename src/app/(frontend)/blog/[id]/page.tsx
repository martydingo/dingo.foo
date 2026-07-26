import config from '@payload-config'
import BlogPost from "@/components/Blog/BlogPost"
import { getPayload } from 'payload'
import Content from '@/components/Content'
import Footer from '@/components/Footer'

export default async function Blog({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const payload = await getPayload({ config })
    const blogPost = await payload.findByID({ collection: "blog", id: id })
    return (
        <div className='container mx-auto mx-w-3xl'>
            <Content post={blogPost} />
            <div className='w-full mt-8 xl:mt-24'>
                <Footer />
            </div>
        </div>
    )
} 