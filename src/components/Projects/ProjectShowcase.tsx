'use client'

import Link from "next/link";
import { Project } from "../../../payload-types";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";


export default function ProjectShowcase({ projects }: { projects: Project[] }) {
    const projectCards = projects.map((projectPost, index) =>
        <Link href={`/projects/${projectPost.id}`}>
            <Card key={projectPost.id} project={projectPost} index={index} />
        </Link>

        // {
        // return {
        //     category: projectPost.category!,
        //     title: projectPost.title!,
        //     src: projectPost.image && projectPost.image.url!,
        // }
        // })
    )


    return (
        <Carousel items={projectCards} />

    )
}