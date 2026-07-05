const { sql } = require("drizzle-orm");
const { db, users, problems } = require("./db.js");
const { submit_testcases } = require("./schema.js");

async function seed() {
  console.log("Seeding database with 10 problems...");
  
  // Clear old data
  await db.delete(submit_testcases);
  await db.delete(problems);
  await db.delete(users);

  // Insert test user
  await db.insert(users).values({
    id: 123,
    name: "Test Author",
    email: "author@test.com",
    password: "password"
  });

  const problemsToInsert = [
    {
      id: 1,
      title: "Two Sum",
      authorId: 123,
      description: "Given an array of integers `nums` and an integer `target`, return *indices of the two numbers such that they add up to `target`*.\n\nYou may assume that each input would have ***exactly one solution***.\n\nOutput space-separated indices in ascending order.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    if (input.length < 3) return;\n    const n = parseInt(input[0]);\n    const nums = input[1].trim().split(/\\s+/).map(Number);\n    const target = parseInt(input[2]);\n    \n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] === target) {\n                console.log(i + ' ' + j);\n                return;\n            }\n        }\n    }\n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    input_data = sys.stdin.read().split()\n    if not input_data:\n        return\n    n = int(input_data[0])\n    nums = [int(x) for x in input_data[1:n+1]]\n    target = int(input_data[-1])\n    for i in range(n):\n        for j in range(i + 1, n):\n            if nums[i] + nums[j] == target:\n                print(f\"{i} {j}\")\n                return\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) {\n        cin >> nums[i];\n    }\n    int target;\n    cin >> target;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                cout << i << \" \" << j << endl;\n                return 0;\n            }\n        }\n    }\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "4\n2 7 11 15\n9", output: "0 1", explanation: "nums[0] + nums[1] == 9, so output 0 1." }
      ],
      run_testcases: [
        { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
        { input: "3\n3 2 4\n6", expectedOutput: "1 2" }
      ],
      constraints: "2 <= nums.length <= 1000\\nOnly one valid answer exists.",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "4\n2 7 11 15\n9", expectedOutput: "0 1" },
        { input: "3\n3 2 4\n6", expectedOutput: "1 2" },
        { input: "2\n3 3\n6", expectedOutput: "0 1" },
        { input: "3\n1 2 3\n4", expectedOutput: "0 2" },
        { input: "4\n10 20 30 40\n70", expectedOutput: "2 3" }
      ]
    },
    {
      id: 2,
      title: "Fibonacci Number",
      authorId: 123,
      description: "Given `n`, calculate the Fibonacci number `F(n)` where `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n-1) + F(n-2)`.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const n = parseInt(fs.readFileSync(0, 'utf-8').trim());\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." }
      ],
      run_testcases: [
        { input: "2", expectedOutput: "1" },
        { input: "3", expectedOutput: "2" }
      ],
      constraints: "0 <= n <= 30",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "0", expectedOutput: "0" },
        { input: "1", expectedOutput: "1" },
        { input: "2", expectedOutput: "1" },
        { input: "5", expectedOutput: "5" },
        { input: "10", expectedOutput: "55" },
        { input: "20", expectedOutput: "6765" }
      ]
    },
    {
      id: 3,
      title: "Palindrome Number",
      authorId: 123,
      description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nOutput should be exactly `true` or `false`.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const x = fs.readFileSync(0, 'utf-8').trim();\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "121", output: "true" }
      ],
      run_testcases: [
        { input: "121", expectedOutput: "true" },
        { input: "-121", expectedOutput: "false" }
      ],
      constraints: "-2^31 <= x <= 2^31 - 1",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "121", expectedOutput: "true" },
        { input: "-121", expectedOutput: "false" },
        { input: "10", expectedOutput: "false" },
        { input: "1221", expectedOutput: "true" },
        { input: "0", expectedOutput: "true" },
        { input: "12321", expectedOutput: "true" }
      ]
    },
    {
      id: 4,
      title: "Fizz Buzz",
      authorId: 123,
      description: "Given an integer `n`, output space-separated string values from 1 to `n` where:\n- Output `Fizz` if divisible by 3\n- Output `Buzz` if divisible by 5\n- Output `FizzBuzz` if divisible by both 3 and 5\n- Else output the string representation of the number itself.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const n = parseInt(fs.readFileSync(0, 'utf-8').trim());\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "3", output: "1 2 Fizz" }
      ],
      run_testcases: [
        { input: "3", expectedOutput: "1 2 Fizz" },
        { input: "5", expectedOutput: "1 2 Fizz 4 Buzz" }
      ],
      constraints: "1 <= n <= 100",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "1", expectedOutput: "1" },
        { input: "3", expectedOutput: "1 2 Fizz" },
        { input: "5", expectedOutput: "1 2 Fizz 4 Buzz" },
        { input: "15", expectedOutput: "1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz" },
        { input: "8", expectedOutput: "1 2 Fizz 4 Buzz Fizz 7 8" }
      ]
    },
    {
      id: 5,
      title: "Single Number",
      authorId: 123,
      description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.\n\nInput format:\n- `n`: size of array\n- `nums`: space-separated elements.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    const n = parseInt(input[0]);\n    const nums = input[1].trim().split(/\\s+/).map(Number);\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "3\n2 2 1", output: "1" }
      ],
      run_testcases: [
        { input: "3\n2 2 1", expectedOutput: "1" },
        { input: "5\n4 1 2 1 2", expectedOutput: "4" }
      ],
      constraints: "1 <= n <= 10^4\\nEvery element appears twice except one.",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "1\n4", expectedOutput: "4" },
        { input: "3\n2 2 1", expectedOutput: "1" },
        { input: "5\n4 1 2 1 2", expectedOutput: "4" },
        { input: "3\n5 -5 -5", expectedOutput: "5" },
        { input: "7\n1 1 2 2 3 4 3", expectedOutput: "4" }
      ]
    },
    {
      id: 6,
      title: "Power of Two",
      authorId: 123,
      description: "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const n = parseInt(fs.readFileSync(0, 'utf-8').trim());\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "16", output: "true" }
      ],
      run_testcases: [
        { input: "16", expectedOutput: "true" },
        { input: "3", expectedOutput: "false" }
      ],
      constraints: "-2^31 <= n <= 2^31 - 1",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "1", expectedOutput: "true" },
        { input: "16", expectedOutput: "true" },
        { input: "3", expectedOutput: "false" },
        { input: "0", expectedOutput: "false" },
        { input: "-8", expectedOutput: "false" },
        { input: "1024", expectedOutput: "true" }
      ]
    },
    {
      id: 7,
      title: "Plus One",
      authorId: 123,
      description: "You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the `i`th digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. Increment the large integer by one and return the resulting array of digits.\n\nInput format:\n- `n`: size of digits array\n- `digits`: space-separated digits.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    const n = parseInt(input[0]);\n    const digits = input[1].trim().split(/\\s+/).map(Number);\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "3\n1 2 3", output: "1 2 4" }
      ],
      run_testcases: [
        { input: "3\n1 2 3", expectedOutput: "1 2 4" },
        { input: "1\n9", expectedOutput: "1 0" }
      ],
      constraints: "1 <= digits.length <= 100\\n0 <= digits[i] <= 9",
      difficulty: "Easy",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "3\n1 2 3", expectedOutput: "1 2 4" },
        { input: "4\n4 3 2 1", expectedOutput: "4 3 2 2" },
        { input: "1\n9", expectedOutput: "1 0" },
        { input: "3\n9 9 9", expectedOutput: "1 0 0 0" },
        { input: "2\n0", expectedOutput: "1" }
      ]
    },
    {
      id: 8,
      title: "Valid Parentheses",
      authorId: 123,
      description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const s = fs.readFileSync(0, 'utf-8').trim();\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "()", output: "true" }
      ],
      run_testcases: [
        { input: "()", expectedOutput: "true" },
        { input: "(]", expectedOutput: "false" }
      ],
      constraints: "1 <= s.length <= 10^4\\ns consists of parentheses only.",
      difficulty: "Medium",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "()", expectedOutput: "true" },
        { input: "()[]{}", expectedOutput: "true" },
        { input: "(]", expectedOutput: "false" },
        { input: "([)]", expectedOutput: "false" },
        { input: "{[]}", expectedOutput: "true" },
        { input: "[", expectedOutput: "false" }
      ]
    },
    {
      id: 9,
      title: "Anagram Check",
      authorId: 123,
      description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nInput format:\n- Line 1: `s`\n- Line 2: `t`",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\n    const s = input[0] || '';\n    const t = input[1] || '';\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "anagram\nnagaram", output: "true" }
      ],
      run_testcases: [
        { input: "anagram\nnagaram", expectedOutput: "true" },
        { input: "rat\ncar", expectedOutput: "false" }
      ],
      constraints: "1 <= s.length, t.length <= 5 * 10^4",
      difficulty: "Medium",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "anagram\nnagaram", expectedOutput: "true" },
        { input: "rat\ncar", expectedOutput: "false" },
        { input: "a\na", expectedOutput: "true" },
        { input: "ab\na", expectedOutput: "false" },
        { input: "hello\nolelh", expectedOutput: "true" }
      ]
    },
    {
      id: 10,
      title: "Find Factorial",
      authorId: 123,
      description: "Given an integer `n`, return the value of `n!` (n factorial).",
      defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\n\nfunction solve() {\n    const n = parseInt(fs.readFileSync(0, 'utf-8').trim());\n    // Write your code here\n    \n}\n\nsolve();",
        python: "import sys\n\ndef solve():\n    # Write your Python code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
        cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}"
      }),
      examples: [
        { id: 1, input: "5", output: "120" }
      ],
      run_testcases: [
        { input: "5", expectedOutput: "120" },
        { input: "0", expectedOutput: "1" }
      ],
      constraints: "0 <= n <= 12",
      difficulty: "Hard",
      timelimit: 2000,
      memorylimit: 256,
      submit_testcases: [
        { input: "0", expectedOutput: "1" },
        { input: "1", expectedOutput: "1" },
        { input: "5", expectedOutput: "120" },
        { input: "8", expectedOutput: "40320" },
        { input: "10", expectedOutput: "3628800" },
        { input: "12", expectedOutput: "479001600" }
      ]
    }
  ];

  for (const prob of problemsToInsert) {
    console.log(`Inserting problem: ${prob.title}...`);
    await db.insert(problems).values({
      id: prob.id,
      title: prob.title,
      authorId: prob.authorId,
      description: prob.description,
      defaultCode: prob.defaultCode,
      examples: prob.examples,
      run_testcases: prob.run_testcases,
      constraints: prob.constraints,
      difficulty: prob.difficulty,
      timelimit: prob.timelimit,
      memorylimit: prob.memorylimit
    });

    for (const tc of prob.submit_testcases) {
      await db.insert(submit_testcases).values({
        problemId: prob.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput
      });
    }
  }

  // Update serial sequences
  await db.execute(sql`SELECT setval(pg_get_serial_sequence('users', 'id'), coalesce(max(id), 1)) FROM users;`);
  await db.execute(sql`SELECT setval(pg_get_serial_sequence('problems', 'id'), coalesce(max(id), 1)) FROM problems;`);

  console.log("Database seeded successfully with 10 problems!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
