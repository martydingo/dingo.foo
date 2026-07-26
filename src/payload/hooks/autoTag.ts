import { GoogleGenAI } from "@google/genai"
import { convertLexicalToMarkdown, editorConfigFactory } from "@payloadcms/richtext-lexical"
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import config from '@payload-config'

export default async function autoTag(data: Partial<any>) {
    console.log("x")
    if (data.tags) return data
    const payloadConfig = await config
    const content: SerializedEditorState = data.content
    const markdown = convertLexicalToMarkdown({
        data: content,
        editorConfig: await editorConfigFactory.default({
            config: payloadConfig, // <= make sure you have access to your Payload Config
        })
    })
    console.log(markdown)
    const ai = new GoogleGenAI({ apiKey: process.env["GOOGLE_GEMINI_API_KEY"] })

    const autoTagResult = await ai.interactions.create({
        model: "gemini-3.6-flash",
        input: `Return ONLY a JSON array of 5-10 lowercase kebab-case tags for this content: ${markdown}`,
    })

    console.log(autoTagResult.output_text)
    data.tags = autoTagResult.output_text
    return data
} 