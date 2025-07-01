import {
	Box,
	Container,
	Heading,
	Text,
	Button,
	Stack,
	HStack,
	VStack,
	Image,
	IconButton,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import { db } from '../firebase';
import { collection, addDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { encryptSensitiveData } from '../utils/encryption';


const Cart = () => {
	const { items, removeFromCart, updateQuantity, clearCart } = useCart();
	const total = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const initialRef = useRef(null);
	const toast = useToast();
	const [form, setForm] = useState({ name: '', address: '', email: '', team: '' });
	const [pdfUrl, setPdfUrl] = useState<string | null>(null);
	const [sending, setSending] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const navigate = useNavigate();

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleCheckout = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Bestellung in Firestore speichern
		setSending(true);
		try {
			const orderData = {
				name: form.name,
				address: form.address,
				email: form.email,
				team: form.team,
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
					customInitials: item.customInitials || null
				})),
				total,
				createdAt: new Date(),
			};

			// Verschlüsseln der sensiblen Daten
			const encryptedOrderData = encryptSensitiveData(orderData);

			// Bestellung in Firestore speichern und ID abrufen
			const orderRef = await addDoc(collection(db, 'bestellungen'), encryptedOrderData);
			const orderId = orderRef.id;

			// PDF mit Bestellungs-ID generieren
			const doc = new jsPDF();
			doc.setFontSize(18);
			doc.text('Rechnung', 14, 18);
			doc.setFontSize(12);
			doc.text(`Bestellungs-ID: ${orderId}`, 14, 26);
			doc.text(`Name: ${form.name}`, 14, 34);
			doc.text(`Adresse: ${form.address}`, 14, 42);
			doc.text(`E-Mail: ${form.email}`, 14, 50);
			doc.text(`Team: ${form.team}`, 14, 58);
			doc.text(' ', 14, 66);
			doc.text('Produkte:', 14, 74);
			let y = 82;
			items.forEach((item, idx) => {
				doc.text(
					`${idx + 1}. ${item.name}${item.size ? ' (' + item.size + ')' : ''} x${item.quantity} á ${item.price.toFixed(2)}€ = ${(item.price * item.quantity).toFixed(2)}€`,
					14,
					y
				);
				y += 8;
				if (item.customName) {
					doc.text(`   Name: ${item.customName}`, 18, y);
					y += 6;
				}
				if (item.customNumber) {
					doc.text(`   Nummer: ${item.customNumber}`, 18, y);
					y += 6;
				}
				if (item.customInitials) {
					doc.text(`   Initialen: ${item.customInitials}`, 18, y);
					y += 6;
					doc.text(`   Initialisierung: +3,50€`, 18, y);
					y += 6;
				}
			});
			doc.text(' ', 14, y);
			y += 8;
			doc.setFontSize(14);
			doc.text(`Gesamtsumme: ${total.toFixed(2)}€`, 14, y);

			y += 8;
			doc.text(' ', 14, y);
			y += 8;
			doc.setFontSize(12);
			doc.text('Bitte überweisen Sie den Betrag auf das folgende Konto:', 14, y);
			y += 8;
			doc.text('Empfänger: FÖV MTV Geismar', 14, y);
			y += 8;
			doc.text('IBAN: DE75 2605 0001 0000 1743 00', 14, y);
			y += 8;
			doc.text('Bitte geben Sie Ihren Namen & Bestellnummer als Verwendungszweck an.', 14, y);

			// PDF als Blob-URL erzeugen
			const pdfBlob = doc.output('blob');
			const url = URL.createObjectURL(pdfBlob);
			setPdfUrl(url);

			setShowConfirmation(true);
			clearCart();
		} catch (err) {
			toast({ title: 'Fehler beim Speichern der Bestellung!', status: 'error', duration: 4000, isClosable: true });
			console.log(err);
		}
		setSending(false);
	};

	const handleGoToShop = () => {
		setShowConfirmation(false);
		setPdfUrl(null);
		setForm({ name: '', address: '', email: '', team: '' });
		onClose();
		navigate('/shop');
	};

	if (items.length === 0 && !showConfirmation) {
		return (
			<Box
				minH="80vh"
				bg="#222"
				display="flex"
				alignItems="center"
				justifyContent="center"
				px={4}>
				<Container
					maxW="md"
					bg="white"
					borderRadius="lg"
					boxShadow="xl"
					p={8}
					textAlign="center">
					<Heading size="lg" mb={4}>
						Ihr Warenkorb ist leer
					</Heading>
					<Text>
						Fügen Sie Produkte hinzu, um mit dem Einkaufen zu
						beginnen.
					</Text>
				</Container>
			</Box>
		);
	}

	return (
		<Box minH="80vh" bg="#222" py={8} px={4}>
			<Container
				maxW="3xl"
				bg="white"
				borderRadius="lg"
				boxShadow="xl"
				p={8}>
				<Heading mb={6}>Warenkorb</Heading>
				<Stack spacing={6}>
					{items.map((item) => (
						<Box
							key={item.id + (item.size || '')}
							p={4}
							borderWidth="1px"
							borderRadius="md"
							boxShadow="sm">
							<HStack spacing={4} align="center">
								<Image
									src={item.image}
									alt={item.name}
									boxSize="100px"
									objectFit="cover"
									borderRadius="md"
								/>
								<VStack align="start" spacing={1} flex={1}>
									<Heading size="sm" color="black">
										{item.name}
									</Heading>
									{item.size && (
										<Text fontSize="sm" color="gray.600">
											Größe: <b>{item.size}</b>
										</Text>
									)}
									{item.customName && (
										<Text fontSize="sm" color="gray.600">
											Name: <b>{item.customName}</b>
										</Text>
									)}
									{item.customNumber && (
										<Text fontSize="sm" color="gray.600">
											Nummer: <b>{item.customNumber}</b>
										</Text>
									)}
									{item.customInitials && (
										<Text fontSize="sm" color="gray.600">
											Initialen: <b>{item.customInitials}</b>
										</Text>
									)}
									<Text fontSize="sm" color="black">
										€{item.price.toFixed(2)} pro Stück
									</Text>
								</VStack>
								<HStack spacing={2}>
									<IconButton
										icon={<FaMinus />}
										size="sm"
										aria-label="Menge verringern"
										colorScheme="red"
										variant="outline"
										onClick={() =>
											updateQuantity(
												item.id,
												Math.max(0, item.quantity - 1),
												item.size,
												item.customName,
												item.customNumber,
												item.customInitials
											)
										}
									/>
									<Text >{item.quantity}</Text>
									<IconButton
										icon={<FaPlus />}
										size="sm"
										aria-label="Menge erhöhen"
										colorScheme="red"
										variant="outline"
										onClick={() =>
											updateQuantity(
												item.id,
												item.quantity + 1,
												item.size,
												item.customName,
												item.customNumber,
												item.customInitials
											)
										}
									/>
								</HStack>
								<Text fontWeight="bold" color="black">
									€{(item.price * item.quantity).toFixed(2)}
								</Text>
								<IconButton
									icon={<FaTrash />}
									aria-label="Produkt entfernen"
									size="sm"
									colorScheme="red"
									variant="ghost"
									onClick={() => removeFromCart(item.id, item.size, item.customName, item.customNumber, item.customInitials)}
								/>
							</HStack>
						</Box>
					))}

					{/* Visuelle Trennlinie */}
					<Box borderTop="1px solid #eee" my={4} />

					<Box textAlign="right">
						<Text fontSize="xl" fontWeight="bold">
							Gesamtsumme: €{total.toFixed(2)}
						</Text>
					</Box>

					<Button colorScheme="red" size="lg" alignSelf="flex-end" onClick={onOpen}>
						Zur Kasse
					</Button>
				</Stack>
			</Container>

			{/* Checkout Modal */}
			<Modal isOpen={isOpen || showConfirmation} onClose={onClose} initialFocusRef={initialRef}>
				<ModalOverlay />
				<ModalContent>
					{showConfirmation ? (
						<>
							<ModalHeader>Bestellung abgeschlossen!</ModalHeader>
							<ModalCloseButton onClick={handleGoToShop} />
							<ModalBody pb={6}>
								<Text mb={4} fontWeight="bold">Vielen Dank für Ihre Bestellung!</Text>
								<Text mb={4} fontWeight="bold">Bitte Überweisen sie den Betrag auf das folgende Konto:</Text>
								<Text mb={4} fontWeight="bold">Empfänger: FÖV MTV Geismar</Text>
								<Text mb={4} fontWeight="bold">IBAN: DE75 2605 0001 0000 1743 00</Text>
								<Text mb={4} fontWeight="bold">Bitte geben Sie Ihren Namen & Bestellnummer als Verwendungszweck an.</Text>
								{pdfUrl && (
									<Box mt={4}>
										<Button as="a" href={pdfUrl} download="rechnung.pdf" colorScheme="green" width="full">
											Rechnung herunterladen
										</Button>
									</Box>
								)}
							</ModalBody>
							<ModalFooter>
								<Button colorScheme="red" onClick={handleGoToShop}>
									Zum Shop
								</Button>
							</ModalFooter>
						</>
					) : (
						<form onSubmit={handleCheckout}>
							<ModalHeader>Rechnungsdaten</ModalHeader>
							<ModalCloseButton />
							<ModalBody pb={6}>
								<FormControl isRequired mb={3}>
									<FormLabel>Name</FormLabel>
									<Input ref={initialRef} name="name" value={form.name} onChange={handleInput} />
								</FormControl>
								<FormControl isRequired mb={3}>
									<FormLabel>Adresse</FormLabel>
									<Input name="address" value={form.address} onChange={handleInput} />
								</FormControl>
								<FormControl isRequired mb={3}>
									<FormLabel>E-Mail</FormLabel>
									<Input name="email" type="email" value={form.email} onChange={handleInput} />
								</FormControl>
								<FormControl isRequired mb={3}>
									<FormLabel>Team</FormLabel>
									<Input name="team" value={form.team} onChange={handleInput} placeholder="z.B. Herren 1, Jugend, etc." />
								</FormControl>
								{pdfUrl && (
									<Box mt={4}>
										<Button as="a" href={pdfUrl} download="rechnung.pdf" colorScheme="green" width="full">
											Rechnung herunterladen
										</Button>
									</Box>
								)}
							</ModalBody>
							<ModalFooter>
								<Button colorScheme="red" mr={3} type="submit" isLoading={sending}>
									Bestellung abschließen
								</Button>
								<Button onClick={onClose}>Abbrechen</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default Cart;
