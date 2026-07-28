"use client"

import { Suspense, useState } from "react";
import { Blog } from "../../../../payload-types";
import { BlogCard } from "./BlogCard";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


export default function BlogGrid({ blogPosts }: { blogPosts: Blog[] }) {
    const [page, setPage] = useState(1)
    const postsPerPage = 6

    const paginatedBlogPosts = blogPosts.map((blogPost, index) => {
        const indexMod = Math.floor(index / postsPerPage)
        return {
            [indexMod]: blogPost
        }
    })

    const pages = []
    for (let pageNumber = 0; pageNumber < Math.ceil(paginatedBlogPosts.length / postsPerPage); pageNumber++) {
        pages.push(pageNumber + 1)
    }

    const slicedBlogPosts = blogPosts.slice(page * postsPerPage - postsPerPage, page * postsPerPage)
    return (

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-0">
            <div>
                <Suspense fallback={<div>Loading articles...</div>}>
                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative overflow-hidden border-x border-border ${blogPosts.length < 4 ? "border-b" : "border-b-0"
                            }`}
                    >
                        {slicedBlogPosts.map((blogPost) => {
                            return (
                                <BlogCard
                                    key={blogPost.id}
                                    blogPost={blogPost}
                                    showRightBorder={slicedBlogPosts.length < 3}
                                />
                            );
                        })}
                    </div>
                </Suspense>
            </div>
            <div className="mt-8">
                <Pagination>
                    <PaginationContent>
                        {page !== 1 &&
                            <PaginationItem>
                                <PaginationPrevious onClick={() => setPage(page - 1)} />
                            </PaginationItem>
                        }
                        {
                            pages.map((_, index) =>
                                <PaginationItem>
                                    <PaginationLink isActive={page === index + 1} onClick={() => setPage(index + 1)} >
                                        {index + 1}
                                    </PaginationLink >
                                </PaginationItem>
                            )
                        }
                        {pages.length !== page &&
                            <PaginationItem>
                                <PaginationNext onClick={() => setPage(page + 1)} />
                            </PaginationItem>
                        }
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}