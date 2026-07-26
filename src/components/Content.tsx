'use client'

import { DefaultNodeTypes } from "@payloadcms/richtext-lexical"
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical"
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"
import { MermaidPreview } from "./mermaidcn/mermaid-preview"
import { Mermaid } from "./mermaidcn/mermaid"
import { useEffect, useState } from "react"
import mermaidConfig from "./mermaidcn/mermaid-config"
import Code from "./Code/Code"
import halcyonTheme from "./Code/halcyon-color-theme.json"
import { Blog, Image, type Project } from "../../payload-types"
import { Spotlight } from "./ui/spotlight-new"
import { ScrollProgress } from "./ui/scroll-progress"
import "iconify-icon";
import { Backlight } from "./ui/backlight"
import NextImage from "next/image"

type NodeTypes =
    | DefaultNodeTypes

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
}) => ({
    ...defaultConverters,
    blocks: {
        // Each key should match your block's slug
        Mermaid: ({ node }: { node: any }) => {
            const [svg, setSvg] = useState("")
            return <MermaidPreview className="h-180 mt-8" chart={node.fields.diagramCode} config={mermaidConfig}
                svgOutput={svg}
                onSvgOutputChange={setSvg} />
        },
        Code: ({ node }: { node: any }) => <Code code={node.fields.code} language={node.fields.language} theme={halcyonTheme} />
    },
})

function ContentRenderer({ content }: { content: SerializedEditorState }) {
    return <RichText converters={jsxConverters} data={content} />
}

export default function Content({ post }: { post: Project | Blog }) {
    const postImage = post.image as Image
    return (
        <article className='typeset typeset-docs mt-8 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-5xl mx-auto'>
            <ScrollProgress className="top-0 fixed" />
            {/* <Spotlight height={height} /> */}
            {/* <NextImage loading='eager' className={`mx-auto`} src={postImage.url!} height={postImage.height!} width={postImage.width!} alt={postImage['alt-text']} /> */}

            <div className="relative w-fullpb-4">
                <NextImage loading='eager' className="w-full h-96 object-cover rounded-2xl" src={postImage && postImage.url!} height={postImage && postImage.height! / 2} width={postImage && postImage.width! / 2} alt={postImage && postImage['alt-text']} />
                <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur backdrop-brightness-50 rounded-2xl">
                    <h1 className='text-center text-4xl'>{post.title}</h1>
                    <div className="w-full flex items-center gap-8 justify-evenly py-4">

                        {post.icons!.length > 0 && (
                            <><p className="text-lg font-semibold ">Technologies Used</p>
                                <div className="flex pt-8 h-16 gap-16 items-center justify-center">
                                    {post.icons?.map((icon) => <Backlight blur={10}><iconify-icon style={{ fontSize: 48 }} icon={icon.icon!}> </iconify-icon></Backlight>)}
                                </div>
                            </>
                        )}
                    </div>
                    <div className='flex justify-evenly w-full py-4'>
                        <div>
                            <p className="flex flex-col leading-0 items-center font-semibold -mb-2">Authored</p>
                            <p> {new Date(post.date!).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="flex flex-col leading-0 items-center font-semibold -mb-2">Updated</p>
                            <p>{new Date(post.createdAt!).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
            <ContentRenderer content={post.content!} />
        </article>
    )
}