import { LevelUpQuestion, LEVEL_UP_PART_1 } from './part1';
import { LEVEL_UP_PART_2 } from './part2';
import { LEVEL_UP_PART_3 } from './part3';
import { LEVEL_UP_PART_4 } from './part4';

export * from './part1';

// Full non-repeated, unique 100 MCQs based hard FAANG assessment
export const LEVEL_UP_100_QUESTIONS: LevelUpQuestion[] = [
  ...LEVEL_UP_PART_1,
  ...LEVEL_UP_PART_2,
  ...LEVEL_UP_PART_3,
  ...LEVEL_UP_PART_4,
];

// Passing score rule: STRICT 95% as specified by user request
export const LEVEL_UP_PASSING_PERCENTAGE = 95;
export const LEVEL_UP_PASSING_COUNT = 95; // 95 out of 100

export interface DailyLevelUpAssessmentSchedule {
  dayNumber: number;
  id: string;
  title: string;
  tagline: string;
  status: 'active' | 'upcoming';
  releaseDate: string;
  targetCompanies: string[];
  domains: string[];
  totalQuestions: number;
  passingScorePct: number;
  timeLimitMinutes: number;
  difficulty: 'FAANG Hard';
  questions?: LevelUpQuestion[];
}

export const DAILY_LEVEL_UP_SCHEDULE: DailyLevelUpAssessmentSchedule[] = [
  {
    dayNumber: 1,
    id: 'level_up_day_1',
    title: 'Level Up #1: FAANG Core Systems & High-Order DSA Marathon',
    tagline: '100 Non-Repeated Hard MCQs from Google, Meta, Amazon, Netflix & Apple',
    status: 'active',
    releaseDate: 'Active Now (Daily Drop #1)',
    targetCompanies: ['Google', 'Meta', 'Amazon', 'Netflix', 'Apple', 'Microsoft'],
    domains: [
      'Advanced DSA & Balanced Trees',
      'Distributed Systems & Raft/Paxos',
      'Kernel Concurrency & epoll / Memory Barriers',
      'HTTP/3, QUIC & AI Systems Architecture',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
    questions: LEVEL_UP_100_QUESTIONS,
  },
  {
    dayNumber: 2,
    id: 'level_up_day_2',
    title: 'Level Up #2: Distributed Consensus, PACELC & Ultra-Scale Storage',
    tagline: 'Daily Hard Drop #2 • Multi-Region Active-Active & Multi-Paxos Deep Dives',
    status: 'upcoming',
    releaseDate: 'Releasing Tomorrow at 09:00 AM',
    targetCompanies: ['Amazon AWS', 'Google Cloud', 'Uber', 'Netflix'],
    domains: [
      'Byzantine Fault Tolerance',
      'LSM-Tree Compaction Under Multi-TB Load',
      'Distributed Sharding & Scatter-Gather',
      'Asynchronous Event Streams & EOS',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
  },
  {
    dayNumber: 3,
    id: 'level_up_day_3',
    title: 'Level Up #3: Low-Latency Kernel Concurrency, NVMe & Zero-Copy I/O',
    tagline: 'Daily Hard Drop #3 • Lock-Free Ring Buffers & High-Frequency Systems',
    status: 'upcoming',
    releaseDate: 'Releasing Day After Tomorrow',
    targetCompanies: ['Microsoft', 'Apple', 'Meta', 'Stripe'],
    domains: [
      'Hazard Pointers & RCU in C/C++',
      'Direct Memory Access (DMA) & Zero-Copy',
      'MESI Cache Invalidation & False Sharing',
      'NVMe Multi-Queue Parallelism',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
  },
  {
    dayNumber: 4,
    id: 'level_up_day_4',
    title: 'Level Up #4: Cloud Networking, BGP Anycast & Zero-Trust Security',
    tagline: 'Daily Hard Drop #4 • Global Edge Mesh, TLS 1.3 & DDoS Defenses',
    status: 'active',
    releaseDate: 'Active Now (Daily Drop #4)',
    targetCompanies: ['Cloudflare', 'Google', 'Amazon', 'Netflix'],
    domains: [
      'BGP Anycast Topologies',
      'QUIC Multiplexing & Loss Recovery',
      'Strict CSP & Cryptographic Nonces',
      'Sidecar Service Mesh Latency Budgets',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
    questions: LEVEL_UP_100_QUESTIONS,
  },
  {
    dayNumber: 5,
    id: 'level_up_day_5',
    title: 'Level Up #5: AI Model Infrastructure, FlashAttention & GPU Clusters',
    tagline: 'Daily Hard Drop #5 • Large-Scale LLM Serving, vLLM & RoCEv2 Clusters',
    status: 'active',
    releaseDate: 'Active Now (Daily Drop #5)',
    targetCompanies: ['OpenAI', 'Google DeepMind', 'Meta AI', 'NVIDIA'],
    domains: [
      'FlashAttention SRAM Tiling',
      'PagedAttention KV-Cache Virtualization',
      'Speculative Decoding Mechanics',
      '3D Distributed Training (ZeRO-3)',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
    questions: LEVEL_UP_100_QUESTIONS,
  },
  {
    dayNumber: 6,
    id: 'level_up_day_6',
    title: 'Level Up #6: Cloud-Native Sagas, High-Throughput Kafka & Redis Clusters',
    tagline: 'Daily Hard Drop #6 • Distributed Transaction Sagas, Zero-Copy & Cache Stampede',
    status: 'active',
    releaseDate: 'Active Now (Daily Drop #6)',
    targetCompanies: ['Uber', 'Stripe', 'Netflix', 'DoorDash'],
    domains: [
      'Distributed Sagas & Outbox Pattern',
      'Kafka KRaft & Exactly-Once Semantics',
      'Redis Cluster Hash Slots & Stampede',
      'API Gateway Token Bucket & mTLS',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
    questions: LEVEL_UP_100_QUESTIONS,
  },
  {
    dayNumber: 7,
    id: 'level_up_day_7',
    title: 'Level Up #7: Ultra-Scale System Design, Vitess Sharding & Executive Viva',
    tagline: 'Daily Hard Drop #7 • Grand Placement Finale & FAANG Architectural Defense',
    status: 'active',
    releaseDate: 'Active Now (Daily Drop #7 - Grand Finale)',
    targetCompanies: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
    domains: [
      'Ultra-Scale System Design (TinyURL, Uber H3)',
      'Horizontal Database Sharding & 2PC',
      'Cloud FinOps & Egress Optimization',
      'Executive Viva & RSU Compensation Negotiation',
    ],
    totalQuestions: 100,
    passingScorePct: 95,
    timeLimitMinutes: 100,
    difficulty: 'FAANG Hard',
    questions: LEVEL_UP_100_QUESTIONS,
  },
];
