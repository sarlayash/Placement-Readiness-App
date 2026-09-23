import {
  DAY_2_VERBAL_QUESTIONS,
  DAY_2_SOFT_SKILLS_QUESTIONS,
  DAY_2_CODING_QUESTIONS,
  DAY_2_EXCEL_QUESTIONS,
  DAY_2_SQL_QUESTIONS,
} from './day2Questions/domainsPart1';

import {
  DAY_2_POWER_BI_QUESTIONS,
  DAY_2_AI_QUESTIONS,
  DAY_2_GENAI_QUESTIONS,
  DAY_2_AGENTIC_AI_QUESTIONS,
  DAY_2_QUANT_QUESTIONS,
  DAY_2_LOGICAL_QUESTIONS,
} from './day2Questions/domainsPart2';

import {
  DAY_2_PROFESSIONAL_WRITING_QUESTIONS,
  DAY_2_BUSINESS_COMMUNICATION_QUESTIONS,
  DAY_2_EMOTIONAL_INTELLIGENCE_QUESTIONS,
} from './professionalAssessmentsDay2';

import { DayMockTestPack } from './dayWiseMockTests';
import { AptitudeQuestion } from '../types';
import { DAY_2_CURRICULUM_DOMAINS } from './itCurriculumDays/day2';

export {
  DAY_2_VERBAL_QUESTIONS,
  DAY_2_SOFT_SKILLS_QUESTIONS,
  DAY_2_PROFESSIONAL_WRITING_QUESTIONS,
  DAY_2_BUSINESS_COMMUNICATION_QUESTIONS,
  DAY_2_EMOTIONAL_INTELLIGENCE_QUESTIONS,
  DAY_2_CODING_QUESTIONS,
  DAY_2_EXCEL_QUESTIONS,
  DAY_2_SQL_QUESTIONS,
  DAY_2_POWER_BI_QUESTIONS,
  DAY_2_AI_QUESTIONS,
  DAY_2_GENAI_QUESTIONS,
  DAY_2_AGENTIC_AI_QUESTIONS,
  DAY_2_QUANT_QUESTIONS,
  DAY_2_LOGICAL_QUESTIONS,
};

