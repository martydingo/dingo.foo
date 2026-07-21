'use client'

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
  CodeBlock
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import {
  convertLexicalToHTML,
  type HTMLConvertersFunction,
} from '@payloadcms/richtext-lexical/html'
import React from 'react'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<typeof CodeBlock>

const htmlConverters: HTMLConvertersFunction<NodeTypes> = ({
  defaultConverters,
}) => ({
  ...defaultConverters,
  blocks: {
    // Each key should match your block's slug
    Code: ({ node }) =>
      `<pre id="${node.fields.blockName}" class="${node.fields.language}"><code>${node.fields.code}</code></pre>`,
  },
  inlineBlocks: {

  },
})

export default htmlConverters