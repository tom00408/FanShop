import { Box, Container, Heading, Text, Image, SimpleGrid, Flex, Stack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiShoppingBag, FiUsers } from 'react-icons/fi'
import type { IconType } from 'react-icons'

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

const steps = [
  {
    no: '01',
    title: 'Artikel entdecken',
    text: 'Stöbere durch unsere Kollektion an Trikots, Fanartikeln und Vereinsbekleidung.',
    img: '/gallery/1.jpeg',
  },
  {
    no: '02',
    title: 'In den Warenkorb',
    text: 'Wähle Größe und Menge und lege deine Lieblingsstücke einfach in den Warenkorb.',
    img: '/gallery/3.jpg',
  },
  {
    no: '03',
    title: 'Bequem bestellen',
    text: 'Gib deine Daten ein und schließe die Bestellung in wenigen Schritten ab.',
    img: '/gallery/2.jpeg',
  },
  {
    no: '04',
    title: 'Vereinsfarben tragen',
    text: 'Erhalte deine Artikel und zeig stolz, für welchen Verein dein Herz schlägt.',
    img: '/gallery/4.jpg',
  },
]

const benefits = [
  'Offizielle Artikel direkt vom MTV Geismar',
  'Hochwertige Qualität für Spieler und Fans',
  'Faire Preise und einfache Bestellung',
  'Jeder Kauf unterstützt den Verein',
  'Trikots, Fanartikel und mehr an einem Ort',
]

const audiences: { icon: IconType; title: string; text: string; to: string; cta: string }[] = [
  {
    icon: FiShoppingBag,
    title: 'Spieler & Mitglieder',
    text: 'Hol dir deine offizielle Ausstattung und repräsentiere den Verein bei jedem Spiel.',
    to: '/shop',
    cta: 'Zum Shop',
  },
  {
    icon: FiUsers,
    title: 'Fans & Familie',
    text: 'Zeig deine Verbundenheit mit Fanartikeln für die ganze Familie und feure das Team an.',
    to: '/shop',
    cta: 'Fanartikel ansehen',
  },
]

