import {fireEvent, render, screen} from '@testing-library/react'
import {AdminContext, Form, FormDataConsumer} from 'react-admin'
import {describe, expect, it} from 'vitest'

import {MyDateTimeInput} from './MyDateTimeInput'

describe(MyDateTimeInput, () => {
  it('should load, edit and store seconds', () => {
    render(
      <AdminContext>
        <Form record={{deadline: '2026-06-01T21:59:00Z'}}>
          <MyDateTimeInput source="deadline" label="Deadline" />
          <FormDataConsumer>
            {({formData}) => <div data-testid="value">{formData.deadline ?? ''}</div>}
          </FormDataConsumer>
        </Form>
      </AdminContext>,
    )

    const input = screen.getByLabelText('Deadline')
    expect(input).toHaveAttribute('step', '1')
    expect(input).toHaveValue('2026-06-01T23:59')

    fireEvent.change(input, {target: {value: '2026-06-01T23:59:59'}})
    expect(screen.getByTestId('value').textContent).toBe('2026-06-01T21:59:59.000Z')
  })
})
