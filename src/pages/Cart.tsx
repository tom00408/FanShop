import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Image,
  IconButton,
  Divider,
  HStack,
  VStack,
} from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

const MotionBox = motion(Box as any)

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <Box minH="80vh" bg="#f5f5f5" display="flex" alignItems="center" justifyContent="center">
        <Container maxW="sm" textAlign="center">
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Box
              w={20}
              h={20}
              bg="white"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={6}
              boxShadow="0 4px 20px rgba(0,0,0,0.08)"
            >
              <FiShoppingBag size={36} color="#d1d5db" />
            </Box>
            <Heading size="lg" fontWeight="900" color="gray.800" mb={3}>
              Ihr Warenkorb ist leer
            </Heading>
            <Text color="gray.500" mb={8}>
              Schauen Sie sich unsere Produkte an und fügen Sie etwas hinzu.
            </Text>
            <Button
              as={RouterLink}
              to="/shop"
              bg="#E30613"
              color="white"
              borderRadius="full"
              px={8}
              py={6}
              fontWeight="700"
              _hover={{ bg: '#7B1B2B' }}
            >
              Zum Shop
            </Button>
          </MotionBox>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="80vh" bg="#f5f5f5" py={10}>
      <Container maxW="900px" px={5}>
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          mb={8}
        >
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={2}>
            Übersicht
          </Text>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
            Warenkorb
            <Text as="span" ml={3} fontSize="xl" color="gray.400" fontWeight="500">
              ({itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'})
            </Text>
          </Heading>
        </MotionBox>

        <Flex gap={6} direction={{ base: 'column', lg: 'row' }} align="flex-start">
          {/* Items list */}
          <Box flex={1}>
            <VStack spacing={3} align="stretch">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id + (item.size || '') + (item.customName || '') + (item.customNumber || '')}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box
                      bg="white"
                      borderRadius="2xl"
                      p={4}
                      boxShadow="0 2px 12px rgba(0,0,0,0.05)"
                      border="1px solid rgba(0,0,0,0.04)"
                    >
                      <Flex gap={4} align="center">
                        <Box
                          w="80px"
                          h="80px"
                          borderRadius="xl"
                          overflow="hidden"
                          flexShrink={0}
                          bg="gray.100"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          )}
                        </Box>

                        <Box flex={1} minW={0}>
                          <Text fontWeight="800" color="gray.900" fontSize="sm" noOfLines={2}>
                            {item.name}
                          </Text>
                          <Flex gap={2} mt={1} flexWrap="wrap">
                            {item.size && (
                              <Text fontSize="xs" color="gray.500" bg="gray.100" px={2} py={0.5} borderRadius="full">
                                Gr. {item.size}
                              </Text>
                            )}
                            {item.customName && (
                              <Text fontSize="xs" color="gray.500" bg="gray.100" px={2} py={0.5} borderRadius="full">
                                Name: {item.customName}
                              </Text>
                            )}
                            {item.customNumber && (
                              <Text fontSize="xs" color="gray.500" bg="gray.100" px={2} py={0.5} borderRadius="full">
                                Nr. {item.customNumber}
                              </Text>
                            )}
                            {item.customInitials && (
                              <Text fontSize="xs" color="gray.500" bg="gray.100" px={2} py={0.5} borderRadius="full">
                                Ini: {item.customInitials}
                              </Text>
                            )}
                          </Flex>
                          <Text color="#E30613" fontWeight="800" fontSize="sm" mt={1}>
                            €{(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </Box>

                        <Flex direction="column" align="center" gap={2}>
                          <HStack
                            bg="gray.100"
                            borderRadius="full"
                            p={1}
                            spacing={1}
                          >
                            <IconButton
                              icon={<FiMinus size={12} />}
                              aria-label="Weniger"
                              size="xs"
                              borderRadius="full"
                              bg="white"
                              boxShadow="sm"
                              onClick={() => updateQuantity(
                                item.id, Math.max(0, item.quantity - 1),
                                item.size, item.customName, item.customNumber, item.customInitials
                              )}
                            />
                            <Text fontSize="sm" fontWeight="700" minW="20px" textAlign="center">
                              {item.quantity}
                            </Text>
                            <IconButton
                              icon={<FiPlus size={12} />}
                              aria-label="Mehr"
                              size="xs"
                              borderRadius="full"
                              bg="white"
                              boxShadow="sm"
                              onClick={() => updateQuantity(
                                item.id, item.quantity + 1,
                                item.size, item.customName, item.customNumber, item.customInitials
                              )}
                            />
                          </HStack>
                          <IconButton
                            icon={<FiTrash2 size={14} />}
                            aria-label="Entfernen"
                            size="xs"
                            variant="ghost"
                            color="gray.400"
                            _hover={{ color: '#E30613', bg: 'red.50' }}
                            borderRadius="full"
                            onClick={() => removeFromCart(
                              item.id, item.size, item.customName, item.customNumber, item.customInitials
                            )}
                          />
                        </Flex>
                      </Flex>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </VStack>
          </Box>

          {/* Order summary */}
          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            w={{ base: '100%', lg: '320px' }}
            flexShrink={0}
            bg="white"
            borderRadius="2xl"
            p={6}
            boxShadow="0 2px 16px rgba(0,0,0,0.07)"
            border="1px solid rgba(0,0,0,0.04)"
            position={{ lg: 'sticky' }}
            top={{ lg: '80px' }}
          >
            <Heading size="sm" fontWeight="900" color="gray.900" mb={5}>
              Zusammenfassung
            </Heading>

            <VStack spacing={3} align="stretch" mb={4}>
              {items.map(item => (
                <Flex
                  key={item.id + (item.size || '') + (item.customName || '')}
                  justify="space-between"
                  fontSize="sm"
                >
                  <Text color="gray.600" noOfLines={1} flex={1} mr={2}>
                    {item.name} {item.size && `(${item.size})`} ×{item.quantity}
                  </Text>
                  <Text fontWeight="700" color="gray.800" flexShrink={0}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </Flex>
              ))}
            </VStack>

            <Divider mb={4} />

            <Flex justify="space-between" align="center" mb={6}>
              <Text fontWeight="700" color="gray.800">Gesamtsumme</Text>
              <Text fontWeight="900" fontSize="xl" color="#E30613">
                €{total.toFixed(2)}
              </Text>
            </Flex>

            <Button
              width="full"
              bg="#E30613"
              color="white"
              borderRadius="xl"
              size="lg"
              fontWeight="700"
              rightIcon={<FiArrowRight />}
              _hover={{ bg: '#7B1B2B', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.2s"
              onClick={() => navigate('/checkout')}
            >
              Zur Kasse
            </Button>

            <Button
              as={RouterLink}
              to="/shop"
              width="full"
              variant="ghost"
              color="gray.500"
              borderRadius="xl"
              size="sm"
              mt={3}
              fontWeight="600"
              _hover={{ color: 'gray.700' }}
            >
              Weiter einkaufen
            </Button>
          </MotionBox>
        </Flex>
      </Container>
    </Box>
  )
}

export default Cart
