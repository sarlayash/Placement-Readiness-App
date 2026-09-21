import { useState, useRef, useEffect } from 'react';
import { Sparkles, Trophy, X, AlertTriangle, CheckCircle2, RotateCw } from 'lucide-react';

export interface WheelReward {
  id: string;
  label: string;
  shortLabel: string;
  type: 'double_bonus' | 'triple_bonus' | 'points_50' | 'points_75' | 'lifeline_5050' | 'double_streak';
  multiplier: number;
  bonusPoints: number;
  color: string;
  textColor: string;
  description: string;
}

export const WHEEL_REWARDS: WheelReward[] = [
  {
    id: 'rew_1',
    label: '2x Double Bonus',
    shortLabel: '2x Bonus',
    type: 'double_bonus',
    multiplier: 2,
    bonusPoints: 30,
    color: '#F59E0B', // Amber
    textColor: '#1E1B4B',
    description: 'Doubles standard points on this question if answered correctly!',
  },
  {
    id: 'rew_2',
    label: '+50 Bonus Points',
    shortLabel: '+50 Pts',
    type: 'points_50',
    multiplier: 1,
    bonusPoints: 50,
    color: '#3B82F6', // Blue
    textColor: '#FFFFFF',
    description: '+50 bonus points added directly if this question is answered correctly.',
  },
  {
    id: 'rew_3',
    label: '50-50 Lifeline',
    shortLabel: '50-50',
    type: 'lifeline_5050',
    multiplier: 1.5,
    bonusPoints: 20,
    color: '#8B5CF6', // Purple
    textColor: '#FFFFFF',
    description: 'Eliminates 2 incorrect options to maximize your win probability!',
  },
  {
    id: 'rew_4',
    label: '2x Double Bonus',
    shortLabel: '2x Bonus',
    type: 'double_bonus',
    multiplier: 2,
    bonusPoints: 35,
    color: '#10B981', // Emerald
    textColor: '#FFFFFF',
    description: 'Doubles standard points on this question if answered correctly!',
  },
  {
    id: 'rew_5',
    label: '3x Triple Bonus',
    shortLabel: '3x Triple',
    type: 'triple_bonus',
    multiplier: 3,
    bonusPoints: 60,
    color: '#EC4899', // Pink
    textColor: '#FFFFFF',
    description: 'Mega 3x multiplier! Triple points on this question if answered correctly.',
  },
  {
    id: 'rew_6',
    label: '+75 Ultra Points',
    shortLabel: '+75 Pts',
    type: 'points_75',
    multiplier: 1,
    bonusPoints: 75,
    color: '#06B6D4', // Cyan
    textColor: '#1E1B4B',
    description: '+75 ultra bonus points if answered correctly.',
  },
  {
    id: 'rew_7',
    label: '2x Double Bonus',
    shortLabel: '2x Bonus',
    type: 'double_bonus',
    multiplier: 2,
    bonusPoints: 30,
    color: '#EAB308', // Yellow
    textColor: '#1E1B4B',
    description: 'Doubles standard points on this question if answered correctly!',
  },
  {
    id: 'rew_8',
    label: 'Streak Booster',
    shortLabel: '2x Streak',
    type: 'double_streak',
    multiplier: 2,
    bonusPoints: 25,
    color: '#6366F1', // Indigo
    textColor: '#FFFFFF',
    description: 'Doubles placement streak credit & adds +25 points on correct answer.',
  },
];

interface SpinningWheelModalProps {
  questionIndex?: number;
  questionNumber?: number;
  onRewardSelected: (reward: WheelReward) => void;
  onClose: () => void;
}

