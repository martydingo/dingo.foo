import { getPayload } from 'payload'
import config from '@payload-config'
import BlogBento from '@/components/Blog/BlogPost/BlogBento/BlogBento'
import Footer from '@/components/Footer'
import { TagFilter } from '@/components/Blog/TagFilter';

export const dynamic = 'force-dynamic';

export default async function Blog({
    searchParams,
}: {
    searchParams: Promise<{ tag?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const payload = await getPayload({ config })
    const blog = await payload.find({ collection: "blog" })
    const sortedBlogPosts = blog.docs.sort((blogPostA, blogPostB) => new Date(blogPostA.date!).getMilliseconds() - new Date(blogPostB.date!).getMilliseconds())
    const allTags: string[] = blog.docs.map((blogPost) => blogPost.tags?.map((tagDict) => tagDict.tag)).flat() as string[]
    const selectedTag = resolvedSearchParams.tag || "all";
    let tagCounts = allTags.reduce((acc, tag) => {
        if (tag === "all") {
            acc[tag] = allTags.length;
        } else {
            acc[tag] = sortedBlogPosts.filter((blog) =>
                blog.tags?.map((blogTags) => blogTags.tag).includes(tag)
            ).length;
        }
        return acc;
    }, {} as Record<string, number>);

    tagCounts['all'] = Object.keys(tagCounts).length

    const filteredBlogs =
        selectedTag === "all"
            ? sortedBlogPosts
            : sortedBlogPosts.filter((blog) => blog.tags?.map((blogTags) => blogTags.tag).includes(selectedTag));

    return (
        <div className='mt-8 flex flex-col lg:min-h-[88vh] justify-between max-w-7xl mx-auto'>
            <div className='max-w-6xl mx-auto pb-8'>
                <TagFilter
                    tags={["all", ...allTags]}
                    selectedTag={selectedTag}
                    tagCounts={tagCounts}
                />
            </div>
            <BlogBento className='' blog={filteredBlogs} />
            <div className='w-full mt-8 lg:mt-0'>
                <Footer />
            </div>
        </div>
    )
}