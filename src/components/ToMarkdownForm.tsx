"use client";

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

// async function onSubmit(event: any) {
//     "use server"
//     const markdownTitle = event.target[0].value
//     const markdownContent = event.target[1].value
//     event.preventDefault()
// }

export default function ToMarkdownForm({ submitFunction }: { submitFunction: any }) {
    return (
        <form onSubmit={submitFunction}>
            <FieldGroup>
                <Field>
                    <FieldLabel className="text-lg" htmlFor='blog-title'>Blog Title</FieldLabel>
                    <Input
                        id="blog-title" type='text'
                    />
                    <FieldDescription className="text-sm">Enter the title of the blog post created already in Payload</FieldDescription>
                </Field>
                <div />
                <Field>
                    <FieldLabel className="text-lg" htmlFor='blog-markdown'>Blog Markdown</FieldLabel>
                    <Textarea
                        id="blog-markdown"
                        rows={50}
                    />
                    <FieldDescription className="text-sm">
                        Enter the markdown of the blog post to be converted into Lexical Nodes
                        <br />
                        {'Note: Replace media links from ![alt] (url) with ![media:<id>]()'}
                    </FieldDescription>
                </Field>
                <Field>
                    <Button className="text-lg" type="submit" size="lg" variant="ghost">Submit</Button>
                </Field>
            </FieldGroup>
            <div className="py-4" />
        </form>
    )

}