import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { useCart } from '../context/CartContext'
import { FiUser, FiMail, FiPhone, FiMapPin, FiUsers, FiMessageSquare, FiDownload, FiArrowLeft, FiCheckCircle, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import { db, functions } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { encryptSensitiveData } from '../utils/encryption'
import { generateOrderNumberAtomic } from '../utils/orderNumber'

const MotionBox = motion(Box as any)

type Step = 'form' | 'confirm' | 'success'

interface FormData {
  name: string
  address: string
  email: string
  telefon: string
  team: string
  hinweis: string
}

const StepIndicator = ({ step }: { step: Step }) => {
  const steps = [
    { key: 'form', label: 'Ihre Daten' },
    { key: 'confirm', label: 'Bestätigen' },
    { key: 'success', label: 'Fertig' },
  ]
  const current = steps.findIndex(s => s.key === step)

  return (
    <Flex align="center" justify="center" mb={8} gap={0}>
      {steps.map((s, i) => (
        <Flex key={s.key} align="center">
          <Flex direction="column" align="center" gap={1}>
            <Box
              w="36px"
              h="36px"
              borderRadius="full"
              bg={i <= current ? '#E30613' : 'gray.200'}
              color={i <= current ? 'white' : 'gray.500'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="800"
              transition="all 0.3s"
            >
              {i < current ? '✓' : i + 1}
            </Box>
            <Text fontSize="xs" fontWeight="600" color={i <= current ? '#E30613' : 'gray.400'}>
              {s.label}
            </Text>
          </Flex>
          {i < steps.length - 1 && (
            <Box
              w={{ base: '40px', md: '80px' }}
              h="2px"
              bg={i < current ? '#E30613' : 'gray.200'}
              mx={2}
              mb={4}
              transition="background 0.3s"
            />
          )}
        </Flex>
      ))}
    </Flex>
  )
}

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  icon,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  required?: boolean
  icon: React.ReactNode
}) => (
  <FormControl isRequired={required}>
    <FormLabel fontSize="sm" fontWeight="700" color="gray.700" mb={1.5}>
      {label}
    </FormLabel>
    <Flex align="center" position="relative">
      <Box position="absolute" left={3} color="gray.400" zIndex={1} pointerEvents="none">
        {icon}
      </Box>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        pl="40px"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
        _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613', outline: 'none' }}
        _hover={{ borderColor: 'gray.300' }}
        size="md"
      />
    </Flex>
  </FormControl>
)

