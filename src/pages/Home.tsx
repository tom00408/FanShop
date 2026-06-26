import { useState, useEffect } from 'react'
import {
  Box, Container, Heading, Text, Image, SimpleGrid, Flex, Skeleton, HStack,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiMapPin, FiMail, FiHeart, FiArrowRight } from 'react-icons/fi'
import { collection, getDocs, query, limit } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from '../firebase'
import logo from '../assets/logo.png'

const MotionBox = motion(Box as any)

interface FeaturedProduct {
  id: string
  name: string
  price: number
  image: string
  imageLoading: boolean
}

// ─── Hero ──────────────────────────────────────────────────────────────────

const HeroSection = () => (
  <Box
    minH="100vh"
    position="relative"
    overflow="hidden"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="#080001"
  >
    {/* Layered gradient */}
    <Box
      position="absolute"
      inset={0}
      bgGradient="linear(160deg, #080001 0%, #2d0008 35%, #7B1B2B 65%, #E30613 100%)"
    />

    {/* Floating blobs */}
    <motion.div
      style={{
        position: 'absolute', top: '8%', right: '6%',
        width: 520, height: 520,
        background: 'radial-gradient(circle, rgba(227,6,19,0.25) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      style={{
        position: 'absolute', bottom: '12%', left: '4%',
        width: 360, height: 360,
        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }}
      animate={{ scale: [1, 1.12, 1] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
    />
    <motion.div
      style={{
        position: 'absolute', top: '55%', right: '20%',
        width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }}
      animate={{ y: [0, -24, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
    />

    {/* Dot grid overlay */}
    <Box
      position="absolute" inset={0} opacity={0.04} pointerEvents="none"
      backgroundImage="radial-gradient(circle, white 1.5px, transparent 1.5px)"
      backgroundSize="40px 40px"
    />

    {/* Content */}
    <Container maxW="900px" position="relative" zIndex={1} px={6} textAlign="center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }}
        >
          <Image
            src={logo}
            alt="MTV Geismar"
            h={{ base: '72px', md: '96px' }}
            bg="white"
            borderRadius="full"
            p="8px"
            mx="auto"
            mb={6}
            boxShadow="0 0 0 3px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.5)"
          />
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4, delay: 0.1 } } }}
        >
          <Text
            fontSize="xs"
            fontWeight="800"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="rgba(255,255,255,0.45)"
            mb={3}
          >
            Offizieller Fan-Shop
          </Text>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } } }}
        >
          <Heading
            fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }}
            fontWeight="900"
            color="white"
            lineHeight="0.95"
            letterSpacing="-0.02em"
            mb={2}
          >
            MTV
          </Heading>
          <Heading
            fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }}
            fontWeight="900"
            lineHeight="0.95"
            letterSpacing="-0.02em"
            mb={8}
            bgGradient="linear(90deg, #ff8fa0, white, #ffccd3)"
            bgClip="text"
          >
            GEISMAR
          </Heading>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22,1,0.36,1] } } }}
        >
          <Text
            fontSize={{ base: 'md', md: 'xl' }}
            color="rgba(255,255,255,0.65)"
            mb={10}
            maxW="500px"
            mx="auto"
            lineHeight="1.7"
          >
            Dein Verein. Dein Stil. Exklusive Artikel für echte Fans.
          </Text>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
        >
          <Flex gap={4} justify="center" flexWrap="wrap">
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
                boxShadow="0 4px 24px rgba(0,0,0,0.4)"
                whileHover={{ scale: 1.05, boxShadow: '0 8px 36px rgba(0,0,0,0.5)' }}
                whileTap={{ scale: 0.97 }}
                cursor="pointer"
              >
                Shop entdecken <FiArrowRight />
              </MotionBox>
            </RouterLink>
          </Flex>
        </motion.div>
      </motion.div>
    </Container>

    {/* Scroll indicator */}
    <Box position="absolute" bottom={8} left="50%" transform="translateX(-50%)">
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      >
        <Text fontSize="10px" fontWeight="700" letterSpacing="0.2em" color="rgba(255,255,255,0.3)" textTransform="uppercase">
          Scroll
        </Text>
        <Box w="1px" h="32px" bg="linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" />
      </motion.div>
    </Box>
  </Box>
)

// ─── Services ─────────────────────────────────────────────────────────────

