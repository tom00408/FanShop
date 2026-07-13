import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { FiUser, FiMail, FiHash, FiMessageSquare, FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { db, functions } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'

const MotionBox = motion(Box as any)

type Step = 'form' | 'confirm' | 'success'

interface WiderrufForm {
  name: string
  bestellnummer: string
  email: string
  grund: string
}

const Widerruf = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState<Step>('form')
  const [sending, setSending] = useState(false)
  const [eingangAt, setEingangAt] = useState<Date | null>(null)
  const [form, setForm] = useState<WiderrufForm>({
    name: '', bestellnummer: '', email: '', grund: '',
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('confirm')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleConfirm = async () => {
    setSending(true)
    try {
      const eingang = new Date()
      setEingangAt(eingang)

      const widerrufData = {
        name: form.name,
        bestellnummer: form.bestellnummer,
        email: form.email,
        grund: form.grund || null,
        status: 'neu',
        eingangAt: eingang,
        createdAt: eingang,
      }

      await addDoc(collection(db, 'widerrufe'), widerrufData)

      try {
        const sendEmail = httpsCallable(functions, 'shopWiderrufEmail')
        await sendEmail({
          to: form.email,
          name: form.name,
          bestellnummer: form.bestellnummer,
          grund: form.grund,
          eingangAt: eingang.toISOString(),
        })
      } catch {
        toast({
          title: 'Eingangsbestätigung per E-Mail fehlgeschlagen',
          description: 'Ihr Widerruf wurde dennoch erfasst. Bitte bewahren Sie diese Bestätigung auf.',
          status: 'warning',
          duration: 5000,
        })
      }

      setStep('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Fehler beim Übermitteln des Widerrufs!', status: 'error', duration: 4000 })
    }
    setSending(false)
  }

  const eingangText = eingangAt
    ? eingangAt.toLocaleString('de-DE', { dateStyle: 'long', timeStyle: 'short' })
    : ''

  return (
    <Box minH="80vh" bg="#f5f5f5" py={10}>
      <Container maxW="680px" px={5}>
        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          mb={6}
        >
          {step !== 'success' && (
            <Button
              variant="ghost"
              leftIcon={<FiArrowLeft />}
              color="gray.500"
              size="sm"
              mb={4}
              onClick={() => step === 'confirm' ? setStep('form') : navigate(-1)}
              _hover={{ color: 'gray.800' }}
            >
              {step === 'confirm' ? 'Zurück zu Ihren Angaben' : 'Zurück'}
            </Button>
          )}
          <Text fontSize="xs" fontWeight="800" letterSpacing="0.15em" textTransform="uppercase" color="#E30613" mb={1}>
            Widerruf
          </Text>
          <Heading fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" color="gray.900">
            Vertrag widerrufen
          </Heading>
        </MotionBox>

        {/* STEP 1: Form */}
        {step === 'form' && (
          <MotionBox
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box bg="rgba(227,6,19,0.04)" border="1px solid rgba(227,6,19,0.12)" borderRadius="xl" p={4} mb={5}>
              <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                Mit diesem Formular können Sie Ihren über den MTV Geismar Shop geschlossenen Vertrag
                widerrufen. Bitte geben Sie die folgenden Angaben ein. Im nächsten Schritt können Sie
                den Widerruf verbindlich bestätigen.
              </Text>
            </Box>

            <form onSubmit={handleFormSubmit}>
              <Box bg="white" borderRadius="2xl" p={7} boxShadow="0 2px 16px rgba(0,0,0,0.06)" mb={5}>
                <Heading size="sm" fontWeight="900" color="gray.800" mb={5}>
                  Ihre Angaben
                </Heading>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.700" mb={1.5}>Name</FormLabel>
                    <Flex align="center" position="relative">
                      <Box position="absolute" left={3} color="gray.400" zIndex={1} pointerEvents="none"><FiUser size={16} /></Box>
                      <Input name="name" value={form.name} onChange={handleInput} placeholder="Vor- und Nachname" pl="40px" borderRadius="xl" borderColor="gray.200" _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }} />
                    </Flex>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.700" mb={1.5}>Bestellnummer</FormLabel>
                    <Flex align="center" position="relative">
                      <Box position="absolute" left={3} color="gray.400" zIndex={1} pointerEvents="none"><FiHash size={16} /></Box>
                      <Input name="bestellnummer" value={form.bestellnummer} onChange={handleInput} placeholder="z.B. 2026-0042" pl="40px" borderRadius="xl" borderColor="gray.200" _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }} />
                    </Flex>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.700" mb={1.5}>E-Mail</FormLabel>
                    <Flex align="center" position="relative">
                      <Box position="absolute" left={3} color="gray.400" zIndex={1} pointerEvents="none"><FiMail size={16} /></Box>
                      <Input name="email" type="email" value={form.email} onChange={handleInput} placeholder="ihre@email.de" pl="40px" borderRadius="xl" borderColor="gray.200" _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }} />
                    </Flex>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="700" color="gray.700" mb={1.5}>Grund (optional)</FormLabel>
                    <Flex align="flex-start" position="relative">
                      <Box position="absolute" left={3} top={3} color="gray.400" zIndex={1} pointerEvents="none"><FiMessageSquare size={16} /></Box>
                      <Textarea name="grund" value={form.grund} onChange={handleInput} placeholder="Optionale Begründung" pl="40px" borderRadius="xl" borderColor="gray.200" _focus={{ borderColor: '#E30613', boxShadow: '0 0 0 1px #E30613' }} rows={3} />
                    </Flex>
                  </FormControl>
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
                Weiter
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
            transition={{ duration: 0.3 }}
          >
            <Box bg="white" borderRadius="2xl" p={7} boxShadow="0 2px 16px rgba(0,0,0,0.06)" mb={4}>
              <Heading size="sm" fontWeight="900" color="gray.800" mb={5}>Ihre Widerrufserklärung prüfen</Heading>
              <VStack spacing={3} align="stretch">
                {[
                  { label: 'Name', value: form.name, icon: <FiUser size={14} /> },
                  { label: 'Bestellnummer', value: form.bestellnummer, icon: <FiHash size={14} /> },
                  { label: 'E-Mail', value: form.email, icon: <FiMail size={14} /> },
                  ...(form.grund ? [{ label: 'Grund', value: form.grund, icon: <FiMessageSquare size={14} /> }] : []),
                ].map(({ label, value, icon }) => (
                  <HStack key={label} spacing={3} align="flex-start">
                    <Box color="#E30613" flexShrink={0} mt={1}>{icon}</Box>
                    <Box>
                      <Text fontSize="xs" color="gray.400" fontWeight="600">{label}</Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="600">{value}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Box bg="rgba(227,6,19,0.04)" border="1px solid rgba(227,6,19,0.12)" borderRadius="xl" p={4} mb={5}>
              <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                Mit Klick auf <b>„Widerruf bestätigen"</b> übermitteln Sie Ihre Widerrufserklärung.
                Sie erhalten anschließend unverzüglich eine Eingangsbestätigung per E-Mail an <b>{form.email}</b>.
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
              loadingText="Widerruf wird übermittelt..."
              onClick={handleConfirm}
              rightIcon={<FiCheckCircle />}
              _hover={{ bg: '#7B1B2B', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(227,6,19,0.3)' }}
              transition="all 0.2s"
            >
              Widerruf bestätigen
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
            <Box bg="white" borderRadius="2xl" p={8} boxShadow="0 4px 24px rgba(0,0,0,0.08)" textAlign="center">
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
                Widerruf eingegangen
              </Heading>
              <Text color="gray.500" mb={5}>
                Vielen Dank, <b>{form.name}</b>. Wir haben Ihre Widerrufserklärung erhalten.
                Eine Eingangsbestätigung wurde an <b>{form.email}</b> gesendet.
              </Text>

              <Box bg="#f5f5f5" borderRadius="xl" p={5} mb={5} textAlign="left">
                <Text fontSize="xs" fontWeight="700" color="gray.500" textTransform="uppercase" letterSpacing="0.1em" mb={3}>
                  Inhalt Ihrer Widerrufserklärung
                </Text>
                <VStack spacing={2} align="stretch" fontSize="sm">
                  <HStack justify="space-between"><Text color="gray.500">Name</Text><Text fontWeight="700" color="gray.800">{form.name}</Text></HStack>
                  <HStack justify="space-between"><Text color="gray.500">Bestellnummer</Text><Text fontWeight="700" color="gray.800">{form.bestellnummer}</Text></HStack>
                  <HStack justify="space-between"><Text color="gray.500">E-Mail</Text><Text fontWeight="700" color="gray.800">{form.email}</Text></HStack>
                  <Divider my={1} />
                  <HStack justify="space-between"><Text color="gray.500">Eingegangen am</Text><Text fontWeight="700" color="gray.800">{eingangText}</Text></HStack>
                </VStack>
              </Box>

              <Text fontSize="xs" color="gray.400" mb={6} lineHeight="1.6">
                Diese Bestätigung dient dem Nachweis des Eingangs und stellt keine inhaltliche
                Prüfung oder Anerkennung des Widerrufs dar. Wir setzen uns zur weiteren Abwicklung mit Ihnen in Verbindung.
              </Text>

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

export default Widerruf
