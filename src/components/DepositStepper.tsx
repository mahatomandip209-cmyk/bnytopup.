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
  ShieldCheck,
  Loader2,
  AlertCircle,
  Sparkles,
  Trash2,
  Eye,
  FileImage,
  Clock,
  XCircle,
  History,
  ArrowRight,
  ExternalLink
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
  userDeposits?: any[];
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
  convertAndFormatPrice,
  userDeposits = []
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedProofModal, setSelectedProofModal] = useState<string | null>(null);

  const handleNextFromStep1 = () => {
    setErrorMsg(null);
    const amt = parseFloat(walletAmt);
    if (!walletAmt || isNaN(amt) || amt <= 0) {
      setErrorMsg("Kripaya deposit garnu parne mulyankan (Amount) 0 bhanda dherai halnuhos.");
      return;
    }
    // Set deposit method to esewa by default
    if (depositMethod !== "esewa") {
      setDepositMethod("esewa");
    }
    setCurrentStep(2);
  };

  const handleFinalSubmit = async () => {
    setErrorMsg(null);
    if (!depositProofImage) {
      setErrorMsg("Kripaya payment gareko screenshot (Proof Image) upload garnuhos.");
      return;
    }
    try {
      await submitDeposit();
    } catch (err: any) {
      setErrorMsg(err?.message || "Deposit request pathauna sakiyana. Kripaya punah prayas garnuhos.");
    }
  };

  return (
    <div className="bg-card-bg rounded-3xl border border-zinc-900 overflow-hidden shadow-2xl space-y-6 p-4 sm:p-6">
      {/* STEPPER HEADER PROGRESS BAR */}
      <div className="relative border-b border-zinc-900 pb-5 pt-1">
        <div className="flex items-center justify-between max-w-sm mx-auto relative z-10 px-4">
          {/* Step 1 Indicator */}
          <div
            onClick={() => setCurrentStep(1)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold font-orbitron transition-all duration-300 ${
                currentStep === 1
                  ? "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110"
                  : "bg-emerald-600 text-white border-2 border-emerald-500 shadow-md"
              }`}
            >
              {currentStep > 1 ? (
                <CheckCircle2 className="w-6 h-6 text-white" />
              ) : (
                <Wallet className="w-5 h-5 text-white" />
              )}
            </div>
            <span
              className={`text-[11px] font-black uppercase font-orbitron tracking-wider transition-colors ${
                currentStep === 1
                  ? "text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                  : "text-emerald-400"
              }`}
            >
              1. Amount
            </span>
          </div>

          {/* Connecting Line 1-2 */}
          <div className="flex-1 h-0.5 mx-3 bg-zinc-800 relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-emerald-500 transition-all duration-500"
              style={{ width: currentStep > 1 ? "100%" : "0%" }}
            />
          </div>

          {/* Step 2 Indicator */}
          <div
            onClick={() => {
              if (walletAmt && parseFloat(walletAmt) > 0) setCurrentStep(2);
            }}
            className={`flex flex-col items-center gap-1.5 ${
              currentStep === 2 ? "cursor-pointer" : "cursor-not-allowed opacity-70"
            } group`}
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold font-orbitron transition-all duration-300 ${
                currentStep === 2
                  ? "bg-red-600 text-white border-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110"
                  : "bg-black/60 text-zinc-500 border border-zinc-800"
              }`}
            >
              <QrCode className="w-5 h-5" />
            </div>
            <span
              className={`text-[11px] font-black uppercase font-orbitron tracking-wider transition-colors ${
                currentStep === 2
                  ? "text-red-500 filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                  : "text-zinc-600"
              }`}
            >
              2. QR & Proof
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
        {/* STEP 1: ENTER AMOUNT PAGE */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header Title with eSewa Badge */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div>
                <h3 className="font-orbitron font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-red-500" />
                  Enter Deposit Amount
                </h3>
                <p className="text-zinc-400 text-xs font-mono mt-0.5">
                  Enter the amount you wish to add to your wallet balance.
                </p>
              </div>

              {/* Single eSewa Payment Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-black font-mono tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>eSewa Direct</span>
              </div>
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
                    placeholder="e.g. 500"
                    value={walletAmt}
                    onChange={(e) => {
                      setWalletAmt(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-full bg-black/60 border border-zinc-800 text-white placeholder-zinc-700 pl-14 pr-4 py-3.5 rounded-xl font-mono text-base focus:outline-none focus:border-red-600 transition-all shadow-inner font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Step 1 Next Button */}
            <button
              type="button"
              onClick={handleNextFromStep1}
              className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 active:scale-[0.98] text-white transition-all py-3.5 rounded-xl font-bold font-orbitron tracking-widest text-xs flex items-center justify-center gap-2 cursor-pointer border border-red-600/40 shadow-[0_0_15px_rgba(220,38,38,0.3)] filter drop-shadow-[0_0_5px_rgba(220,38,38,0.2)]"
            >
              <span>NEXT: VIEW QR & UPLOAD PROOF</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* DEPOSIT HISTORY SECTION ON AMOUNT PAGE */}
            <div className="pt-4 border-t border-zinc-900 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-orbitron font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-red-500" />
                  Your Deposit History
                </h4>
                <span className="text-[10px] font-mono font-bold text-zinc-500 bg-black/60 px-2.5 py-0.5 rounded-full border border-zinc-800">
                  Total: {userDeposits.length}
                </span>
              </div>

              {userDeposits.length === 0 ? (
                <div className="bg-black/30 p-6 rounded-2xl border border-zinc-900/80 text-center space-y-1">
                  <p className="text-zinc-500 text-xs font-mono">No previous deposit requests found.</p>
                  <p className="text-[10px] text-zinc-600 font-mono">Your deposit history will appear here once submitted.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {userDeposits.map((dep, idx) => {
                    const statusKey = dep.status?.toLowerCase() || "pending";
                    return (
                      <div
                        key={dep.id || idx}
                        className="bg-black/40 p-3.5 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all flex items-center justify-between gap-3 text-xs font-mono"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-white text-sm">
                              NPR {dep.amount}
                            </span>
                            <span className="text-[9px] uppercase px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {dep.method || "eSewa"}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500">
                            {dep.date ? new Date(dep.date).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            }) : "Recent"}
                            {dep.trxId && ` • Ref: ${dep.trxId}`}
                          </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          {statusKey === "approved" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> APPROVED
                            </span>
                          ) : statusKey === "rejected" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-extrabold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                              <XCircle className="w-3.5 h-3.5" /> REJECTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                              <Clock className="w-3.5 h-3.5" /> PENDING
                            </span>
                          )}

                          {dep.proofImage && (
                            <button
                              type="button"
                              onClick={() => setSelectedProofModal(dep.proofImage)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                              title="View Proof Image"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2: SCAN QR & UPLOAD PROOF PAGE */}
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
                  <QrCode className="w-4 h-4 text-red-500" />
                  Scan eSewa QR & Upload Screenshot
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-mono">
                  NPR {walletAmt}
                </span>
              </div>
              <p className="text-zinc-400 text-xs font-mono mt-1">
                Scan the QR code below using eSewa app, pay NPR {walletAmt}, and upload the screenshot.
              </p>
            </div>

            {/* QR Code and Payment Details Block */}
            <div className="bg-black/40 p-5 rounded-2xl border border-zinc-900 flex flex-col items-center space-y-4 text-center">
              <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-green-500/40 text-green-400 bg-green-500/10">
                INSTANT ESEWA DIRECT
              </span>

              {/* QR Code Container */}
              <div className="bg-white p-2.5 rounded-2xl border-4 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.35)] aspect-square w-52 h-52 flex items-center justify-center relative overflow-hidden">
                <img
                  id="qr-display"
                  src={paymentSettings.qrCode}
                  alt="eSewa QR Code"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Account Number & Copy Button */}
              <div className="space-y-1.5 font-mono w-full max-w-xs">
                <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-extrabold">
                  eSewa ID / Phone Number
                </p>
                <div className="flex items-center justify-center gap-2 bg-black/60 py-2.5 px-3 rounded-xl border border-zinc-800">
                  <b className="text-red-500 text-sm tracking-widest font-mono filter drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                    {paymentSettings.esewaNum || "9825880400"}
                  </b>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentSettings.esewaNum || "9825880400", "esewa")}
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

              {/* Remarks Notice */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2.5 w-full max-w-xs text-center space-y-0.5">
                <p className="text-[10px] font-black text-red-400 tracking-wider font-mono uppercase">
                  REMARKS: BILL PAYMENTS
                </p>
                <p className="text-[10px] font-black text-red-400 tracking-wider font-mono uppercase">
                  NO THIRD PARTY
                </p>
              </div>
            </div>

            {/* SCREENSHOT PROOF UPLOAD DIRECTLY BELOW QR CODE */}
            <div className="space-y-2">
              <label className="text-zinc-400 block uppercase font-bold text-[10px] font-mono tracking-wider">
                Upload Payment Screenshot / Receipt <span className="text-red-500">*</span>
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
                    <span>Receipt Attached Successfully</span>
                  </div>

                  {/* Actions: Change & Remove */}
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

            {/* Step 2 Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setCurrentStep(1);
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
                    <span>SUBMIT DEPOSIT REQUEST</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROOF IMAGE MODAL */}
      <AnimatePresence>
        {selectedProofModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProofModal(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
          >
            <div className="relative max-w-lg w-full bg-black border border-zinc-800 rounded-3xl p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <h4 className="font-orbitron font-bold text-xs text-white uppercase tracking-wider">Deposit Receipt Proof</h4>
                <button
                  type="button"
                  onClick={() => setSelectedProofModal(null)}
                  className="text-zinc-400 hover:text-white text-xs font-bold font-mono bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
              <div className="max-h-[75vh] overflow-auto rounded-xl">
                <img src={selectedProofModal} alt="Deposit Proof" className="w-full h-auto object-contain rounded-xl" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
