import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Select,
  Skeleton,
  useToast,
  Badge,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { db, storage } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { FiSearch, FiChevronLeft, FiChevronRight, FiShoppingCart, FiCheck, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const MotionBox = motion(Box as any)

interface Product {
  id: string
  name: string
  price: number
  image: string
  imageBack?: string
  size?: string[]
  category?: string
  hasName?: boolean
  hasNumber?: boolean
  hasInitials?: boolean
  imageLoading?: boolean
  imageBackLoading?: boolean
}

const ProductSkeleton = () => (
  <Box borderRadius="2xl" overflow="hidden" bg="white" boxShadow="0 2px 12px rgba(0,0,0,0.06)">
    <Skeleton height="280px" />
    <Box p={5}>
      <Skeleton height="20px" mb={2} />
      <Skeleton height="16px" width="40%" mb={4} />
      <Skeleton height="40px" />
    </Box>
  </Box>
)

const CategoryPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <Box
    as="button"
    onClick={onClick}
    px={4}
    py={2}
    borderRadius="full"
    fontSize="sm"
    fontWeight="700"
    transition="all 0.2s"
    bg={active ? '#E30613' : 'gray.100'}
    color={active ? 'white' : 'gray.600'}
    border="1px solid"
    borderColor={active ? '#E30613' : 'transparent'}
    _hover={{ bg: active ? '#7B1B2B' : 'gray.200' }}
  >
    {label}
  </Box>
)

