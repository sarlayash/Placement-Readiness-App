export interface PlacementInterviewTip {
  id: string;
  dayNumber: number;
  tipNumber: number;
  title: string;
  category: 'Aptitude & Speed' | 'Coding & DSA' | 'HR & Behavioral' | 'Core CS & Tech' | 'Resume & Strategy' | 'System Design & Viva';
  targetRound: string;
  keyRule: string;
  detailedAdvice: string;
  actionableStep: string;
  companyPattern: string;
  tag: string;
}

export interface DayTipsCollection {
  dayNumber: number;
  theme: string;
  tagline: string;
  tips: PlacementInterviewTip[];
}

export const DAY_1_TIPS: PlacementInterviewTip[] = [
  {
    id: 'd1_tip_01',
    dayNumber: 1,
    tipNumber: 1,
    title: 'The 90-Second Aptitude Elimination Framework',
    category: 'Aptitude & Speed',
    targetRound: 'Online Assessment (OA) / First Round Screening',
    keyRule: 'Never spend more than 90 seconds on an uncracked MCQ; eliminate 2 extreme options within 20 seconds.',
    detailedAdvice: 'In high-stakes campus placement aptitude tests, speed matters as much as accuracy. 80% of test-takers get disqualified not because they lacked knowledge, but because they got trapped in one complex time-and-work or permutation puzzle. Scan questions in passes: Pass 1 (instant 30-second formula questions), Pass 2 (standard medium problems), Pass 3 (lengthy calculations if time permits).',
    actionableStep: 'Practice option-approximation and unit-digit arithmetic tricks on quantitative tests to discard dummy options instantly without completing long division.',
    companyPattern: 'High-speed elimination is vital for TCS NQT, Cognizant GenC Next, Wipro Elite, and Capgemini aptitude screenings.',
    tag: 'Speed Math',
  },
  {
    id: 'd1_tip_02',
    dayNumber: 1,
    tipNumber: 2,
    title: 'The STAR Method with Quantified Metric Anchors',
    category: 'HR & Behavioral',
    targetRound: 'Behavioral & HR Interview',
    keyRule: 'Every behavioral story must follow Situation-Task-Action-Result, and the Result MUST contain numbers.',
    detailedAdvice: 'When asked "Tell me about a challenging project" or "Describe a time you handled a conflict", avoid vague statements like "The team liked my contribution". Instead, structure your response as: Situation (context), Task (your exact responsibility), Action (technical decisions and tools you used), and Result (quantifiable impact like "reduced latency by 32%" or "automated tests saving 4 hours weekly").',
    actionableStep: 'Audit your top 2 resume projects right now. Write down 1 specific numeric achievement metric for each (percentage speedup, user count, test coverage, or data throughput).',
    companyPattern: 'Amazon Leadership Principles, Microsoft Core Competency rounds, and Goldman Sachs behavioral screens evaluate candidates strictly on metric-backed STAR answers.',
    tag: 'STAR Technique',
  },
  {
    id: 'd1_tip_03',
    dayNumber: 1,
    tipNumber: 3,
    title: 'State the Brute-Force Solution First, Optimize Verbally',
    category: 'Coding & DSA',
    targetRound: 'Technical Coding Round 1',
    keyRule: 'Never jump straight into writing complex code in silence; verbally state the naive O(n²) baseline first.',
    detailedAdvice: 'Silent coding is the #1 reason candidates fail technical rounds. When presented with a problem (e.g., Two Sum or Longest Substring), clarify constraints first (array size, negative numbers, memory limits). Then say: "A brute-force approach using nested loops gives O(n²) time and O(1) space. We can optimize this to O(n) using a hash map to trade space for time." This demonstrates algorithmic maturity.',
    actionableStep: 'Before writing any code today, force yourself to spend 3 minutes explaining the time complexity of both the naive and optimal approaches out loud.',
    companyPattern: 'Google, Uber, Adobe, and Tier-1 product startups deduct points for silent coders even if the final code is correct.',
    tag: 'Think-Aloud Protocol',
  },
  {
    id: 'd1_tip_04',
    dayNumber: 1,
    tipNumber: 4,
    title: 'The 6-Second ATS Resume Scan Rule',
    category: 'Resume & Strategy',
    targetRound: 'Resume Shortlisting & Profile Screening',
    keyRule: 'Format your resume in a clean single-column layout; front-load skills and strong action verbs.',
    detailedAdvice: 'Campus recruiters and automated Applicant Tracking Systems (ATS) scan resumes in 6 to 10 seconds. Multi-column tables, fancy graphical progress bars (e.g., "Python: 80%"), and embedded images break ATS parsers. Use standard section headers: Education, Skills, Experience / Projects, Achievements. Begin every bullet point with high-impact power verbs: "Engineered", "Optimized", "Architected", "Deployed".',
    actionableStep: 'Remove all graphical skill-bars and replace them with categorized text keywords: Languages (Java, C++, Python), Databases (PostgreSQL, MongoDB), Tools (Docker, Git, AWS).',
    companyPattern: 'TCS Digital, Infosys SP/DSE, and campus hiring portals use ATS keyword filters to shortlist candidate batches before human review.',
    tag: 'ATS Optimization',
  },
  {
    id: 'd1_tip_05',
    dayNumber: 1,
    tipNumber: 5,
    title: 'Master "Do You Have Any Questions for Us?"',
    category: 'HR & Behavioral',
    targetRound: 'Managerial, Tech Lead & Final HR Round',
    keyRule: 'Never reply "No, I have no questions"; ask high-context technical or organizational trajectory questions.',
    detailedAdvice: 'The final 5 minutes of an interview are your opportunity to leave a lasting impression. Saying you have no questions signals disinterest. Instead, ask: "What does the typical day-to-day engineering iteration look like for freshers on your team?", or "I saw your company recently expanded into AI workflows—how will new campus hires contribute to that initiative?"',
    actionableStep: 'Prepare 3 tailored questions before walking into any interview: 1 about their engineering culture, 1 about their tech stack evolution, and 1 about mentorship for junior developers.',
    companyPattern: 'Senior Engineering Managers at Microsoft, Oracle, and Salesforce use this question to assess intellectual curiosity and genuine cultural enthusiasm.',
    tag: 'Closing Impact',
  },
];

