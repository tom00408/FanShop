import { ChakraProvider } from '@chakra-ui/react'
import system from './theme'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import { CartProvider } from './context/CartContext'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  out: { opacity: 0, transition: { duration: 0.15 } },
}

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div variants={pageVariants} initial="initial" animate="in" exit="out">
    {children}
  </motion.div>
)

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/shop" element={<Page><Shop /></Page>} />
        <Route path="/cart" element={<Page><Cart /></Page>} />
        <Route path="/checkout" element={<Page><Checkout /></Page>} />
        <Route path="/produkt/:id" element={<Page><ProductDetail /></Page>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ChakraProvider theme={system}>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <AppRoutes />
        </Router>
      </CartProvider>
    </ChakraProvider>
  )
}

export default App
