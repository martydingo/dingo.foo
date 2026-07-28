"use client";

"use client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { Separator } from "../ui/separator";

const siteNavLinks: { [key: string]: { link: string, name: string, description: string, img?: string }[] } = {
    "Site Navigation": [
        {
            link: "/projects",
            name: "Projects",
            description: "A collection of things I've created, written, contributed to, or worked on. Or things I've simply just broke.",
            img: "/api/images/file/icon-projects.svg"
        },
        {
            link: "/blog",
            name: "Blog",
            description: "Some of my more technical scribblings and scratchings, which are definitely still scribbles and scratches.",
            img: "/api/images/file/icon-blog.svg"
        },
        {
            link: "/about",
            name: "About",
            description: "Want to know more about me, my professional experiences and or my contributions? Or you just want to get in touch? Figure that out all here!",
            img: "/api/images/file/icon-about.svg"
        },
        {
            link: "/admin",
            name: "Admin",
            description: "You know, there needs to be some way to add content to this site",
            img: "/api/images/file/icon-admin.svg"
        }
    ],
    "Applications": [
        {
            link: "https://j2live.dingo.foo",
            name: "J2Live",
            description: "J2Live is a web-based application that allows users to edit and render Jinja2 templates using YAML variables in real-time, using the Ansible templating engine.",
            img: "/api/images/file/j2live_logo_square_halcyon.svg"
        }
    ]
}

export default function NavBar({ siteLogoUri }: { siteLogoUri?: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [active, setActive] = useState<string | null>(null);

    return (
        <div className="relative w-full pt-4">
            <Navbar setActive={setActive}>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo siteLogoUri={siteLogoUri!} />
                    <NavItems items={siteNavLinks} active={active} setActive={setActive} />
                    <div className="flex items-center gap-4">
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo siteLogoUri={siteLogoUri!} />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {Object.entries(siteNavLinks).map(([navCategory, navItems], idx) => (
                            <div>
                                <p className="text-base font-semibold font-serif">{navCategory}</p>
                                {idx !== Object.keys(siteNavLinks).length && <Separator className="my-1 bg-primary w-full" />}

                                {navItems.map((item) => (
                                    <a
                                        key={`mobile-link-${idx}`}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="relative text-base indent-4 font-sans hover:text-primary/80"
                                    >
                                        <span className="block">{item.name}</span>
                                    </a>
                                ))
                                }
                            </div>
                        ))}
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>

            {/* Navbar */}
        </div>
    )
}