export function SpinningWheelModal({
  questionIndex,
  questionNumber,
  onRewardSelected,
  onClose,
}: SpinningWheelModalProps) {
  const qNum = questionNumber ?? (questionIndex !== undefined ? questionIndex + 1 : 1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wonReward, setWonReward] = useState<WheelReward | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const numSegments = WHEEL_REWARDS.length;
  const segmentAngle = 360 / numSegments;

  // Sound synthesis helper using Web Audio API
  const playSound = (frequency: number, duration: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported
    }
  };

  // Draw the Canvas Wheel
  const drawWheel = (currentAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 14;

    ctx.clearRect(0, 0, width, height);

    // Save state for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentAngle * Math.PI) / 180);

    // Draw Wheel Segments
    for (let i = 0; i < numSegments; i++) {
      const startAngle = (i * segmentAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;
      const reward = WHEEL_REWARDS[i];

      // Segment wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = reward.color;
      ctx.fill();
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text inside segment
      ctx.save();
      ctx.rotate(startAngle + (segmentAngle * Math.PI) / 360);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = reward.textColor;
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 3;
      ctx.fillText(reward.shortLabel, radius - 20, 0);
      ctx.restore();
    }

    // Outer decorative rim
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B'; // Gold border
    ctx.lineWidth = 6;
    ctx.stroke();

    // Decorative bulb studs along rim
    for (let j = 0; j < 16; j++) {
      const bulbAngle = (j * (360 / 16) * Math.PI) / 180;
      const bulbX = (radius + 6) * Math.cos(bulbAngle);
      const bulbY = (radius + 6) * Math.sin(bulbAngle);
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 3, 0, Math.PI * 2);
      ctx.fillStyle = j % 2 === 0 ? '#FEF08A' : '#FFFFFF';
      ctx.fill();
    }

    ctx.restore();

    // Center hub (stationary look in center)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(rotationAngle);
  }, [rotationAngle]);

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setWonReward(null);

    // Pick target segment (we guarantee good odds on Double Bonus!)
    // Let's pick a random reward index
    const winningIndex = Math.floor(Math.random() * numSegments);
    const targetReward = WHEEL_REWARDS[winningIndex];

    // Pointer is at the top (270 degrees in standard circle coords)
    // When wheel rotates clockwise, angle at top = (270 - totalAngle) % 360
    // To land on segment i: (270 - (i * segmentAngle + segmentAngle / 2))
    const minSpins = 6; // minimum complete revolutions
    const extraRotations = minSpins * 360;
    const targetSegmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
    // Calculate final angle so pointer lands on this segment
    const finalAngle = extraRotations + (360 - targetSegmentCenter + 270) % 360;

    const startTime = performance.now();
    const spinDuration = 3800; // ms
    let lastTickSegment = -1;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Ease out cubic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = easeOut * finalAngle;

      setRotationAngle(currentAngle % 360);

      // Play tick sound when passing segments
      const currentSegment = Math.floor((currentAngle % 360) / segmentAngle);
      if (currentSegment !== lastTickSegment && progress < 0.95) {
        lastTickSegment = currentSegment;
        playSound(450 + Math.random() * 100, 0.04);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setHasSpun(true);
        setWonReward(targetReward);
        playSound(880, 0.25);
        setTimeout(() => playSound(1100, 0.35), 180);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleApplyReward = () => {
    if (wonReward) {
      onRewardSelected(wonReward);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-5 shadow-2xl relative flex flex-col items-center text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        {!isSpinning && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Lucky Spin • MCQ Bonus Round</span>
        </div>

        <h3 className="text-base font-extrabold text-slate-100">
          Spin the Wheel for MCQ #{qNum}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
          Score a Double Bonus multiplier on this question.
        </p>

        {/* Spinning Wheel Stage */}
        <div className="relative my-4 flex items-center justify-center">
          {/* Top Pointer Needle */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center filter drop-shadow-md">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 -mt-1 border border-white" />
          </div>

          {/* Canvas Wheel */}
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="rounded-full shadow-xl shadow-amber-950/20"
          />

          {/* Center Spin Button (clickable when idle) */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || hasSpun}
            className={`absolute z-10 w-16 h-16 rounded-full flex flex-col items-center justify-center font-black text-[11px] uppercase tracking-wider shadow-lg transition-all transform ${
              isSpinning || hasSpun
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed scale-95'
                : 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 hover:scale-105 active:scale-95 ring-4 ring-amber-500/30'
            }`}
          >
            <RotateCw className={`w-4 h-4 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '...' : hasSpun ? 'DONE' : 'SPIN'}</span>
          </button>
        </div>

        {/* Won Result Box */}
        {wonReward ? (
          <div className="w-full bg-slate-950/80 border border-amber-500/40 rounded-2xl p-3.5 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-black text-amber-300">
                {wonReward.label}!
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {wonReward.description}
            </p>

            {/* Strict Condition Warning */}
            <div className="flex items-start gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>
                <strong>CRITICAL RULE:</strong> Bonus is awarded <em>only</em> if you answer this MCQ correctly. Any wrong answer immediately <strong>removes & forfeits</strong> all bonus points!
              </span>
            </div>

            <button
              onClick={handleApplyReward}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Attach Bonus to Question #{qNum}</span>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSpinning ? 'Wheel is Spinning...' : 'Spin the Wheel Now'}</span>
            </button>
            <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
              <span>⚠️ Wrong answer forfeits any bonus won</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
