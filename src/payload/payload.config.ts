import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { buildConfig } from 'payload'
import Projects from './collections/Projects/Projects'
import Users from './collections/Users/Users'
import Images from './collections/SiteMedia/Images/Images'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
    collections: [
        Projects,
        Images,
        Users
    ],
    db: vercelPostgresAdapter({
        pool: {
            connectionString: process.env.POSTGRES_URL || '',
        },
    }),
    editor: lexicalEditor({}),
    plugins: [
        vercelBlobStorage({
            enabled: true,
            collections: {
                images: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN || '',
        }),
    ],
    secret: process.env.PAYLOAD_SECRET || '',
    sharp,
})