import { getPayload } from 'payload'
import config from '@payload-config'
import BlogBento from '@/components/Blog/BlogPost/BlogBento/BlogBento'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic';

export default async function Blog() {
    const payload = await getPayload({ config })
    const blog = await payload.find({ collection: "blog" })

    return (
        <div className='mt-8 lg:mt-16 flex flex-col lg:min-h-[88vh] justify-between'>
            <BlogBento className='' blog={blog.docs} />
            <div className='w-full mt-8 lg:mt-0'>
                <Footer />
            </div>
        </div>
    )
}