'use client'

import { PaginatedDocs } from "payload"
import { Blog, Image, Project } from "../../../payload-types"
import { GlyphMatrix } from "../ui/glyph-matrix"
import { KineticText } from "../ui/kinetic-text"
import { TextFlippingBoard } from "../ui/text-flipping-board"
import HomeFlipCard from "./HomeFlipCard"
import { HeroParallax } from "../ui/hero-parallax"

interface siteContent extends Blog, Project {
    collection: string
}

export default function HomeGreeting({ siteContent }: { siteContent: siteContent[] }) {
    const contentMedia: { title: string, link: string, thumbnail: string }[] = []

    siteContent.forEach((post) => {
        post.content!.root.children.forEach((childNode) => {
            if (childNode.type = "upload") {
                if (childNode.value) {
                    const thumbnailDict = childNode.value as { url: string }
                    contentMedia.push({
                        title: post.title!,
                        link: `/${post.collection}/${post.id}`,
                        thumbnail: childNode.value && thumbnailDict.url
                    })
                }
            }
        })
        if (post.image) {
            const postImage = post.image as Image
            contentMedia.push({
                "title": post.title!,
                "link": `/${post.collection}/${post.id}`,
                "thumbnail": postImage.url as string
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