import { Box, Container, Flex, Text, Image } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiRotateCcw } from 'react-icons/fi'
import logo from '../assets/logo.png'

const Footer = () => (
  <Box bg="#080001" py={10}>
    <Container maxW="1200px" px={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={6}>
        <Flex align="center" gap={3}>
          <Image src={logo} h="36px" bg="white" borderRadius="full" p="4px" opacity={0.8} />
          <Text color="rgba(255,255,255,0.4)" fontSize="sm" fontWeight="600">MTV Geismar e.V.</Text>
        </Flex>

        <Box
          as={RouterLink}
          to="/widerruf"
          display="inline-flex"
          alignItems="center"
          gap={2}
          bg="rgba(255,255,255,0.08)"
          color="white"
          border="1px solid rgba(255,255,255,0.18)"
          borderRadius="full"
          px={5}
          py={2.5}
          fontSize="sm"
          fontWeight="700"
          transition="all 0.2s"
          _hover={{ bg: '#E30613', borderColor: '#E30613' }}
        >
          <FiRotateCcw size={15} /> Vertrag widerrufen
        </Box>

        <Flex direction="column" align={{ base: 'flex-start', sm: 'flex-end' }} gap={1}>
          <Text color="rgba(255,255,255,0.25)" fontSize="xs">
            © {new Date().getFullYear()} MTV Geismar — Alle Rechte vorbehalten
          </Text>
          <Text color="rgba(255,255,255,0.2)" fontSize="xs">
            {import.meta.env.VITE_APP_VERSION}
          </Text>
        </Flex>
      </Flex>
    </Container>
  </Box>
)

export default Footer
