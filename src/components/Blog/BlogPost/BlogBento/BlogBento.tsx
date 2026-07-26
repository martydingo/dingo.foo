"use client"

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Blog } from "../../../../../payload-types";
import "iconify-icon";

export default function BlogBento({ blog }: { blog: Blog[] }) {
    const blogItems = blog.map((blogPost) => {
        return {
            title: blogPost.title,
            description: blogPost.summary,
            header: blogPost.image && <Image src={blogPost.image.url} alt={blogPost.image.alt} />,
            icon: blogPost.icons?.length > 0 && <iconify-icon icon={blogPost.icons[0].icon}></iconify-icon>
        }
    })
    return (
        <BentoGrid>
            {blogItems.map((blogItem, index) =>
                <BentoGridItem
                    key={index}
                    title={blogItem.title}
                    description={blogItem.description}
                    icon={blogItem.icon}
                    className={index % 3 === 0 ? "md:col-span-2" : ""}
                />

            )}
        </BentoGrid>
    )
}