const services = [
  { icon: FiPackage, title: 'Qualitätsartikel', desc: 'Offizielles Vereinsmaterial' },
  { icon: FiMapPin, title: 'Abholung vor Ort', desc: 'Beim MTV Geismar abholen' },
  { icon: FiMail, title: 'Rechnung per E-Mail', desc: 'PDF sofort nach Bestellung' },
  { icon: FiHeart, title: 'Für alle Fans', desc: 'Mitglieder & Unterstützer' },
]

const ServicesBar = () => (
  <Box bg="white" py={{ base: 10, md: 14 }} borderBottom="1px solid" borderColor="gray.100">
    <Container maxW="1100px" px={6}>
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={6}>
        {services.map(({ icon: Icon, title, desc }, i) => (
          <MotionBox
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            textAlign="center"
            p={4}
          >
            <Box
              w={12}
              h={12}
              bg="rgba(227,6,19,0.08)"
              color="#E30613"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={3}
            >
              <Icon size={22} />
            </Box>
            <Text fontWeight="800" fontSize="sm" color="gray.900" mb={1}>{title}</Text>
            <Text fontSize="xs" color="gray.500">{desc}</Text>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
)

// ─── Featured Products ─────────────────────────────────────────────────────

const FeaturedCard = ({ product }: { product: FeaturedProduct }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45 }}
    bg="white"
    borderRadius="2xl"
    overflow="hidden"
    boxShadow="0 2px 16px rgba(0,0,0,0.06)"
    border="1px solid rgba(0,0,0,0.04)"
    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.1)' }}
  >
    <RouterLink to={`/produkt/${product.id}`}>
      <Box h="260px" bg="gray.50" overflow="hidden" cursor="pointer">
        {product.imageLoading ? (
          <Skeleton h="100%" />
        ) : product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            w="100%" h="100%"
            objectFit="cover"
            transition="transform 0.4s ease"
            _hover={{ transform: 'scale(1.06)' }}
          />
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Text color="gray.300" fontSize="sm">Kein Bild</Text>
          </Flex>
        )}
      </Box>
    </RouterLink>
    <Box p={5}>
      <Heading size="sm" fontWeight="800" color="gray.900" noOfLines={1} mb={1}>
        {product.name}
      </Heading>
      <Text color="#E30613" fontWeight="800" fontSize="lg" mb={4}>
        €{product.price.toFixed(2)}
      </Text>
      <RouterLink to={`/produkt/${product.id}`}>
        <Box
          display="inline-flex"
          alignItems="center"
          gap={2}
          fontSize="sm"
          fontWeight="700"
          color="#E30613"
          _hover={{ gap: '10px' }}
          transition="all 0.2s"
        >
          Ansehen <FiArrowRight size={14} />
        </Box>
      </RouterLink>
    </Box>
  </MotionBox>
)

