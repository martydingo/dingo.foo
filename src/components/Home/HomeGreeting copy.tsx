'use client'

import { GlyphMatrix } from "../ui/glyph-matrix"
import { KineticText } from "../ui/kinetic-text"
import { TextFlippingBoard } from "../ui/text-flipping-board"
import HomeFlipCard from "./HomeFlipCard"

export default function HomeGreeting({ heroMessages }: { heroMessages: string[] | undefined }) {

    return (
        <div className="flex items-center justify-between h-full min-h-[80vh] typeset typeset-doc">
            <div className="basis-1/2 flex flex-col items-start">
            </div>
            <div className="basis-1/2 flex flex-col items-start">
                <KineticText className="ml-16" text="Now Engineering" as="h1" />
                <HomeFlipCard heroMessages={heroMessages!} />
            </div>
            <div>
                {/* <NoiseTexture className="col-span-1 col-start-2 mask-[radial-gradient(420px_circle_at_center,white,transparent)]" /> */}
            </div>
        </div>
    )
}