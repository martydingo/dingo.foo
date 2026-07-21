"use client";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";

const siteNavLinks: { href: string, title: string, description: string }[] = [
    {
        href: "/projects",
        title: "Projects",
        description: "A collection of things I've created, written, contributed to, or worked on. Or things I've simply just broke."
    },
    {
        href: "/blog",
        title: "Blog",
        description: "Some of my more technical scribblings and scratchings, which are definitely still scribbles and scratches."
    },
    {
        href: "/socials",
        title: "Socials",
        description: "Sometimes, you just want a chat."
    },
    {
        href: "/admin",
        title: "Admin",
        description: "You know, there needs to be some way to add content to this site"
    }
]

export default function NavBar() {
    return (
        <div className="w-full px-8 mt-4 h-16">
            <NavigationMenu>
                <Link href="/" className="flex items-center gap-2 mr-8">
                    <Image src="/logo.png" height={64} width={64} alt="dingo.foo site logo" />
                    <p className="font-bai-jamjuree tracking-wider text-2xl">dingo.foo</p>
                </Link>
                <NavigationMenuList className="mt-1 font-bai-jamjuree">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-md">Site Navigation</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            {
                                siteNavLinks.map((siteNavLink, index) =>
                                    <>
                                        <NavigationMenuLink render={<Link href={siteNavLink.href} />}>
                                            <div className="w-72">
                                                <h3 className="font-serif font-semibold pb-2 text-base">{siteNavLink.title}</h3>
                                                <p className="font-jetbrains-mono indent-2 text-sm">{siteNavLink.description}</p>
                                            </div>
                                        </NavigationMenuLink>
                                        {index < siteNavLinks.length - 1 && <Separator />}
                                    </>
                                )
                            }
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-md">Applications</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink render={<Link href="https://j2live.dingo.foo" />}>
                                <div className="flex items-center justify-around gap-4">
                                    <div className="flex flex-col w-72">
                                        <h3 className="font-bold">J2Live</h3>
                                        <p className="font-titillium-web">J2Live is a web-based application that allows users to edit and render Jinja2 templates using YAML variables in real-time, using the Ansible templating engine.</p>
                                    </div>
                                    <Image loading="eager" src="/j2live_logo_square_halcyon.svg" height={96} width={96} alt="j2live logo" className="self-center mt-1" />
                                </div>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div >
    )
}