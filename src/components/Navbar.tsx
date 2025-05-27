import { Box, Flex, Button, Image, Badge } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FaShoppingCart } from 'react-icons/fa'
import logo from '../assets/logo.png'

const Navbar = () => {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Box as="nav" bg="red.600" px={4} py={2} w="100vw" position="sticky" top={0} zIndex={100} boxShadow="md">
      <Flex maxW="1200px" mx="auto" justify="space-between" align="center">
        <RouterLink to="/">
          <Image
            src={logo}
            alt="MTV Geismar Logo" 
            h="48px"
            bg="white"
            borderRadius="full"
            p={1}
            boxShadow="sm"
          />
        </RouterLink>
        
        <Flex gap={4}>
          <Button as={RouterLink} to="/" variant="ghost" color="white" fontWeight="bold">
            Home
          </Button>
          <Button as={RouterLink} to="/shop" variant="ghost" color="white" fontWeight="bold">
            Shop
          </Button>
          <Button as={RouterLink} to="/cart" variant="ghost" color="white" position="relative">
            <FaShoppingCart />
            {itemCount > 0 && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                colorScheme="white"
                bg="white"
                color="red.600"
                borderRadius="full"
                fontWeight="bold"
                fontSize="0.8em"
                px={2}
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar 