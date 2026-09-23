import { DayDomainMockTest, DayMockTestPack } from '../dayWiseMockTests';
import { DAY_1_CURRICULUM_DOMAINS } from './day1';
import { DAY_2_CURRICULUM_DOMAINS } from './day2';
import { DAY_3_CURRICULUM_DOMAINS } from './day3';
import { DAY_4_CURRICULUM_DOMAINS } from './day4';
import { DAY_5_CURRICULUM_DOMAINS } from './day5';

export * from './day1';
export * from './day2';
export * from './day3';
export * from './day4';
export * from './day5';

export const IT_DAY_1_PACK: DayMockTestPack = {
  dayNumber: 1,
  title: 'Day 1: IT Fundamentals, Computer Organization, C Programming & MS Office',
  tagline: 'Binary Logic, CPU Architecture, C Memory Model & Enterprise Excel Analytics • 40 MCQs',
  description: 'Comprehensive assessment on hardware fundamentals, motherboard buses, UEFI, Von Neumann architecture, cache associativity, C pointers & struct padding, and advanced MS Office formulas/pivots.',
  status: 'active',
  totalQuestions: 40,
  domains: DAY_1_CURRICULUM_DOMAINS,
};

export const IT_DAY_2_PACK: DayMockTestPack = {
  dayNumber: 2,
  title: 'Day 2: Operating Systems, Database Management, Web Development & Networking',
  tagline: 'OS Process Scheduling, ACID Relational DBMS, Full Stack Web & OSI/TCP Protocols • 40 MCQs',
  description: 'Rigorous tests evaluating operating system concurrency, Coffman deadlock avoidance, 3NF database normalization, JavaScript event loop microtasks, and CIDR subnetting with DNS/BGP routing.',
  status: 'active',
  totalQuestions: 40,
  domains: DAY_2_CURRICULUM_DOMAINS,
};

export const IT_DAY_3_PACK: DayMockTestPack = {
  dayNumber: 3,
  title: 'Day 3: SDLC, Project Life Cycle, Agile, DevOps & IT Roles & Infrastructure',
  tagline: 'Software Lifecycle Models, Scrum Ceremonies, Trunk CI/CD & Enterprise ITIL Services • 30 MCQs',
  description: 'Engineering and process suite covering Waterfall/Spiral risk management, Scrum Product Owner vs Scrum Master accountabilities, Git branching, Docker vs VMs, SRE error budgets, and Tier IV data center design.',
  status: 'active',
  totalQuestions: 30,
  domains: DAY_3_CURRICULUM_DOMAINS,
};

export const IT_DAY_4_PACK: DayMockTestPack = {
  dayNumber: 4,
  title: 'Day 4: Virtualization, Cloud Computing, Information Security & IoT / Drones',
  tagline: 'Bare-Metal Hypervisors, Zero Trust PKI, MQTT Smart Edge & Autonomous UAV Systems • 40 MCQs',
  description: 'Production infrastructure and autonomous edge suite covering Type-1 virtualization, VPC private subnetting, CIA triad cryptographic salts, LoRaWAN IoT telemetry, and drone IMU sensor fusion with RTK GPS.',
  status: 'active',
  totalQuestions: 40,
  domains: DAY_4_CURRICULUM_DOMAINS,
};

export const IT_DAY_5_PACK: DayMockTestPack = {
  dayNumber: 5,
  title: 'Day 5: Emerging Technologies - Industry 5.0, AI/ML, GenAI, Blockchain & AR/VR/MR',
  tagline: 'Human-Cobot 3D Printing, Neural Networks, Transformer LLMs, Web3 EVM & Spatial XR • 50 MCQs',
  description: 'Advanced frontier technologies suite introducing Industry 5.0 cobots, SLA/SLS additive manufacturing, deep learning backpropagation, RAG & ChatGPT prompt engineering, PoS consensus with EVM gas, and 6DoF WebXR spatial computing.',
  status: 'active',
  totalQuestions: 50,
  domains: DAY_5_CURRICULUM_DOMAINS,
};

export const ALL_IT_CURRICULUM_PACKS: DayMockTestPack[] = [
  IT_DAY_1_PACK,
  IT_DAY_2_PACK,
  IT_DAY_3_PACK,
  IT_DAY_4_PACK,
  IT_DAY_5_PACK,
];
