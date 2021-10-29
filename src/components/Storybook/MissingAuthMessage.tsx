import React from 'react'
import Blockquote from '../Text/Blockquote'
import Link from '../Text/Link'
import Paragraph from '../Text/Paragraph'

export default React.memo(function MissingAuthMessage() {
  return (
    <Blockquote>
      <Paragraph small secondary>
        This feature requires to login, try to connect using the{' '}
        <Link href="./?path=/story/hooks-useauth--page#connect-preview">
          `useAuth`
        </Link>{' '}
        hook.
      </Paragraph>
    </Blockquote>
  )
})
