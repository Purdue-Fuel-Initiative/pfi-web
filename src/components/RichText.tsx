import React from 'react'
import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
})

export function RichText({ content }: { content: any }) {
  if (!content) return null
  return <PayloadRichText converters={converters} data={content} />
}
