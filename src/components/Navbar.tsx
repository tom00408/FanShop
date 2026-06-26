import { useState } from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import logo from '../assets/logo.png'
import CartDrawer from './CartDrawer'

const MotionBox = motion(Box as any)

const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <RouterLink to={to} onClick={onClick}>
      <Box
        px={4} py={2} borderRadius="full" color="white"
        fontWeight="700" fontSize="sm" letterSpacing="0.04em" textTransform="uppercase"
        bg={active ? 'rgba(255,255,255,0.2)' : 'transparent'}
        transition="background 0.2s" _hover={{ bg: 'rgba(255,255,255,0.15)' }}
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
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  const cartActive = location.pathname === '/cart' || location.pathname === '/checkout'

  return (
    <>
      <Box
        as="nav" position="sticky" top={0} zIndex={200}
        bg="rgba(227,6,19,0.97)" backdropFilter="blur(14px)"
        boxShadow="0 2px 24px rgba(0,0,0,0.18)"
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        {/* Scroll progress bar */}
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, background: 'rgba(255,255,255,0.35)',
            scaleX: scrollYProgress, transformOrigin: '0%',
          }}
        />

        <Flex maxW="1200px" mx="auto" px={5} py={3} justify="space-between" align="center">
          <RouterLink to="/" onClick={() => setMobileOpen(false)}>
            <MotionBox whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} display="inline-block">
              <Image
                src={logo} alt="MTV Geismar" h="44px" bg="white"
                borderRadius="full" p="5px"
                boxShadow="0 2px 12px rgba(0,0,0,0.25)"
              />
            </MotionBox>
          </RouterLink>

          {/* Desktop nav */}
          <Flex display={{ base: 'none', md: 'flex' }} gap={1} align="center">
            <NavLink to="/" label="Home" />
            <NavLink to="/shop" label="Shop" />
            <MotionBox
              position="relative" display="flex" alignItems="center" justifyContent="center"
              w="44px" h="44px" borderRadius="full" color="white"
              bg={cartActive || cartOpen ? 'rgba(255,255,255,0.2)' : 'transparent'}
              cursor="pointer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
              onClick={() => setCartOpen(true)}
            >
              <FiShoppingCart size={22} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.div
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'white', color: '#E30613', borderRadius: 999, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, padding: '0 4px' }}
                  >
                    {itemCount}
                  </motion.div>
                )}
              </AnimatePresence>
            </MotionBox>
          </Flex>

          {/* Mobile icons */}
          <Flex display={{ base: 'flex', md: 'none' }} align="center" gap={1}>
            <MotionBox
              position="relative" display="flex" alignItems="center" justifyContent="center"
              w="40px" h="40px" borderRadius="full" color="white" cursor="pointer"
              bg={cartOpen ? 'rgba(255,255,255,0.2)' : 'transparent'}
              whileTap={{ scale: 0.9 }} onClick={() => { setMobileOpen(false); setCartOpen(true) }}
            >
              <FiShoppingCart size={20} />
              {itemCount > 0 && (
                <Box
                  position="absolute" top="4px" right="4px"
                  bg="white" color="#E30613" borderRadius="full"
                  minW="16px" h="16px" display="flex" alignItems="center" justifyContent="center"
                  fontSize="9px" fontWeight="800" px="3px"
                >
                  {itemCount}
                </Box>
              )}
            </MotionBox>
            <MotionBox
              display="flex" alignItems="center" justifyContent="center"
              w="40px" h="40px" borderRadius="full" color="white" cursor="pointer"
              bg={mobileOpen ? 'rgba(255,255,255,0.2)' : 'transparent'}
              whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(o => !o)}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </MotionBox>
          </Flex>
        </Flex>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
            >
              <Box
                bg="rgba(180,0,10,0.97)" backdropFilter="blur(14px)"
                px={5} py={4} display="flex" flexDirection="column" gap={1}
                borderTop="1px solid rgba(255,255,255,0.1)"
              >
                <NavLink to="/" label="Home" onClick={() => setMobileOpen(false)} />
                <NavLink to="/shop" label="Shop" onClick={() => setMobileOpen(false)} />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default Navbar
