// Data for the Roblox Lua Learning Platform
const units = [
  {
    id: 1,
    title: "Introduction to Lua",
    description: "Learn the basics of Lua programming language",
    lessons: [
      { id: 1, title: "What is Lua?", completed: true },
      { id: 2, title: "Lua in Roblox", completed: true },
      { id: 3, title: "Your First Script", completed: true },
      { id: 4, title: "Comments and Print", completed: true },
      { id: 5, title: "Basic Operators", completed: true },
    ],
  },
  {
    id: 2,
    title: "Variables & Data Types",
    description: "Understanding variables and different data types in Lua",
    lessons: [
      { id: 1, title: "Variables and Assignment", completed: true },
      { id: 2, title: "Numbers and Strings", completed: true },
      { id: 3, title: "Booleans and Nil", completed: true },
      { id: 4, title: "Type Conversion", completed: false },
    ],
  },
  {
    id: 3,
    title: "Functions",
    description: "Creating and using functions in Lua",
    lessons: [
      { id: 1, title: "Function Basics", completed: true },
      { id: 2, title: "Parameters and Arguments", completed: true },
      { id: 3, title: "Return Values", completed: false },
      { id: 4, title: "Local and Global Functions", completed: false },
    ],
  },
  {
    id: 4,
    title: "Tables",
    description: "Working with Lua tables for data storage",
    lessons: [
      { id: 1, title: "Table Basics", completed: false },
      { id: 2, title: "Arrays in Lua", completed: false },
      { id: 3, title: "Dictionaries in Lua", completed: false },
      { id: 4, title: "Nested Tables", completed: false },
      { id: 5, title: "Table Methods", completed: false },
    ],
  },
  {
    id: 5,
    title: "Loops",
    description: "Different types of loops in Lua",
    lessons: [
      { id: 1, title: "For Loops", completed: false },
      { id: 2, title: "While Loops", completed: false },
      { id: 3, title: "Repeat Until Loops", completed: false },
    ],
  },
  {
    id: 6,
    title: "Control Structures",
    description: "Using if statements and other control structures",
    lessons: [
      { id: 1, title: 'if "condition" then', completed: false },
      { id: 2, title: "else and elseif", completed: false },
      { id: 3, title: "switch-case alternatives", completed: false },
      { id: 4, title: "Logical Operators", completed: false },
    ],
  },
]

