import {
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader,
  DrawerBody, DrawerFooter, Box, Flex, Text, Image, IconButton, Button,
  HStack, VStack,
} from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const CartDrawer = ({ isOpen, onClose }: Props) => {
  const { items, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  const go = (path: string) => { onClose(); navigate(path) }

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay bg="rgba(0,0,0,0.4)" backdropFilter="blur(4px)" />
      <DrawerContent borderLeftRadius="2xl" boxShadow="-8px 0 40px rgba(0,0,0,0.15)">
        <DrawerCloseButton top={4} right={4} borderRadius="full" />
        <DrawerHeader borderBottomWidth="1px" borderColor="gray.100" pb={4}>
          <Flex align="center" gap={2}>
            <Text fontWeight="900" fontSize="lg" color="gray.900">Warenkorb</Text>
            {itemCount > 0 && (
              <Box
                bg="#E30613" color="white" borderRadius="full"
                minW="22px" h="22px" display="flex" alignItems="center" justifyContent="center"
                fontSize="xs" fontWeight="800" px={1}
              >
                {itemCount}
              </Box>
            )}
          </Flex>
        </DrawerHeader>

        <DrawerBody px={4} py={4}>
          {items.length === 0 ? (
            <Flex direction="column" align="center" justify="center" h="100%" gap={4} py={16}>
              <Box
                w={16} h={16} bg="gray.100" borderRadius="full"
                display="flex" alignItems="center" justifyContent="center"
              >
                <FiShoppingBag size={28} color="#d1d5db" />
              </Box>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                Ihr Warenkorb ist leer.
              </Text>
              <Button
                size="sm" bg="#E30613" color="white" borderRadius="full"
                fontWeight="700" _hover={{ bg: '#7B1B2B' }} onClick={() => go('/shop')}
              >
                Zum Shop
              </Button>
            </Flex>
          ) : (
            <VStack spacing={3} align="stretch">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={item.id + (item.size || '') + (item.customName || '')}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      bg="gray.50" borderRadius="xl" p={3}
                      border="1px solid" borderColor="gray.100"
                    >
                      <HStack spacing={3} align="flex-start">
                        <Box w="56px" h="56px" borderRadius="lg" overflow="hidden" bg="white" flexShrink={0}>
                          {item.image && (
                            <Image src={item.image} alt={item.name} w="100%" h="100%" objectFit="cover" />
                          )}
                        </Box>
                        <Box flex={1} minW={0}>
                          <Text fontWeight="700" fontSize="sm" color="gray.900" noOfLines={1}>
                            {item.name}
                          </Text>
                          <Flex gap={1} mt={0.5} flexWrap="wrap">
                            {item.size && (
                              <Text fontSize="10px" color="gray.500" bg="white" px={1.5} py={0.5} borderRadius="full" border="1px solid" borderColor="gray.200">
                                {item.size}
                              </Text>
                            )}
                            {item.customName && (
                              <Text fontSize="10px" color="gray.500" bg="white" px={1.5} py={0.5} borderRadius="full" border="1px solid" borderColor="gray.200">
                                {item.customName}
                              </Text>
                            )}
                          </Flex>
                          <Flex align="center" justify="space-between" mt={2}>
                            <HStack bg="white" borderRadius="full" p={1} spacing={1} border="1px solid" borderColor="gray.200">
                              <IconButton
                                icon={<FiMinus size={10} />} aria-label="Weniger" size="xs"
                                borderRadius="full" bg="transparent" h="20px" minW="20px"
                                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), item.size, item.customName, item.customNumber, item.customInitials)}
                              />
                              <Text fontSize="xs" fontWeight="700" minW="14px" textAlign="center">{item.quantity}</Text>
                              <IconButton
                                icon={<FiPlus size={10} />} aria-label="Mehr" size="xs"
                                borderRadius="full" bg="transparent" h="20px" minW="20px"
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.customName, item.customNumber, item.customInitials)}
                              />
                            </HStack>
                            <Flex align="center" gap={2}>
                              <Text fontSize="sm" fontWeight="800" color="#E30613">
                                €{(item.price * item.quantity).toFixed(2)}
                              </Text>
                              <IconButton
                                icon={<FiTrash2 size={12} />} aria-label="Entfernen" size="xs"
                                variant="ghost" color="gray.400" borderRadius="full"
                                _hover={{ color: '#E30613', bg: 'red.50' }}
                                onClick={() => removeFromCart(item.id, item.size, item.customName, item.customNumber, item.customInitials)}
                              />
                            </Flex>
                          </Flex>
                        </Box>
                      </HStack>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </VStack>
          )}
        </DrawerBody>

        {items.length > 0 && (
          <DrawerFooter borderTopWidth="1px" borderColor="gray.100" flexDirection="column" gap={3} pt={4}>
            <Flex justify="space-between" align="center" w="full">
              <Text fontWeight="700" color="gray.700" fontSize="sm">Gesamt</Text>
              <Text fontWeight="900" fontSize="xl" color="#E30613">€{total.toFixed(2)}</Text>
            </Flex>
            <Button
              width="full" bg="#E30613" color="white" borderRadius="xl"
              fontWeight="700" rightIcon={<FiArrowRight />}
              _hover={{ bg: '#7B1B2B', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}
              transition="all 0.2s"
              onClick={() => go('/checkout')}
            >
              Zur Kasse
            </Button>
            <Button
              width="full" variant="ghost" color="gray.500" borderRadius="xl"
              fontSize="sm" fontWeight="600" _hover={{ color: 'gray.700' }}
              onClick={() => go('/cart')}
            >
              Warenkorb ansehen
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default CartDrawer
