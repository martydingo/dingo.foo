import { CollectionConfig } from "payload";
import { array, slugify } from "payload/shared";

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