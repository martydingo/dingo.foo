'use client'

import { DefaultNodeTypes } from "@payloadcms/richtext-lexical"
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical"
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react"
import { MermaidPreview } from "./mermaidcn/mermaid-preview"
import { Mermaid } from "./mermaidcn/mermaid"
import { useState } from "react"
import mermaidConfig from "./mermaidcn/mermaid-config"

type NodeTypes =
    | DefaultNodeTypes

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({
    defaultConverters,
}) => ({
    ...defaultConverters,
    blocks: {
        // Each key should match your block's slug
        Mermaid: ({ node }: { node: any }) => {
            const [svg, setSvg] = useState("")
            return <MermaidPreview className="h-180 mt-8" chart={node.fields.diagramCode} config={mermaidConfig}
                svgOutput={svg}
                onSvgOutputChange={setSvg} />
        },
        Code: ({ node }: { node: any }) => <div>{node.fields.code}</div>,
    },
})

export default function Content({ content }: { content: SerializedEditorState }) {

    return <RichText converters={jsxConverters} data={content} />
}