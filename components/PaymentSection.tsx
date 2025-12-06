"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

// Initialize Stripe without the connected account first
// We will re-initialize it once we get the connectedAccountId from the backend
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export default function PaymentSection() {
    const [clientSecret, setClientSecret] = useState("");
    const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
    const [mode, setMode] = useState<"pay_now" | "reserve" | "save_card">("pay_now");
    const [saveCard, setSaveCard] = useState(false);

    // 1. Fetch Client Secret when Mode Changes
    const fetchSecret = async (selectedMode: string, isSaveCardChecked: boolean) => {
        let endpoint = "/create-payment-intent";
        let body: any = { amount: 500, currency: "gbp", saveCard: isSaveCardChecked };

        if (selectedMode === "reserve") {
            endpoint = "/create-setup-intent";
            body = {};
        } else if (selectedMode === "save_card") {
            endpoint = "/create-customer-setup-intent";
            body = {};
        }

        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }
            const data = await res.json();
            setClientSecret(data.clientSecret);

            // Initialize Stripe with the connected account ID from the backend
            if (data.connectedAccountId) {
                setStripePromise(loadStripe(stripePublishableKey, {
                    stripeAccount: data.connectedAccountId
                }));
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error("Error fetching secret:", errorMessage);
            console.error("Endpoint:", `${API_BASE_URL}${endpoint}`);
            console.error("Body:", body);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchSecret("pay_now", false);
    }, []);

    // Handle Radio Change
    const handleModeChange = (newMode: "pay_now" | "reserve" | "save_card") => {
        setMode(newMode);
        setClientSecret(""); // Clear old secret while loading
        fetchSecret(newMode, saveCard);
    };

    // Handle Checkbox Change
    const handleSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setSaveCard(checked);
        if (mode === "pay_now") {
            setClientSecret("");
            fetchSecret("pay_now", checked);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Payment Options</h2>

            {/* Payment Mode Selector */}
            <div className="space-y-3 mb-8">
                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'pay_now' ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-600 hover:border-gray-500'}`}>
                    <div className="flex items-center gap-4">
                        <input
                            type="radio"
                            name="mode"
                            className="w-5 h-5 text-yellow-500 accent-yellow-500"
                            checked={mode === 'pay_now'}
                            onChange={() => handleModeChange('pay_now')}
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-lg">Pay Full Amount</div>
                            <div className="text-sm text-gray-400">Secure your booking with payment now</div>
                        </div>
                        <div className="text-yellow-500 font-bold text-xl">£5.00</div>
                    </div>

                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'reserve' ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-600 hover:border-gray-500'}`}>
                    <div className="flex items-center gap-4">
                        <input
                            type="radio"
                            name="mode"
                            className="w-5 h-5 text-yellow-500 accent-yellow-500"
                            checked={mode === 'reserve'}
                            onChange={() => handleModeChange('reserve')}
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-lg">Reserve Slot</div>
                            <div className="text-sm text-gray-400">Hold your appointment, pay later</div>
                        </div>
                        <div className="text-gray-400 font-bold text-xl">£0</div>
                    </div>
                </label>

                <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === 'save_card' ? 'border-yellow-500 bg-yellow-500/5' : 'border-gray-600 hover:border-gray-500'}`}>
                    <div className="flex items-center gap-4">
                        <input
                            type="radio"
                            name="mode"
                            className="w-5 h-5 text-yellow-500 accent-yellow-500"
                            checked={mode === 'save_card'}
                            onChange={() => handleModeChange('save_card')}
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-lg">Save Card Only</div>
                            <div className="text-sm text-gray-400">Save payment method for future use</div>
                        </div>
                    </div>
                </label>
            </div>

            {/* Stripe Payment Form */}
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                    {mode === 'pay_now' && (
                        <label className="flex items-center text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                            <input
                                type="checkbox"
                                className="mr-2 w-4 h-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-500/50"
                                checked={saveCard}
                                onChange={handleSaveCardChange}
                            />
                            Save for future
                        </label>
                    )}
                </div>
                {clientSecret && stripePromise ? (
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: 'night',
                                variables: {
                                    colorPrimary: '#d4af37',
                                    colorBackground: '#111827',
                                    colorText: '#ffffff',
                                    colorDanger: '#ef4444',
                                    borderRadius: '8px'
                                }
                            }
                        }}
                    >
                        <PaymentForm mode={mode} />
                    </Elements>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-gray-400">
                        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p>Loading secure payment...</p>
                    </div>
                )}
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secured by Stripe • Your payment information is encrypted</span>
            </div>
        </div>
    );
}
