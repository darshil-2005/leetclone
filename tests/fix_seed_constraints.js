const fs = require('fs');

const seedPath = 'backend/src/seed.js';
let content = fs.readFileSync(seedPath, 'utf8');

// Replace constraints: ["a", "b"] with constraints: "a\nb"
content = content.replace(/constraints:\s*\[(.*?)\]/g, (match, p1) => {
    // p1 contains string literals separated by commas, like `"1 <= n", "2 <= n"`
    // We want to evaluate it as a real JS array and join with '\n'
    try {
        const arr = eval(`[${p1}]`);
        const joined = arr.join('\\n');
        return `constraints: ${JSON.stringify(joined)}`;
    } catch (e) {
        return match;
    }
});

fs.writeFileSync(seedPath, content);
console.log("Updated seed.js constraints to use newline separated strings.");
