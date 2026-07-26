"use client"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Blog, Image } from "../../../../../payload-types";
import "iconify-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";

const IconfiyIcon = ({ iconName }: { iconName: string }) => <iconify-icon style={{ fontSize: 32 }} icon={iconName}></iconify-icon>

export default function BlogBento({ blog, className }: { blog: Blog[], className?: string }) {
    const blogItems = blog.map((blogPost) => {
        const blogImg = blogPost.image as Image
        return {
            title: blogPost.title,
            description: blogPost.summary,
            // header: 
            img: blogImg,
            icon: blogPost.icons && blogPost.icons?.length > 0 && blogPost.icons[0].icon,
            id: blogPost.id
        }
    })
    return (
        <BentoGrid className={className}>
            {blogItems.map((blogItem, index) =>
                <BentoGridItem
                    key={index}
                    title={blogItem.title}
                    description={blogItem.description}
                    header={blogItem.img && <img className={cn(index % 2 === 0 && index !== 0 ? "h-36" : index === 0 ? "h-40" : "h-24", "object-cover")} src={blogItem.img.url!} alt={blogItem.img['alt-text']} />}
                    icon={IconfiyIcon({ iconName: blogItem.icon && blogItem.icon || "" })}
                    className={cn(index % 2 === 0 && index !== 0 ? "md:col-span-2" : index === 0 ? "md:col-span-3" : "")}
                    href={`/blog/${blogItem.id}`}
                // className={cn(index % 2 === 0 && index !== 0 ? "aspect-video h-40" : index === 0 ? "aspect-square h-24" : "")}
                />
            )}
        </BentoGrid>
    )
}