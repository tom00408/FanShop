import { Box, Flex, Image } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiShoppingCart } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/logo.png'

const MotionBox = motion(Box as any)

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation()
  const active = location.pathname === to

  return (
    <RouterLink to={to}>
      <Box
        px={4}
        py={2}
        borderRadius="full"
        color="white"
        fontWeight="700"
        fontSize="sm"
        letterSpacing="0.04em"
        textTransform="uppercase"
        bg={active ? 'rgba(255,255,255,0.2)' : 'transparent'}
        transition="background 0.2s"
        _hover={{ bg: 'rgba(255,255,255,0.15)' }}
        userSelect="none"
      >
        {label}
      </Box>
    </RouterLink>
  )
}

const Navbar = () => {
  const { items } = useCart()
  const location = useLocation()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const cartActive = location.pathname === '/cart' || location.pathname === '/checkout'

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={200}
      bg="rgba(227,6,19,0.97)"
      backdropFilter="blur(14px)"
      boxShadow="0 2px 24px rgba(0,0,0,0.18)"
      borderBottom="1px solid rgba(255,255,255,0.08)"
    >
      <Flex maxW="1200px" mx="auto" px={5} py={3} justify="space-between" align="center">
        <RouterLink to="/">
          <MotionBox whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} display="inline-block">
            <Image
              src={logo}
              alt="MTV Geismar"
              h="44px"
              bg="white"
              borderRadius="full"
              p="5px"
              boxShadow="0 2px 12px rgba(0,0,0,0.25)"
            />
          </MotionBox>
        </RouterLink>

        <Flex gap={1} align="center">
          <NavLink to="/" label="Home" />
          <NavLink to="/shop" label="Shop" />

          <RouterLink to="/cart">
            <MotionBox
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="44px"
              h="44px"
              borderRadius="full"
              color="white"
              bg={cartActive ? 'rgba(255,255,255,0.2)' : 'transparent'}
              cursor="pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.15 }}
              _hover={{ bg: 'rgba(255,255,255,0.15)' }}
            >
              <FiShoppingCart size={22} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'white',
                      color: '#E30613',
                      borderRadius: '999px',
                      minWidth: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '0 4px',
                      lineHeight: 1,
                    }}
                  >
                    {itemCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionBox>
          </RouterLink>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar
