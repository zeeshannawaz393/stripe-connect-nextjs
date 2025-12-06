"use client";

import React, { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";

export default function PaymentForm({ mode }: { mode: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setIsLoading(true);

        const returnUrl = window.location.href;

        let error;

        if (mode === 'pay_now') {
            const res = await stripe.confirmPayment({
                elements,
                confirmParams: { return_url: returnUrl },
            });
            error = res.error;
        } else {
            const res = await stripe.confirmSetup({
                elements,
                confirmParams: { return_url: returnUrl },
            });
            error = res.error;
        }

        if (error) {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("Success!");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement
                onLoadError={(event) => {
                    console.error("PaymentElement load error:", event);
                    const errorMsg = event.error?.message || 'Payment element failed to load. This usually means the Stripe publishable key does not match the account that created the payment intent.';
                    setMessage(errorMsg);
                }}
            />
            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded transition-colors disabled:opacity-50"
            >
                {isLoading ? "Processing..." : mode === 'pay_now' ? "Pay £5.00" : "Confirm Setup"}
            </button>
            {message && <div className="mt-4 text-center text-red-400">{message}</div>}
        </form>
    );
}
