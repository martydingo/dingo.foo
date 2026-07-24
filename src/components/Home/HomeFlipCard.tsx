'use client';

import { useCallback, useEffect, useState } from "react";
import { TextFlippingBoard } from "../ui/text-flipping-board";

export default function HomeFlipCard({ heroMessages }: { heroMessages: string[] }) {
    const [msgIdx, setMsgIdx] = useState(0);

    const next = useCallback(
        () => setMsgIdx((i) => (i + 1) % heroMessages.length),
        [],
    );

    useEffect(() => {
        const id = setInterval(next, 6000);
        return () => clearInterval(id);
    }, [next]);


    return (
        <TextFlippingBoard text={heroMessages[msgIdx]} />

    )
}