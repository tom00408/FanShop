import { Box, Container, Heading, Text, Image, SimpleGrid, Flex } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const MotionBox = motion(Box as any)
const MotionHeading = motion(Heading as any)
const MotionText = motion(Text as any)

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const galleryImages = [
  { src: '/gallery/1.jpg', alt: 'Team Foto' },
  { src: '/gallery/2.jpg', alt: 'Training' },
  { src: '/gallery/3.jpg', alt: 'Vereinsevent' },
  { src: '/gallery/4.jpg', alt: 'Pokalübergabe' },
  { src: '/gallery/1.jpeg', alt: 'Mannschaft' },
  { src: '/gallery/2.jpeg', alt: 'Siegesfeier' },
]

const Home = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #E30613 0%, #7B1B2B 100%)"
        minH={{ base: '80vh', md: '88vh' }}
        display="flex"
        alignItems="center"
      >
        {/* Background pattern */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.06}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="36px 36px"
          pointerEvents="none"
        />
        {/* Decorative circles */}
        <Box
          position="absolute"
          top="-120px"
          right="-120px"
          w="480px"
          h="480px"
          borderRadius="full"
          bg="rgba(255,255,255,0.05)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-80px"
          left="-80px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="rgba(255,255,255,0.04)"
          pointerEvents="none"
        />

        <Container maxW="1100px" position="relative" zIndex={1} px={6}>
          <Flex direction="column" align="center" textAlign="center" gap={6}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              bg="rgba(255,255,255,0.12)"
              color="white"
              borderRadius="full"
              px={5}
              py={2}
              fontSize="sm"
              fontWeight="700"
              letterSpacing="0.1em"
              textTransform="uppercase"
              border="1px solid rgba(255,255,255,0.2)"
              display="inline-block"
            >
              Offizieller Fan-Shop
            </MotionBox>

            <MotionHeading
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="900"
              color="white"
              lineHeight="1.1"
              maxW="800px"
            >
              MTV Geismar
              <Box as="span" display="block" opacity={0.9} fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}>
                Fan-Shop
              </Box>
            </MotionHeading>

            <MotionText
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              fontSize={{ base: 'md', md: 'xl' }}
              color="rgba(255,255,255,0.85)"
              maxW="560px"
              lineHeight="1.7"
            >
              Entdecken Sie unsere exklusive Kollektion an Artikeln für Ihren Lieblingsverein!
            </MotionText>

            <MotionBox
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              display="flex"
              gap={4}
              flexWrap="wrap"
              justifyContent="center"
            >
              <RouterLink to="/shop">
                <MotionBox
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  bg="white"
                  color="#E30613"
                  px={8}
                  py={4}
                  borderRadius="full"
                  fontWeight="800"
                  fontSize="md"
                  boxShadow="0 8px 32px rgba(0,0,0,0.2)"
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  cursor="pointer"
                >
                  Jetzt einkaufen →
                </MotionBox>
              </RouterLink>
            </MotionBox>
          </Flex>
        </Container>

        {/* Bottom wave */}
        <Box position="absolute" bottom={0} left={0} right={0}>
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 64L1440 64L1440 32C1080 0 360 64 0 32L0 64Z" fill="white" />
          </svg>
        </Box>
      </Box>

      {/* Gallery */}
      <Box py={20} bg="white">
        <Container maxW="1200px" px={6}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={12}
          >
            <Text
              fontSize="xs"
              fontWeight="800"
              letterSpacing="0.15em"
              textTransform="uppercase"
              color="#E30613"
              mb={3}
            >
              Unser Verein
            </Text>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
              Momente die bleiben
            </Heading>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={5}>
            {galleryImages.map((img, i) => (
              <MotionBox
                key={img.src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.14)' }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  w="100%"
                  h="260px"
                  objectFit="cover"
                  loading="lazy"
                  transition="transform 0.4s ease"
                  _hover={{ transform: 'scale(1.04)' }}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Rundschau CTA */}
      <Box bg="#f7f7f7" py={20}>
        <Container maxW="800px" px={6}>
          <MotionBox
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            bg="white"
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            boxShadow="0 8px 40px rgba(0,0,0,0.07)"
            textAlign="center"
            border="1px solid rgba(0,0,0,0.05)"
          >
            <Box
              w={14}
              h={14}
              bg="linear-gradient(135deg, #E30613, #7B1B2B)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={6}
              fontSize="2xl"
            >
              📖
            </Box>
            <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color="gray.900" mb={4}>
              MTV Geismar Rundschau
            </Heading>
            <Text fontSize="md" color="gray.500" lineHeight="1.8" mb={8} maxW="480px" mx="auto">
              Bleiben Sie auf dem Laufenden mit unserer Vereinszeitschrift. Aktuelle Ereignisse, Turniere und das lebendige Vereinsleben.
            </Text>
            <a href="https://rundschau.mtvgeismar.de" target="_blank" rel="noreferrer">
              <MotionBox
                as="span"
                display="inline-flex"
                alignItems="center"
                gap={2}
                bg="linear-gradient(135deg, #E30613, #7B1B2B)"
                color="white"
                px={8}
                py={4}
                borderRadius="full"
                fontWeight="800"
                fontSize="md"
                boxShadow="0 6px 24px rgba(227,6,19,0.3)"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 32px rgba(227,6,19,0.4)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                cursor="pointer"
              >
                Zur Rundschau →
              </MotionBox>
            </a>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="#111" py={8}>
        <Container maxW="1200px" px={6}>
          <Text textAlign="center" color="gray.600" fontSize="sm">
            © {new Date().getFullYear()} MTV Geismar e.V. — Alle Rechte vorbehalten
          </Text>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
