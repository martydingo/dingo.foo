import sharp from 'sharp'
import { lexicalEditor, BlocksFeature, CodeBlock, EXPERIMENTAL_TableFeature } from '@payloadcms/richtext-lexical'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { buildConfig } from 'payload'
import Projects from './collections/Projects/Projects'
import Users from './collections/Users/Users'
import Images from './collections/SiteMedia/Images/Images'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import Blog from './collections/Blog/Blog'
import MermaidBlock from './blocks/MermaidBlock'
import HomeConfig from './collections/SiteMedia/Home/Home'


export default buildConfig({
    collections: [
        Blog,
        Projects,
        Images,
        HomeConfig,
        Users,
    ],
    db: vercelPostgresAdapter({
        pool: {
            connectionString: process.env.POSTGRES_URL || '',
        },
    }),
    editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
            ...defaultFeatures,
            EXPERIMENTAL_TableFeature(),
            BlocksFeature({
                blocks: [
                    CodeBlock(),
                    MermaidBlock
                ]
            }),
        ]
    }),
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