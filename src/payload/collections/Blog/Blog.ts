import { CollectionConfig } from "payload";
import { slugify } from "payload/shared";
import config from '@payload-config'
import { GoogleGenAI } from "@google/genai";
import { convertLexicalToMarkdown, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import fs from "node:fs"

const Blog: CollectionConfig = {
    slug: "blog",
    admin: {
        group: "Content"
    },
    labels: {
        singular: "Blog Post",
        plural: "Blog Posts"
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


                if (!data.image) {
                    const promptData = {
                        prompt: `Create a preview image suitable for use on a blog for a post with the following title ${data.title}, and the following content: ${markdown}\nDo NOT generate text on the image.`,
                        num_steps: 4,
                        height: 1024,
                        width: 1024
                    }
                    // You can choose models like 'flux' or 'turbo' directly in the URL
                    // const url = 'https://gateway.pixazo.ai/getImage/v1/getSDXLImage';
                    const url = 'https://gateway.pixazo.ai/flux-1-schnell/v1/getData';
                    const headers = {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                        'Ocp-Apim-Subscription-Key': process.env.PIXAZO_API_KEY!
                    };

                    try {
                        const genResponse = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(promptData) })
                        if (!genResponse.ok) throw new Error(`HTTP error! status: ${await genResponse.text()}`);
                        const fetchUrl = await genResponse.json()
                        // const fetchResponse = await fetch(fetchUrl.imageUrl)
                        const fetchResponse = await fetch(fetchUrl.output)
                        const arrayBuffer = await fetchResponse.arrayBuffer();
                        const imgFile = Buffer.from(arrayBuffer);

                        // fs.writeFileSync('./preview_image.png', buffer);

                        data.image = imgFile

                        const imgMeta = await req.payload.create({
                            collection: "images",
                            data: {
                                "alt-text": `${data.title} Preview Image`
                            },
                            file: {
                                data: imgFile,
                                mimetype: 'image/png',
                                name: slugify(`${data.title} Preview Image`)!,
                                size: imgFile.length
                            },
                            req
                        })

                        data.image = imgMeta.id

                    } catch (error) {
                        console.error('Download failed:', error);
                    }
                    // const imgFile = fs.readFileSync("./preview_image.png")


                    console.log(data)
                    // const autoImageResult = await ai.interactions.create({
                    //     model: "gemini-2.5-flash-image",
                    //     input: `Create a preview image for the following content ${markdown}`
                    // })

                    // const previewImage = autoImageResult.output_image

                    // // 2. Extract the base64 data from the result object
                    // const base64Data = autoImageResult.output_image.data;

                    // // 3. Convert the base64 string into a Buffer
                    // const imageBuffer = Buffer.from(base64Data, 'base64');

                    // // 4. Save the file to your local disk
                    // fs.writeFileSync('./preview_image.png', imageBuffer);

                    // await fs.writeFile(`${data.title}-preview-image.png`, previewImage, (err) => console.log(err))
                    // if (previewImage) {
                    //     data.image = previewImage
                    // }
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

export default Blog