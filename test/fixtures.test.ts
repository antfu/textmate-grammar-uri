import fs from 'node:fs/promises'
import { expect, it } from 'vitest'
import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'
import grammarUri from '../grammars/uri.json'

it('fixtures', async () => {
  const content = await fs.readFile(new URL('./uris.txt', import.meta.url), 'utf-8')

  const shiki = await getHighlighter({
    themes: [
      'vitesse-dark',
    ],
    langs: [
      grammarUri as any,
    ],
  })

  const html = shiki.codeToHtml(content, {
    lang: 'uri',
    theme: 'vitesse-dark',
  })

  expect(html)
    .toMatchFileSnapshot('./output/url.html')
})
