import { useState, useEffect } from 'react';
import {
  X,
  Gift,
  Wallet,
  Coins,
  QrCode,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Award,
} from 'lucide-react';
import {
  StudentProfile,
  RewardRedemption,
  RewardsSummary,
} from '../types';
import {
  XP_PER_INR_BLOCK,
  INR_PER_BLOCK,
  WELCOME_BONUS_THRESHOLD_XP,
  WELCOME_BONUS_INR,
  computeRewardsSummary,
  isValidUpiId,
  isValidIndianMobile,
  formatINR,
} from '../utils/rewardsCalculator';
import {
  createRedemptionRequest,
  saveUserProfile,
  recordLearnerActivity,
  subscribeToUserRedemptions,
} from '../lib/firestoreService';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  totalXp: number;
  onProfileUpdated?: (updated: StudentProfile) => void;
  onNavigateToProfile?: () => void;
}

export function RewardsModal({
  isOpen,
  onClose,
  profile,
  totalXp,
  onProfileUpdated,
  onNavigateToProfile,
}: RewardsModalProps) {
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [selectedXpAmount, setSelectedXpAmount] = useState<number>(500);
  const [inputUpiId, setInputUpiId] = useState<string>(profile.upiId || '');
  const [inputMobile, setInputMobile] = useState<string>(profile.mobileNumber || '');
  const [isEditingPaymentDetails, setIsEditingPaymentDetails] = useState<boolean>(
    !profile.upiId || !profile.mobileNumber
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time calculation of summary
  const summary: RewardsSummary = computeRewardsSummary(totalXp, profile);

  // Sync inputs if profile changes
  useEffect(() => {
    if (profile.upiId) setInputUpiId(profile.upiId);
    if (profile.mobileNumber) setInputMobile(profile.mobileNumber);
    if (profile.upiId && profile.mobileNumber) {
      setIsEditingPaymentDetails(false);
    }
  }, [profile.upiId, profile.mobileNumber]);

  // Subscribe to real-time redemptions for this user
  useEffect(() => {
    if (!profile.id || !isOpen) return;
    const unsub = subscribeToUserRedemptions(profile.id, (list) => {
      setRedemptions(list);
    });
    return () => unsub();
  }, [profile.id, isOpen]);

  if (!isOpen) return null;

  // Handle saving UPI ID & Mobile number
  const handleSavePaymentDetails = async () => {
    if (!isValidUpiId(inputUpiId)) {
      setErrorMessage('Please enter a valid UPI ID (e.g., yourname@okhdfcbank, 9876543210@paytm)');
      return;
    }
    if (!isValidIndianMobile(inputMobile)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const cleanMobile = inputMobile.replace(/\D/g, '').slice(-10);
      const updated: Partial<StudentProfile> = {
        upiId: inputUpiId.trim(),
        mobileNumber: cleanMobile,
      };
      await saveUserProfile(profile.id, updated);
      if (onProfileUpdated) {
        onProfileUpdated({ ...profile, ...updated });
      }
      setIsEditingPaymentDetails(false);
      setSuccessMessage('UPI payment credentials saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save payment details');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle claim Welcome Bonus (₹200 INR)
  const handleClaimWelcomeBonus = async () => {
    if (!summary.hasPaymentDetails) {
      setIsEditingPaymentDetails(true);
      setErrorMessage('Please add your UPI ID and Mobile number first to receive the ₹200 bonus');
      return;
    }

    if (totalXp < WELCOME_BONUS_THRESHOLD_XP) {
      setErrorMessage(`You need 500 XP to claim this bonus. Current XP: ${totalXp}`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const txnRef = `TXN-BONUS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const redemption: RewardRedemption = {
        id: `red_bonus_${Date.now()}`,
        userId: profile.id,
        userName: profile.fullName,
        userEmail: profile.email,
        upiId: profile.upiId!,
        mobileNumber: profile.mobileNumber!,
        xpRedeemed: 0, // Bonus does not deduct XP
        inrAmount: WELCOME_BONUS_INR,
        type: 'welcome_bonus',
        status: 'pending',
        timestamp: new Date().toISOString(),
        transactionRef: txnRef,
        note: 'New Learner 500 XP Welcome Milestone Reward',
      };

      await createRedemptionRequest(redemption);

      // Update profile
      const updatedProfile: Partial<StudentProfile> = {
        welcomeBonusAwarded: true,
        totalInrEarned: (profile.totalInrEarned || 0) + WELCOME_BONUS_INR,
      };
      await saveUserProfile(profile.id, updatedProfile);

      // Record activity event
      await recordLearnerActivity({
        userId: profile.id,
        userName: profile.fullName,
        userEmail: profile.email,
        type: 'reward_claimed',
        module: 'Rewards',
        scorePercentage: 100,
        bonusEarned: true,
        details: `Claimed ₹200 INR Welcome Bonus to UPI (${profile.upiId})`,
        timestamp: new Date().toISOString(),
      });

      if (onProfileUpdated) {
        onProfileUpdated({ ...profile, ...updatedProfile });
      }

      setSuccessMessage(`🎉 ₹200 INR Welcome Bonus claimed! Ref: ${txnRef}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to claim welcome bonus');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle XP Redemption (500 XP = 100 INR)
  const handleRedeemXp = async () => {
    if (!summary.hasPaymentDetails) {
      setIsEditingPaymentDetails(true);
      setErrorMessage('Please add your UPI ID and Mobile number first to receive cashout');
      return;
    }

    if (summary.availableXp < selectedXpAmount) {
      setErrorMessage(`Insufficient available XP. You have ${summary.availableXp} XP available.`);
      return;
    }

    if (selectedXpAmount % XP_PER_INR_BLOCK !== 0 || selectedXpAmount < XP_PER_INR_BLOCK) {
      setErrorMessage('Redemption must be in multiples of 500 XP (500 XP = ₹100 INR)');
      return;
    }

    const inrToReceive = (selectedXpAmount / XP_PER_INR_BLOCK) * INR_PER_BLOCK;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const txnRef = `TXN-UPI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const redemption: RewardRedemption = {
        id: `red_${Date.now()}`,
        userId: profile.id,
        userName: profile.fullName,
        userEmail: profile.email,
        upiId: profile.upiId!,
        mobileNumber: profile.mobileNumber!,
        xpRedeemed: selectedXpAmount,
        inrAmount: inrToReceive,
        type: 'xp_redemption',
        status: 'pending',
        timestamp: new Date().toISOString(),
        transactionRef: txnRef,
        note: `Redeemed ${selectedXpAmount} XP for ₹${inrToReceive} INR`,
      };

      await createRedemptionRequest(redemption);

      // Update profile
      const newRedeemedXp = (profile.redeemedXp || 0) + selectedXpAmount;
      const newTotalInr = (profile.totalInrEarned || 0) + inrToReceive;
      const updatedProfile: Partial<StudentProfile> = {
        redeemedXp: newRedeemedXp,
        totalInrEarned: newTotalInr,
      };
      await saveUserProfile(profile.id, updatedProfile);

      // Record activity event
      await recordLearnerActivity({
        userId: profile.id,
        userName: profile.fullName,
        userEmail: profile.email,
        type: 'reward_claimed',
        module: 'Rewards',
        scorePercentage: 100,
        bonusEarned: true,
        details: `Redeemed ${selectedXpAmount} XP for ₹${inrToReceive} INR to UPI (${profile.upiId})`,
        timestamp: new Date().toISOString(),
      });

      if (onProfileUpdated) {
        onProfileUpdated({ ...profile, ...updatedProfile });
      }

      setSuccessMessage(`✅ Redemption request for ${formatINR(inrToReceive)} submitted! Ref: ${txnRef}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit redemption request');
    } finally {
      setIsProcessing(false);
    }
  };

  // Available options for redemption blocks
  const maxRedeemableBlocks = Math.floor(summary.availableXp / XP_PER_INR_BLOCK);
  const options = [500, 1000, 1500, 2500].filter((val) => val <= Math.max(500, maxRedeemableBlocks * 500));

  return (
    <div
      id="rewards-center-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0a1128] via-[#050b1c] to-[#020614] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-amber-950/40 text-slate-100 my-8">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 shrink-0 font-black">
              <Gift className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-['Outfit',sans-serif]">
                  Rewards & UPI Cashouts
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  500 XP = ₹100 INR
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Certified By <strong className="text-sky-300">SarlaYash Mission</strong> • Powered By <strong className="text-amber-300">Kapil</strong>
              </p>
            </div>
          </div>
          <button
            id="close-rewards-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Official Diwali 2026 Payout Notice */}
        <div
          id="rewards-modal-diwali-notice"
          className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/25 to-yellow-500/15 border-2 border-amber-400/60 shadow-md shadow-amber-950/40 flex items-start gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Gift className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Official Payout Notice
              </span>
              <h4 className="text-xs font-black uppercase text-amber-200 tracking-wider">
                ALL REWARDS WILL BE PAID ON DIWALI 2026.
              </h4>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Keep learning and redeeming your points. All accumulated cashouts, ₹200 sign-up milestone bonuses, and rewards will be transferred directly to your registered UPI ID on <strong className="text-amber-300 font-bold">Diwali 2026</strong>.
            </p>
          </div>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Balance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3 text-center relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
              Available XP
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-xl sm:text-2xl font-black text-white">{summary.availableXp}</span>
              <span className="text-[10px] text-slate-400">XP</span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Total earned: {summary.totalXp} XP
            </span>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-3 text-center relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              Redeemable Cash
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-300">
                {formatINR(summary.redeemableInr)}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              {maxRedeemableBlocks} × ₹100 blocks
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-sky-500/30 rounded-2xl p-3 text-center relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider block">
              Lifetime Paid
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-xl sm:text-2xl font-black text-sky-300">
                {formatINR(summary.totalInrEarned)}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              Claimed to UPI
            </span>
          </div>
        </div>

        {/* 200 INR Welcome Milestone Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#0b1635] to-emerald-500/15 border-2 border-amber-500/40 relative overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 font-['Outfit',sans-serif]">
                  ₹200 INR New Learner Welcome Bonus
                </h4>
                <p className="text-[11px] text-slate-300">
                  Each new learner gets <strong className="text-emerald-300">₹200 INR</strong> once you sign up and reach <strong className="text-amber-300">500 XP</strong>!
                </p>
              </div>
            </div>
          </div>

          {/* Progress or Claim Button */}
          <div className="mt-3">
            {summary.welcomeBonusAwarded ? (
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>₹200 Welcome Bonus successfully claimed and credited!</span>
              </div>
            ) : summary.welcomeBonusEligible ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40">
                <div className="text-center sm:text-left">
                  <span className="text-xs font-black text-amber-300 block">
                    🎉 Milestone Reached! 500+ XP Scored
                  </span>
                  <span className="text-[10px] text-slate-300">
                    Claim your ₹200 sign-up bonus to your UPI account now
                  </span>
                </div>
                <button
                  id="claim-welcome-bonus-btn"
                  type="button"
                  disabled={isProcessing}
                  onClick={handleClaimWelcomeBonus}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/30 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Claim ₹200 Now'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-semibold">Progress to 500 XP Milestone</span>
                  <span className="text-amber-300 font-bold">{summary.totalXp} / 500 XP ({summary.welcomeBonusProgress}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${summary.welcomeBonusProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Solve mock tests, coding problems, or maintain daily streaks to earn the remaining{' '}
                  <strong className="text-amber-300">{Math.max(0, 500 - summary.totalXp)} XP</strong>!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* UPI & Payment Details Section */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                Registered UPI Payout Destination
              </span>
            </div>
            {!isEditingPaymentDetails && (
              <button
                type="button"
                onClick={() => setIsEditingPaymentDetails(true)}
                className="text-[11px] text-sky-400 hover:text-sky-300 font-bold cursor-pointer"
              >
                Change UPI
              </button>
            )}
          </div>

          {isEditingPaymentDetails ? (
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={inputUpiId}
                  onChange={(e) => setInputUpiId(e.target.value.trim())}
                  placeholder="e.g. learner@okhdfcbank, 9876543210@paytm"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  10-Digit Mobile Number (Linked with UPI)
                </label>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-bold flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={inputMobile}
                    onChange={(e) => setInputMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSavePaymentDetails}
                  disabled={isProcessing}
                  className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Save UPI & Mobile'}
                </button>
                {profile.upiId && profile.mobileNumber && (
                  <button
                    type="button"
                    onClick={() => setIsEditingPaymentDetails(false)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-amber-300 font-bold">{profile.upiId}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>+91 {profile.mobileNumber}</span>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Verified Destination
              </span>
            </div>
          )}
        </div>

        {/* 500 XP to 100 INR Cashout Console */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                Redeem XP for Direct Cash
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Rule: 500 XP = ₹100 INR
            </span>
          </div>

          {/* XP Amount Selector */}
          <div>
            <label className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
              Select XP to Redeem:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {options.map((xp) => {
                const inr = (xp / XP_PER_INR_BLOCK) * INR_PER_BLOCK;
                const isSelected = selectedXpAmount === xp;
                const canAfford = summary.availableXp >= xp;

                return (
                  <button
                    key={xp}
                    type="button"
                    disabled={!canAfford}
                    onClick={() => setSelectedXpAmount(xp)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                        : canAfford
                        ? 'bg-slate-950 border-slate-700 hover:border-slate-600 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="block text-xs font-black">{xp} XP</span>
                    <span className="block text-[10px] font-bold text-emerald-400 mt-0.5">
                      = ₹{inr} INR
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <button
            id="submit-redemption-btn"
            type="button"
            disabled={isProcessing || summary.availableXp < 500 || !summary.hasPaymentDetails}
            onClick={handleRedeemXp}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-400 hover:to-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span>Processing Payout Request...</span>
            ) : summary.availableXp < 500 ? (
              <span>Need At Least 500 XP to Redeem (Available: {summary.availableXp} XP)</span>
            ) : !summary.hasPaymentDetails ? (
              <span>Please Add UPI & Mobile Number Above</span>
            ) : (
              <>
                <Coins className="w-4 h-4 text-amber-300" />
                <span>
                  Redeem {selectedXpAmount} XP → Send {formatINR((selectedXpAmount / XP_PER_INR_BLOCK) * INR_PER_BLOCK)} to UPI
                </span>
              </>
            )}
          </button>
        </div>

        {/* Real-time Redemption History */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Redemption & Cashout Activity</span>
            </span>
            <span className="text-[10px] text-slate-500">
              {redemptions.length} transactions
            </span>
          </div>

          {redemptions.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
              No redemptions yet. Earn 500 XP in mock tests & coding drills to start cashing out!
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {redemptions.map((red) => (
                <div
                  key={red.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">
                        {formatINR(red.inrAmount)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({red.type === 'welcome_bonus' ? 'Welcome Bonus' : `${red.xpRedeemed} XP`})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Ref: <span className="font-mono text-slate-300">{red.transactionRef}</span> • {new Date(red.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        red.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : red.status === 'processing'
                          ? 'bg-blue-500/20 text-sky-300 border-blue-500/40'
                          : red.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {red.status === 'completed' ? 'Paid via UPI' : red.status === 'pending' ? 'Pending Payout' : red.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