const Home = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #E30613 0%, #7B1B2B 100%)"
        minH={{ base: '82vh', md: '88vh' }}
        display="flex"
        alignItems="center"
      >
        <Box
          position="absolute"
          inset={0}
          opacity={0.06}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="36px 36px"
          pointerEvents="none"
        />
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
              maxW="820px"
            >
              Zeig deine Vereinsfarben.
              <Box as="span" display="block" opacity={0.9} fontSize={{ base: '2xl', md: '4xl', lg: '5xl' }}>
                Der MTV Geismar Fan-Shop
              </Box>
            </MotionHeading>

            <MotionText
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              fontSize={{ base: 'md', md: 'xl' }}
              color="rgba(255,255,255,0.85)"
              maxW="600px"
              lineHeight="1.7"
            >
              Trikots, Fanartikel und Vereinsbekleidung – alles an einem Ort. Mit jedem Kauf
              unterstützt du deinen Verein direkt.
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

              <a href="https://rundschau.mtvgeismar.de" target="_blank" rel="noreferrer">
                <MotionBox
                  as="span"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  bg="rgba(255,255,255,0.12)"
                  color="white"
                  px={8}
                  py={4}
                  borderRadius="full"
                  fontWeight="800"
                  fontSize="md"
                  border="1px solid rgba(255,255,255,0.3)"
                  whileHover={{ scale: 1.05, bg: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  cursor="pointer"
                >
                  Zur Rundschau
                </MotionBox>
              </a>
            </MotionBox>
          </Flex>
        </Container>

        <Box position="absolute" bottom={0} left={0} right={0}>
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 64L1440 64L1440 32C1080 0 360 64 0 32L0 64Z" fill="white" />
          </svg>
        </Box>
      </Box>

      {/* So funktioniert es */}
      <Box py={20} bg="white">
        <Container maxW="1200px" px={6}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={14}
          >
            <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={3}>
              So funktioniert es
            </Text>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
              In vier Schritten zum Fan-Outfit
            </Heading>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            {steps.map((step, i) => (
              <MotionBox
                key={step.no}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                borderRadius="2xl"
                overflow="hidden"
                bg="white"
                boxShadow="0 4px 24px rgba(0,0,0,0.07)"
                border="1px solid rgba(0,0,0,0.05)"
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.14)' }}
              >
                <Box position="relative" h="180px" overflow="hidden">
                  <Image src={step.img} alt={step.title} w="100%" h="100%" objectFit="cover" loading="lazy" />
                  <Box
                    position="absolute"
                    top={4}
                    left={4}
                    bg="rgba(227,6,19,0.95)"
                    color="white"
                    borderRadius="lg"
                    px={3}
                    py={1}
                    fontSize="sm"
                    fontWeight="900"
                  >
                    {step.no}
                  </Box>
                </Box>
                <Box p={6}>
                  <Heading fontSize="lg" fontWeight="800" color="gray.900" mb={2}>
                    {step.title}
                  </Heading>
                  <Text fontSize="sm" color="gray.500" lineHeight="1.7">
                    {step.text}
                  </Text>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Warum / Vorteile */}
      <Box py={20} bg="#f7f7f7">
        <Container maxW="1200px" px={6}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="0 12px 48px rgba(0,0,0,0.12)"
            >
              <Image src="/gallery/2.jpg" alt="MTV Geismar" w="100%" h={{ base: '280px', md: '440px' }} objectFit="cover" loading="lazy" />
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={3}>
                Warum bei uns
              </Text>
              <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900" mb={6}>
                Mehr als nur ein Shop
              </Heading>
              <Stack spacing={4}>
                {benefits.map((b) => (
                  <Flex key={b} align="center" gap={3}>
                    <Box
                      flexShrink={0}
                      w={7}
                      h={7}
                      borderRadius="full"
                      bg="linear-gradient(135deg, #E30613, #7B1B2B)"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FiCheck size={15} strokeWidth={3} />
                    </Box>
                    <Text fontSize="md" color="gray.700" fontWeight="600">
                      {b}
                    </Text>
                  </Flex>
                ))}
              </Stack>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Für wen */}
      <Box py={20} bg="white">
        <Container maxW="1100px" px={6}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={14}
          >
            <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={3}>
              Für wen?
            </Text>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
              Für alle, die Geismar leben
            </Heading>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            {audiences.map((a, i) => (
              <MotionBox
                key={a.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                bg="white"
                borderRadius="2xl"
                p={{ base: 8, md: 10 }}
                boxShadow="0 8px 40px rgba(0,0,0,0.07)"
                border="1px solid rgba(0,0,0,0.05)"
                whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.13)' }}
              >
                <Box
                  w={14}
                  h={14}
                  bg="linear-gradient(135deg, #E30613, #7B1B2B)"
                  borderRadius="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={6}
                  color="white"
                >
                  <a.icon size={26} />
                </Box>
                <Heading fontSize="xl" fontWeight="900" color="gray.900" mb={3}>
                  {a.title}
                </Heading>
                <Text fontSize="md" color="gray.500" lineHeight="1.8" mb={6}>
                  {a.text}
                </Text>
                <RouterLink to={a.to}>
                  <MotionBox
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap={2}
                    color="#E30613"
                    fontWeight="800"
                    fontSize="md"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    cursor="pointer"
                  >
                    {a.cta} →
                  </MotionBox>
                </RouterLink>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA */}
      <Box bg="linear-gradient(135deg, #E30613 0%, #7B1B2B 100%)" py={{ base: 16, md: 24 }} position="relative" overflow="hidden">
        <Box
          position="absolute"
          inset={0}
          opacity={0.06}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="36px 36px"
          pointerEvents="none"
        />
        <Container maxW="800px" px={6} position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            textAlign="center"
          >
            <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color="white" mb={5} lineHeight="1.2">
              Werde Teil der Geismar-Familie.
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(255,255,255,0.85)" lineHeight="1.8" mb={8} maxW="560px" mx="auto">
              Entdecke jetzt unsere komplette Kollektion und zeig der Welt, für welchen Verein dein Herz schlägt.
            </Text>
            <RouterLink to="/shop">
              <MotionBox
                as="span"
                display="inline-flex"
                alignItems="center"
                gap={2}
                bg="white"
                color="#E30613"
                px={10}
                py={4}
                borderRadius="full"
                fontWeight="800"
                fontSize="md"
                boxShadow="0 8px 32px rgba(0,0,0,0.25)"
                whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                cursor="pointer"
              >
                Jetzt einkaufen →
              </MotionBox>
            </RouterLink>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="#111" py={8}>
        <Container maxW="1200px" px={6}>
          <Text textAlign="center" color="gray.600" fontSize="sm">
            © {new Date().getFullYear()} MTV Geismar e.V. — Alle Rechte vorbehalten
          </Text>
          <Text textAlign="center" color="gray.700" fontSize="xs" mt={2}>
            {import.meta.env.VITE_APP_VERSION}
          </Text>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
