'use client'

import "iconify-icon";
import Link from "next/link";
import { Backlight } from "../ui/backlight";

export default function Socials({ socials }: {
    socials: {
        icon?: string | null | undefined;
        title?: string | null | undefined;
        handle?: string | null | undefined;
        id?: string | null | undefined;
    }[]
}) {
    return (<div className="w-full">
        <p>Here are some of my social contact points!</p>
        <div className="flex flex-col gap-4 pt-8 justify-center">
            {socials.map((socialEntry) => {
                let handleIsHyperlink = false
                if (socialEntry.handle?.includes("http")) {
                    handleIsHyperlink = true
                }
                return (<div key={socialEntry.id}>
                    {handleIsHyperlink ?
                        <Link className="flex gap-2 items-center justify-center" href={socialEntry.handle!}>
                            <Backlight blur={5}>
                                <iconify-icon style={{ fontSize: 48 }} icon={socialEntry.icon!} />
                            </Backlight>
                            <p className="pb-5">{socialEntry.title}</p>
                        </Link>
                        : <>
                            <Backlight blur={5}>
                                <iconify-icon style={{ fontSize: 48 }} icon={socialEntry.icon!} />
                            </Backlight>
                            <p>{socialEntry.title}</p>
                        </>
                    }
                </div>)
            })}
        </div>
    </div>)
}