const Checkout = () => {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState<Step>('form')
  const [sending, setSending] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState('')
  const [form, setForm] = useState<FormData>({
    name: '', address: '', email: '', telefon: '', team: '', hinweis: '',
  })

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOrder = async () => {
    setSending(true)
    try {
      const genOrderNumber = await generateOrderNumberAtomic()
      setOrderNumber(genOrderNumber)

      const orderData = {
        orderNumber: genOrderNumber,
        name: form.name,
        address: form.address,
        email: form.email,
        telefon: form.telefon,
        team: form.team,
        hinweis: form.hinweis,
        status: 'neu',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size || null,
          customName: item.customName || null,
          customNumber: item.customNumber || null,
          customInitials: item.customInitials || null,
        })),
        total,
        createdAt: new Date(),
      }

      const encrypted = encryptSensitiveData(orderData)
      await addDoc(collection(db, 'bestellungen'), encrypted)

      // Generate PDF
      const doc = new jsPDF()
      doc.setFillColor(227, 6, 19)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('Rechnung', 14, 26)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`MTV Geismar Fan-Shop`, 140, 22)
      doc.text(`Bestellnr.: ${genOrderNumber}`, 140, 30)

      doc.setTextColor(30, 30, 30)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Rechnungsempfänger', 14, 56)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.text(form.name, 14, 64)
      doc.text(form.address, 14, 71)
      doc.text(form.email, 14, 78)
      doc.text(`Tel.: ${form.telefon}`, 14, 85)
      doc.text(`Team: ${form.team}`, 14, 92)

      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Bestellte Artikel', 14, 108)

      doc.setDrawColor(227, 6, 19)
      doc.setLineWidth(0.5)
      doc.line(14, 111, 196, 111)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Artikel', 14, 118)
      doc.text('Menge', 140, 118)
      doc.text('Preis', 168, 118)
      doc.text('Gesamt', 185, 118)
      doc.setLineWidth(0.3)
      doc.setDrawColor(200, 200, 200)
      doc.line(14, 121, 196, 121)

      doc.setFont('helvetica', 'normal')
      let y = 128
      items.forEach(item => {
        const label = `${item.name}${item.size ? ` (${item.size})` : ''}`
        doc.text(label, 14, y)
        if (item.customName) { y += 5; doc.setFontSize(9); doc.text(`  Name: ${item.customName}`, 14, y); doc.setFontSize(10) }
        if (item.customNumber) { y += 5; doc.setFontSize(9); doc.text(`  Nr.: ${item.customNumber}`, 14, y); doc.setFontSize(10) }
        if (item.customInitials) { y += 5; doc.setFontSize(9); doc.text(`  Initialen: ${item.customInitials} (+€3,50)`, 14, y); doc.setFontSize(10) }
        doc.text(`${item.quantity}`, 142, y - (item.customName || item.customNumber || item.customInitials ? 5 : 0))
        doc.text(`€${item.price.toFixed(2)}`, 168, y - (item.customName || item.customNumber || item.customInitials ? 5 : 0))
        doc.text(`€${(item.price * item.quantity).toFixed(2)}`, 185, y - (item.customName || item.customNumber || item.customInitials ? 5 : 0))
        y += 8
        doc.setDrawColor(240, 240, 240)
        doc.line(14, y - 2, 196, y - 2)
      })

      y += 4
      doc.setFillColor(245, 245, 245)
      doc.rect(130, y - 4, 66, 14, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(227, 6, 19)
      doc.text(`Gesamt: €${total.toFixed(2)}`, 133, y + 5)
      doc.setTextColor(30, 30, 30)

      y += 24
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Zahlungshinweise', 14, y)
      y += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text('Bitte überweisen Sie den Betrag auf folgendes Konto:', 14, y)
      y += 7
      doc.setFont('helvetica', 'bold')
      doc.text('Empfänger:', 14, y); doc.setFont('helvetica', 'normal'); doc.text('FÖV MTV Geismar', 50, y)
      y += 7
      doc.setFont('helvetica', 'bold')
      doc.text('IBAN:', 14, y); doc.setFont('helvetica', 'normal'); doc.text('DE75 2605 0001 0000 1743 00', 50, y)
      y += 7
      doc.setFont('helvetica', 'bold')
      doc.text('Verwendungszweck:', 14, y); doc.setFont('helvetica', 'normal'); doc.text(`${form.name} / ${genOrderNumber}`, 62, y)

      if (form.hinweis) {
        y += 12
        doc.setFont('helvetica', 'bold')
        doc.text('Hinweis:', 14, y)
        doc.setFont('helvetica', 'normal')
        doc.text(form.hinweis, 14, y + 6)
      }

      const pdfBlob = doc.output('blob')
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)

      // Send email
      try {
        const arrayBuffer = await pdfBlob.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        const sendEmail = httpsCallable(functions, 'shopOrderEmail')
        await sendEmail({
          to: form.email,
          name: form.name,
          filename: `rechnung-${genOrderNumber}.pdf`,
          pdfBase64: base64,
        })
      } catch {
        toast({
          title: 'E-Mail konnte nicht gesendet werden',
          description: 'Die Rechnung kann trotzdem heruntergeladen werden.',
          status: 'warning',
          duration: 4000,
        })
      }

      clearCart()
      setStep('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Fehler beim Speichern der Bestellung!', status: 'error', duration: 4000 })
    }
    setSending(false)
  }

  if (items.length === 0 && step !== 'success') {
    navigate('/cart')
    return null
  }

  return (
    <Box minH="80vh" bg="#f5f5f5" py={10}>
      <Container maxW="680px" px={5}>
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          mb={6}
        >
          <Button
            variant="ghost"
            leftIcon={<FiArrowLeft />}
            color="gray.500"
            size="sm"
            mb={4}
            onClick={() => step === 'confirm' ? setStep('form') : navigate('/cart')}
            _hover={{ color: 'gray.800' }}
          >
            {step === 'confirm' ? 'Zurück zu Ihren Daten' : 'Zurück zum Warenkorb'}
          </Button>
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={1}>
            Kasse
          </Text>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
            Bestellung abschließen
          </Heading>
        </MotionBox>

        <StepIndicator step={step} />

        {/* STEP 1: Form */}
        {step === 'form' && (
          <MotionBox
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleFormSubmit}>
              <Box bg="white" borderRadius="2xl" p={7} boxShadow="0 2px 16px rgba(0,0,0,0.06)" mb={4}>
                <Heading size="sm" fontWeight="900" color="gray.800" mb={5}>
                  Ihre Kontaktdaten
                </Heading>
                <VStack spacing={4}>
                  <FormField label="Name" name="name" value={form.name} onChange={handleInput} required icon={<FiUser size={16} />} placeholder="Vor- und Nachname" />
                  <FormField label="Adresse" name="address" value={form.address} onChange={handleInput} required icon={<FiMapPin size={16} />} placeholder="Straße, PLZ, Ort" />
                  <FormField label="E-Mail" name="email" value={form.email} onChange={handleInput} type="email" required icon={<FiMail size={16} />} placeholder="ihre@email.de" />
                  <FormField label="Telefon" name="telefon" value={form.telefon} onChange={handleInput} required icon={<FiPhone size={16} />} placeholder="+49 ..." />
                  <FormField label="Team" name="team" value={form.team} onChange={handleInput} required icon={<FiUsers size={16} />} placeholder="z.B. Herren 1, Jugend U15 ..." />
                  <FormField label="Hinweis (optional)" name="hinweis" value={form.hinweis} onChange={handleInput} icon={<FiMessageSquare size={16} />} placeholder="Anmerkungen zur Bestellung" />
                </VStack>
              </Box>

              {/* Mini order summary */}
              <Box bg="white" borderRadius="2xl" p={5} boxShadow="0 2px 12px rgba(0,0,0,0.05)" mb={5} border="1px solid rgba(0,0,0,0.04)">
                <Text fontWeight="800" fontSize="sm" color="gray.700" mb={3}>
                  {items.length} {items.length === 1 ? 'Artikel' : 'Artikel'} • Gesamt: €{total.toFixed(2)}
                </Text>
                <VStack spacing={1} align="stretch">
                  {items.map(item => (
                    <Flex key={item.id + item.size} justify="space-between" fontSize="sm">
                      <Text color="gray.600">
                        {item.name}{item.size ? ` (${item.size})` : ''} ×{item.quantity}
                      </Text>
                      <Text fontWeight="700" color="gray.800">€{(item.price * item.quantity).toFixed(2)}</Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>

              <Button
                type="submit"
                width="full"
                bg="#E30613"
                color="white"
                borderRadius="xl"
                size="lg"
                fontWeight="700"
                rightIcon={<FiArrowRight />}
                _hover={{ bg: '#7B1B2B', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}
                transition="all 0.2s"
              >
                Weiter zur Bestätigung
              </Button>
            </form>
          </MotionBox>
        )}

        {/* STEP 2: Confirm */}
        {step === 'confirm' && (
          <MotionBox
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box bg="white" borderRadius="2xl" p={7} boxShadow="0 2px 16px rgba(0,0,0,0.06)" mb={4}>
              <Heading size="sm" fontWeight="900" color="gray.800" mb={5}>Ihre Angaben prüfen</Heading>
              <VStack spacing={3} align="stretch">
                {[
                  { label: 'Name', value: form.name, icon: <FiUser size={14} /> },
                  { label: 'Adresse', value: form.address, icon: <FiMapPin size={14} /> },
                  { label: 'E-Mail', value: form.email, icon: <FiMail size={14} /> },
                  { label: 'Telefon', value: form.telefon, icon: <FiPhone size={14} /> },
                  { label: 'Team', value: form.team, icon: <FiUsers size={14} /> },
                  ...(form.hinweis ? [{ label: 'Hinweis', value: form.hinweis, icon: <FiMessageSquare size={14} /> }] : []),
                ].map(({ label, value, icon }) => (
                  <HStack key={label} spacing={3}>
                    <Box color="#E30613" flexShrink={0}>{icon}</Box>
                    <Box>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">{label}</Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="600">{value}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Box bg="white" borderRadius="2xl" p={6} boxShadow="0 2px 12px rgba(0,0,0,0.05)" mb={4} border="1px solid rgba(0,0,0,0.04)">
              <Heading size="sm" fontWeight="900" color="gray.800" mb={4}>Bestellübersicht</Heading>
              <VStack spacing={3} align="stretch">
                {items.map(item => (
                  <Flex key={item.id + item.size} justify="space-between" align="flex-start" fontSize="sm">
                    <Box>
                      <Text fontWeight="700" color="gray.800">
                        {item.name} ×{item.quantity}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {[item.size, item.customName && `Name: ${item.customName}`, item.customNumber && `Nr: ${item.customNumber}`].filter(Boolean).join(' · ')}
                      </Text>
                    </Box>
                    <Text fontWeight="700" color="gray.800">€{(item.price * item.quantity).toFixed(2)}</Text>
                  </Flex>
                ))}
              </VStack>
              <Divider my={4} />
              <Flex justify="space-between">
                <Text fontWeight="800" color="gray.800">Gesamtsumme</Text>
                <Text fontWeight="900" fontSize="lg" color="#E30613">€{total.toFixed(2)}</Text>
              </Flex>
            </Box>

            <Box bg="rgba(227,6,19,0.04)" border="1px solid rgba(227,6,19,0.12)" borderRadius="xl" p={4} mb={5}>
              <Text fontSize="sm" color="gray.700" fontWeight="600">
                💳 Zahlung per Banküberweisung nach Bestelleingang.
                Sie erhalten eine Rechnung per E-Mail an <b>{form.email}</b>.
              </Text>
            </Box>

            <Button
              width="full"
              bg="#E30613"
              color="white"
              borderRadius="xl"
              size="lg"
              fontWeight="700"
              isLoading={sending}
              loadingText="Bestellung wird verarbeitet..."
              onClick={handleOrder}
              rightIcon={<FiCheckCircle />}
              _hover={{ bg: '#7B1B2B', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}
              transition="all 0.2s"
            >
              Jetzt verbindlich bestellen
            </Button>
          </MotionBox>
        )}

        {/* STEP 3: Success */}
        {step === 'success' && (
          <MotionBox
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Box bg="white" borderRadius="2xl" p={8} boxShadow="0 4px 24px rgba(0,0,0,0.08)" textAlign="center" mb={5}>
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
                display="inline-flex"
                w={20}
                h={20}
                bg="linear-gradient(135deg, #E30613, #7B1B2B)"
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                mb={5}
                mx="auto"
              >
                <FiCheckCircle size={36} color="white" />
              </MotionBox>

              <Heading size="lg" fontWeight="900" color="gray.900" mb={2}>
                Bestellung eingegangen!
              </Heading>
              <Text color="gray.500" mb={5}>
                Vielen Dank, <b>{form.name}</b>! Ihre Bestellung wurde erfolgreich aufgenommen.
              </Text>

              <Box
                bg="#f5f5f5"
                borderRadius="xl"
                p={4}
                mb={5}
                display="inline-block"
              >
                <Text fontSize="xs" color="gray.500" mb={1}>Bestellnummer</Text>
                <Text fontSize="xl" fontWeight="900" color="#E30613">{orderNumber}</Text>
              </Box>

              <Divider mb={5} />

              <VStack spacing={2} align="stretch" textAlign="left" mb={6}>
                <Text fontSize="sm" fontWeight="700" color="gray.700">Zahlung per Überweisung:</Text>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.500">Empfänger</Text>
                  <Text fontWeight="700" color="gray.800">FÖV MTV Geismar</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.500">IBAN</Text>
                  <Text fontWeight="700" color="gray.800" fontFamily="mono">DE75 2605 0001 0000 1743 00</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.500">Verwendungszweck</Text>
                  <Text fontWeight="700" color="gray.800">{form.name} / {orderNumber}</Text>
                </HStack>
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.500">Betrag</Text>
                  <Text fontWeight="900" color="#E30613">€{total.toFixed(2)}</Text>
                </HStack>
              </VStack>

              {pdfUrl && (
                <Button
                  as="a"
                  href={pdfUrl}
                  download={`rechnung-${orderNumber}.pdf`}
                  width="full"
                  bg="linear-gradient(135deg, #E30613, #7B1B2B)"
                  color="white"
                  borderRadius="xl"
                  size="lg"
                  fontWeight="700"
                  leftIcon={<FiDownload />}
                  _hover={{ opacity: 0.9, transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}
                  mb={3}
                  transition="all 0.2s"
                >
                  Rechnung herunterladen (PDF)
                </Button>
              )}

              <Button
                width="full"
                variant="ghost"
                color="gray.500"
                borderRadius="xl"
                fontWeight="600"
                onClick={() => navigate('/shop')}
                _hover={{ color: 'gray.700' }}
              >
                Zurück zum Shop
              </Button>
            </Box>
          </MotionBox>
        )}
      </Container>
    </Box>
  )
}

export default Checkout
