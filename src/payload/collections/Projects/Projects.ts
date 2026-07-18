import { CollectionConfig } from "payload";
import { slugify } from "payload/shared";

const Projects: CollectionConfig = {
    slug: "projects",
    labels: {
        singular: "Project",
        plural: "Projects"
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
            name: "content",
            label: "Content",
            type: "richText"
        }
    ],
    hooks: {
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