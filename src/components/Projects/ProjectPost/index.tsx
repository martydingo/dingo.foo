'use client';

import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { Image, Project } from "../../../../payload-types";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import Image from 'next/image';

export default function ProjectPost({ project }: { project: Project }) {
    const projectContentHtml = convertLexicalToHTML({ data: project.content })
    const projectImage = project.image as Image
    return (
        <article className='typeset typeset-docs'>
            <div>
                <Image src={projectImage.url!} height={projectImage.height!} width={projectImage.width!} alt={projectImage['alt-text']} />
                <h1>{project.title}</h1>
            </div>
            <div dangerouslySetInnerHTML={{ "__html": projectContentHtml }} />
        </article>
    )
}