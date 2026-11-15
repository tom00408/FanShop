import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Image, Flex, Skeleton } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiPackage, FiMapPin, FiMail, FiHeart } from 'react-icons/fi'
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore'
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

// ─── Hero ─────────────────────────────────────────────────────────────────

const HeroSection = () => (
  <Box minH="100vh" position="relative" overflow="hidden" display="flex" alignItems="center" justifyContent="center" bg="#080001">
    <Box position="absolute" inset={0} bgGradient="linear(160deg, #080001 0%, #2d0008 35%, #7B1B2B 65%, #E30613 100%)" />
    <motion.div style={{ position: 'absolute', top: '8%', right: '6%', width: 520, height: 520, background: 'radial-gradient(circle, rgba(227,6,19,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.div style={{ position: 'absolute', bottom: '12%', left: '4%', width: 360, height: 360, background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}
      animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }} />
    <Box position="absolute" inset={0} opacity={0.04} pointerEvents="none"
      backgroundImage="radial-gradient(circle, white 1.5px, transparent 1.5px)" backgroundSize="40px 40px" />

    <Container maxW="900px" position="relative" zIndex={1} px={6} textAlign="center">
      <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.14 } } }}>
        <motion.div variants={{ hidden: { opacity: 0, scale: 0.7 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22,1,0.36,1] } } }}>
          <Image src={logo} alt="MTV Geismar" h={{ base: '72px', md: '96px' }} bg="white" borderRadius="full" p="8px" mx="auto" mb={6}
            boxShadow="0 0 0 3px rgba(255,255,255,0.15), 0 8px 40px rgba(0,0,0,0.5)" />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }}>
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.25em" textTransform="uppercase" color="rgba(255,255,255,0.45)" mb={3}>Offizieller Fan-Shop</Text>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } } }}>
          <Heading fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }} fontWeight="900" color="white" lineHeight="0.95" letterSpacing="-0.02em" mb={2}>MTV</Heading>
          <Heading fontSize={{ base: '5xl', md: '7xl', lg: '8xl' }} fontWeight="900" lineHeight="0.95" letterSpacing="-0.02em" mb={8}
            bgGradient="linear(90deg, #ff8fa0, white, #ffccd3)" bgClip="text">GEISMAR</Heading>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } }}>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="rgba(255,255,255,0.65)" mb={10} maxW="500px" mx="auto" lineHeight="1.7">
            Dein Verein. Dein Stil. Exklusive Artikel für echte Fans.
          </Text>
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
          <RouterLink to="/shop">
            <MotionBox as="span" display="inline-flex" alignItems="center" gap={2} bg="white" color="#E30613"
              px={8} py={4} borderRadius="full" fontWeight="800" fontSize="md"
              boxShadow="0 4px 24px rgba(0,0,0,0.4)"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 36px rgba(0,0,0,0.5)' }}
              whileTap={{ scale: 0.97 }} cursor="pointer">
              Shop entdecken <FiArrowRight />
            </MotionBox>
          </RouterLink>
        </motion.div>
      </motion.div>
    </Container>

    <Box position="absolute" bottom={8} left="50%" transform="translateX(-50%)">
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Text fontSize="10px" fontWeight="700" letterSpacing="0.2em" color="rgba(255,255,255,0.3)" textTransform="uppercase">Scroll</Text>
        <Box w="1px" h="32px" bg="linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" />
      </motion.div>
    </Box>
  </Box>
)

// ─── Services bar ──────────────────────────────────────────────────────────

const services = [
  { icon: FiPackage, title: 'Qualitätsartikel', desc: 'Offizielles Vereinsmaterial' },
  { icon: FiMapPin, title: 'Abholung vor Ort', desc: 'Beim MTV Geismar abholen' },
  { icon: FiMail, title: 'Rechnung per E-Mail', desc: 'PDF sofort nach Bestellung' },
  { icon: FiHeart, title: 'Für alle Fans', desc: 'Mitglieder & Unterstützer' },
]

