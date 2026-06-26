import { ChakraProvider } from '@chakra-ui/react'
import system from './theme'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import { CartProvider } from './context/CartContext'

function App() {
  return (
    <ChakraProvider theme={system}>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/produkt/:id" element={<ProductDetail />} />
          </Routes>
        </Router>
      </CartProvider>
    </ChakraProvider>
  )
}

export default App
