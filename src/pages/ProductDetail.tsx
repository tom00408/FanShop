import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box, Container, Flex, Heading, Text, Image, Button, Input,
  Skeleton, Badge, HStack, VStack, useToast,
} from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiArrowLeft, FiChevronRight, FiCheck } from 'react-icons/fi'
import { motion } from 'framer-motion'

const MotionBox = motion(Box as any)

interface Product {
  id: string
  name: string
  price: number
  image: string
  imageBack?: string
  imageLoading: boolean
  imageBackLoading: boolean
  size?: string[]
  category?: string
  hasName?: boolean
  hasNumber?: boolean
  hasInitials?: boolean
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const toast = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<'front' | 'back'>('front')
  const [selectedSize, setSelectedSize] = useState('')
  const [customName, setCustomName] = useState('')
  const [customNumber, setCustomNumber] = useState('')
  const [customInitials, setCustomInitials] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!id) return
      setLoading(true)
      try {
        const docRef = doc(db, 'products', id)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) { navigate('/shop'); return }
        const data = docSnap.data()
        const p: Product = {
          id: docSnap.id,
          name: data.name,
          price: data.price,
          image: '',
          imageBack: undefined,
          imageLoading: !!data.imagepath,
          imageBackLoading: !!data.imagepath_back,
          size: data.size || [],
          category: data.category || '',
          hasName: data.hasName || false,
          hasNumber: data.hasNumber || false,
          hasInitials: data.hasInitials || false,
        }
        setProduct(p)
        setLoading(false)

        if (data.imagepath) {
          getDownloadURL(ref(storage, data.imagepath))
            .then(url => setProduct(prev => prev ? { ...prev, image: url, imageLoading: false } : prev))
            .catch(() => setProduct(prev => prev ? { ...prev, imageLoading: false } : prev))
        }
        if (data.imagepath_back) {
          getDownloadURL(ref(storage, data.imagepath_back))
            .then(url => setProduct(prev => prev ? { ...prev, imageBack: url, imageBackLoading: false } : prev))
            .catch(() => setProduct(prev => prev ? { ...prev, imageBackLoading: false } : prev))
        }
      } catch {
        navigate('/shop')
      }
    }
    fetch()
  }, [id, navigate])

  const totalPrice = (product?.price || 0) + (customInitials ? 3.5 : 0)
  const isDisabled =
    (!!product?.size?.length && !selectedSize) ||
    (!!product?.hasName && !customName) ||
    (!!product?.hasNumber && !customNumber)

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      ...product,
      quantity: 1,
      size: selectedSize,
      customName,
      customNumber,
      customInitials,
      price: totalPrice,
    })
    setAdded(true)
    toast({ title: 'Zum Warenkorb hinzugefügt', status: 'success', duration: 2000, position: 'bottom-right' })
    setTimeout(() => setAdded(false), 2500)
  }

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <Box minH="80vh" bg="#f5f5f5" py={10}>
        <Container maxW="1100px" px={5}>
          <Skeleton h="16px" w="200px" mb={8} />
          <Flex gap={{ base: 6, md: 12 }} direction={{ base: 'column', md: 'row' }}>
            <Skeleton w={{ base: '100%', md: '55%' }} h="500px" borderRadius="2xl" />
            <Box flex={1}>
              <Skeleton h="24px" w="80px" mb={4} borderRadius="full" />
              <Skeleton h="48px" mb={3} />
              <Skeleton h="36px" w="120px" mb={6} />
              <Skeleton h="1px" mb={6} />
              <Skeleton h="44px" mb={3} />
              <Skeleton h="44px" mb={3} />
              <Skeleton h="1px" mb={6} />
              <Skeleton h="56px" borderRadius="xl" />
            </Box>
          </Flex>
        </Container>
      </Box>
    )
  }

  if (!product) return null

  const showingBack = activeImage === 'back' && !!product.imageBack
  const currentImageLoading = activeImage === 'front' ? product.imageLoading : product.imageBackLoading

  return (
    <Box minH="80vh" bg="#f5f5f5" py={10}>
      <Container maxW="1100px" px={5}>

        {/* Breadcrumb */}
        <HStack spacing={2} mb={8} fontSize="sm" color="gray.400">
          <RouterLink to="/">
            <Text _hover={{ color: '#E30613' }} transition="color 0.2s" cursor="pointer">Home</Text>
          </RouterLink>
          <FiChevronRight size={13} />
          <RouterLink to="/shop">
            <Text _hover={{ color: '#E30613' }} transition="color 0.2s" cursor="pointer">Shop</Text>
          </RouterLink>
          <FiChevronRight size={13} />
          <Text color="gray.700" fontWeight="600">{product.name}</Text>
        </HStack>

        <Flex gap={{ base: 6, md: 14 }} direction={{ base: 'column', md: 'row' }} align="flex-start">

          {/* ── LEFT: Image ─────────────────────────────────────────── */}
          <MotionBox
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            w={{ base: '100%', md: '55%' }}
            flexShrink={0}
          >
            {/* Main image */}
            <Box
              borderRadius="2xl"
              overflow="hidden"
              bg="white"
              boxShadow="0 8px 40px rgba(0,0,0,0.1)"
              mb={product.imageBack ? 4 : 0}
              position="relative"
              minH="420px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {currentImageLoading ? (
                <Skeleton position="absolute" inset={0} />
              ) : (
                <motion.div
                  key={showingBack ? 'back' : 'front'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%' }}
                >
                  {product.image ? (
                    <Image
                      src={showingBack ? product.imageBack : product.image}
                      alt={product.name}
                      w="100%"
                      maxH="500px"
                      objectFit="contain"
                      display="block"
                    />
                  ) : (
                    <Flex h="420px" align="center" justify="center">
                      <Text color="gray.300">Kein Bild</Text>
                    </Flex>
                  )}
                </motion.div>
              )}
            </Box>

            {/* Thumbnails */}
            {product.imageBack && (
              <HStack spacing={3}>
                {(['front', 'back'] as const).map(side => {
                  const src = side === 'front' ? product.image : product.imageBack
                  const label = side === 'front' ? 'Vorderseite' : 'Rückseite'
                  const isActive = activeImage === side
                  return (
                    <Box
                      key={side}
                      as="button"
                      onClick={() => setActiveImage(side)}
                      borderRadius="xl"
                      overflow="hidden"
                      border="2px solid"
                      borderColor={isActive ? '#E30613' : 'gray.200'}
                      w="80px"
                      h="80px"
                      bg="white"
                      boxShadow={isActive ? '0 4px 16px rgba(227,6,19,0.2)' : '0 2px 8px rgba(0,0,0,0.06)'}
                      transition="all 0.2s"
                      _hover={{ borderColor: '#E30613' }}
                      flexShrink={0}
                    >
                      {src ? (
                        <Image src={src} alt={label} w="100%" h="100%" objectFit="cover" />
                      ) : (
                        <Skeleton w="100%" h="100%" />
                      )}
                    </Box>
                  )
                })}
                <Text fontSize="xs" color="gray.400" fontWeight="500">
                  {activeImage === 'front' ? 'Vorderseite' : 'Rückseite'}
                </Text>
              </HStack>
            )}
          </MotionBox>

          {/* ── RIGHT: Info ─────────────────────────────────────────── */}
          <MotionBox
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            flex={1}
            position={{ md: 'sticky' }}
            top={{ md: '80px' }}
          >
            {product.category && (
              <Badge
                bg="rgba(227,6,19,0.08)"
                color="#E30613"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.08em"
                textTransform="uppercase"
                mb={4}
                display="inline-block"
              >
                {product.category}
              </Badge>
            )}

            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="900"
              color="gray.900"
              lineHeight="1.15"
              mb={4}
            >
              {product.name}
            </Heading>

            <Flex align="baseline" gap={2} mb={1}>
              <Text fontSize="3xl" fontWeight="900" color="#E30613">
                €{totalPrice.toFixed(2)}
              </Text>
              {customInitials && (
                <Text fontSize="sm" color="gray.400">inkl. €3,50 Initialen</Text>
              )}
            </Flex>

            <Box h="1px" bg="gray.100" my={6} />

            <VStack spacing={5} align="stretch">
              {/* Size */}
              {product.size && product.size.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="700" color="gray.700" mb={3}>
                    Größe
                    {!selectedSize && (
                      <Text as="span" color="gray.400" fontWeight="500" ml={2}>(bitte wählen)</Text>
                    )}
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {product.size.map(s => (
                      <Box
                        key={s}
                        as="button"
                        onClick={() => setSelectedSize(s)}
                        px={5}
                        py={2.5}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={selectedSize === s ? '#E30613' : 'gray.200'}
                        bg={selectedSize === s ? 'rgba(227,6,19,0.05)' : 'white'}
                        color={selectedSize === s ? '#E30613' : 'gray.700'}
                        fontWeight="700"
                        fontSize="sm"
                        transition="all 0.15s"
                        boxShadow={selectedSize === s ? '0 2px 12px rgba(227,6,19,0.15)' : 'none'}
                        _hover={{ borderColor: '#E30613', color: '#E30613' }}
                      >
                        {s}
                      </Box>
                    ))}
                  </HStack>
                </Box>
              )}

              {/* Custom name */}
              {product.hasName && (
                <Box>
                  <Text fontSize="sm" fontWeight="700" color="gray.700" mb={2}>Name</Text>
                  <Input
                    placeholder="Name eingeben"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
                  />
                </Box>
              )}

              {/* Custom number */}
              {product.hasNumber && (
                <Box>
                  <Text fontSize="sm" fontWeight="700" color="gray.700" mb={2}>Rückennummer</Text>
                  <Input
                    placeholder="Nummer eingeben"
                    value={customNumber}
                    onChange={e => setCustomNumber(e.target.value)}
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
                  />
                </Box>
              )}

              {/* Custom initials */}
              {product.hasInitials && (
                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="700" color="gray.700">Initialen</Text>
                    <Text fontSize="xs" color="gray.400">max. 2 Zeichen · +€3,50</Text>
                  </Flex>
                  <Input
                    placeholder="z.B. MK"
                    value={customInitials}
                    onChange={e => e.target.value.length <= 2 && setCustomInitials(e.target.value)}
                    maxLength={2}
                    borderRadius="xl"
                    borderColor="gray.200"
                    _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }}
                  />
                </Box>
              )}
            </VStack>

            <Box h="1px" bg="gray.100" my={6} />

            <Button
              width="full"
              size="lg"
              bg={added ? '#22c55e' : '#E30613'}
              color="white"
              borderRadius="xl"
              fontWeight="700"
              isDisabled={isDisabled}
              onClick={handleAddToCart}
              leftIcon={added ? <FiCheck /> : <FiShoppingCart />}
              transition="all 0.25s"
              _hover={{
                bg: added ? '#16a34a' : '#7B1B2B',
                transform: isDisabled ? 'none' : 'translateY(-2px)',
                boxShadow: isDisabled ? 'none' : '0 8px 24px rgba(227,6,19,0.3)',
              }}
              _active={{ transform: 'translateY(0)' }}
              _disabled={{ opacity: 0.35, cursor: 'not-allowed', transform: 'none' }}
              mb={3}
            >
              {added ? 'Im Warenkorb!' : 'In den Warenkorb'}
            </Button>

            <Button
              as={RouterLink}
              to="/shop"
              width="full"
              variant="ghost"
              color="gray.400"
              borderRadius="xl"
              leftIcon={<FiArrowLeft size={14} />}
              _hover={{ color: 'gray.700' }}
              fontWeight="600"
              fontSize="sm"
            >
              Zurück zum Shop
            </Button>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  )
}

export default ProductDetail