const ServicesBar = () => (
  <Box bg="white" py={{ base: 10, md: 14 }} borderBottom="1px solid" borderColor="gray.100">
    <Container maxW="1100px" px={6}>
      <Flex justify="space-around" flexWrap="wrap" gap={6}>
        {services.map(({ icon: Icon, title, desc }, i) => (
          <MotionBox key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} textAlign="center" flex="1" minW="140px">
            <Box w={12} h={12} bg="rgba(227,6,19,0.08)" color="#E30613" borderRadius="xl"
              display="flex" alignItems="center" justifyContent="center" mx="auto" mb={3}>
              <Icon size={22} />
            </Box>
            <Text fontWeight="800" fontSize="sm" color="gray.900" mb={1}>{title}</Text>
            <Text fontSize="xs" color="gray.500">{desc}</Text>
          </MotionBox>
        ))}
      </Flex>
    </Container>
  </Box>
)

// ─── Latest Products ────────────────────────────────────────────────────────

const ProductCard = ({ product, index }: { product: FeaturedProduct; index: number }) => (
  <MotionBox
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.45, delay: index * 0.08 }}
    whileHover={{ y: -6 }}
    flex="1"
    minW={{ base: '160px', md: '200px' }}
    maxW={{ base: '200px', md: '260px' }}
  >
    <RouterLink to={`/produkt/${product.id}`}>
      <Box
        bg="white" borderRadius="2xl" overflow="hidden"
        boxShadow="0 2px 16px rgba(0,0,0,0.06)" border="1px solid rgba(0,0,0,0.05)"
        transition="box-shadow 0.25s"
        _hover={{ boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
        cursor="pointer"
      >
        <Box h={{ base: '160px', md: '200px' }} bg="gray.50" overflow="hidden">
          {product.imageLoading ? (
            <Skeleton h="100%" />
          ) : product.image ? (
            <Image src={product.image} alt={product.name} w="100%" h="100%" objectFit="cover"
              transition="transform 0.4s" _hover={{ transform: 'scale(1.06)' }} />
          ) : (
            <Flex h="100%" align="center" justify="center">
              <Text color="gray.300" fontSize="xs">Kein Bild</Text>
            </Flex>
          )}
        </Box>
        <Box p={4}>
          <Text fontWeight="800" fontSize="sm" color="gray.900" noOfLines={1} mb={1}>{product.name}</Text>
          <Flex align="center" justify="space-between">
            <Text color="#E30613" fontWeight="900" fontSize="md">€{product.price.toFixed(2)}</Text>
            <Text fontSize="xs" fontWeight="700" color="gray.400">Details →</Text>
          </Flex>
        </Box>
      </Box>
    </RouterLink>
  </MotionBox>
)

const LatestProductsSection = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch4 = async () => {
      try {
        // Try ordering by createdAt, fall back to plain limit
        let snap
        try {
          snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4)))
        } catch {
          snap = await getDocs(query(collection(db, 'products'), limit(4)))
        }
        const initial = snap.docs.map(d => ({
          id: d.id, name: d.data().name, price: d.data().price, image: '', imageLoading: true,
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
      } catch { setLoading(false) }
    }
    fetch4()
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <Box bg="#f5f5f5" py={{ base: 14, md: 20 }}>
      <Container maxW="1200px" px={6}>
        <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} mb={10}>
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={2}>Neueste Artikel</Text>
          <Flex justify="space-between" align="flex-end" flexWrap="wrap" gap={3}>
            <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">Neu im Shop</Heading>
            <RouterLink to="/shop">
              <Text fontSize="sm" fontWeight="700" color="#E30613" display="flex" alignItems="center" gap={1}>
                Alle ansehen <FiArrowRight size={14} />
              </Text>
            </RouterLink>
          </Flex>
        </MotionBox>
        {loading ? (
          <Flex gap={5} flexWrap="wrap">
            {[1,2,3,4].map(i => (
              <Box key={i} flex="1" minW="160px" maxW="260px" bg="white" borderRadius="2xl" overflow="hidden">
                <Skeleton h="200px" />
                <Box p={4}><Skeleton h="16px" mb={2} /><Skeleton h="14px" w="60%" /></Box>
              </Box>
            ))}
          </Flex>
        ) : (
          <Flex gap={5} flexWrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </Flex>
        )}
      </Container>
    </Box>
  )
}

// ─── Editorial Gallery ─────────────────────────────────────────────────────

