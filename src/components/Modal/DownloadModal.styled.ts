import { Box, emotionStyled as styled } from 'decentraland-ui2'

import Paragraph from '../../components/Text/Paragraph'
import Title from '../Text/Title'

export const StyledTitle = styled(Title)({
  '&.dg.Title': {
    fontSize: '21px',
    fontWeight: 600,
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.43,
    letterSpacing: '0.3px',
    textAlign: 'center',
  },
})

export const StyledDescription = styled(Paragraph)({
  '&.dg.Paragraph': {
    fontSize: '17px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.53,
    letterSpacing: '-0.2px',
    textAlign: 'center',
  },
})

export const Content = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
})

export const ImageContainer = styled(Box)({
  '& img': {
    maxWidth: '100%',
    height: 'auto',
  },
})