const ProductCard = ({ product }: { product: Product }) => {
  const [activeImage, setActiveImage] = useState<'front' | 'back'>('front')
  const [selectedSize, setSelectedSize] = useState('')
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')
  const [customInitials, setCustomInitials] = useState('')
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const isDisabled =
    (!!product.size?.length && !selectedSize) ||
    (!!product.hasName && !customName) ||
    (!!product.hasNumber && !customNumber)

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      size: selectedSize,
      customName,
      customNumber,
      customInitials,
      price: product.price + (customInitials ? 3.5 : 0),
    })
    setAdded(true)
    toast({
      title: 'Zum Warenkorb hinzugefügt',
      status: 'success',
      duration: 2000,
      isClosable: true,
      position: 'bottom-right',
    })
    setTimeout(() => setAdded(false), 2000)
  }

  const showingBack = activeImage === 'back' && !!product.imageBack

  return (
    <MotionBox
      borderRadius="2xl"
      overflow="hidden"
      bg="white"
      boxShadow="0 2px 16px rgba(0,0,0,0.06)"
      border="1px solid rgba(0,0,0,0.05)"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      display="flex"
      flexDirection="column"
    >
      {/* Image area */}
      <Box
        position="relative"
        h="280px"
        bg="gray.50"
        overflow="hidden"
        cursor="pointer"
        onClick={() => navigate(`/produkt/${product.id}`)}
      >
        {product.imageLoading ? (
          <Skeleton height="100%" />
        ) : product.image ? (
          <>
            <motion.div
              style={{ width: '100%', height: '100%' }}
              key={showingBack ? 'back' : 'front'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={showingBack ? product.imageBack : product.image}
                alt={product.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </motion.div>
            {product.imageBack && (
              <Flex position="absolute" bottom={3} right={3} gap={1}>
                <Box
                  as="button"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); setActiveImage('front') }}
                  bg={activeImage === 'front' ? '#E30613' : 'rgba(255,255,255,0.9)'}
                  color={activeImage === 'front' ? 'white' : 'gray.700'}
                  borderRadius="full"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.1)' }}
                >
                  <FiChevronLeft size={16} />
                </Box>
                <Box
                  as="button"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); setActiveImage('back') }}
                  bg={activeImage === 'back' ? '#E30613' : 'rgba(255,255,255,0.9)'}
                  color={activeImage === 'back' ? 'white' : 'gray.700'}
                  borderRadius="full"
                  w="32px"
                  h="32px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                  transition="all 0.2s"
                  _hover={{ transform: 'scale(1.1)' }}
                >
                  <FiChevronRight size={16} />
                </Box>
              </Flex>
            )}
          </>
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Text color="gray.400" fontSize="sm">Kein Bild</Text>
          </Flex>
        )}

        {product.category && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            bg="rgba(0,0,0,0.6)"
            color="white"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
            fontWeight="700"
            backdropFilter="blur(4px)"
          >
            {product.category}
          </Badge>
        )}
      </Box>

      {/* Info */}
      <Box p={5} display="flex" flexDirection="column" flex={1}>
        <Flex justify="space-between" align="center" mb={1}>
          <Heading size="sm" color="gray.900" fontWeight="800">{product.name}</Heading>
          <Text
            fontSize="xs"
            fontWeight="700"
            color="gray.400"
            cursor="pointer"
            _hover={{ color: '#E30613' }}
            transition="color 0.2s"
            flexShrink={0}
            ml={2}
            onClick={() => navigate(`/produkt/${product.id}`)}
          >
            Details →
          </Text>
        </Flex>
        <Text color="#E30613" fontWeight="800" fontSize="lg" mb={4}>
          €{product.price.toFixed(2)}
          {!!customInitials && (
            <Text as="span" fontSize="xs" color="gray.500" fontWeight="500" ml={1}>+€3,50 Initialen</Text>
          )}
        </Text>

        <Box flex={1} display="flex" flexDirection="column" gap={2}>
          {product.size && product.size.length > 0 && (
            <Select
              placeholder="Größe wählen"
              size="sm"
              borderRadius="lg"
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              borderColor="gray.200"
              _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
            >
              {[...new Set(product.size)].map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          )}
          {product.hasName && (
            <Input
              size="sm"
              placeholder="Name eingeben"
              borderRadius="lg"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              borderColor="gray.200"
              _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
            />
          )}
          {product.hasNumber && (
            <Input
              size="sm"
              placeholder="Nummer eingeben"
              borderRadius="lg"
              value={customNumber}
              onChange={e => setCustomNumber(e.target.value)}
              borderColor="gray.200"
              _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
            />
          )}
          {product.hasInitials && (
            <Input
              size="sm"
              placeholder="Initialen (max. 2 Zeichen)"
              borderRadius="lg"
              value={customInitials}
              onChange={e => e.target.value.length <= 2 && setCustomInitials(e.target.value)}
              maxLength={2}
              borderColor="gray.200"
              _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
            />
          )}
        </Box>

        <Button
          mt={4}
          width="full"
          borderRadius="xl"
          size="md"
          bg={added ? '#22c55e' : '#E30613'}
          color="white"
          fontWeight="700"
          isDisabled={isDisabled}
          onClick={handleAddToCart}
          transition="all 0.25s"
          _hover={{ bg: added ? '#16a34a' : '#7B1B2B', transform: 'translateY(-1px)' }}
          _active={{ transform: 'translateY(0)' }}
          leftIcon={added ? <FiCheck /> : <FiShoppingCart />}
          _disabled={{ opacity: 0.4, cursor: 'not-allowed', transform: 'none' }}
        >
          {added ? 'Hinzugefügt!' : 'In den Warenkorb'}
        </Button>
      </Box>
    </MotionBox>
  )
}

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name'

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('default')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'products'))
      const loadedProducts: Product[] = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          name: data.name,
          price: data.price,
          image: '',
          imageBack: '',
          imageLoading: true,
          imageBackLoading: !!data.imagepath_back,
          size: data.size || [],
          category: data.category || '',
          hasName: data.hasName || false,
          hasNumber: data.hasNumber || false,
          hasInitials: data.hasInitials || false,
        }
      })
      setProducts(loadedProducts)
      setLoading(false)

      querySnapshot.docs.forEach(async (docSnap, index) => {
        const data = docSnap.data()
        const product = loadedProducts[index]

        if (data.imagepath) {
          try {
            const url = await getDownloadURL(ref(storage, data.imagepath))
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, image: url, imageLoading: false } : p))
          } catch {
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageLoading: false } : p))
          }
        } else {
          setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageLoading: false } : p))
        }

        if (data.imagepath_back) {
          try {
            const url = await getDownloadURL(ref(storage, data.imagepath_back))
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageBack: url, imageBackLoading: false } : p))
          } catch {
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageBackLoading: false } : p))
          }
        }
      })
    }
    fetchProducts()
  }, [])

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCat = !selectedCategory || p.category === selectedCategory
      return matchSearch && matchCat
    })
    .sort((a, b) => {
      if (sortKey === 'price-asc') return a.price - b.price
      if (sortKey === 'price-desc') return b.price - a.price
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  const hasFilter = !!searchTerm || !!selectedCategory

  return (
    <Box minH="90vh" bg="#f5f5f5">
      {/* Gradient header */}
      <Box
        position="relative"
        overflow="hidden"
        bg="linear-gradient(135deg, #E30613 0%, #7B1B2B 100%)"
        pt={{ base: 12, md: 16 }}
        pb={{ base: 16, md: 20 }}
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
          top="-100px"
          right="-100px"
          w="380px"
          h="380px"
          borderRadius="full"
          bg="rgba(255,255,255,0.05)"
          pointerEvents="none"
        />
        <Container maxW="1200px" px={5} position="relative" zIndex={1}>
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="rgba(255,255,255,0.8)" mb={2}>
              Offizieller Fan-Shop
            </Text>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight="900" color="white" mb={3}>
              Unsere Kollektion
            </Heading>
            <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(255,255,255,0.85)" maxW="520px" lineHeight="1.7">
              Trikots, Fanartikel und Vereinsbekleidung – such dir deine Lieblingsstücke aus.
            </Text>
          </MotionBox>
        </Container>
      </Box>

      <Container maxW="1200px" px={5} pb={16} mt={{ base: -10, md: -12 }} position="relative" zIndex={2}>
        {/* Filter bar */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          bg="white"
          borderRadius="2xl"
          p={{ base: 4, md: 5 }}
          mb={6}
          boxShadow="0 8px 32px rgba(0,0,0,0.08)"
        >
          <Flex gap={3} flexWrap="wrap" mb={categories.length > 0 ? 4 : 0}>
            <InputGroup flex={1} minW="200px">
              <InputLeftElement pointerEvents="none" h="full" pl={3}>
                <FiSearch color="#9ca3af" />
              </InputLeftElement>
              <Input
                placeholder="Produkte suchen..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
                pl="40px"
              />
            </InputGroup>
            <Select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as SortKey)}
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              maxW={{ base: 'full', sm: '220px' }}
              _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
            >
              <option value="default">Empfohlen</option>
              <option value="price-asc">Preis aufsteigend</option>
              <option value="price-desc">Preis absteigend</option>
              <option value="name">Name (A–Z)</option>
            </Select>
          </Flex>

          {categories.length > 0 && (
            <Flex gap={2} flexWrap="wrap" align="center">
              <CategoryPill
                label="Alle"
                active={!selectedCategory}
                onClick={() => setSelectedCategory('')}
              />
              {categories.map(cat => (
                <CategoryPill
                  key={cat}
                  label={cat as string}
                  active={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat as string)}
                />
              ))}
            </Flex>
          )}
        </MotionBox>

        {/* Result count */}
        {!loading && (
          <Flex justify="space-between" align="center" mb={5} px={1} flexWrap="wrap" gap={2}>
            <Text fontSize="sm" color="gray.500" fontWeight="600">
              {filtered.length} {filtered.length === 1 ? 'Artikel' : 'Artikel'} gefunden
            </Text>
            {hasFilter && (
              <Box
                as="button"
                onClick={() => { setSearchTerm(''); setSelectedCategory('') }}
                display="inline-flex"
                alignItems="center"
                gap={1}
                fontSize="sm"
                fontWeight="700"
                color="#E30613"
                _hover={{ textDecoration: 'underline' }}
              >
                <FiX size={14} /> Filter zurücksetzen
              </Box>
            )}
          </Flex>
        )}

        {/* Product grid */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
            {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
          </SimpleGrid>
        ) : filtered.length === 0 ? (
          <Box textAlign="center" py={20} bg="white" borderRadius="2xl" boxShadow="0 2px 12px rgba(0,0,0,0.05)">
            <Text fontSize="lg" color="gray.400" mb={2}>Keine Produkte gefunden.</Text>
            {hasFilter && (
              <Box
                as="button"
                onClick={() => { setSearchTerm(''); setSelectedCategory('') }}
                fontSize="sm"
                fontWeight="700"
                color="#E30613"
                _hover={{ textDecoration: 'underline' }}
              >
                Filter zurücksetzen
              </Box>
            )}
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
            <AnimatePresence>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}

export default Shop