const EditorialGallery = () => (
  <Box>

    {/* Block 1: Full-bleed image, text overlay left */}
    <MotionBox
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }}
      position="relative" h={{ base: '60vh', md: '85vh' }} overflow="hidden"
    >
      <Image src="/gallery/1.jpg" alt="Unser Verein" w="100%" h="100%" objectFit="cover"
        style={{ transformOrigin: 'center center' }} />
      <Box position="absolute" inset={0}
        bgGradient="linear(to-r, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)" />
      <Container maxW="1200px" position="absolute" inset={0} px={8} display="flex" alignItems="flex-end" pb={{ base: 10, md: 16 }}>
        <MotionBox initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.2 }} maxW="520px">
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.2em" textTransform="uppercase"
            color="rgba(255,255,255,0.55)" mb={3}>Unser Verein</Text>
          <Heading fontSize={{ base: '3xl', md: '5xl' }} fontWeight="900" color="white" lineHeight="1.1" mb={4}>
            Für alle, die für<br />MTV Geismar brennen.
          </Heading>
          <Text fontSize={{ base: 'sm', md: 'md' }} color="rgba(255,255,255,0.7)" lineHeight="1.8">
            Seit Generationen vereint der MTV Geismar Menschen durch Sport, Leidenschaft und Gemeinschaft.
          </Text>
        </MotionBox>
      </Container>
    </MotionBox>

    {/* Block 2: 60/40 image left + dark text panel right */}
    <Flex direction={{ base: 'column', md: 'row' }} minH={{ base: 'auto', md: '520px' }}>
      <MotionBox
        initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        w={{ base: '100%', md: '60%' }} h={{ base: '280px', md: 'auto' }} overflow="hidden" flexShrink={0}
      >
        <Image src="/gallery/2.jpg" alt="Mannschaft" w="100%" h="100%" objectFit="cover"
          transition="transform 0.6s" _hover={{ transform: 'scale(1.04)' }} />
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        flex={1} bg="gray.900" display="flex" alignItems="center" px={{ base: 8, md: 14 }} py={{ base: 10, md: 0 }}
      >
        <Box>
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.2em" textTransform="uppercase" color="#E30613" mb={4}>
            Gemeinschaft
          </Text>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="white" lineHeight="1.2" mb={5}>
            Zusammen<br />stark.
          </Heading>
          <Text fontSize="md" color="rgba(255,255,255,0.6)" lineHeight="1.85" mb={8} maxW="360px">
            Im Team erreicht man mehr als alleine. Der MTV Geismar steht für Zusammenhalt auf und neben dem Spielfeld.
          </Text>
          <RouterLink to="/shop">
            <MotionBox as="span" display="inline-flex" alignItems="center" gap={2}
              border="2px solid rgba(255,255,255,0.3)" color="white"
              px={6} py={3} borderRadius="full" fontWeight="700" fontSize="sm"
              whileHover={{ borderColor: 'white', bg: 'rgba(255,255,255,0.08)' }}
              transition={{ duration: 0.2 }} cursor="pointer">
              Jetzt einkaufen <FiArrowRight size={14} />
            </MotionBox>
          </RouterLink>
        </Box>
      </MotionBox>
    </Flex>

    {/* Block 3: Red text panel left + 60% image right */}
    <Flex direction={{ base: 'column-reverse', md: 'row' }} minH={{ base: 'auto', md: '480px' }}>
      <MotionBox
        initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        flex={1} bg="linear-gradient(135deg, #E30613 0%, #7B1B2B 100%)"
        display="flex" alignItems="center" px={{ base: 8, md: 14 }} py={{ base: 10, md: 0 }}
      >
        <Box>
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.2em" textTransform="uppercase"
            color="rgba(255,255,255,0.6)" mb={4}>Sport & Training</Text>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="white" lineHeight="1.2" mb={5}>
            Sport verbindet<br />Menschen.
          </Heading>
          <Text fontSize="md" color="rgba(255,255,255,0.75)" lineHeight="1.85" maxW="340px">
            Vom Breitensport bis zur Spitzenleistung — beim MTV Geismar findet jeder seinen Platz.
          </Text>
        </Box>
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        w={{ base: '100%', md: '60%' }} h={{ base: '280px', md: 'auto' }} overflow="hidden" flexShrink={0}
      >
        <Image src="/gallery/3.jpg" alt="Training" w="100%" h="100%" objectFit="cover"
          transition="transform 0.6s" _hover={{ transform: 'scale(1.04)' }} />
      </MotionBox>
    </Flex>

    {/* Block 4: Two equal images with caption bar */}
    <Box>
      <Flex>
        <MotionBox
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55 }}
          flex={1} h={{ base: '200px', md: '420px' }} overflow="hidden"
        >
          <Image src="/gallery/4.jpg" alt="Vereinsleben" w="100%" h="100%" objectFit="cover"
            transition="transform 0.5s" _hover={{ transform: 'scale(1.04)' }} />
        </MotionBox>
        <MotionBox
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
          flex={1} h={{ base: '200px', md: '420px' }} overflow="hidden"
        >
          <Image src="/gallery/1.jpeg" alt="Pokal" w="100%" h="100%" objectFit="cover"
            transition="transform 0.5s" _hover={{ transform: 'scale(1.04)' }} />
        </MotionBox>
      </Flex>
      <MotionBox
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        bg="#111" py={{ base: 6, md: 10 }} px={8} textAlign="center"
      >
        <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="900" color="white" letterSpacing="-0.01em">
          Momente die bleiben —{' '}
          <Text as="span" color="#E30613">bei MTV Geismar.</Text>
        </Text>
      </MotionBox>
    </Box>

    {/* Block 5: Full-bleed final image + CTA */}
    <MotionBox
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }}
      position="relative" h={{ base: '50vh', md: '70vh' }} overflow="hidden"
    >
      <Image src="/gallery/2.jpeg" alt="Siegesfeier" w="100%" h="100%" objectFit="cover" />
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.55)" />
      <Flex position="absolute" inset={0} align="center" justify="center" direction="column" textAlign="center" gap={6} px={6}>
        <MotionBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.2 }}>
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.25em" textTransform="uppercase"
            color="rgba(255,255,255,0.5)" mb={4}>Fan-Shop</Text>
          <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="900" color="white" mb={6}>
            Zeig deine Farben.
          </Heading>
          <RouterLink to="/shop">
            <MotionBox as="span" display="inline-flex" alignItems="center" gap={2}
              bg="white" color="#E30613" px={8} py={4} borderRadius="full"
              fontWeight="800" fontSize="md" boxShadow="0 4px 24px rgba(0,0,0,0.4)"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} cursor="pointer">
              Zum Fan-Shop <FiArrowRight />
            </MotionBox>
          </RouterLink>
        </MotionBox>
      </Flex>
    </MotionBox>
  </Box>
)

