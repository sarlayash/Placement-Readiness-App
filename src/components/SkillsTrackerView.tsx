import { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Sliders,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Target,
} from 'lucide-react';
import { SkillItem } from '../types';

interface SkillsTrackerViewProps {
  skills: SkillItem[];
  onUpdateSkillLevel: (skillId: string, newLevel: number) => void;
  onNavigateToAssessment: () => void;
}

export function SkillsTrackerView({
  skills,
  onUpdateSkillLevel,
  onNavigateToAssessment,
}: SkillsTrackerViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [editLevelVal, setEditLevelVal] = useState<number>(70);

  const categories = [
    'All',
    'DSA & Algorithms',
    'Aptitude & Logic',
    'Core CS Fundamentals',
    'Development & Frameworks',
    'Soft Skills & Interviews',
  ];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  const overallAvg = Math.round(
    skills.reduce((acc, cur) => acc + cur.level, 0) / skills.length
  );
  const verifiedCount = skills.filter((s) => s.isVerified).length;

  const getProficiencyLabel = (level: number) => {
    if (level >= 85) return { label: 'Mastery', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (level >= 70) return { label: 'Proficient', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    if (level >= 55) return { label: 'Competent', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Developing', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const handleSaveEdit = () => {
    if (editingSkill) {
      onUpdateSkillLevel(editingSkill.id, editLevelVal);
      setEditingSkill(null);
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto">
      {/* Skill Intelligence Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Placement Competency Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Verified through assessment analytics & code audits
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{verifiedCount} Verified</span>
          </span>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800">
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cohort Avg</span>
            <span className="text-sm font-bold text-slate-300">62%</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Your Average</span>
            <span className="text-sm font-bold text-indigo-400">{overallAvg}%</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tier-1 Cutoff</span>
            <span className="text-sm font-bold text-amber-400">82%</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills List */}
      <div className="space-y-2.5">
        {filteredSkills.map((skill) => {
          const prof = getProficiencyLabel(skill.level);
          return (
            <div
              key={skill.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-slate-100">{skill.name}</h3>
                    {skill.isVerified && (
                      <span title="Verified through Assessment">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {skill.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prof.color}`}
                  >
                    {prof.label}
                  </span>
                  <button
                    onClick={() => {
                      setEditingSkill(skill);
                      setEditLevelVal(skill.level);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                    title="Self-Assess / Update Skill"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Benchmark Target */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">
                    Current: <strong className="text-slate-100">{skill.level}%</strong>
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-400" />
                    <span>Target: {skill.targetLevel}%</span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 relative overflow-hidden">
                  {/* Current Level */}
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                  {/* Target level marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                    style={{ left: `${skill.targetLevel}%` }}
                    title={`Target: ${skill.targetLevel}%`}
                  />
                </div>
              </div>

              {/* Assessment CTA if unverified or low */}
              {!skill.isVerified && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Take assessment to officially verify</span>
                  </span>
                  <button
                    onClick={onNavigateToAssessment}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Test Now →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Skill Update Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100">
                Update Skill Mastery
              </h3>
              <button
                onClick={() => setEditingSkill(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs font-semibold text-indigo-300">
                {editingSkill.name}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Set self-assessed competence percentage based on coursework and coding practice.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Proficiency Level</span>
                <span className="text-base font-bold text-indigo-400">{editLevelVal}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={editLevelVal}
                onChange={(e) => setEditLevelVal(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Novice (20%)</span>
                <span>Competent (60%)</span>
                <span>Mastery (90%+)</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingSkill(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
              >
                Save Level
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
