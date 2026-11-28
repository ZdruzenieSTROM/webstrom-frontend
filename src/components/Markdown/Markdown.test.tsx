import {describe, expect, it} from 'vitest'

import {renderWithProviders} from '@/utils/testUtils'

import {katexMacros} from './katexMacros'
import {Markdown} from './Markdown'

describe(Markdown, () => {
  it('should render the siunitx macros the seminars use', () => {
    const {container} = renderWithProviders(<Markdown content={String.raw`Obsah je $\SI{6}{\metre\squared}$.`} />)

    expect(container.querySelector('.katex-error')).toBeNull()
    expect(container.querySelector('.katex-html')?.textContent).toBe('6m2')
  })

  it(String.raw`should not let a \gdef in one text change the shared macros`, () => {
    renderWithProviders(<Markdown content={String.raw`$\gdef\foo{X}\foo$`} />)

    expect(Object.keys(katexMacros)).not.toContain(String.raw`\foo`)
  })
})