// ─── Rundschau ──────────────────────────────────────────────────────────────

const RundschauSection = () => (
  <Box bg="#f5f5f5" py={{ base: 16, md: 24 }}>
    <Container maxW="700px" px={6}>
      <MotionBox
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        bg="white" borderRadius="2xl" p={{ base: 8, md: 12 }}
        boxShadow="0 8px 40px rgba(0,0,0,0.07)" textAlign="center"
        border="1px solid rgba(0,0,0,0.05)"
      >
        <Text fontSize="4xl" mb={4}>📖</Text>
        <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="900" color="gray.900" mb={4}>MTV Geismar Rundschau</Heading>
        <Text fontSize="md" color="gray.500" lineHeight="1.8" mb={8} maxW="480px" mx="auto">
          Bleiben Sie auf dem Laufenden — aktuelle Vereinsnachrichten, Turniere und das Leben beim MTV Geismar.
        </Text>
        <a href="https://rundschau.mtvgeismar.de" target="_blank" rel="noreferrer">
          <MotionBox as="span" display="inline-flex" alignItems="center" gap={2}
            bg="linear-gradient(135deg, #E30613, #7B1B2B)" color="white"
            px={8} py={4} borderRadius="full" fontWeight="800" fontSize="md"
            boxShadow="0 6px 24px rgba(227,6,19,0.3)"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 32px rgba(227,6,19,0.4)' }}
            whileTap={{ scale: 0.97 }} cursor="pointer">
            Zur Rundschau <FiArrowRight />
          </MotionBox>
        </a>
      </MotionBox>
    </Container>
  </Box>
)

// ─── Main ───────────────────────────────────────────────────────────────────

const Home = () => (
  <Box>
    <HeroSection />
    <ServicesBar />
    <LatestProductsSection />
    <EditorialGallery />
    <RundschauSection />
  </Box>
)

export default Home
