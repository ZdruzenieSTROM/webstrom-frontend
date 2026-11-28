import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {AdminContext, Form} from 'react-admin'
import {describe, expect, it, vi} from 'vitest'

import {SolutionScoreInput} from './SolutionScoreInput'

const submitScore = (value: string) => {
  const onSubmit = vi.fn()
  render(
    <AdminContext>
      <Form noValidate defaultValues={{score: 1}} onSubmit={onSubmit}>
        <SolutionScoreInput />
        <button type="submit">Uložiť</button>
      </Form>
    </AdminContext>,
  )

  fireEvent.change(screen.getByRole('spinbutton'), {target: {value}})
  fireEvent.click(screen.getByRole('button', {name: 'Uložiť'}))
  return onSubmit
}

describe(SolutionScoreInput, () => {
  it.each(['-10', '10', '1.5'])('rejects a score of %s', async (value) => {
    const onSubmit = submitScore(value)

    expect(await screen.findByText('Zadaj celé číslo od -9 do 9.')).toBeVisible()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it.each([
    ['-9', -9],
    ['0', 0],
    ['9', 9],
    ['', null],
  ])('accepts a score of %j', async (value, score) => {
    const onSubmit = submitScore(value)

    await waitFor(() => expect(onSubmit.mock.calls[0]?.[0]).toStrictEqual({score}))
  })
})
