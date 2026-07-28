import Link from "next/link";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Image, Blog } from "../../../../payload-types";

interface BlogCardProps {
    blogPost: Blog
    showRightBorder?: boolean;
}

export function BlogCard({
    blogPost,
    showRightBorder = true,
}: BlogCardProps) {
    const blogImage = blogPost.image as Image
    const blogImageUri = blogImage && blogImage.url
    return (
        <Link
            href={`/blog/${blogPost.id}`}
            className={cn(
                "group block relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-0 after:h-px after:w-screen after:bg-border after:content-['']",
                showRightBorder && "md:border-r border-border border-b-0"
            )}
        >
            <div className="flex flex-col">
                {blogImageUri && (
                    <div className="relative w-full h-48 overflow-hidden">
                        <NextImage
                            src={blogImageUri}
                            alt={blogImage && blogImage["alt-text"]}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}

                <div className="p-6 flex flex-col gap-2 h-64">
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:underline underline-offset-4">
                        {blogPost.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{blogPost.summary}</p>
                    <time className="block text-sm font-medium text-muted-foreground">
                        {new Date(blogPost.date!).toLocaleDateString("en-AU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </time>
                </div>
            </div>
        </Link>
    );
}
