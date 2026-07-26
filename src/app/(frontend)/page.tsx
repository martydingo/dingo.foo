import Footer from "@/components/Footer";
import HomeGreeting from "@/components/Home/HomeGreeting";
import config from '@payload-config'
import { getPayload } from 'payload'

export default async function Home() {
  const payload = await getPayload({ config })
  // const siteContent = []
  const blogContent = await payload.find({ collection: "blog" })
  const projectContent = await payload.find({ collection: "projects" })
  const blogDocs = blogContent.docs.map((blogPost) => { return { ...blogPost, "collection": "blog" } })
  const projectDocs = projectContent.docs.map((projectPost) => { return { ...projectPost, "collection": "projects" } })
  const siteContent = [...projectDocs, ...blogDocs]
  // siteContent.push(projectContent.docs)

  return (

    <main className="h-full">
      <HomeGreeting siteContent={siteContent} />
      <div className='w-full mt-8 lg:mt-0'>
        <Footer />
      </div>
    </main>

  );
}
