import { CollectionConfig } from "payload";
import { slugify } from "payload/shared";

const HomeConfig: CollectionConfig = {
    slug: "home-config",
    admin: {
        group: "Configuration"
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
            name: "name",
            label: "Name",
            type: "text"
        },
        {
            name: "hero-messages",
            label: "Home Hero Messages",
            type: "array",
            fields: [
                {
                    name: "message",
                    label: "Message",
                    type: "text",
                }
            ]
        }
    ],
    hooks: {
        beforeValidate: [
            ({ data }) => {
                if (data?.['name'] && !data.id) {
                    data.id = slugify(data['name']);
                }
                return data;
            },
        ],
    },
}

export default HomeConfig