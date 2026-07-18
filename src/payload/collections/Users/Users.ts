import { CollectionConfig } from "payload";

const Users: CollectionConfig = {
    slug: "users",
    auth: true, // Enables authentication for the Admin Panel
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true
        }
    ]
}

export default Users