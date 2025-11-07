import React from 'react';

interface PaywallScreenProps {
  onPaymentSuccess: () => void;
}

const PaywallScreen: React.FC<PaywallScreenProps> = ({ onPaymentSuccess }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center text-center animate-fade-in max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Unlock Full Access</h1>
      <p className="text-gray-600 mb-6">
        To play "Am I The Asshole?", please make a one-time purchase to unlock all cards and features.
      </p>
      <button
        onClick={onPaymentSuccess}
        className="w-full max-w-xs py-4 text-xl font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg shadow-lg hover:scale-105 transform transition-transform"
      >
        Pay $4.99 to Play
      </button>
      <p className="text-xs text-gray-500 mt-4">This is a demo. Clicking this button will unlock the game.</p>
    </div>
  );
};

export default PaywallScreen;
