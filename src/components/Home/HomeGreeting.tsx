'use client'

import { PaginatedDocs } from "payload"
import { Blog, Project } from "../../../payload-types"
import { GlyphMatrix } from "../ui/glyph-matrix"
import { KineticText } from "../ui/kinetic-text"
import { TextFlippingBoard } from "../ui/text-flipping-board"
import HomeFlipCard from "./HomeFlipCard"
import { HeroParallax } from "../ui/hero-parallax"

export default function HomeGreeting({ siteContent }: { siteContent: Blog[] | Project[] }) {
    const contentMedia: { title: string, href: string, thumbnail: string }[] = []
    console.log(siteContent)
    siteContent.forEach((post) => {
        post.content!.root.children.forEach((childNode) => {
            if (childNode.type = "upload") {
                if (childNode.value) {
                    contentMedia.push({
                        title: post.title!,
                        link: `/${post.collection}/${post.id}`,
                        thumbnail: childNode.value && childNode.value.url
                    })
                }
            }
        })
        if (post.image) {
            contentMedia.push({
                "title": post.title!,
                "href": `/${post.collection}/${post.id}`,
                "thumbnail": post.image!.url
            })
        }
    })
    return (
        <div className="flex items-center justify-between h-full min-h-[80vh] typeset typeset-doc">
            <div className="basis-1/2 flex flex-col items-start">
            </div>
            <div className="basis-1/2 flex flex-col items-start">
                {/* <KineticText className="ml-16" text="Now Engineering" as="h1" /> */}
                {/* <HomeFlipCard heroMessages={heroMessages!} /> */}
                <HeroParallax products={contentMedia} />
            </div>
            <div>
                {/* <NoiseTexture className="col-span-1 col-start-2 mask-[radial-gradient(420px_circle_at_center,white,transparent)]" /> */}
            </div>
        </div>
    )
}