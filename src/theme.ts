// theme.ts
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    primary: {
      500: '#E30613',
      600: '#7B1B2B',
      100: '#F6B6B6',
    },
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      500: '#A0A0A0',
    },
  },
  fonts: {
    heading: 'Montserrat, Arial, sans-serif',
    body: 'Montserrat, Arial, sans-serif',
    mono: 'Menlo, monospace',
  },
  fontWeights: {
    normal: 400,
    bold: 700,
    extrabold: 900,
  },
})

export default theme