export const DAY_2_TIPS: PlacementInterviewTip[] = [
  {
    id: 'd2_tip_01',
    dayNumber: 2,
    tipNumber: 1,
    title: 'The "Dry Run on Boundary Corner Cases" Protocol',
    category: 'Coding & DSA',
    targetRound: 'Live Technical Coding & Pair Programming',
    keyRule: 'Before announcing completion, execute a dry run against 5 corner cases: empty, 1-element, duplicates, extremes, negatives.',
    detailedAdvice: 'The difference between a junior developer and a hireable software engineer is defensive coding. Once you finish typing your code, do not say "Done". Say: "Let me trace this through edge cases." Test: (1) Empty array or null input, (2) Array with only 1 element, (3) Array with all identical elements, (4) Very large inputs that cause integer overflow, (5) Negative numbers or empty strings. Catching your own bug before the interviewer points it out is an automatic green flag.',
    actionableStep: 'Practice tracing variables line-by-line on paper or in comments using a test case table with columns for pointers (i, j, mid) and state variables.',
    companyPattern: 'Amazon SDE and Atlassian live coding rounds test hidden edge cases in automated test suites immediately upon submission.',
    tag: 'Edge Case Defense',
  },
  {
    id: 'd2_tip_02',
    dayNumber: 2,
    tipNumber: 2,
    title: 'Master the Core CS "Holy Trinity": OS, DBMS & OOP',
    category: 'Core CS & Tech',
    targetRound: 'Technical Interview Round 1 & 2',
    keyRule: 'Expect at least 40% of technical questions to test OS (Processes/Deadlocks), DBMS (ACID/Indexes), and OOP (Polymorphism/SOLID).',
    detailedAdvice: 'Many students over-index on LeetCode while neglecting fundamental computer science subjects. Interviewers frequently probe: Process vs Thread (context switching overhead, shared memory), Deadlock 4 necessary conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait), ACID properties with real banking examples, and B-Tree indexing vs Hash indexing tradeoffs.',
    actionableStep: 'Write a 1-page cheat sheet explaining real-world analogies: Deadlock (traffic intersection), ACID (ATM fund transfer), Virtual Memory (paged library books).',
    companyPattern: 'Cisco, Oracle, Samsung R&D, Qualcomm, and TCS Digital dedicated technical panels focus heavily on core CS fundamentals.',
    tag: 'Core CS Mastery',
  },
  {
    id: 'd2_tip_03',
    dayNumber: 2,
    tipNumber: 3,
    title: 'The SQL vs. NoSQL Architectural Decision Matrix',
    category: 'Core CS & Tech',
    targetRound: 'Database & System Design Round',
    keyRule: 'Never say "NoSQL is faster than SQL"; explain tradeoffs based on schema rigidity, ACID needs, and read/write patterns.',
    detailedAdvice: 'When an interviewer asks "Which database would you choose for an e-commerce platform?", show structural thinking: "For order management and payment ledger, I would choose a relational database like PostgreSQL for ACID compliance and transaction integrity. For product catalogs and user clickstream logs, I would leverage MongoDB or DynamoDB for schema flexibility and high-throughput write scaling."',
    actionableStep: 'Memorize the CAP theorem (Consistency, Availability, Partition Tolerance) and be able to classify PostgreSQL (CP), Cassandra (AP), and MongoDB (CP).',
    companyPattern: 'Morgan Stanley, Goldman Sachs, and fintech placement drives evaluate candidate depth on data integrity and database locking mechanisms.',
    tag: 'Database Tradeoffs',
  },
  {
    id: 'd2_tip_04',
    dayNumber: 2,
    tipNumber: 4,
    title: 'The "Explain Like I\'m 5" Technical Clarity Test',
    category: 'HR & Behavioral',
    targetRound: 'Techno-Managerial & VP Round',
    keyRule: 'Explain technical concepts without hiding behind buzzwords; interviewers test your ability to bridge tech and business.',
    detailedAdvice: 'Senior managers often test communication by asking: "Explain how an API works to my grandmother" or "What is recursion in simple terms?". Avoid throwing jargon like "stateless HTTP protocols" or "call stack frames". Use tangible analogies: an API is like a restaurant waiter carrying your order to the kitchen and bringing food back. Recursion is like Russian nesting dolls or standing between two mirrors.',
    actionableStep: 'Pick one complex topic from your coursework (e.g., DNS lookup, Dijkstra\'s algorithm, or JWT tokens) and record a 60-second voice memo explaining it to a non-technical friend.',
    companyPattern: 'Deloitte Consulting, EY, Accenture, and product management tracks place heavy weight on cross-functional communication clarity.',
    tag: 'Clarity & Analogies',
  },
  {
    id: 'd2_tip_05',
    dayNumber: 2,
    tipNumber: 5,
    title: 'Live Error Debugging Composure: The "Think Aloud" Triage',
    category: 'Coding & DSA',
    targetRound: 'Live Technical Round / Machine Coding',
    keyRule: 'When code throws Segmentation Fault or runtime errors, do not guess-change lines; print-debug with calm hypotheses.',
    detailedAdvice: 'Panicking during a crash is an instant red flag. When your code throws an `IndexOutOfBoundsException` or `Segmentation Fault`, take a deep breath. Say: "We have an invalid memory access. Let me trace the pointer bounds on loop termination." Add clear log statements or inspect array index boundaries. Interviewers intentionally give tricky inputs to see how you troubleshoot under pressure.',
    actionableStep: 'When practicing coding problems, if a test case fails, resist the urge to peek at solutions immediately. Spend 5 minutes systematically isolating which line violated your invariant.',
    companyPattern: 'Top engineering teams at Microsoft, Uber, and Flipkart assess candidate resilience and systematic root-cause debugging over immediate perfection.',
    tag: 'Crisis Composure',
  },
];

export const DAY_3_TIPS: PlacementInterviewTip[] = [
  {
    id: 'd3_tip_01',
    dayNumber: 3,
    tipNumber: 1,
    title: 'The 20-40-60 Time Split for High-Pressure OAs',
    category: 'Aptitude & Speed',
    targetRound: 'Timed Online Assessments (OA)',
    keyRule: 'On a 60-minute test, allocate: 0-20 min (rapid MCQs), 20-45 min (core coding), 45-60 min (test cases & corner conditions).',
    detailedAdvice: 'Online assessments on platforms like HackerRank, Mettl, and CodeSignal penalize poor pacing. Candidates often spend 35 minutes trying to optimize a hard coding question to 100% while leaving 10 straightforward MCQs completely unattempted. Secure the low-hanging fruit first. A 70% partial score across all sections beats an 85% in coding with 0% in quantitative logic.',
    actionableStep: 'Always read every problem in the assessment during the first 2 minutes. Categorize them into Green (know instantly), Yellow (can do in 5 mins), and Red (reserve for the end).',
    companyPattern: 'HackerRank, Mercer Mettl, and CoCubes placement assessments use strict section-wise cutoff timers where missing MCQs leads to immediate rejection.',
    tag: 'Time Pacing',
  },
  {
    id: 'd3_tip_02',
    dayNumber: 3,
    tipNumber: 2,
    title: 'Fresher System Design: The 1 to 10,000 Scale Blueprint',
    category: 'System Design & Viva',
    targetRound: 'System Design / Advanced Technical Round',
    keyRule: 'Even for freshers, articulating DNS → Load Balancer → App Server → Cache (Redis) → DB Read Replicas sets you apart from 95% of candidates.',
    detailedAdvice: 'Freshers are rarely asked to design YouTube or Netflix from scratch, but they are frequently asked: "What happens when 10,000 students try to register for an exam at the exact same second?". Walk through the architecture step-by-step: (1) DNS resolution, (2) CDN for static assets, (3) Nginx Load Balancer distributing requests, (4) In-memory Redis cache to handle hot reads, (5) Asynchronous Message Queue (RabbitMQ/Kafka) to prevent database lock contention.',
    actionableStep: 'Draw a high-level 3-tier web architecture diagram on paper right now, labeling the flow of an HTTP request from browser to persistent database.',
    companyPattern: 'Swiggy, Zomato, Flipkart, CRED, and high-growth unicorn engineering rounds regularly test fresher awareness of basic caching and concurrency.',
    tag: 'System Scalability',
  },
  {
    id: 'd3_tip_03',
    dayNumber: 3,
    tipNumber: 3,
    title: 'The "Graceful Unknown" Protocol: Never Bluff Technical Facts',
    category: 'HR & Behavioral',
    targetRound: 'Technical Viva & Techno-HR Round',
    keyRule: 'If you do not know an answer, say: "I haven\'t worked directly with X, but based on Y, here is how I would reason through it."',
    detailedAdvice: 'Interviewers with 10+ years of experience immediately detect when a student is fabricating answers or guessing buzzwords. Bluffing destroys trust. Admitting a knowledge gap with intellectual curiosity is respected: "I haven\'t configured Kubernetes clusters in production, but from my Docker containerization experience, I understand it manages automated container orchestration and auto-scaling."',
    actionableStep: 'Practice substituting "I don\'t know" with: "I haven\'t encountered that specific scenario yet, but my initial engineering intuition would be to investigate..."',
    companyPattern: 'Senior interviewers at Microsoft, Google, and Amazon value intellectual honesty above all; bluffing is the single quickest path to rejection.',
    tag: 'Intellectual Honesty',
  },
  {
    id: 'd3_tip_04',
    dayNumber: 3,
    tipNumber: 4,
    title: 'Resume Project Defense: Anticipate the "Why" Questions',
    category: 'Resume & Strategy',
    targetRound: 'Technical Viva & Project Evaluation',
    keyRule: 'Be ready to defend every tool on your resume: "Why PostgreSQL instead of MongoDB?", "What was your biggest architectural bottleneck?"',
    detailedAdvice: 'Every line on your resume is fair game. If your resume mentions "Built a full-stack job board using React and Node.js", the interviewer will not ask you basic syntax; they will ask: "How did you handle authentication state across page refreshes?", "What happens if two users apply for the same limited slot at the exact same millisecond?", "What was the single hardest bug you had to troubleshoot?".',
    actionableStep: 'For your main resume project, write down answers to: (1) Why this tech stack?, (2) How does authentication work?, (3) What would break at 100x traffic?, (4) What would you refactor if you had 2 more weeks?',
    companyPattern: 'Product engineering teams at Tier-1 startups and R&D labs spend 25 to 35 minutes drilling into candidate capstone projects.',
    tag: 'Project Defense',
  },
  {
    id: 'd3_tip_05',
    dayNumber: 3,
    tipNumber: 5,
    title: 'Campus Drive Stamina & The "Mental Zero" Reset',
    category: 'HR & Behavioral',
    targetRound: 'Placement Day Endurance (All 4+ Consecutive Rounds)',
    keyRule: 'Campus placement drives last 12-16 hours; treat each round as a fresh interview—interviewers do not share bias between panels.',
    detailedAdvice: 'On campus placement days, you might complete an online test at 9 AM, Round 1 at 12 PM, Round 2 at 4 PM, and HR at 8 PM. If Round 1 felt shaky or an interviewer was stern, do not carry that self-doubt into Round 2. Panels are independent. Pack high-protein snacks, stay hydrated, maintain your posture, and practice the "Mental Zero" reset: take 3 deep breaths, let go of the previous round, and walk in with genuine energy.',
    actionableStep: 'Prepare your placement day kit: printed resume copies, formal dress, water bottle, notepad, and a curated 2-minute self-introduction.',
    companyPattern: 'Day 1 campus placement drives by TCS Digital, Cognizant, Infosys, Capgemini, and mass recruiters are endurance battles where energy and composure win offers.',
    tag: 'Placement Stamina',
  },
];

