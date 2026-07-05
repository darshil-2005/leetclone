const fs = require('fs');
let content = fs.readFileSync('backend/src/seed.js', 'utf8');

// Replace Two Sum specifically
content = content.replace(
  `defaultCode: "const fs = require('fs');\\n\\nfunction solve() {\\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\\\n');\\n    if (input.length < 3) return;\\n    const n = parseInt(input[0]);\\n    const nums = input[1].trim().split(/\\\\s+/).map(Number);\\n    const target = parseInt(input[2]);\\n    \\n    for (let i = 0; i < n; i++) {\\n        for (let j = i + 1; j < n; j++) {\\n            if (nums[i] + nums[j] === target) {\\n                console.log(i + ' ' + j);\\n                return;\\n            }\\n        }\\n    }\\n}\\n\\nsolve();",`,
  `defaultCode: JSON.stringify({
        javascript: "const fs = require('fs');\\n\\nfunction solve() {\\n    const input = fs.readFileSync(0, 'utf-8').trim().split('\\\\n');\\n    if (input.length < 3) return;\\n    const n = parseInt(input[0]);\\n    const nums = input[1].trim().split(/\\\\s+/).map(Number);\\n    const target = parseInt(input[2]);\\n    \\n    for (let i = 0; i < n; i++) {\\n        for (let j = i + 1; j < n; j++) {\\n            if (nums[i] + nums[j] === target) {\\n                console.log(i + ' ' + j);\\n                return;\\n            }\\n        }\\n    }\\n}\\n\\nsolve();",
        python: "import sys\\n\\ndef solve():\\n    input_data = sys.stdin.read().split()\\n    if not input_data:\\n        return\\n    n = int(input_data[0])\\n    nums = [int(x) for x in input_data[1:n+1]]\\n    target = int(input_data[-1])\\n    for i in range(n):\\n        for j in range(i + 1, n):\\n            if nums[i] + nums[j] == target:\\n                print(f\\"{i} {j}\\")\\n                return\\n\\nif __name__ == '__main__':\\n    solve()",
        cpp: "#include <iostream>\\n#include <vector>\\nusing namespace std;\\n\\nint main() {\\n    int n;\\n    if (!(cin >> n)) return 0;\\n    vector<int> nums(n);\\n    for (int i = 0; i < n; i++) {\\n        cin >> nums[i];\\n    }\\n    int target;\\n    cin >> target;\\n    for (int i = 0; i < n; i++) {\\n        for (int j = i + 1; j < n; j++) {\\n            if (nums[i] + nums[j] == target) {\\n                cout << i << \\" \\" << j << endl;\\n                return 0;\\n            }\\n        }\\n    }\\n    return 0;\\n}"
      }),`
);

// Replace generic Javascript ones
content = content.replace(/defaultCode:\s*"([^"]+)",/g, (match, p1) => {
    if (match.includes('prob.defaultCode')) return match; // skip mapping assignment
    return `defaultCode: JSON.stringify({
        javascript: "${p1}",
        python: "import sys\\n\\ndef solve():\\n    # Write your Python code here\\n    pass\\n\\nif __name__ == '__main__':\\n    solve()",
        cpp: "#include <iostream>\\nusing namespace std;\\n\\nint main() {\\n    // Write your C++ code here\\n    return 0;\\n}"
      }),`;
});

fs.writeFileSync('backend/src/seed.js', content);
