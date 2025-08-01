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
  Select as ChakraSelect,
  IconButton
} from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { db, storage } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [selectedNames, setSelectedNames] = useState<Record<string, string>>({})
  const [selectedNumbers, setSelectedNumbers] = useState<Record<string, string>>({})
  const [selectedInitials, setSelectedInitials] = useState<Record<string, string>>({})
  const [activeImages, setActiveImages] = useState<Record<string, 'front' | 'back'>>({})
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'products'))
      const loadedProducts: Product[] = []
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data()
        loadedProducts.push({
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
          hasInitials: data.hasInitials || false
        })
      }
      setProducts(loadedProducts)
      setLoading(false)

      // Lade Bilder asynchron
      loadedProducts.forEach(async (product, index) => {
        const data = querySnapshot.docs[index].data()
        if (data.imagepath) {
          try {
            const imageUrl = await getDownloadURL(ref(storage, data.imagepath))
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.id === product.id 
                  ? { ...p, image: imageUrl, imageLoading: false }
                  : p
              )
            )
          } catch (e) {
            console.error(e)
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.id === product.id 
                  ? { ...p, imageLoading: false }
                  : p
              )
            )
          }
        }
        
        if (data.imagepath_back) {
          try {
            const imageBackUrl = await getDownloadURL(ref(storage, data.imagepath_back))
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.id === product.id 
                  ? { ...p, imageBack: imageBackUrl, imageBackLoading: false }
                  : p
              )
            )
          } catch (e) {
            console.error(e)
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.id === product.id 
                  ? { ...p, imageBackLoading: false }
                  : p
              )
            )
          }
        }
      })
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  const handleNameChange = (productId: string, name: string) => {
    setSelectedNames(prev => ({ ...prev, [productId]: name }))
  }

  const handleNumberChange = (productId: string, number: string) => {
    setSelectedNumbers(prev => ({ ...prev, [productId]: number }))
  }

  const handleInitialsChange = (productId: string, initials: string) => {
    if (initials.length <= 2) {
      setSelectedInitials(prev => ({ ...prev, [productId]: initials }))
    }
  }

  return (
    <Box minH="80vh" bg="#222" py={8} px={4} display="flex" flexDirection="column" alignItems="center">
      <Container maxW="1200px" bg="white" borderRadius="lg" boxShadow="xl" p={8}>
        <Heading mb={8}>Shop</Heading>
        <Flex mb={8} gap={4} direction={{ base: 'column', md: 'row' }}>
          <Input
            placeholder="Produkte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ maxWidth: 200, padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
          >
            <option value="">Kategorie auswählen</option>
            {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Flex>
        {loading ? (
          <Text>Produkte werden geladen...</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
            {filteredProducts.map(product => (
              <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="sm">
                <Box position="relative" height="300px" bg="gray.100">
                  {product.imageLoading || (product.imageBack && product.imageBackLoading) ? (
                    <Box 
                      height="100%" 
                      width="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      bg="gray.100"
                    >
                      <Text color="gray.500">Bild wird geladen...</Text>
                    </Box>
                  ) : (
                    <Box position="relative" height="100%" width="100%">
                      <Image
                        src={activeImages[product.id] === 'back' && product.imageBack ? product.imageBack : product.image}
                        alt={product.name}
                        boxSize="300px"
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        transition="opacity 0.3s"
                      />
                      {product.imageBack && (
                        <Flex 
                          position="absolute" 
                          bottom="2" 
                          right="2" 
                          gap="2"
                        >
                          <IconButton
                            aria-label="Vorderseite"
                            icon={<FaChevronLeft />}
                            size="sm"
                            onClick={() => setActiveImages(prev => ({ ...prev, [product.id]: 'front' }))}
                            isDisabled={activeImages[product.id] === 'front'}
                            colorScheme="red"
                            variant="solid"
                          />
                          <IconButton
                            aria-label="Rückseite"
                            icon={<FaChevronRight />}
                            size="sm"
                            onClick={() => setActiveImages(prev => ({ ...prev, [product.id]: 'back' }))}
                            isDisabled={activeImages[product.id] === 'back'}
                            colorScheme="red"
                            variant="solid"
                          />
                        </Flex>
                      )}
                    </Box>
                  )}
                </Box>
                <Box p={4}>
                  <Heading size="md" color="black">{product.name}</Heading>
                  <Text mt={2} color="black">€{product.price.toFixed(2)}</Text>
                  {product.size && product.size.length > 0 && (
                    <ChakraSelect
                      placeholder="Größe wählen"
                      mt={2}
                      value={selectedSizes[product.id] || ''}
                      onChange={e => handleSizeChange(product.id, e.target.value)}
                    >
                      {product.size.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </ChakraSelect>
                  )}
                  {product.hasName && (
                    <Input
                      mt={2}
                      placeholder="Name eingeben"
                      value={selectedNames[product.id] || ''}
                      onChange={e => handleNameChange(product.id, e.target.value)}
                    />
                  )}
                  {product.hasNumber && (
                    <Input
                      mt={2}
                      placeholder="Nummer eingeben"
                      value={selectedNumbers[product.id] || ''}
                      onChange={e => handleNumberChange(product.id, e.target.value)}
                    />
                  )}
                  {product.hasInitials && (
                    <>
                      <Input
                        mt={2}
                        placeholder="Initialen (max. 2 Zeichen)"
                        value={selectedInitials[product.id] || ''}
                        onChange={e => handleInitialsChange(product.id, e.target.value)}
                        maxLength={2}
                      />
                      {selectedInitials[product.id] && (
                        <Text mt={1} fontSize="sm" color="gray.600">
                          + €3,50 für Initialisierung
                        </Text>
                      )}
                    </>
                  )}
                  <Button
                    mt={4}
                    colorScheme="red"
                    width="full"
                    isDisabled={
                      (product.size && product.size.length > 0 && !selectedSizes[product.id]) ||
                      (product.hasName && !selectedNames[product.id]) ||
                      (product.hasNumber && !selectedNumbers[product.id])
                    }
                    onClick={() => addToCart({ 
                      ...product, 
                      quantity: 1, 
                      size: selectedSizes[product.id],
                      customName: selectedNames[product.id],
                      customNumber: selectedNumbers[product.id],
                      customInitials: selectedInitials[product.id],
                      price: product.price + (selectedInitials[product.id] ? 3.5 : 0)
                    })}
                  >
                    In den Warenkorb
                  </Button>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}

export default Shop 