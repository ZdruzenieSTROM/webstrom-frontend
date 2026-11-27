import {fireEvent, render, screen} from '@testing-library/react'
import {AdminContext, Form, FormDataConsumer} from 'react-admin'
import {describe, expect, it} from 'vitest'

import {myI18nProvider} from '../i18nProvider'
import {MyDateTimeSplitInput} from './MyDateTimeSplitInput'

const renderInput = (record?: {deadline: string}) =>
  render(
    <AdminContext i18nProvider={myI18nProvider}>
      <Form record={record}>
        <MyDateTimeSplitInput source="deadline" defaultTime="23:59:59" />
        <FormDataConsumer>{({formData}) => <div data-testid="value">{formData.deadline ?? ''}</div>}</FormDataConsumer>
      </Form>
    </AdminContext>,
  )

describe(MyDateTimeSplitInput, () => {
  it('should prefill default time with seconds and store it in UTC', () => {
    renderInput()

    const time = screen.getByLabelText('Čas')
    expect(time).toHaveValue('23:59:59')
    expect(time).toHaveAttribute('step', '1')

    fireEvent.change(screen.getByLabelText('Dátum'), {target: {value: '2026-01-15'}})
    expect(screen.getByTestId('value').textContent).toBe('2026-01-15T22:59:59.000Z')
  })

  it('should show seconds of an existing value', () => {
    renderInput({deadline: '2026-06-01T21:59:59Z'})

    expect(screen.getByLabelText('Dátum')).toHaveValue('2026-06-01')
    expect(screen.getByLabelText('Čas')).toHaveValue('23:59:59')
  })
})
