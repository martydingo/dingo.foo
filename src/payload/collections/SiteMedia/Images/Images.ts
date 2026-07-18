import { CollectionConfig } from "payload";
import { slugify } from "payload/shared";

const Images: CollectionConfig = {
    slug: "images",
    admin: {
        group: "Site Media"
    },
    labels: {
        singular: "Image",
        plural: "Images"
    },
    upload: {
        disableLocalStorage: true,
        mimeTypes: ["image/*"]
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
            name: 'alt-text',
            label: "Alt Text",
            type: 'text',
            required: true
        },
    ],
    hooks: {
        beforeValidate: [
            ({ data }) => {
                if (data?.['alt-text'] && !data.id) {
                    data.id = slugify(data['alt-text']);
                }
                return data;
            },
        ],
    },
}

export default Images