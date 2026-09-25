import { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  // 1. Basic Digital Electronics
  {
    id: 1,
    question: "What are the two basic voltage levels represented in binary digital circuits?",
    options: ["HIGH and LOW", "AC and DC", "POSITIVE and NEGATIVE", "UP and DOWN"],
    answer: "HIGH and LOW",
    topic: "Basic Digital Electronics"
  },
  {
    id: 2,
    question: "What is the base of the binary number system?",
    options: ["2", "8", "10", "16"],
    answer: "2",
    topic: "Basic Digital Electronics"
  },
  {
    id: 3,
    question: "A single binary digit is commonly known as a:",
    options: ["Bit", "Byte", "Nibble", "Word"],
    answer: "Bit",
    topic: "Basic Digital Electronics"
  },
  {
    id: 4,
    question: "How many bits are there in one byte?",
    options: ["8", "4", "16", "2"],
    answer: "8",
    topic: "Basic Digital Electronics"
  },
  {
    id: 5,
    question: "How many bits make up a nibble?",
    options: ["4", "2", "8", "16"],
    answer: "4",
    topic: "Basic Digital Electronics"
  },
  {
    id: 6,
    question: "What is the binary equivalent of the decimal number 5?",
    options: ["101", "110", "100", "011"],
    answer: "101",
    topic: "Basic Digital Electronics"
  },
  {
    id: 7,
    question: "What is the decimal value of the binary number 1010?",
    options: ["10", "8", "12", "14"],
    answer: "10",
    topic: "Basic Digital Electronics"
  },
  {
    id: 8,
    question: "Which of the following is an example of an active-low signal indicator in schematics?",
    options: ["A bubble or overbar", "An arrow", "A double line", "A resistor symbol"],
    answer: "A bubble or overbar",
    topic: "Basic Digital Electronics"
  },

  // 2. AND Gate
  {
    id: 9,
    question: "Which logic gate produces output 1 only when all its inputs are 1?",
    options: ["AND", "OR", "NOR", "XOR"],
    answer: "AND",
    topic: "AND Gate"
  },
  {
    id: 10,
    question: "What is the output of a 2-input AND gate when inputs are A=1 and B=0?",
    options: ["0", "1", "High-Z", "Undefined"],
    answer: "0",
    topic: "AND Gate"
  },
  {
    id: 11,
    question: "In Boolean algebra, what algebraic operation corresponds to the AND gate?",
    options: ["Multiplication (dot)", "Addition (plus)", "Inversion (bar)", "Exclusive sum"],
    answer: "Multiplication (dot)",
    topic: "AND Gate"
  },
  {
    id: 12,
    question: "What is the output of A · 0 for any boolean variable A?",
    options: ["0", "1", "A", "A'"],
    answer: "0",
    topic: "AND Gate"
  },
  {
    id: 13,
    question: "What is the output of A · 1 in Boolean algebra?",
    options: ["A", "1", "0", "A'"],
    answer: "A",
    topic: "AND Gate"
  },

  // 3. OR Gate
  {
    id: 14,
    question: "Which logic gate produces output 1 when at least one input is 1?",
    options: ["OR", "AND", "NOR", "NAND"],
    answer: "OR",
    topic: "OR Gate"
  },
  {
    id: 15,
    question: "What is the output of a 2-input OR gate when both inputs are 0?",
    options: ["0", "1", "Floating", "Toggle"],
    answer: "0",
    topic: "OR Gate"
  },
  {
    id: 16,
    question: "What is the output of A + 1 in Boolean algebra?",
    options: ["1", "A", "0", "A + 1"],
    answer: "1",
    topic: "OR Gate"
  },
  {
    id: 17,
    question: "What is the output of A + 0 in Boolean algebra?",
    options: ["A", "0", "1", "A'"],
    answer: "A",
    topic: "OR Gate"
  },
  {
    id: 18,
    question: "Which gate represents logical disjunction in digital circuits?",
    options: ["OR gate", "AND gate", "NOT gate", "XOR gate"],
    answer: "OR gate",
    topic: "OR Gate"
  },

  // 4. NOT Gate
  {
    id: 19,
    question: "Which logic gate is also called an inverter?",
    options: ["NOT", "AND", "BUFFER", "OR"],
    answer: "NOT",
    topic: "NOT Gate"
  },
  {
    id: 20,
    question: "How many inputs does a standard NOT gate have?",
    options: ["1", "2", "3", "Any number"],
    answer: "1",
    topic: "NOT Gate"
  },
  {
    id: 21,
    question: "What is the complement of logic 0?",
    options: ["1", "0", "-1", "Z"],
    answer: "1",
    topic: "NOT Gate"
  },
  {
    id: 22,
    question: "According to the double negation law, what is (A')' equal to?",
    options: ["A", "A'", "0", "1"],
    answer: "A",
    topic: "NOT Gate"
  },
  {
    id: 23,
    question: "What is the Boolean expression for A + A'?",
    options: ["1", "0", "A", "2A"],
    answer: "1",
    topic: "NOT Gate"
  },
  {
    id: 24,
    question: "What is the Boolean expression for A · A'?",
    options: ["0", "1", "A", "A'"],
    answer: "0",
    topic: "NOT Gate"
  },

  // 5. NAND Gate
  {
    id: 25,
    question: "Which gate consists of an AND gate followed by a NOT gate?",
    options: ["NAND", "NOR", "XOR", "XNOR"],
    answer: "NAND",
    topic: "NAND Gate"
  },
  {
    id: 26,
    question: "What is the output of a 2-input NAND gate when both inputs are 1?",
    options: ["0", "1", "High-Z", "Undefined"],
    answer: "0",
    topic: "NAND Gate"
  },
  {
    id: 27,
    question: "Why is the NAND gate called a 'universal gate'?",
    options: [
      "Any Boolean function can be implemented using only NAND gates",
      "It operates at universal voltage levels",
      "It can accept an infinite number of inputs",
      "It never dissipates thermal power"
    ],
    answer: "Any Boolean function can be implemented using only NAND gates",
    topic: "NAND Gate"
  },
  {
    id: 28,
    question: "How many 2-input NAND gates are needed to construct a NOT gate?",
    options: ["1", "2", "3", "4"],
    answer: "1",
    topic: "NAND Gate"
  },
  {
    id: 29,
    question: "How many 2-input NAND gates are required to implement a 2-input AND gate?",
    options: ["2", "1", "3", "4"],
    answer: "2",
    topic: "NAND Gate"
  },
  {
    id: 30,
    question: "How many 2-input NAND gates are required to implement a 2-input OR gate?",
    options: ["3", "2", "4", "1"],
    answer: "3",
    topic: "NAND Gate"
  },

  // 6. NOR Gate
  {
    id: 31,
    question: "Which gate consists of an OR gate followed by an inverter?",
    options: ["NOR", "NAND", "XNOR", "BUFFER"],
    answer: "NOR",
    topic: "NOR Gate"
  },
  {
    id: 32,
    question: "What is the output of a 2-input NOR gate when both inputs are 0?",
    options: ["1", "0", "High-Z", "Oscillating"],
    answer: "1",
    topic: "NOR Gate"
  },
  {
    id: 33,
    question: "Which of the following pair of gates are known as universal gates?",
    options: ["NAND and NOR", "AND and OR", "XOR and XNOR", "NOT and BUFFER"],
    answer: "NAND and NOR",
    topic: "NOR Gate"
  },
  {
    id: 34,
    question: "How many 2-input NOR gates are needed to make an inverter (NOT gate)?",
    options: ["1", "2", "3", "4"],
    answer: "1",
    topic: "NOR Gate"
  },
  {
    id: 35,
    question: "How many 2-input NOR gates are needed to construct a 2-input OR gate?",
    options: ["2", "1", "3", "4"],
    answer: "2",
    topic: "NOR Gate"
  },
  {
    id: 36,
    question: "How many 2-input NOR gates are needed to construct a 2-input AND gate?",
    options: ["3", "2", "4", "1"],
    answer: "3",
    topic: "NOR Gate"
  },

  // 7. XOR Gate
  {
    id: 37,
    question: "Which logic gate gives output 1 when the two inputs are different?",
    options: ["XOR", "XNOR", "AND", "NOR"],
    answer: "XOR",
    topic: "XOR Gate"
  },
  {
    id: 38,
    question: "What is the output of a 2-input XOR gate when both inputs are identical (0,0 or 1,1)?",
    options: ["0", "1", "Undefined", "High-Z"],
    answer: "0",
    topic: "XOR Gate"
  },
  {
    id: 39,
    question: "What is the Boolean expression for an XOR gate with inputs A and B?",
    options: ["A'B + AB'", "AB + A'B'", "A'B'", "A + B"],
    answer: "A'B + AB'",
    topic: "XOR Gate"
  },
  {
    id: 40,
    question: "An XOR gate can be used as which type of parity checker?",
    options: ["Odd parity detector", "Frequency multiplier", "Analog amplifier", "Voltage regulator"],
    answer: "Odd parity detector",
    topic: "XOR Gate"
  },
  {
    id: 41,
    question: "What is the result of A ⊕ A in Boolean algebra?",
    options: ["0", "1", "A", "A'"],
    answer: "0",
    topic: "XOR Gate"
  },
  {
    id: 42,
    question: "What is the result of A ⊕ 0 in Boolean algebra?",
    options: ["A", "0", "1", "A'"],
    answer: "A",
    topic: "XOR Gate"
  },
  {
    id: 43,
    question: "What is the result of A ⊕ 1 in Boolean algebra?",
    options: ["A'", "A", "1", "0"],
    answer: "A'",
    topic: "XOR Gate"
  },

  // 8. XNOR Gate
  {
    id: 44,
    question: "Which gate produces an output 1 when both inputs are equal?",
    options: ["XNOR", "XOR", "NAND", "OR"],
    answer: "XNOR",
    topic: "XNOR Gate"
  },
  {
    id: 45,
    question: "What is the Boolean expression for an XNOR gate with inputs A and B?",
    options: ["AB + A'B'", "A'B + AB'", "A + B", "(A + B)'"],
    answer: "AB + A'B'",
    topic: "XNOR Gate"
  },
  {
    id: 46,
    question: "Because an XNOR gate produces 1 when inputs match, it is also called an:",
    options: ["Equivalence gate", "Difference detector", "Universal inverter", "Sum generator"],
    answer: "Equivalence gate",
    topic: "XNOR Gate"
  },
  {
    id: 47,
    question: "What is the output of an XNOR gate when inputs are A=1 and B=0?",
    options: ["0", "1", "High-Z", "Undefined"],
    answer: "0",
    topic: "XNOR Gate"
  },
  {
    id: 48,
    question: "What is the complement of an XOR function?",
    options: ["XNOR", "NAND", "NOR", "AND"],
    answer: "XNOR",
    topic: "XNOR Gate"
  },

  // 9. Basic Boolean Algebra
  {
    id: 49,
    question: "According to De Morgan's first theorem, (A + B)' is equivalent to:",
    options: ["A' · B'", "A' + B'", "A · B", "(AB)'"],
    answer: "A' · B'",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 50,
    question: "According to De Morgan's second theorem, (A · B)' is equivalent to:",
    options: ["A' + B'", "A' · B'", "A + B", "(A + B)'"],
    answer: "A' + B'",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 51,
    question: "What is the Boolean identity A + A equal to?",
    options: ["A", "2A", "1", "0"],
    answer: "A",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 52,
    question: "What is the Boolean identity A · A equal to?",
    options: ["A", "A²", "1", "0"],
    answer: "A",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 53,
    question: "What is the simplified form of A + AB?",
    options: ["A", "B", "AB", "A + B"],
    answer: "A",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 54,
    question: "What is the simplified form of A + A'B?",
    options: ["A + B", "AB", "A' + B", "B"],
    answer: "A + B",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 55,
    question: "Which law states that A + B = B + A?",
    options: ["Commutative Law", "Associative Law", "Distributive Law", "Idempotent Law"],
    answer: "Commutative Law",
    topic: "Basic Boolean Algebra"
  },
  {
    id: 56,
    question: "Which law states that A · (B + C) = (A · B) + (A · C)?",
    options: ["Distributive Law", "Commutative Law", "Absorption Law", "Complement Law"],
    answer: "Distributive Law",
    topic: "Basic Boolean Algebra"
  },

  // 10. Truth Tables
  {
    id: 57,
    question: "How many input combinations exist in a truth table for 3 binary variables?",
    options: ["8", "6", "4", "16"],
    answer: "8",
    topic: "Truth Tables"
  },
  {
    id: 58,
    question: "What is the formula for the number of rows in a truth table for 'n' input variables?",
    options: ["2ⁿ", "2n", "n²", "n!"],
    answer: "2ⁿ",
    topic: "Truth Tables"
  },
  {
    id: 59,
    question: "How many rows does a truth table have for 4 input variables?",
    options: ["16", "8", "32", "4"],
    answer: "16",
    topic: "Truth Tables"
  },
  {
    id: 60,
    question: "In a truth table, a minterm is a product term that evaluates to:",
    options: ["1 for exactly one row", "0 for all rows", "1 for all rows", "0 for exactly one row"],
    answer: "1 for exactly one row",
    topic: "Truth Tables"
  },
  {
    id: 61,
    question: "In standard notation, SOP stands for:",
    options: ["Sum of Products", "System of Programs", "Standard Output Path", "Sequence of Primes"],
    answer: "Sum of Products",
    topic: "Truth Tables"
  },
  {
    id: 62,
    question: "In standard notation, POS stands for:",
    options: ["Product of Sums", "Point of Sale", "Power of Systems", "Pulse of Signals"],
    answer: "Product of Sums",
    topic: "Truth Tables"
  },

  // 11. K-Map / Karnaugh Map
  {
    id: 63,
    question: "What is the primary purpose of a Karnaugh Map (K-Map)?",
    options: ["Simplifying Boolean expressions", "Amplifying signals", "Storing binary data", "Counting clock cycles"],
    answer: "Simplifying Boolean expressions",
    topic: "K-Map / Karnaugh Map"
  },
  {
    id: 64,
    question: "How many cells are present in a 3-variable K-Map?",
    options: ["8", "4", "6", "16"],
    answer: "8",
    topic: "K-Map / Karnaugh Map"
  },
  {
    id: 65,
    question: "How many cells are present in a 4-variable K-Map?",
    options: ["16", "8", "32", "12"],
    answer: "16",
    topic: "K-Map / Karnaugh Map"
  },
  {
    id: 66,
    question: "Which code is used to label the rows and columns of a K-map to ensure only 1 bit changes between adjacent cells?",
    options: ["Gray Code", "BCD Code", "ASCII Code", "Excess-3 Code"],
    answer: "Gray Code",
    topic: "K-Map / Karnaugh Map"
  },
  {
    id: 67,
    question: "In K-Map grouping, the number of adjacent 1s in a group must always be a power of:",
    options: ["2", "3", "4", "10"],
    answer: "2",
    topic: "K-Map / Karnaugh Map"
  },
  {
    id: 68,
    question: "In a K-map, grouping 4 adjacent 1s eliminates how many variables?",
    options: ["2", "1", "3", "4"],
    answer: "2",
    topic: "K-Map / Karnaugh Map"
  },
  {
    id: 69,
    question: "In a K-map, what does an 'X' or 'd' typically represent?",
    options: ["Don't Care condition", "Dead cell", "Clock cycle", "Ground connection"],
    answer: "Don't Care condition",
    topic: "K-Map / Karnaugh Map"
  },

  // 12. SR Flip-Flop
  {
    id: 70,
    question: "What do the letters 'S' and 'R' stand for in an SR flip-flop?",
    options: ["Set and Reset", "Start and Run", "Shift and Read", "Switch and Route"],
    answer: "Set and Reset",
    topic: "SR Flip-Flop"
  },
  {
    id: 71,
    question: "In a basic NOR-based SR flip-flop, what condition is considered invalid or forbidden?",
    options: ["S=1, R=1", "S=0, R=0", "S=1, R=0", "S=0, R=1"],
    answer: "S=1, R=1",
    topic: "SR Flip-Flop"
  },
  {
    id: 72,
    question: "What is the output state of an SR flip-flop when S=1 and R=0?",
    options: ["Set (Q=1)", "Reset (Q=0)", "No change", "Race condition"],
    answer: "Set (Q=1)",
    topic: "SR Flip-Flop"
  },
  {
    id: 73,
    question: "What is the output state of an SR flip-flop when S=0 and R=1?",
    options: ["Reset (Q=0)", "Set (Q=1)", "Toggle", "Invalid"],
    answer: "Reset (Q=0)",
    topic: "SR Flip-Flop"
  },
  {
    id: 74,
    question: "When S=0 and R=0 in an SR flip-flop, the output:",
    options: ["Remains in memory (no change)", "Forces Q to 0", "Forces Q to 1", "Toggles continuously"],
    answer: "Remains in memory (no change)",
    topic: "SR Flip-Flop"
  },

  // 13. JK Flip-Flop
  {
    id: 75,
    question: "Which flip-flop eliminates the invalid state of the SR flip-flop?",
    options: ["JK Flip-Flop", "D Flip-Flop", "L-R Latch", "Binary Relay"],
    answer: "JK Flip-Flop",
    topic: "JK Flip-Flop"
  },
  {
    id: 76,
    question: "What happens in a JK flip-flop when both J=1 and K=1 on a clock pulse?",
    options: ["Toggle state", "Reset to 0", "Set to 1", "Invalid state"],
    answer: "Toggle state",
    topic: "JK Flip-Flop"
  },
  {
    id: 77,
    question: "What problem occurs in a level-triggered JK flip-flop when J=1, K=1 and pulse width is too wide?",
    options: ["Race-around condition", "Zero crossover", "Thermal runaway", "Latch-up burnout"],
    answer: "Race-around condition",
    topic: "JK Flip-Flop"
  },
  {
    id: 78,
    question: "Which configuration of JK flip-flop is commonly used to eliminate the race-around condition?",
    options: ["Master-Slave JK flip-flop", "Dual NOT buffer", "Cascade latch", "Dynamic transistor"],
    answer: "Master-Slave JK flip-flop",
    topic: "JK Flip-Flop"
  },
  {
    id: 79,
    question: "What is the output of a JK flip-flop when J=0 and K=0?",
    options: ["No change (holds previous state)", "Q=0", "Q=1", "Toggle"],
    answer: "No change (holds previous state)",
    topic: "JK Flip-Flop"
  },

  // 14. D Flip-Flop
  {
    id: 80,
    question: "What does 'D' stand for in a D flip-flop?",
    options: ["Data (or Delay)", "Decimal", "Divider", "Dynamic"],
    answer: "Data (or Delay)",
    topic: "D Flip-Flop"
  },
  {
    id: 81,
    question: "In a D flip-flop, on the active clock edge, the next state Q(t+1) is equal to:",
    options: ["D", "D'", "0", "1"],
    answer: "D",
    topic: "D Flip-Flop"
  },
  {
    id: 82,
    question: "How is a D flip-flop constructed from an SR flip-flop?",
    options: ["Connect S=D and R=D' via an inverter", "Connect S=D and R=D", "Connect both S and R to ground", "Leave R floating"],
    answer: "Connect S=D and R=D' via an inverter",
    topic: "D Flip-Flop"
  },
  {
    id: 83,
    question: "D flip-flops are widely used to construct which digital memory units?",
    options: ["Shift registers and registers", "Analog integrators", "Inductive filters", "Full adders"],
    answer: "Shift registers and registers",
    topic: "D Flip-Flop"
  },
  {
    id: 84,
    question: "If the D input is 0 when clock arrives, what is the output Q?",
    options: ["0", "1", "High-Z", "Undefined"],
    answer: "0",
    topic: "D Flip-Flop"
  },

  // 15. T Flip-Flop
  {
    id: 85,
    question: "What does 'T' stand for in a T flip-flop?",
    options: ["Toggle", "Trigger", "Timer", "Transfer"],
    answer: "Toggle",
    topic: "T Flip-Flop"
  },
  {
    id: 86,
    question: "When T=1 in a T flip-flop, what happens to the output on each clock pulse?",
    options: ["The output complements (toggles)", "The output resets to 0", "The output sets to 1", "No change occurs"],
    answer: "The output complements (toggles)",
    topic: "T Flip-Flop"
  },
  {
    id: 87,
    question: "When T=0 in a T flip-flop, what is the next state?",
    options: ["No change (Q remains the same)", "Q goes to 0", "Q goes to 1", "Q toggles"],
    answer: "No change (Q remains the same)",
    topic: "T Flip-Flop"
  },
  {
    id: 88,
    question: "How can a JK flip-flop be converted into a T flip-flop?",
    options: ["Tie both J and K inputs together as T", "Invert the clock input", "Tie J to VCC and leave K open", "Ground the J input"],
    answer: "Tie both J and K inputs together as T",
    topic: "T Flip-Flop"
  },
  {
    id: 89,
    question: "Because a T flip-flop toggles every clock cycle when T=1, it functions as a:",
    options: ["Frequency divider by 2", "Voltage multiplier", "Parity shifter", "Analog converter"],
    answer: "Frequency divider by 2",
    topic: "T Flip-Flop"
  },

  // 16. Multiplexer (MUX)
  {
    id: 90,
    question: "A Multiplexer is commonly referred to as a:",
    options: ["Data selector", "Data distributor", "Code converter", "Parity generator"],
    answer: "Data selector",
    topic: "Multiplexer"
  },
  {
    id: 91,
    question: "How many select lines are required for a 4-to-1 multiplexer?",
    options: ["2", "1", "3", "4"],
    answer: "2",
    topic: "Multiplexer"
  },
  {
    id: 92,
    question: "How many select lines are needed for an 8-to-1 multiplexer?",
    options: ["3", "2", "4", "8"],
    answer: "3",
    topic: "Multiplexer"
  },
  {
    id: 93,
    question: "How many output lines does a standard single multiplexer have?",
    options: ["1", "2", "4", "Depends on select lines"],
    answer: "1",
    topic: "Multiplexer"
  },
  {
    id: 94,
    question: "If a multiplexer has 'm' select lines, how many data inputs can it select from?",
    options: ["2ᵐ", "2m", "m²", "m + 2"],
    answer: "2ᵐ",
    topic: "Multiplexer"
  },

  // 17. Demultiplexer (DEMUX)
  {
    id: 95,
    question: "A Demultiplexer performs the exact reverse operation of a:",
    options: ["Multiplexer", "Encoder", "Counter", "Flip-Flop"],
    answer: "Multiplexer",
    topic: "Demultiplexer"
  },
  {
    id: 96,
    question: "A Demultiplexer is commonly known as a:",
    options: ["Data distributor", "Data selector", "Data comparator", "Data compressor"],
    answer: "Data distributor",
    topic: "Demultiplexer"
  },
  {
    id: 97,
    question: "How many input data lines does a 1-to-4 demultiplexer receive?",
    options: ["1", "4", "2", "8"],
    answer: "1",
    topic: "Demultiplexer"
  },
  {
    id: 98,
    question: "How many select lines are required for a 1-to-8 demultiplexer?",
    options: ["3", "2", "4", "8"],
    answer: "3",
    topic: "Demultiplexer"
  },

  // 18. Encoder
  {
    id: 99,
    question: "What is the primary function of a digital encoder?",
    options: [
      "Converts 2ⁿ input lines into an n-bit binary code",
      "Selects one data input out of many",
      "Converts binary code into decoded decimal",
      "Amplifies weak digital pulses"
    ],
    answer: "Converts 2ⁿ input lines into an n-bit binary code",
    topic: "Encoder"
  },
  {
    id: 100,
    question: "How many output lines are produced by an 8-to-3 octal-to-binary encoder?",
    options: ["3", "8", "4", "2"],
    answer: "3",
    topic: "Encoder"
  },
  {
    id: 101,
    question: "Which type of encoder handles situations where more than one input is active simultaneously?",
    options: ["Priority encoder", "Sequential encoder", "Asynchronous encoder", "Serial encoder"],
    answer: "Priority encoder",
    topic: "Encoder"
  },

  // 19. Decoder
  {
    id: 102,
    question: "What does a digital decoder do?",
    options: [
      "Converts an n-bit binary code into up to 2ⁿ unique output lines",
      "Encodes analog signals into digital bits",
      "Converts serial signals into high-frequency pulses",
      "Stores 8 bits of data in memory"
    ],
    answer: "Converts an n-bit binary code into up to 2ⁿ unique output lines",
    topic: "Decoder"
  },
  {
    id: 103,
    question: "How many output lines does a 2-to-4 binary decoder have?",
    options: ["4", "2", "8", "16"],
    answer: "4",
    topic: "Decoder"
  },
  {
    id: 104,
    question: "How many output lines does a 3-to-8 binary decoder have?",
    options: ["8", "3", "6", "16"],
    answer: "8",
    topic: "Decoder"
  },
  {
    id: 105,
    question: "Which decoder is commonly used to drive numerical seven-segment LED displays?",
    options: ["BCD to 7-Segment Decoder", "Hex to Octal Decoder", "Gray to Binary Decoder", "Parity Decoder"],
    answer: "BCD to 7-Segment Decoder",
    topic: "Decoder"
  }
];
