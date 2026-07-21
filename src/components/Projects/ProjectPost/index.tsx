'use client';

import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import { Image, Project } from "../../../../payload-types";
import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import NextImage from 'next/image';
import { Spotlight } from '@/components/ui/spotlight-new';
import { Backlight } from '@/components/ui/backlight';

export default function ProjectPost({ project }: { project: Project }) {
    const projectContentHtml = convertLexicalToHTML({ data: project.content })
    const projectImage = project.image as Image
    return (
        <article className='typeset typeset-docs mt-8'>
            <Spotlight />
            {/* <NextImage loading='eager' className={`mx-auto`} src={projectImage.url!} height={projectImage.height!} width={projectImage.width!} alt={projectImage['alt-text']} /> */}
            <div className='mb-16'>
                <h1 className='text-center text-4xl'>{project.title}</h1>
                <div className='flex justify-evenly'>
                    <p>Created {new Date(project.date!).toLocaleDateString()}</p>
                    <p>Authored {new Date(project.createdAt!).toLocaleDateString()}</p>
                </div>
            </div>
            <div className='max-w-2xl md:max-w-5xl mx-auto' dangerouslySetInnerHTML={{ "__html": projectContentHtml }} />
            {/* <ProgressiveBlur className='fixed rounded-t-full' height="16%" position="bottom" /> */}
        </article>
    )
}