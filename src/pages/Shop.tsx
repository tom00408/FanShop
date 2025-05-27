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
  Select as ChakraSelect
} from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { db, storage } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'

interface Product {
  id: string
  name: string
  price: number
  image: string
  size?: string[]
  category?: string
}

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSizes, setSelectedSizes] = useState<{ [productId: string]: string }>({})
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, 'products'))
      const loadedProducts: Product[] = []
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data()
        let imageUrl = ''
        if (data.imagepath) {
          try {
            imageUrl = await getDownloadURL(ref(storage, data.imagepath))
          } catch (e) {
            imageUrl = ''
          }
        }
        loadedProducts.push({
          id: docSnap.id,
          name: data.name,
          price: data.price,
          image: imageUrl,
          size: data.size || [],
          category: data.category || '',
        })
      }
      setProducts(loadedProducts)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }))
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
                <Image
                  src={product.image}
                  alt={product.name}
                  boxSize="300px"
                  objectFit="cover"
                  w="100%"
                  bg="#f5f5f5"
                />
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
                  <Button
                    mt={4}
                    colorScheme="red"
                    width="full"
                    isDisabled={product.size && product.size.length > 0 && !selectedSizes[product.id]}
                    onClick={() => addToCart({ ...product, quantity: 1, size: selectedSizes[product.id] })}
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