// Lesson content data
const lessonContent = {
  // Unit 3: Functions
  3: {
    1: {
      unitId: 3,
      unitTitle: "Functions",
      id: 1,
      title: "Function Basics",
      content: `
# Function Basics in Lua

Functions are blocks of code that can be called and reused throughout your program. In Lua, functions are defined using the \`function\` keyword.

## Basic Syntax

\`\`\`lua
function functionName()
    -- code to execute
end
\`\`\`

## Example

\`\`\`lua
function sayHello()
    print("Hello, Roblox developer!")
end

-- Call the function
sayHello()
\`\`\`

Functions help organize your code and make it more reusable. In Roblox, you'll use functions for everything from handling player actions to creating game mechanics.
      `,
      challenge: {
        title: "Create a Greeting Function",
        description: "Create a function that prints a greeting message.",
        instructions: [
          "Create a function called 'greet'",
          "Inside the function, print 'Welcome to Roblox Studio!'",
          "Call the function after defining it",
        ],
        initialCode: `-- Write your function here


-- Call your function here
`,
        solution: `-- Write your function here
function greet()
  print("Welcome to Roblox Studio!")
end

-- Call your function here
greet()`,
        expectedOutput: ["Welcome to Roblox Studio!"],
      },
      nextLesson: {
        id: 2,
        title: "Parameters and Arguments",
      },
      prevLesson: null,
    },
    2: {
      unitId: 3,
      unitTitle: "Functions",
      id: 2,
      title: "Parameters and Arguments",
      content: `
# Function Parameters and Arguments

Parameters allow functions to receive data when they are called. Arguments are the actual values passed to the function.

## Syntax

\`\`\`lua
function functionName(parameter1, parameter2)
    -- code using parameters
end

-- Call with arguments
functionName(argument1, argument2)
\`\`\`

## Example

\`\`\`lua
function addNumbers(a, b)
    print(a + b)
end

-- Call with arguments 5 and 3
addNumbers(5, 3)  -- Outputs: 8
\`\`\`

Parameters make your functions more flexible and reusable by allowing them to work with different values each time they're called.
      `,
      challenge: {
        title: "Create a Personalized Greeting",
        description: "Create a function that greets a player by name.",
        instructions: [
          "Create a function called 'greetPlayer' that takes a 'name' parameter",
          "Inside the function, print 'Hello, [name]! Welcome to the game!'",
          "Call the function with different names",
        ],
        initialCode: `-- Write your function here


-- Call your function with different names
-- greetPlayer("Alex")
-- greetPlayer("Taylor")
`,
        solution: `-- Write your function here
function greetPlayer(name)
  print("Hello, " .. name .. "! Welcome to the game!")
end

-- Call your function with different names
greetPlayer("Alex")
greetPlayer("Taylor")`,
        expectedOutput: ["Hello, Alex! Welcome to the game!", "Hello, Taylor! Welcome to the game!"],
      },
      nextLesson: {
        id: 3,
        title: "Return Values",
      },
      prevLesson: {
        id: 1,
        title: "Function Basics",
      },
    },
  },
  // Unit 6: Control Structures
  6: {
    1: {
      unitId: 6,
      unitTitle: "Control Structures",
      id: 1,
      title: 'if "condition" then',
      content: `
# If Statements in Lua

In Lua, the \`if\` statement allows you to execute code conditionally. The basic syntax is:

\`\`\`lua
if condition then
    -- code to execute if condition is true
end
\`\`\`

The condition is evaluated, and if it's true (any value other than \`false\` or \`nil\`), the code inside the if block is executed.

## Examples

### Basic if statement:

\`\`\`lua
local playerHealth = 50

if playerHealth < 100 then
    print("Player is not at full health!")
end
\`\`\`

### Using comparison operators:

- Equal to: \`==\`
- Not equal to: \`~=\`
- Greater than: \`>\`
- Less than: \`<\`
- Greater than or equal to: \`>=\`
- Less than or equal to: \`<=\`

\`\`\`lua
local playerLevel = 10

if playerLevel >= 10 then
    print("Player can use advanced weapons!")
end
\`\`\`

In Roblox, if statements are commonly used to check player conditions, part collisions, and game states.
  `,
      challenge: {
        title: "Health Status Challenge",
        description:
          "Create a function that takes a player's health value and returns a status message based on the health value.",
        instructions: [
          "Create a function called 'getHealthStatus' that takes a number parameter 'health'",
          "If health is 100 or greater, return 'Full Health'",
          "If health is between 50 and 99, return 'Moderate Health'",
          "If health is between 25 and 49, return 'Low Health'",
          "If health is below 25, return 'Critical Health'",
        ],
        initialCode: `function getHealthStatus(health)
  -- Write your code here
  
  return "Unknown Status"
end

-- Test your function with these values
print(getHealthStatus(100))
print(getHealthStatus(75))
print(getHealthStatus(30))
print(getHealthStatus(10))`,
        solution: `function getHealthStatus(health)
  if health >= 100 then
    return "Full Health"
  elseif health >= 50 then
    return "Moderate Health"
  elseif health >= 25 then
    return "Low Health"
  else
    return "Critical Health"
  end
end

-- Test your function with these values
print(getHealthStatus(100))
print(getHealthStatus(75))
print(getHealthStatus(30))
print(getHealthStatus(10))`,
        expectedOutput: ["Full Health", "Moderate Health", "Low Health", "Critical Health"],
      },
      nextLesson: {
        id: 2,
        title: "else and elseif",
      },
      prevLesson: null,
    },
  },
}

// Unit test data
const unitTests = {
  6: {
    unitId: 6,
    unitTitle: "Control Structures",
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Which keyword is used to start an if statement in Lua?",
        options: ["if", "when", "check", "condition"],
        correctAnswer: "if",
      },
      {
        id: 2,
        type: "multiple-choice",
        question: "What symbol is used for 'not equal to' in Lua?",
        options: ["!=", "<>", "~=", "/="],
        correctAnswer: "~=",
      },
      {
        id: 3,
        type: "coding",
        question: "Write a function that returns 'Pass' if the score is 70 or higher, otherwise return 'Fail'.",
        initialCode: `function checkScore(score)
  -- Write your code here
  
  return "Unknown"
end`,
        solution: `function checkScore(score)
  if score >= 70 then
    return "Pass"
  else
    return "Fail"
  end
end`,
        testCases: [
          { input: 85, expected: "Pass" },
          { input: 70, expected: "Pass" },
          { input: 65, expected: "Fail" },
        ],
      },
      {
        id: 4,
        type: "multiple-choice",
        question: "Which of the following is NOT a valid comparison operator in Lua?",
        options: ["==", "<=", ">=", "=>"],
        correctAnswer: "=>",
      },
    ],
  },
}