export const ALL_DAY_TIPS: DayTipsCollection[] = [
  {
    dayNumber: 1,
    theme: 'Foundations, Speed Math & First Impressions',
    tagline: '5 Golden Rules for Online Assessments, ATS Resumes & Behavioral STAR Answers',
    tips: DAY_1_TIPS,
  },
  {
    dayNumber: 2,
    theme: 'Deep Technical Rigor, Core CS & Live Coding Defense',
    tagline: '5 Golden Rules for Edge-Case Tracing, OS/DBMS/OOP Viva & Crisis Composure',
    tips: DAY_2_TIPS,
  },
  {
    dayNumber: 3,
    theme: 'Speed Mastery, Fresher System Design & Offer Conversion',
    tagline: '5 Golden Rules for OA Pacing, Architectural Viva, Project Defense & Stamina',
    tips: DAY_3_TIPS,
  },
];

export function getDayTips(dayNumber: number): DayTipsCollection {
  const found = ALL_DAY_TIPS.find((d) => d.dayNumber === dayNumber);
  if (found) return found;
  
  // Default fallback or dynamic future day placeholder
  return {
    dayNumber,
    theme: `Day ${dayNumber}: Advanced Placement Tactics`,
    tagline: 'Daily high-impact rules to maximize your interview conversion rate',
    tips: DAY_1_TIPS.map((t, idx) => ({
      ...t,
      id: `d${dayNumber}_tip_0${idx + 1}`,
      dayNumber,
      title: `[Day ${dayNumber}] ${t.title}`,
    })),
  };
}
