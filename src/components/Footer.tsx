import Image from "next/image";
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Footer() {
    const payload = await getPayload({ config })
    const siteImage = await payload.findByID({ collection: "images", id: "site-logo" })
    const siteImageUri = siteImage.url
    return (
        <div className="mx-auto max-w-7xl items-start justify-between text-sm py-8 sm:px-8">
            <div className="relative flex w-full flex-col items-center justify-center">
                <div className="mr-0 mb-4 md:mr-4 md:flex"><a
                    className="relative z-20 mr-4 flex justify-center  items-center space-x-2 px-2 py-1 text-sm font-normal text-foreground"
                    href="/"><Image alt="logo" width="30" height="30" src={siteImageUri!} /><span
                        className="font-medium mt-4">dingo.foo</span></a></div>
                <ul
                    className="hover:text-text-neutral-800 flex list-none gap-4 text-neutral-600 transition-colors sm:flex-row dark:text-neutral-300">
                    <li className="list-none"><a className="hover:text-primary transition-colors" href="/blog">Blog</a></li>
                    <li className="list-none"><a className="hover:text-primary transition-colors" href="/projects">Projects</a></li>
                    <li className="list-none"><a className="hover:text-primary transition-colors" href="/socials">Socials</a></li>
                    <li className="list-none"><a className="hover:text-primary transition-colors" href="/admin">Admin</a></li>
                </ul>
            </div>
            <div className="mt-8 flex w-full flex-col items-center justify-between sm:flex-row">
                <p className="mb-8 sm:mb-0 text-muted-foreground">© dingo.foo</p>
                <div className="flex gap-4">

                </div>
            </div>
        </div>
    )
}