import { CollectionConfig } from "payload";

const Users: CollectionConfig = {
    slug: "users",
    auth: true, // Enables authentication for the Admin Panel
    admin: {
        useAsTitle: 'name',
        group: "Users"
    },
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true
        },
        {
            name: "profile-picture",
            label: "Profile Picture",
            type: "upload",
            relationTo: "images"
        },
        {
            name: "socials",
            label: "Socials",
            type: "array",
            fields: [
                {
                    name: "icon",
                    label: "Icon",
                    type: "text",
                },
                {
                    name: "title",
                    label: "Title",
                    type: "text",
                },
                {
                    name: "handle",
                    label: "Handle",
                    type: "text",
                },
            ]
        },
        {
            name: "summary",
            label: "Summary",
            type: "textarea",
        },
        {
            name: "history",
            label: "History",
            type: "array",
            fields: [
                {
                    name: "year",
                    label: "Year",
                    type: "number",
                },
                {
                    name: "content",
                    label: "Content",
                    type: "richText",
                },
            ]
        }
    ]
}

export default Users