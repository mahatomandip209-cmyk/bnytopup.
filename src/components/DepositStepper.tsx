import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  Wallet,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Building2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Trash2,
  Eye,
  FileImage
} from "lucide-react";

interface DepositStepperProps {
  depositMethod: "esewa" | "khalti" | "binance" | "uaebank";
  setDepositMethod: (method: "esewa" | "khalti" | "binance" | "uaebank") => void;
  walletAmt: string;
  setWalletAmt: (amt: string) => void;
  esewaTrx: string;
  setEsewaTrx: (trx: string) => void;
  depositProofImage: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDepositProofImage: (img: string | null) => void;
  submitDeposit: () => Promise<void>;
  loading: boolean;
  paymentSettings: { qrCode: string; esewaNum: string };
  copyToClipboard: (text: string, type: "esewa" | "id") => void;
  copiedEsewa: boolean;
  convertAndFormatPrice: (price: number) => string;
}

export const DepositStepper: React.FC<DepositStepperProps> = ({
  depositMethod,
  setDepositMethod,
  walletAmt,
  setWalletAmt,
  esewaTrx,
  setEsewaTrx,
  depositProofImage,
  handleImageUpload,
  setDepositProofImage,
  submitDeposit,
  loading,
  paymentSettings,
  copyToClipboard,
  copiedEsewa,
  convertAndFormatPrice
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presetAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleNextFromStep1 = () => {
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    setErrorMsg(null);
    const amt = parseFloat(walletAmt);
    if (!walletAmt || isNaN(amt) || amt <= 0) {
      setErrorMsg("Please enter a valid deposit amount greater than 0.");
      return;
    }
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setErrorMsg(null);
    if (!depositProofImage) {
      setErrorMsg("Please upload a transaction proof image (screenshot) to proceed.");
      return;
    }
    try {
      await submitDeposit();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit deposit. Please try again.");
    }
  };

  const getMethodDetails = () => {
    switch (depositMethod) {
      case "esewa":
        return {
          title: "eSewa Direct QR / ID",
          badge: "Instant Verification",
          numberLabel: "eSewa ID / Phone",
          numberValue: paymentSettings.esewaNum || "9825880400",
          qrImage: paymentSettings.qrCode,
          remarks: "BILL PAYMENTS / NO THIRD PARTY",
          color: "border-green-500/40 text-green-400 bg-green-500/10"
        };
      case "khalti":
        return {
          title: "Khalti Digital Wallet",
          badge: "Instant Verification",
          numberLabel: "Khalti ID / Phone",
          numberValue: paymentSettings.esewaNum || "9825880400",
          qrImage: paymentSettings.qrCode,
          remarks: "BILL PAYMENTS / BNY TOPUP",
          color: "border-purple-500/40 text-purple-400 bg-purple-500/10"
        };
      case "binance":
        return {
          title: "Binance Pay / Crypto (USDT)",
          badge: "Crypto Gateway",
          numberLabel: "Binance Pay ID",
          numberValue: "87349102",
          qrImage: paymentSettings.qrCode,
          remarks: "PAYMENT NOTE: BNY STORE",
          color: "border-amber-500/40 text-amber-400 bg-amber-500/10"
        };
      case "uaebank":
        return {
          title: "Bank Transfer / UAE Bank",
          badge: "Manual Verification",
          numberLabel: "Account Number",
          numberValue: paymentSettings.esewaNum || "9825880400",
          qrImage: paymentSettings.qrCode,
          remarks: "TRANSFER REMARKS: YOUR EMAIL",
          color: "border-blue-500/40 text-blue-400 bg-blue-500/10"
        };
    }
  };

  const activeMethod = getMethodDetails();

  return (
    <div className="bg-card-bg rounded-3xl border border-zinc-900 overflow-hidden shadow-2xl space-y-6 p-4 sm:p-6">
      {/* STEPPER HEADER PROGRESS BAR */}
      <div className="relative border-b border-zinc-900 pb-6 pt-2">
        <div className="flex items-center justify-between max-w-md mx-auto relative z-10 px-2 sm:px-6">
          {/* Step 1 Indicator */}
          <div
            onClick={() => setCurrentStep(1)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold font-orbitron transition-all duration-300 ${
                currentStep === 1
                  ? "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110"
                  : currentStep > 1
                  ? "bg-emerald-600 text-white border-2 border-emerald-500 shadow-md"
                  : "bg-black/60 text-zinc-500 border border-zinc-800 group-hover:border-zinc-700"
              }`}
            >
              {currentStep > 1 ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-black uppercase font-orbitron tracking-wider transition-colors ${
                currentStep === 1
                  ? "text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                  : currentStep > 1
                  ? "text-emerald-400"
                  : "text-zinc-600"
              }`}
            >
              1. Method
            </span>
          </div>

          {/* Connecting Line 1-2 */}
          <div className="flex-1 h-0.5 mx-2 bg-zinc-800 relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-emerald-500 transition-all duration-500"
              style={{ width: currentStep > 1 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 2 Indicator */}
          <div
            onClick={() => {
              if (currentStep > 1) setCurrentStep(2);
            }}
            className={`flex flex-col items-center gap-1.5 ${
              currentStep >= 2 ? "cursor-pointer" : "cursor-not-allowed opacity-60"
            } group`}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold font-orbitron transition-all duration-300 ${
                currentStep === 2
                  ? "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110"
                  : currentStep > 2
                  ? "bg-emerald-600 text-white border-2 border-emerald-500 shadow-md"
                  : "bg-black/60 text-zinc-500 border border-zinc-800"
              }`}
            >
              {currentStep > 2 ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <span
              className={`text-[10px] sm:text-xs font-black uppercase font-orbitron tracking-wider transition-colors ${
                currentStep === 2
                  ? "text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                  : currentStep > 2
                  ? "text-emerald-400"
                  : "text-zinc-600"
              }`}
            >
              2. Amount
            </span>
          </div>

          {/* Connecting Line 2-3 */}
          <div className="flex-1 h-0.5 mx-2 bg-zinc-800 relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-emerald-500 transition-all duration-500"
              style={{ width: currentStep > 2 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 3 Indicator */}
          <div
            onClick={() => {
              if (currentStep > 2) setCurrentStep(3);
            }}
            className={`flex flex-col items-center gap-1.5 ${
              currentStep >= 3 ? "cursor-pointer" : "cursor-not-allowed opacity-60"
            } group`}
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold font-orbitron transition-all duration-300 ${
                currentStep === 3
                  ? "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110"
                  : "bg-black/60 text-zinc-500 border border-zinc-800"
              }`}
            >
              <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span
              className={`text-[10px] sm:text-xs font-black uppercase font-orbitron tracking-wider transition-colors ${
                currentStep === 3
                  ? "text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                  : "text-zinc-600"
              }`}
            >
              3. Proof
            </span>
          </div>
        </div>
      </div>

      {/* ERROR ALERT NOTIFICATION */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-500/10 border border-red-500/40 rounded-2xl p-3.5 flex items-center gap-3 text-red-400 text-xs font-mono shadow-md"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <p className="flex-1 font-bold">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP CONTENT SWITCHER */}
      <AnimatePresence mode="wait">
        {/* STEP 1: PAYMENT METHOD SELECTION */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-orbitron font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                Select Payment Method
              </h3>
              <p className="text-zinc-400 text-xs font-mono mt-1">
                Choose your preferred payment gateway to add funds to your wallet.
              </p>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "esewa",
                  name: "eSewa Direct QR / ID",
                  sub: "Instant Mobile Wallet",
                  badge: "Recommended",
                  icon: QrCode,
                  accent: "border-green-500/60 bg-green-500/5 text-green-400"
                },
                {
                  id: "khalti",
                  name: "Khalti Wallet",
                  sub: "Instant QR Payment",
                  badge: "Popular",
                  icon: Wallet,
                  accent: "border-purple-500/60 bg-purple-500/5 text-purple-400"
                },
                {
                  id: "binance",
                  name: "Binance Pay / Crypto",
                  sub: "USDT / Crypto Deposit",
                  badge: "Crypto",
                  icon: CreditCard,
                  accent: "border-amber-500/60 bg-amber-500/5 text-amber-400"
                },
                {
                  id: "uaebank",
                  name: "Bank Transfer",
                  sub: "Local & International",
                  badge: "Bank Wire",
                  icon: Building2,
                  accent: "border-blue-500/60 bg-blue-500/5 text-blue-400"
                }
              ].map((m) => {
                const isSelected = depositMethod === m.id;
                const IconComp = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setDepositMethod(m.id as any)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 relative ${
                      isSelected
                        ? "bg-red-950/30 border-red-500/80 shadow-[0_0_20px_rgba(220,38,38,0.25)] scale-[1.02]"
                        : "bg-black/40 border-zinc-900 hover:border-zinc-800 hover:bg-black/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          isSelected
                            ? "bg-red-600 text-white border-red-500"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white tracking-wide">
                            {m.name}
                          </h4>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${m.accent}`}>
                            {m.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{m.sub}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Method Details & QR Display */}
            <div className="bg-black/40 p-5 rounded-2xl border border-zinc-900 flex flex-col items-center space-y-4 text-center">
              <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${activeMethod.color}`}>
                {activeMethod.badge}
              </span>

              <h4 className="font-orbitron font-extrabold text-xs text-red-500 uppercase tracking-widest filter drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">
                {activeMethod.title}
              </h4>

              {/* QR Code Container */}
              <div className="bg-white p-2.5 rounded-2xl border-4 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.35)] aspect-square w-48 h-48 flex items-center justify-center relative overflow-hidden">
                <img
                  id="qr-display"
                  src={activeMethod.qrImage}
                  alt={`${activeMethod.title} QR`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Account Number & Copy Button */}
              <div className="space-y-1.5 font-mono w-full max-w-xs">
                <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-extrabold">
                  {activeMethod.numberLabel}
                </p>
                <div className="flex items-center justify-center gap-2 bg-black/60 py-2.5 px-3 rounded-xl border border-zinc-800">
                  <b className="text-red-500 text-sm tracking-widest font-mono filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                    {activeMethod.numberValue}
                  </b>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(activeMethod.numberValue, "esewa")}
                    className="bg-zinc-900 hover:bg-zinc-800 p-1.5 rounded-lg text-red-500 hover:text-white border border-zinc-800 cursor-pointer transition-colors shadow-sm"
                    title="Copy Details"
                  >
                    {copiedEsewa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {copiedEsewa && (
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Warning Remarks Badge */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 w-full max-w-xs text-center">
                <p className="text-[10px] font-black text-red-400 tracking-wider font-mono uppercase">
                  REMARKS: {activeMethod.remarks}
                </p>
              </div>
            </div>

            {/* Step 1 Next Button */}
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 active:scale-[0.98] text-white transition-all py-3.5 rounded-xl font-bold font-orbitron tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer border border-red-600/40 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              <span>CONTINUE TO ENTER AMOUNT</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: ENTER AMOUNT & TRX ID */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-red-500" />
                  Enter Deposit Amount
                </h3>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${activeMethod.color}`}>
                  {activeMethod.title}
                </span>
              </div>
              <p className="text-zinc-400 text-xs font-mono mt-1">
                Enter the exact amount sent to our account.
              </p>
            </div>

            {/* Deposit Amount Input */}
            <div className="space-y-4">
              <div>
                <label className="text-zinc-400 block mb-1.5 uppercase font-bold text-[10px] font-mono tracking-wider">
                  Deposit Amount (NPR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold font-mono text-zinc-500 text-sm">
                    NPR
                  </span>
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 1000)"
                    value={walletAmt}
                    onChange={(e) => {
                      setWalletAmt(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-full bg-black/60 border border-zinc-800 text-white placeholder-zinc-700 pl-14 pr-4 py-3.5 rounded-xl font-mono text-base focus:outline-none focus:border-red-600 transition-all shadow-inner font-bold"
                  />
                </div>
              </div>

              {/* Preset Quick Chips */}
              <div>
                <label className="text-zinc-500 block mb-2 uppercase font-bold text-[9px] font-mono tracking-wider">
                  Quick Select Presets
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {presetAmounts.map((amt) => {
                    const isSelected = walletAmt === amt.toString();
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setWalletAmt(amt.toString());
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                            : "bg-black/40 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-black/80"
                        }`}
                      >
                        Rs {amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Transaction / Reference ID (Optional) */}
              <div>
                <label className="text-zinc-400 block mb-1.5 uppercase font-bold text-[10px] font-mono tracking-wider">
                  Transaction / Reference ID <span className="text-zinc-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRX123456789 or Reference No."
                  value={esewaTrx}
                  onChange={(e) => setEsewaTrx(e.target.value)}
                  className="w-full bg-black/60 border border-zinc-800 text-white placeholder-zinc-700 px-4 py-3 rounded-xl font-mono text-xs focus:outline-none focus:border-red-600 transition-all"
                />
              </div>

              {/* Instructions Summary Card */}
              <div className="bg-black/30 p-4 rounded-2xl border border-zinc-900 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Selected Method:</span>
                  <span className="text-white font-bold">{activeMethod.title}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Target Account:</span>
                  <span className="text-red-400 font-bold">{activeMethod.numberValue}</span>
                </div>
                <div className="flex justify-between text-zinc-400 border-t border-zinc-900 pt-2 mt-2">
                  <span>Estimated Credit:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">
                    {walletAmt ? convertAndFormatPrice(parseFloat(walletAmt) || 0) : "NPR 0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2 Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setCurrentStep(1);
                }}
                className="w-1/3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-all py-3.5 rounded-xl font-bold font-orbitron tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="button"
                onClick={handleNextFromStep2}
                className="w-2/3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 active:scale-[0.98] text-white transition-all py-3.5 rounded-xl font-bold font-orbitron tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer border border-red-600/40 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                <span>NEXT: UPLOAD PROOF</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: UPLOAD PROOF & SUBMIT */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-orbitron font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-red-500" />
                Upload Transaction Proof
              </h3>
              <p className="text-zinc-400 text-xs font-mono mt-1">
                Attach a clear screenshot or receipt photo of your completed payment.
              </p>
            </div>

            {/* Deposit Summary Overview */}
            <div className="bg-black/50 p-4 rounded-2xl border border-red-600/30 space-y-2 text-xs font-mono shadow-md">
              <div className="flex justify-between items-center text-zinc-400 pb-1.5 border-b border-zinc-900">
                <span>Method:</span>
                <span className="text-white font-bold">{activeMethod.title}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400 pb-1.5 border-b border-zinc-900">
                <span>Deposit Amount:</span>
                <span className="text-red-500 font-black text-sm filter drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]">
                  NPR {walletAmt}
                </span>
              </div>
              {esewaTrx && (
                <div className="flex justify-between items-center text-zinc-400">
                  <span>Trx / Ref ID:</span>
                  <span className="text-zinc-200 font-bold">{esewaTrx}</span>
                </div>
              )}
            </div>

            {/* Drag & Drop Image Upload Zone */}
            <div className="space-y-2">
              <label className="text-zinc-400 block uppercase font-bold text-[10px] font-mono tracking-wider">
                Screenshot / Receipt Image (PNG, JPG, JPEG) <span className="text-red-500">*</span>
              </label>

              {depositProofImage ? (
                <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-5 space-y-4 text-center">
                  {/* Image Preview Container */}
                  <div className="relative mx-auto max-h-56 max-w-[260px] overflow-hidden rounded-2xl border-2 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] bg-black/80 group/preview">
                    <img
                      src={depositProofImage}
                      alt="Proof Preview"
                      className="w-full h-auto object-cover max-h-52"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-mono font-bold bg-black/90 px-3 py-1.5 rounded-xl border border-zinc-700 flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" /> Preview Ready
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold font-mono bg-emerald-500/10 border border-emerald-500/30 py-2 px-4 rounded-xl max-w-xs mx-auto">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Receipt Proof Attached</span>
                  </div>

                  {/* Actions: Change Image & Remove Image */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <label className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm">
                      <FileImage className="w-3.5 h-3.5 text-blue-400" />
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => {
                          handleImageUpload(e);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setDepositProofImage(null);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className="inline-flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 hover:text-red-200 border border-red-800/60 text-xs font-mono font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-zinc-800 rounded-2xl p-6 bg-black/40 hover:border-red-600/60 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      handleImageUpload(e);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="text-center py-4 space-y-2 z-0">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto group-hover:border-red-600/50 transition-colors">
                      <Upload className="w-6 h-6 text-zinc-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-mono">
                        Click or Drag & Drop Screenshot Here
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase font-mono mt-1">
                        Supported: PNG, JPG, JPEG (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setCurrentStep(2);
                }}
                disabled={loading}
                className="w-1/3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-all py-3.5 rounded-xl font-bold font-orbitron tracking-wider text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-800 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className="w-2/3 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 active:scale-[0.98] text-white transition-all py-3.5 rounded-xl font-bold font-orbitron tracking-widest text-xs flex items-center justify-center gap-2.5 cursor-pointer border border-red-600/40 shadow-[0_0_15px_rgba(220,38,38,0.3)] filter drop-shadow-[0_0_5px_rgba(220,38,38,0.25)] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>SUBMITTING...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>SUBMIT DEPOSIT PROOF</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
