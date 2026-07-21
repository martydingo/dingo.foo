'use client';

import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { Image, Blog } from "../../../../payload-types";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import NextImage from 'next/image';
import { Spotlight } from '@/components/ui/spotlight-new';
import { Backlight } from '@/components/ui/backlight';
import htmlConverters from '@/payload/converters/htmlConverters';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MermaidPreview } from '@/components/mermaidcn/mermaid-preview';
import { Mermaid } from '@/components/mermaidcn/mermaid';

export default function BlogPost({ blog }: { blog: Blog }) {
    const blogContentHtml = convertLexicalToHTML({ data: blog.content!, converters: htmlConverters })
    const blogImage = blog.image as Image
    const [svg, setSvg] = useState("")
    useEffect(() => {
        const mermaidElement = document.getElementById("mermaid")
        if (mermaidElement) {
            const mermaidText = mermaidElement.firstChild!.firstChild!.textContent
            const newDiv = document.createElement("div")
            const root = createRoot(newDiv)
            const renderedElement = root.render(<Mermaid chart={mermaidText!} />)
            mermaidElement.replaceChildren(newDiv)
            return () => root.unmount();
        }
    })
    return (
        <article className='typeset typeset-docs mt-8'>
            <Spotlight />
            {/* <NextImage loading='eager' className={`mx-auto`} src={blogImage.url!} height={blogImage.height!} width={blogImage.width!} alt={blogImage['alt-text']} /> */}
            <div className='mb-16'>
                <h1 className='text-center text-4xl'>{blog.title}</h1>
                <div className='flex justify-evenly'>
                    <p>Created {new Date(blog.date!).toLocaleDateString()}</p>
                    <p>Authored {new Date(blog.createdAt!).toLocaleDateString()}</p>
                </div>
            </div>
            <div className='max-w-2xl md:max-w-5xl mx-auto' dangerouslySetInnerHTML={{ "__html": blogContentHtml }} />
            {/* <ProgressiveBlur className='fixed rounded-t-full' height="16%" position="bottom" /> */}
        </article>
    )
}