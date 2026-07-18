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

export default function NavBar() {

    return (
        <div className="w-full px-8 mt-4 h-16">
            <NavigationMenu>
                <Link href="/" className="flex items-center gap-2 mr-8">
                    <Image src="/logo.png" height={64} width={64} alt="dingo.foo site logo" />
                    <p className="font-bai-jamjuree tracking-wider text-xl font-black">dingo.foo</p>
                </Link>
                <NavigationMenuList className="mt-1 font-bai-jamjuree">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Site Navigation</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink render={<Link href="/projects" />}>
                                <div className="w-72 typeset typeset-docs">
                                    <h3 className="font-bold">Projects</h3>
                                    <p className="font-titillium-web">A collection of things I've created, written, contributed to, or worked on.</p>
                                </div>
                            </NavigationMenuLink>
                            <NavigationMenuLink>
                                <div className="w-72 typeset typeset-docs">
                                    <h3 className="font-bold">Blog</h3>
                                    <p className="font-titillium-web">Some of my more technical scribblings and scratchings, which are definitely still scribbles and scratches.</p>
                                </div>
                            </NavigationMenuLink>
                            <NavigationMenuLink>
                                <div className="w-72 typeset typeset-docs">
                                    <h3 className="font-bold text-purple">Contact</h3>
                                    <p className="font-titillium-web">Sometimes, you just want a chat.</p>
                                </div>
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Applications</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink render={<Link href="https://j2live.dingo.foo" />}>
                                <div className="flex items-center justify-around gap-4">
                                    <div className="flex flex-col w-72 typeset typeset-docs">
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