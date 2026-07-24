"use client";

import { useState } from 'react';
import { codeToHtml } from 'shiki'

export default function Code({ code, language, theme }: { code: string, language: string, theme: any }) {
    const [html, setHtml] = useState("")
    const renderCodeHtml = async () => {
        const html = await codeToHtml(code, {
            lang: language,
            theme: "ayu-mirage"

        })
        setHtml(html)
    }

    Promise.resolve(renderCodeHtml())

    return <div className='max-w-4xl mx-auto py-2 text-wrap' dangerouslySetInnerHTML={{ "__html": html }} />
}