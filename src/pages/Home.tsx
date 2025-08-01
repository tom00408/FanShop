import { Box, Container, Heading, Text, Image, Button, Stack, SimpleGrid } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'


const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="primary.500" color="white" py={20}>
        <Container maxW="1200px">
          <Stack spacing={6} align="center" textAlign="center">
            <Heading size="2xl">Willkommen im MTV Geismar Shop</Heading>
            <Text fontSize="xl">Entdecken Sie unsere exklusive Kollektion an Artikeln für Ihren Lieblingsverein!</Text>
            <Button
              as={RouterLink}
              to="/shop"
              size="lg"
              color="red"
              variant="solid"
              _hover={{ bg: 'gray',
                color: 'white',
                scale: 1.15,
                transition: 'all 0.3s ease'
               }}
              
            >
              Jetzt einkaufen
            </Button>
          </Stack>
        </Container>
      </Box>

   

      {/* Foto Galerie Section */}
      <Box py={16}>
        <Container maxW="1200px">
          <Stack spacing={8} align="center" textAlign="center" mb={12}>
            <Heading size="xl">Unser Verein</Heading>
          </Stack>
          
          <SimpleGrid columns={[1, 2, 3]} spacing={8}>
            <Box>
              <Image
                src="/gallery/1.jpg" 
                alt="Team Foto"
                borderRadius="lg"
                width="100%"
                height="300px"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            <Box>
              <Image
                src="/gallery/2.jpg"
                alt="Training Session" 
                borderRadius="lg"
                width="100%"
                height="300px"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            <Box>
              <Image
                src="/gallery/3.jpg"
                alt="Vereinsevent"
                borderRadius="lg" 
                width="100%"
                height="300px"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            <Box>
              <Image
                src="/gallery/4.jpg"
                alt="Pokalübergabe"
                borderRadius="lg"
                width="100%"
                height="300px"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            <Box>
              <Image
                src="/gallery/1.jpeg"
                alt="Mannschaftsfoto"
                borderRadius="lg"
                width="100%"
                height="300px"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
            <Box>
              <Image
                src="/gallery/2.jpeg"
                alt="Siegesfeier"
                borderRadius="lg"
                width="100%"
                height="300px"
                objectFit="cover"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.05)' }}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

                  {/* Rundschau Section */}
      <Box 
        bg="linear-gradient(135deg, primary.500 0%, primary.600 100%)" 
        py={20}
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      >
        <Container maxW="1200px" position="relative" zIndex={1}>
          <Stack spacing={8} align="center" textAlign="center">
            <Box
              bg="white"
              p={8}
              borderRadius="xl"
              boxShadow="0 20px 40px rgba(0,0,0,0.1)"
              transform="translateY(0)"
              transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              _hover={{
                transform: 'translateY(-8px)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
              }}
            >
              <Stack spacing={6}>
              
                
                <Heading 
                  size="xl" 
                  color="primary.600"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                >
                  MTV Geismar Rundschau
                </Heading>
                
                <Text 
                  fontSize="lg" 
                  color="gray.600"
                  maxW="600px"
                  lineHeight="tall"
                >
                  Bleiben Sie auf dem Laufenden mit unserer Vereinszeitschrift. Erfahren Sie mehr über aktuelle Ereignisse, Turniere und das lebendige Vereinsleben.
                </Text>
                
                <Button
                  as="a"
                  href="https://rundschau.mtvgeismar.de" 
                  target="_blank"
                  size="lg"
                  bg="primary.500"
                  color="white"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="full"
                  boxShadow="0 8px 16px rgba(227, 6, 19, 0.3)"
                  transition="all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  _hover={{
                    bg: 'primary.600',
                    transform: 'scale(1.05) translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(227, 6, 19, 0.4)',
                  }}
                  _active={{
                    transform: 'scale(0.95)',
                  }}
                >
                  📖 Hier gehts zur Rundschau
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </Box>


    </Box>
  )
}

export default Home 