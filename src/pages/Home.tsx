import { Box, Container, Heading, Text, Image, Button, Stack, SimpleGrid } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'


const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="primary.500" color="white" py={20}>
        <Container maxW="1200px">
          <Stack spacing={6} align="center" textAlign="center">
            <Heading size="2xl">Willkommen im MTV Geismar Fan-Shop</Heading>
            <Text fontSize="xl">Entdecken Sie unsere exklusive Kollektion an Fanartikeln</Text>
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


    </Box>
  )
}

export default Home 