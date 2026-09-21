import { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Code2,
  BrainCircuit,
  Trophy,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

interface GoogleAuthScreenProps {
  onSignedIn: () => void;
}

export function GoogleAuthScreen({ onSignedIn }: GoogleAuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onSignedIn();
    } catch (err: unknown) {
      console.error('Sign-in error:', err);
      const message = err instanceof Error ? err.message : 'Google Sign-In failed';
      if (message.includes('popup-closed-by-user')) {
        setError('Sign-in popup closed. Please try again.');
      } else {
        setError('Unable to authenticate with Google. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="pt-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">PlacePrep</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">Campus Placement Intelligence</p>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight leading-tight">
            Verify Your Campus Readiness with Live Intelligence
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real algorithmic evaluations, timed sectional aptitude drills, and verified Placement Readiness Scores. All progress securely synced to your verified Google account.
          </p>
        </div>

        {/* Value Highlights */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Real Assessment Engines</div>
              <div className="text-[11px] text-slate-400">Quantitative, logical, and verbal sectional drills with instant accuracy metrics.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">In-Browser Code Studio</div>
              <div className="text-[11px] text-slate-400">Execute code against real test cases with runtime and edge-case validation.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Zero Fake Numbers or Badges</div>
              <div className="text-[11px] text-slate-400">Every score and badge is 100% earned through your assessment submissions.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication CTA */}
      <div className="pb-8 pt-6 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          id="google-signin-btn"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              {/* Google official 'G' SVG icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strictly Google authentication. Real student profiles only.</span>
        </div>
      </div>
    </div>
  );
}
