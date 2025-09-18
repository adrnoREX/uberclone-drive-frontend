import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const handlePayment = async (selectedService) => {
  if (!selectedService) return;

  try {
    const res = await fetch("http://localhost:8800/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: selectedService.title,
        amount: selectedService.price * 100, // amount in paise/cents
        currency: "inr",
      }),
    });
    const session = await res.json();

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (err) {
    console.error("Payment error:", err);
  }
};