const FeaturedSection = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch3 = async () => {
      try {
        const q = query(collection(db, 'products'), limit(3))
        const snap = await getDocs(q)
        const initial = snap.docs.map(d => ({
          id: d.id,
          name: d.data().name,
          price: d.data().price,
          image: '',
          imageLoading: true,
        }))
        setProducts(initial)
        setLoading(false)
        snap.docs.forEach(async (d, i) => {
          if (d.data().imagepath) {
            try {
              const url = await getDownloadURL(ref(storage, d.data().imagepath))
              setProducts(prev => prev.map((p, idx) => idx === i ? { ...p, image: url, imageLoading: false } : p))
            } catch {
              setProducts(prev => prev.map((p, idx) => idx === i ? { ...p, imageLoading: false } : p))
            }
          } else {
            setProducts(prev => prev.map((p, idx) => idx === i ? { ...p, imageLoading: false } : p))
          }
        })
      } catch {
        setLoading(false)
      }
    }
    fetch3()
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <Box bg="#f5f5f5" py={{ base: 14, md: 20 }}>
      <Container maxW="1100px" px={6}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          mb={10}
        >
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={2}>
            Jetzt erhältlich
          </Text>
          <Flex justify="space-between" align="flex-end" flexWrap="wrap" gap={3}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
              Ausgewählte Artikel
            </Heading>
            <RouterLink to="/shop">
              <Text fontSize="sm" fontWeight="700" color="#E30613" display="flex" alignItems="center" gap={1}>
                Alle ansehen <FiArrowRight size={14} />
              </Text>
            </RouterLink>
          </Flex>
        </MotionBox>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {[1,2,3].map(i => (
              <Box key={i} bg="white" borderRadius="2xl" overflow="hidden">
                <Skeleton h="260px" />
                <Box p={5}>
                  <Skeleton h="20px" mb={2} />
                  <Skeleton h="16px" w="40%" />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            {products.map(p => <FeaturedCard key={p.id} product={p} />)}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}

// ─── Gallery ───────────────────────────────────────────────────────────────

const galleryImages = [
  { src: '/gallery/1.jpg', alt: 'Team Foto' },
  { src: '/gallery/2.jpg', alt: 'Training' },
  { src: '/gallery/3.jpg', alt: 'Vereinsevent' },
  { src: '/gallery/4.jpg', alt: 'Pokalübergabe' },
  { src: '/gallery/1.jpeg', alt: 'Mannschaft' },
  { src: '/gallery/2.jpeg', alt: 'Siegesfeier' },
]

const GallerySection = () => (
  <Box bg="white" py={{ base: 14, md: 20 }}>
    <Container maxW="1200px" px={6}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        textAlign="center"
        mb={12}
      >
        <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={2}>
          Unser Verein
        </Text>
        <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
          Momente die bleiben
        </Heading>
      </MotionBox>

      <SimpleGrid columns={{ base: 2, md: 3 }} gap={{ base: 3, md: 5 }}>
        {galleryImages.map((img, i) => (
          <MotionBox
            key={img.src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="0 4px 16px rgba(0,0,0,0.07)"
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.13)' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              w="100%"
              h={{ base: '160px', md: '240px' }}
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
)

// ─── Rundschau ─────────────────────────────────────────────────────────────

const RundschauSection = () => (
  <Box
    position="relative"
    overflow="hidden"
    py={{ base: 16, md: 24 }}
    bg="linear-gradient(135deg, #0f0002 0%, #7B1B2B 50%, #E30613 100%)"
  >
    <Box
      position="absolute" inset={0} opacity={0.05} pointerEvents="none"
      backgroundImage="radial-gradient(circle, white 1.5px, transparent 1.5px)"
      backgroundSize="36px 36px"
    />
    <Container maxW="700px" px={6} position="relative" zIndex={1}>
      <MotionBox
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        bg="rgba(255,255,255,0.08)"
        backdropFilter="blur(16px)"
        border="1px solid rgba(255,255,255,0.15)"
        borderRadius="2xl"
        p={{ base: 8, md: 12 }}
        textAlign="center"
      >
        <Text fontSize="4xl" mb={4}>📖</Text>
        <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color="white" mb={4}>
          MTV Geismar Rundschau
        </Heading>
        <Text fontSize="md" color="rgba(255,255,255,0.7)" lineHeight="1.8" mb={8} maxW="480px" mx="auto">
          Bleiben Sie auf dem Laufenden — aktuelle Vereinsnachrichten, Turniere und das Leben beim MTV Geismar.
        </Text>
        <a href="https://rundschau.mtvgeismar.de" target="_blank" rel="noreferrer">
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
            boxShadow="0 4px 24px rgba(0,0,0,0.3)"
            whileHover={{ scale: 1.05, boxShadow: '0 8px 36px rgba(0,0,0,0.4)' }}
            whileTap={{ scale: 0.97 }}
            cursor="pointer"
          >
            Zur Rundschau <FiArrowRight />
          </MotionBox>
        </a>
      </MotionBox>
    </Container>
  </Box>
)

// ─── Footer ────────────────────────────────────────────────────────────────

const FooterSection = () => (
  <Box bg="#080001" py={10}>
    <Container maxW="1200px" px={6}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
        <HStack spacing={3}>
          <Image src={logo} h="36px" bg="white" borderRadius="full" p="4px" opacity={0.8} />
          <Text color="rgba(255,255,255,0.4)" fontSize="sm" fontWeight="600">
            MTV Geismar e.V.
          </Text>
        </HStack>
        <Text color="rgba(255,255,255,0.25)" fontSize="xs">
          © {new Date().getFullYear()} MTV Geismar — Alle Rechte vorbehalten
        </Text>
      </Flex>
    </Container>
  </Box>
)

// ─── Main ──────────────────────────────────────────────────────────────────

const Home = () => (
  <Box>
    <HeroSection />
    <ServicesBar />
    <FeaturedSection />
    <GallerySection />
    <RundschauSection />
    <FooterSection />
  </Box>
)

export default Home