export const DAY_2_MOCK_TEST_PACK: DayMockTestPack = {
  dayNumber: 2,
  title: 'Day 2: Advanced Technical, Leadership & Problem Solving',
  tagline: '14 Domains • 10 MCQs each • 140 MCQs Total',
  description:
    'Comprehensive Day 2 placement evaluation featuring advanced graph algorithms, financial modeling in Excel, SQL window functions, FlashAttention/KV caching in GenAI, autonomous ReAct loops, cross-cultural professional writing, executive business communication, emotional intelligence, and quantitative placement problems.',
  status: 'active',
  totalQuestions: 140,
  domains: [
    {
      category: 'verbal',
      domainName: 'Verbal Ability',
      shortCode: 'VA',
      badgeColor: '#3B82F6',
      tagline: 'Subjunctive Mood, Parallelism & Critical Reading',
      targetRoles: ['Campus Recruitment', 'Consulting', 'Tech Writing'],
      questions: DAY_2_VERBAL_QUESTIONS,
    },
    {
      category: 'soft_skills',
      domainName: 'Corporate Soft Skills',
      shortCode: 'SK',
      badgeColor: '#10B981',
      tagline: 'Upward Management, Blameless Post-Mortems & Scope Creep',
      targetRoles: ['Engineering Leads', 'Scrum Masters', 'Client Facing Roles'],
      questions: DAY_2_SOFT_SKILLS_QUESTIONS,
    },
    {
      category: 'professional_writing',
      domainName: 'Professional Writing',
      shortCode: 'PW',
      badgeColor: '#06B6D4',
      tagline: 'Cross-Cultural Specs, CVE Disclosures & Analytical KPIs',
      targetRoles: ['Technical Writers, Senior SDEs, Solution Architects'],
      questions: DAY_2_PROFESSIONAL_WRITING_QUESTIONS,
    },
    {
      category: 'business_communication',
      domainName: 'Business Communication',
      shortCode: 'BC',
      badgeColor: '#8B5CF6',
      tagline: 'Power-Interest Matrices, Tech Debt Defense & Crisis PR',
      targetRoles: ['Product Managers, Consultants, Project Leads'],
      questions: DAY_2_BUSINESS_COMMUNICATION_QUESTIONS,
    },
    {
      category: 'emotional_intelligence',
      domainName: 'Emotional Intelligence (EQ)',
      shortCode: 'EQ',
      badgeColor: '#EC4899',
      tagline: 'Cognitive Bias Audits, Emotional Contagion & Re-org Resilience',
      targetRoles: ['Engineering Managers, Tech Leads, Directors'],
      questions: DAY_2_EMOTIONAL_INTELLIGENCE_QUESTIONS,
    },
    {
      category: 'coding',
      domainName: 'Core Coding & DSA',
      shortCode: 'DSA',
      badgeColor: '#F59E0B',
      tagline: 'Dynamic Programming, Graph DFS & Monotonic Stacks',
      targetRoles: ['SDE-1', 'Backend Systems', 'Full Stack Developers'],
      questions: DAY_2_CODING_QUESTIONS,
    },
    {
      category: 'excel',
      domainName: 'Excel & Business Modeling',
      shortCode: 'XLS',
      badgeColor: '#059669',
      tagline: 'Dynamic Arrays, LET Formulas, XNPV & Two-Way Tables',
      targetRoles: ['Financial Analyst', 'Business Operations', 'Consulting'],
      questions: DAY_2_EXCEL_QUESTIONS,
    },
    {
      category: 'sql',
      domainName: 'SQL & Database Design',
      shortCode: 'SQL',
      badgeColor: '#6366F1',
      tagline: 'Window Functions (LAG/LEAD), B-Tree Indexing & BCNF',
      targetRoles: ['Database Engineer', 'Backend Dev', 'Data Analyst'],
      questions: DAY_2_SQL_QUESTIONS,
    },
    {
      category: 'power_bi',
      domainName: 'Power BI & Analytics',
      shortCode: 'PBI',
      badgeColor: '#D97706',
      tagline: 'DAX Context Transition, REMOVEFILTERS, Dynamic RLS & Star Schema',
      targetRoles: ['BI Developer', 'Analytics Engineer', 'Data Viz Specialist'],
      questions: DAY_2_POWER_BI_QUESTIONS,
    },
    {
      category: 'ai',
      domainName: 'Foundational AI & ML',
      shortCode: 'ML',
      badgeColor: '#8B5CF6',
      tagline: 'Stratified K-Fold, PCA Math, Bagging vs Boosting & ReLU',
      targetRoles: ['AI/ML Engineer', 'Data Scientist', 'Research Associate'],
      questions: DAY_2_AI_QUESTIONS,
    },
    {
      category: 'generative_ai',
      domainName: 'Generative AI & LLMs',
      shortCode: 'GEN',
      badgeColor: '#EC4899',
      tagline: 'KV Caching, LoRA, HNSW Vectors, Cross-Encoders & FlashAttention',
      targetRoles: ['GenAI Engineer', 'LLM Application Developer'],
      questions: DAY_2_GENAI_QUESTIONS,
    },
    {
      category: 'agentic_ai',
      domainName: 'Agentic AI Systems',
      shortCode: 'AGT',
      badgeColor: '#6366F1',
      tagline: 'ReAct Loops, Supervisor Multi-Agents, Long-Term Memory & Guardrails',
      targetRoles: ['Agentic AI Engineer', 'AI Automation Architect'],
      questions: DAY_2_AGENTIC_AI_QUESTIONS,
    },
    {
      category: 'quantitative',
      domainName: 'Quantitative Aptitude',
      shortCode: 'QA',
      badgeColor: '#EF4444',
      tagline: 'Replacement Alligations, Relative Speed, Pipes & Cisterns, CI Half-Yearly',
      targetRoles: ['Tier-1 Placement Aptitude', 'Quantitative Research'],
      questions: DAY_2_QUANT_QUESTIONS,
    },
    {
      category: 'logical',
      domainName: 'Logical Reasoning',
      shortCode: 'LR',
      badgeColor: '#14B8A6',
      tagline: 'Syllogisms (Only a Few), Coded Blood Relations & Input-Output Machine',
      targetRoles: ['Consulting', 'Product Firms', 'Cognitive Ability Rounds'],
      questions: DAY_2_LOGICAL_QUESTIONS,
    },
    ...DAY_2_CURRICULUM_DOMAINS,
  ],
};

// All Day 2 questions combined
export const ALL_DAY_2_QUESTIONS: AptitudeQuestion[] = DAY_2_MOCK_TEST_PACK.domains.flatMap(
  (d) => d.questions
);
