import {FC, useMemo} from 'react'
import {TextInput, TextInputProps, useTranslate} from 'react-admin'
import {useWatch} from 'react-hook-form'

import {findMarkdownLinks} from '@/utils/postMarkdown'

/**
 * TextInput that shows a non-blocking warning when the value contains a link.
 * Not a validation - the form can still be saved.
 */
export const LinkWarningTextInput: FC<TextInputProps> = ({source, helperText, sx, ...rest}) => {
  const translate = useTranslate()
  const value = useWatch({name: source}) as string | null | undefined
  const hasLink = useMemo(() => findMarkdownLinks(value ?? '').length > 0, [value])

  let shownHelperText: TextInputProps['helperText'] = helperText
  if (hasLink) {
    const linkWarning = translate('content.helpers.contains_link')
    const translatedHelperText = typeof helperText === 'string' ? translate(helperText, {_: helperText}) : helperText
    shownHelperText = translatedHelperText ? (
      <>
        {linkWarning}
        <br />
        {translatedHelperText}
      </>
    ) : (
      linkWarning
    )
  }

  return (
    <TextInput
      source={source}
      helperText={shownHelperText}
      // pri chybe validacie nechavame MUI cervenu farbu, warning je len oranzovy
      sx={[
        hasLink && {'& .MuiFormHelperText-root:not(.Mui-error)': {color: 'warning.main'}},
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  )
}
