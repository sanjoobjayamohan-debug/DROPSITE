import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import { CourierType, CustomerInfo, Order, PaymentMethod } from '../../types';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Mail,
  Smartphone,
  MapPin,
  Building,
  ShieldCheck,
  QrCode,
  Banknote,
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
    appliedDiscount,
    discountCode,
    setCurrentView,
    setActiveTrackingOrder,
    showToast,
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'courier' | 'payment' | 'confirmation'>('shipping');

  // Customer shipping info tailored for Indian market
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Nilgiri Greens, Ring Road',
    landmark: 'Opposite Metro Station Gate 2',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    zip: '380015',
    country: 'India',
  });

  // Courier selection
  const [selectedCourier, setSelectedCourier] = useState<CourierType>('Delhivery Surface Express');
  const [shippingCost, setShippingCost] = useState(0);

  // Payment method (UPI, COD, Card, Net Banking)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI (GPay / PhonePe / Paytm / BHIM)');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8812');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('319');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmed Order result
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const rawSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const finalTotal = rawSubtotal - discountAmount + shippingCost;

  const handleCourierSelect = (courier: CourierType, fee: number) => {
    setSelectedCourier(courier);
    // Free shipping if order above ₹1,999 on standard couriers
    if (rawSubtotal >= 1999) {
      setShippingCost(0);
    } else {
      setShippingCost(fee);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.phone || customer.phone.replace(/\D/g, '').length < 10) {
      showToast('Invalid Mobile Number', 'Please enter a valid 10-digit Indian mobile number for consignment SMS updates.', 'warning');
      return;
    }
    if (!customer.landmark || customer.landmark.trim().length < 3) {
      showToast('Landmark Required', 'Please provide a nearby landmark for smooth delivery executive navigation.', 'warning');
      return;
    }
    setStep('courier');
  };

  const handleSubmitOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder(customer, paymentMethod, selectedCourier, shippingCost);
      setConfirmedOrder(order);
      setIsProcessing(false);
      setStep('confirmation');
    }, 700);
  };

  const handleTrackDirectly = () => {
    if (confirmedOrder) {
      setActiveTrackingOrder(confirmedOrder);
      setIsCheckoutOpen(false);
      setCurrentView('tracking');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Minimal Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-xl font-medium tracking-wider text-stone-900">
              AURA
            </span>
            <span className="text-stone-300">/</span>
            <span className="text-xs font-medium tracking-wider uppercase text-stone-600">
              {step === 'shipping' && 'Delivery Address & Coordinates'}
              {step === 'courier' && 'Select Courier Partner'}
              {step === 'payment' && 'Payment Method'}
              {step === 'confirmation' && 'Consignment Confirmed'}
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          
          {/* STEP 1: SHIPPING DETAILS WITH MOBILE NUMBER & LANDMARK */}
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div>
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  Delivery Destination
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Enter your address details. Mobile number and landmark are mandatory to ensure effortless last-mile delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* First Name & Last Name */}
                <div>
                  <label className="block font-medium text-stone-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* Mobile Number (Crucial for Indian Logistics) */}
                <div className="sm:col-span-1">
                  <label className="block font-medium text-stone-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-stone-600" />
                      <span>Mobile Number</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-light">Delivery OTP & SMS updates</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-stone-500 text-xs">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={customer.phone.replace('+91 ', '')}
                      onChange={(e) => setCustomer({ ...customer, phone: `+91 ${e.target.value}` })}
                      className="w-full pl-11 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl font-mono text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="sm:col-span-1">
                  <label className="block font-medium text-stone-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* House / Flat / Street Address */}
                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">
                    Flat, House No., Apartment, Street
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="e.g. 402, Nilgiri Greens, Ring Road"
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* Landmark (User Requirement) */}
                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-800 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-stone-600" />
                      <span>Landmark (Required)</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-light">Near metro, temple, bank, or landmark building</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.landmark || ''}
                    onChange={(e) => setCustomer({ ...customer, landmark: e.target.value })}
                    placeholder="e.g. Opposite Metro Station Gate 2, Behind Apollo Pharmacy"
                    className="w-full p-2.5 bg-[#FAF9F6] border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:border-stone-800"
                  />
                </div>

                {/* PIN Code, City, State */}
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    6-Digit Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pincode || customer.zip}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value, zip: e.target.value })}
                    placeholder="e.g. 380015"
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-mono focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="e.g. Ahmedabad / Bengaluru / Mumbai"
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">State</label>
                  <select
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl font-medium focus:outline-none focus:border-stone-800"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-7 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-semibold rounded-full shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Select Courier Partner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: COURIER SELECTION */}
          {step === 'courier' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  Delivery Logistics
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Direct dispatch from artisan clusters via India's leading surface and air courier networks.
                </p>
              </div>

              <div className="space-y-3">
                {/* Delhivery */}
                <div
                  onClick={() => handleCourierSelect('Delhivery Surface Express', rawSubtotal >= 1999 ? 0 : 70)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedCourier === 'Delhivery Surface Express'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-stone-700" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900">Delhivery Express</h4>
                      <p className="text-[11px] text-stone-500 font-light">
                        2-3 Business Days · Full SMS & WhatsApp updates
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-stone-900">
                    {rawSubtotal >= 1999 ? 'Complimentary' : '₹70'}
                  </span>
                </div>

                {/* BlueDart */}
                <div
                  onClick={() => handleCourierSelect('BlueDart Air Express', 120)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedCourier === 'BlueDart Air Express'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-stone-700" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900">BlueDart Air Priority</h4>
                      <p className="text-[11px] text-stone-500 font-light">
                        Next-Day Metro Dispatch · Expedited air freight
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-stone-900">₹120</span>
                </div>

                {/* India Post Speed Post */}
                <div
                  onClick={() => handleCourierSelect('India Post Speed Post', rawSubtotal >= 1999 ? 0 : 50)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedCourier === 'India Post Speed Post'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-stone-700" />
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900">India Post Speed Post</h4>
                      <p className="text-[11px] text-stone-500 font-light">
                        Comprehensive Pin Code Coverage across all rural & tier 3 hubs
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-stone-900">
                    {rawSubtotal >= 1999 ? 'Complimentary' : '₹50'}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-xs font-medium tracking-wider uppercase text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-7 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-semibold rounded-full shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  Payment Method
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Select your preferred settlement method. All digital transactions are secured with 256-bit encryption.
                </p>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI (GPay / PhonePe / Paytm / BHIM)')}
                  className={`p-3.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod.includes('UPI')
                      ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-stone-800" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                  className={`p-3.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod.includes('Cash on Delivery')
                      ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-stone-800" />
                  <span>Pay on Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Debit / Credit Card (RuPay / Visa / MC)')}
                  className={`p-3.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod.includes('Debit / Credit Card')
                      ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-stone-800" />
                  <span>Card / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Net Banking')}
                  className={`p-3.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod.includes('Net Banking')
                      ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <Building className="w-5 h-5 text-stone-800" />
                  <span>Net Banking</span>
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod.includes('UPI') && (
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-medium text-stone-900">
                    <span>Instant UPI Settlement</span>
                    <span className="text-[10px] text-stone-500">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                  <div>
                    <label className="block text-stone-600 font-light mb-1">Enter UPI VPA ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@okhdfcbank"
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-mono text-xs focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>
              )}

              {/* Cash On Delivery Notice */}
              {paymentMethod.includes('Cash on Delivery') && (
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 text-xs text-stone-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-stone-700" />
                    <span>Pay Upon Delivery</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    Pay <strong>{formatINR(finalTotal)}</strong> in cash or via delivery executive UPI scanner when the parcel arrives at{' '}
                    <strong>{customer.address}</strong> (Landmark: {customer.landmark}).
                  </p>
                </div>
              )}

              {/* Cards Form */}
              {paymentMethod.includes('Debit / Credit Card') && (
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-light mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 font-light mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 font-light mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod.includes('Net Banking') && (
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-2 text-xs">
                  <label className="block font-light text-stone-600">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-medium"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {/* Order Summary in INR */}
              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 font-light">
                  <span>Cart Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} pieces)</span>
                  <span className="font-medium text-stone-900 tabular-nums">{formatINR(rawSubtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-stone-800 font-light">
                    <span>Courtesy ({discountCode})</span>
                    <span className="tabular-nums">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600 font-light">
                  <span>Shipping ({selectedCourier.split(' ')[0]})</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    {shippingCost === 0 ? 'Complimentary' : formatINR(shippingCost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-semibold text-stone-900">
                  <span>Total Amount</span>
                  <span className="tabular-nums font-mono">{formatINR(finalTotal)}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('courier')}
                  className="text-xs font-medium tracking-wider uppercase text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="px-8 py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-semibold rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Confirming with Atelier...</span>
                  ) : (
                    <>
                      <span>Place Order · {formatINR(finalTotal)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ORDER CONFIRMATION */}
          {step === 'confirmation' && confirmedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 bg-stone-100 text-stone-900 rounded-full flex items-center justify-center mx-auto border border-stone-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-3xl font-medium text-stone-900">
                  Thank You for Supporting Handloom Craft
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Consignment <strong>#{confirmedOrder.orderNumber}</strong> has been received by our atelier workshop.
                </p>
              </div>

              {/* Notification Banner */}
              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-stone-200 text-left flex items-start gap-3 text-xs">
                <Smartphone className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-medium text-stone-900">
                    Dispatch Updates via SMS & Email
                  </div>
                  <div className="text-stone-600 font-light text-[11px] leading-relaxed">
                    Live tracking updates will be transmitted to <strong>{confirmedOrder.customer.phone}</strong> and an official tax invoice to <strong>{confirmedOrder.customer.email}</strong>.
                  </div>
                </div>
              </div>

              {/* Order Breakdown Box */}
              <div className="p-5 bg-[#FAF9F6] rounded-xl border border-stone-200 text-left space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Order No.</span>
                    <span className="font-mono font-medium text-stone-900">{confirmedOrder.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Destination</span>
                    <span className="font-medium text-stone-900">
                      {confirmedOrder.customer.city}, {confirmedOrder.customer.state} ({confirmedOrder.customer.pincode})
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Landmark</span>
                    <span className="font-medium text-stone-800">{confirmedOrder.customer.landmark}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px] uppercase tracking-wider">Logistics & Payment</span>
                    <span className="font-medium text-stone-800">{confirmedOrder.courier} · {confirmedOrder.paymentMethod}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200">
                  <div className="font-medium text-stone-800 mb-2 uppercase tracking-wider text-[11px]">Selected Garments:</div>
                  {confirmedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 text-[11px]">
                      <span className="text-stone-700 font-light">
                        {it.name} {it.selectedSize ? `(${it.selectedSize})` : ''} <span className="text-stone-400">×{it.quantity}</span>
                      </span>
                      <span className="font-medium text-stone-900 tabular-nums">
                        {formatINR(it.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2.5 border-t border-stone-200 flex justify-between font-semibold text-stone-900 text-sm">
                    <span>Total Amount</span>
                    <span className="tabular-nums font-mono">{formatINR(confirmedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleTrackDirectly}
                  className="w-full sm:w-auto px-7 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Consignment</span>
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-white border border-stone-300 hover:border-stone-800 text-stone-800 text-xs tracking-wider uppercase font-medium rounded-full transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
