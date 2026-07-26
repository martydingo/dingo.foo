import autoTag from "@/payload/hooks/autoTag";
import { convertLexicalToMarkdown, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { CollectionConfig } from "payload";
import { array, slugify } from "payload/shared";
import config from '@payload-config'
import { GoogleGenAI } from "@google/genai";

const Projects: CollectionConfig = {
    slug: "projects",
    labels: {
        singular: "Project",
        plural: "Projects"
    },
    admin: {
        group: "Content"
    },
    fields: [
        {
            name: "id",
            type: "text",
            required: true,
            unique: true,
            admin: {
                // Optional: hide it from the edit form since it's derived from title
                readOnly: true,
                position: "sidebar",
                hidden: true
            },
        },
        {
            name: 'title',
            label: "Title",
            type: "text"
        },
        {
            name: "date",
            label: "Date",
            type: "date"
        },
        {
            name: "image",
            label: "Image",
            type: "upload",
            relationTo: "images"
        },
        {
            name: "category",
            label: "Category",
            type: "text"
        },
        {
            name: "summary",
            label: "Summary",
            type: "textarea"
        },
        {
            name: "icons",
            label: "Icons",
            type: "array",
            fields: [
                {
                    name: "icon",
                    label: "Icon Name",
                    type: "text"
                }
            ]
        },
        {
            name: "tags",
            label: "Tags",
            type: "array",
            fields: [
                {
                    name: "tag",
                    label: "Tag",
                    type: "text"
                }
            ]
        },
        {
            name: "content",
            label: "Content",
            type: "richText"
        }
    ],
    hooks: {
        beforeChange: [
            async ({ data, req }) => {

                const payloadConfig = await config
                const content: SerializedEditorState = data.content
                const markdown = convertLexicalToMarkdown({
                    data: content,
                    editorConfig: await editorConfigFactory.default({
                        config: payloadConfig, // <= make sure you have access to your Payload Config
                    })
                })

                const ai = new GoogleGenAI({ apiKey: process.env["GOOGLE_GEMINI_API_KEY"] })

                if (data.tags.length === 0) {
                    const autoTagResult = await ai.interactions.create({
                        model: "gemini-3.6-flash",
                        input: `Return ONLY a JSON array of 5-10 lowercase kebab-case tags for this content: ${markdown}`,
                    })

                    const parsedTagArray: string[] = JSON.parse(autoTagResult.output_text!)
                    const tags = parsedTagArray.map((tag) => { return { tag: tag } })

                    data.tags = tags
                }

                if (!data.category) {
                    const autoCategoryResult = await ai.interactions.create({
                        model: "gemini-3.6-flash",
                        input: `Return ONLY a single word that denotes the category for this content: ${markdown}`,
                    })
                    data.category = autoCategoryResult.output_text
                }

                if (!data.summary) {

                    const autoSummaryResult = await ai.interactions.create({
                        model: "gemini-3.6-flash",
                        input: `Return a brief summary, three lines MAXIMUM, that summarises this content: ${markdown}`,
                    })
                    data.summary = autoSummaryResult.output_text
                }

                return data
            }
        ],
        beforeValidate: [
            ({ data }) => {
                if (data?.title && !data.id) {
                    data.id = slugify(data.title);
                }
                return data;
            },
        ],
    },
}

export default Projects