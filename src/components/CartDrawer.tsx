import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
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
import { useNavigate } from 'react-router-dom'

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, isCartOpen, closeCart } = useCart()
  const navigate = useNavigate()
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const goToCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  const continueShopping = () => {
    closeCart()
    navigate('/shop')
  }

  return (
    <Drawer isOpen={isCartOpen} placement="right" onClose={closeCart} size="sm">
      <DrawerOverlay bg="rgba(0,0,0,0.45)" />
      <DrawerContent display="flex" flexDirection="column">
        {/* Header */}
        <Box bg="linear-gradient(135deg, #E30613 0%, #7B1B2B 100%)" px={6} py={5} color="white">
          <DrawerCloseButton color="white" top={4} right={4} />
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" opacity={0.85}>
            Warenkorb
          </Text>
          <Text fontSize="2xl" fontWeight="900" mt={1}>
            {itemCount} {itemCount === 1 ? 'Artikel' : 'Artikel'}
          </Text>
        </Box>

        {/* Items */}
        <Box flex={1} overflowY="auto" bg="#f7f7f7" px={4} py={4}>
          {items.length === 0 ? (
            <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" px={6}>
              <Box
                w={16}
                h={16}
                bg="white"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={5}
                boxShadow="0 4px 20px rgba(0,0,0,0.08)"
              >
                <FiShoppingBag size={30} color="#d1d5db" />
              </Box>
              <Text fontWeight="900" color="gray.800" fontSize="lg" mb={2}>
                Dein Warenkorb ist leer
              </Text>
              <Text color="gray.500" fontSize="sm" mb={6}>
                Stöbere durch unsere Kollektion und füge etwas hinzu.
              </Text>
              <Button
                onClick={continueShopping}
                bg="#E30613"
                color="white"
                borderRadius="full"
                px={8}
                fontWeight="700"
                _hover={{ bg: '#7B1B2B' }}
              >
                Zum Shop
              </Button>
            </Flex>
          ) : (
            <VStack spacing={3} align="stretch">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id + (item.size || '') + (item.customName || '') + (item.customNumber || '') + (item.customInitials || '')}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box bg="white" borderRadius="xl" p={3} boxShadow="0 2px 10px rgba(0,0,0,0.05)">
                      <Flex gap={3} align="flex-start">
                        <Box w="64px" h="64px" borderRadius="lg" overflow="hidden" flexShrink={0} bg="gray.100">
                          {item.image && (
                            <Image src={item.image} alt={item.name} w="100%" h="100%" objectFit="cover" />
                          )}
                        </Box>

                        <Box flex={1} minW={0}>
                          <Text fontWeight="800" color="gray.900" fontSize="sm" noOfLines={2}>
                            {item.name}
                          </Text>
                          <Flex gap={1.5} mt={1} flexWrap="wrap">
                            {item.size && (
                              <Text fontSize="xs" color="gray.500" bg="gray.100" px={2} py={0.5} borderRadius="full">
                                Gr. {item.size}
                              </Text>
                            )}
                            {item.customName && (
                              <Text fontSize="xs" color="gray.500" bg="gray.100" px={2} py={0.5} borderRadius="full">
                                {item.customName}
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

                          <Flex justify="space-between" align="center" mt={2}>
                            <HStack bg="gray.100" borderRadius="full" p={1} spacing={1}>
                              <IconButton
                                icon={<FiMinus size={11} />}
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
                                icon={<FiPlus size={11} />}
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
                            <Text color="#E30613" fontWeight="800" fontSize="sm">
                              €{(item.price * item.quantity).toFixed(2)}
                            </Text>
                          </Flex>
                        </Box>

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
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </VStack>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box bg="white" px={6} py={5} borderTop="1px solid" borderColor="gray.100" boxShadow="0 -4px 20px rgba(0,0,0,0.05)">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="700" color="gray.700">Gesamtsumme</Text>
              <Text fontWeight="900" fontSize="xl" color="#E30613">
                €{total.toFixed(2)}
              </Text>
            </Flex>
            <Divider mb={4} />
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
              onClick={goToCheckout}
            >
              Zur Kasse
            </Button>
            <Button
              width="full"
              variant="ghost"
              color="gray.500"
              borderRadius="xl"
              size="sm"
              mt={2}
              fontWeight="600"
              _hover={{ color: 'gray.700' }}
              onClick={continueShopping}
            >
              Weiter einkaufen
            </Button>
          </Box>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default CartDrawer
