document.addEventListener("DOMContentLoaded", () => {
  // Declare Lucide icons
  const lucide = window.lucide

  // Declare lessonContent
  const lessonContent = window.lessonContent

  // Declare monaco
  const monaco = window.monaco

  // Initialize Lucide icons
  lucide.createIcons()

  // Get unit and lesson IDs from URL
  const urlParams = new URLSearchParams(window.location.search)
  const unitId = Number.parseInt(urlParams.get("unitId"))
  const lessonId = Number.parseInt(urlParams.get("lessonId"))

  if (!unitId || !lessonId) {
    window.location.href = "index.html"
    return
  }

  // Set back link
  document.getElementById("back-to-unit").href = `unit.html?id=${unitId}`

  // Get lesson data
  const lessonData = lessonContent[unitId]?.[lessonId]

  if (!lessonData) {
    window.location.href = `unit.html?id=${unitId}`
    return
  }

  // Render lesson header
  const lessonHeader = document.getElementById("lesson-header")
  lessonHeader.innerHTML = `
    <h1>Lesson ${lessonId}: ${lessonData.title}</h1>
    <p>Unit ${unitId}: ${lessonData.unitTitle}</p>
  `

  // Render lesson content
  const lessonContentEl = document.getElementById("lesson-content")
  lessonContentEl.innerHTML = `
    <div class="prose">
      ${formatMarkdown(lessonData.content)}
    </div>
    <div class="flex justify-between mt-4">
      ${
        lessonData.prevLesson
          ? `
        <a href="lesson.html?unitId=${unitId}&lessonId=${lessonData.prevLesson.id}" class="button outline">
          <i data-lucide="arrow-left" class="mr-2 h-4 w-4"></i>
          Previous Lesson
        </a>
      `
          : "<div></div>"
      }
      
      <button id="go-to-challenge" class="button primary">
        Try the Challenge
        <i data-lucide="arrow-right" class="ml-2 h-4 w-4"></i>
      </button>
    </div>
  `

  // Render challenge content
  const challengeContent = document.getElementById("challenge-content")
  challengeContent.innerHTML = `
    <h2>${lessonData.challenge.title}</h2>
    <p>${lessonData.challenge.description}</p>
    
    <div class="mb-4">
      <h3 class="font-medium mb-2">Instructions:</h3>
      <ul class="list-disc pl-5 space-y-1">
        ${lessonData.challenge.instructions.map((instruction) => `<li>${instruction}</li>`).join("")}
      </ul>
    </div>
    
    <div class="code-editor-container">
      <h3>Code:</h3>
      <div id="monaco-editor" style="height: 300px; border: 1px solid #ccc;"></div>
      
      <div class="editor-actions">
        <button id="run-code" class="button primary">Run Code</button>
        <button id="reset-code" class="button outline">Reset Code</button>
        <button id="show-solution" class="button outline">Show Solution</button>
      </div>
      
      <h3>Output:</h3>
      <div id="code-output" class="code-output">
        <div class="output-placeholder">Run your code to see output</div>
      </div>
      
      <div id="success-message" class="success-message hidden">
        <i data-lucide="check-circle" class="h-5 w-5"></i>
        <span>Great job! You've completed this challenge successfully!</span>
      </div>
    </div>
    
    <div class="lesson-navigation">
      <div></div>
      <div class="flex gap-2">
        <button id="run-code-bottom" class="button primary">Run Code</button>
        ${
          lessonData.nextLesson
            ? `
          <a href="lesson.html?unitId=${unitId}&lessonId=${lessonData.nextLesson.id}" id="next-lesson" class="button primary hidden">
            Next Lesson
            <i data-lucide="arrow-right" class="ml-2 h-4 w-4"></i>
          </a>
        `
            : ""
        }
      </div>
    </div>
  `

  // Initialize tabs
  const tabs = document.querySelectorAll(".tab")
  const tabContents = document.querySelectorAll(".tab-content")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab")

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Update active content
      tabContents.forEach((content) => {
        content.classList.remove("active")
        if (content.id === `${tabId}-content`) {
          content.classList.add("active")
        }
      })
    })
  })

  // Go to challenge button
  document.getElementById("go-to-challenge").addEventListener("click", () => {
    document.querySelector('[data-tab="challenge"]').click()
  })

  // Initialize Monaco Editor
  let editor
  let isCorrect = false

  require(["vs/editor/editor.main"], () => {
    // Configure Lua language
    configureLuaLanguage()

    // Create editor
    editor = monaco.editor.create(document.getElementById("monaco-editor"), {
      value: lessonData.challenge.initialCode,
      language: "lua",
      theme: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "vs-dark" : "vs",
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
      lineNumbers: "on",
      tabSize: 2,
    })

    // Run code button
    const runCodeBtn = document.getElementById("run-code")
    const runCodeBottomBtn = document.getElementById("run-code-bottom")
    const resetCodeBtn = document.getElementById("reset-code")
    const showSolutionBtn = document.getElementById("show-solution")
    const codeOutput = document.getElementById("code-output")
    const successMessage = document.getElementById("success-message")
    const nextLessonBtn = document.getElementById("next-lesson")

    runCodeBtn.addEventListener("click", runCode)
    runCodeBottomBtn.addEventListener("click", runCode)

    resetCodeBtn.addEventListener("click", () => {
      editor.setValue(lessonData.challenge.initialCode)
      codeOutput.innerHTML = '<div class="output-placeholder">Run your code to see output</div>'
      successMessage.classList.add("hidden")
      if (nextLessonBtn) nextLessonBtn.classList.add("hidden")
      isCorrect = false
    })

    showSolutionBtn.addEventListener("click", () => {
      editor.setValue(lessonData.challenge.solution)
    })

    function runCode() {
      const code = editor.getValue()
      let output = []
      let correct = false

      try {
        // Simple simulation of running the code
        if (unitId === 3) {
          // Functions unit
          if (lessonId === 1) {
            if (
              code.includes("function greet") &&
              code.includes("Welcome to Roblox Studio") &&
              code.includes("greet()")
            ) {
              output = lessonData.challenge.expectedOutput
              correct = true
            } else {
              output = ["Output doesn't match expected results. Try again!"]
            }
          } else if (lessonId === 2) {
            if (
              code.includes("function greetPlayer") &&
              code.includes("name") &&
              code.includes("Hello") &&
              code.includes("Welcome to the game") &&
              code.includes("greetPlayer(")
            ) {
              output = lessonData.challenge.expectedOutput
              correct = true
            } else {
              output = ["Output doesn't match expected results. Try again!"]
            }
          }
        } else if (unitId === 6) {
          // Control Structures unit
          if (
            code.includes("health >= 100") &&
            code.includes("health >= 50") &&
            code.includes("health >= 25") &&
            code.includes("Full Health") &&
            code.includes("Moderate Health") &&
            code.includes("Low Health") &&
            code.includes("Critical Health")
          ) {
            output = lessonData.challenge.expectedOutput
            correct = true
          } else {
            output = ["Output doesn't match expected results. Try again!"]
          }
        }
      } catch (error) {
        output = [`Error: ${error}`]
      }

      // Update output
      codeOutput.innerHTML = output.map((line) => `<div>${line}</div>`).join("")

      // Update success state
      isCorrect = correct
      if (correct) {
        successMessage.classList.remove("hidden")
        if (nextLessonBtn) nextLessonBtn.classList.remove("hidden")
      } else {
        successMessage.classList.add("hidden")
        if (nextLessonBtn) nextLessonBtn.classList.add("hidden")
      }
    }
  })

  // Helper function to format markdown
  function formatMarkdown(markdown) {
    return markdown
      .replace(/\n/g, "<br />")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/```lua\n([^`]+)```/g, "<pre><code>$1</code></pre>")
  }

  // Configure Lua language for Monaco
  function configureLuaLanguage() {
    // Define Lua keywords for syntax highlighting
    const luaKeywords = [
      "and",
      "break",
      "do",
      "else",
      "elseif",
      "end",
      "false",
      "for",
      "function",
      "if",
      "in",
      "local",
      "nil",
      "not",
      "or",
      "repeat",
      "return",
      "then",
      "true",
      "until",
      "while",
    ]

    // Register Lua language
    monaco.languages.register({ id: "lua" })

    // Define Lua language configuration
    monaco.languages.setMonarchTokensProvider("lua", {
      defaultToken: "",
      tokenPostfix: ".lua",

      keywords: luaKeywords,

      operators: [
        "+",
        "-",
        "*",
        "/",
        "%",
        "^",
        "#",
        "==",
        "~=",
        "<=",
        ">=",
        "<",
        ">",
        "=",
        "(",
        ")",
        "{",
        "}",
        "[",
        "]",
        ";",
        ":",
        ",",
        ".",
        "..",
        "...",
      ],

      symbols: /[=><!~?:&|+\-*/^%]+/,
      escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

      tokenizer: {
        root: [
          [
            /[a-zA-Z_]\w*/,
            {
              cases: {
                "@keywords": "keyword",
                "@default": "identifier",
              },
            },
          ],

          { include: "@whitespace" },

          [/[{}()[\]]/, "@brackets"],
          [/[<>](?!@symbols)/, "@brackets"],
          [
            /@symbols/,
            {
              cases: {
                "@operators": "operator",
                "@default": "",
              },
            },
          ],

          [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
          [/0[xX][0-9a-fA-F]+/, "number.hex"],
          [/\d+/, "number"],

          [/[;,.]/, "delimiter"],

          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/'([^'\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string_double"],
          [/'/, "string", "@string_single"],

          [/--\[\[.*\]\]/, "comment"],
          [/--.*$/, "comment"],
        ],

        whitespace: [[/[ \t\r\n]+/, ""]],

        string_double: [
          [/[^\\"]+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [/"/, "string", "@pop"],
        ],

        string_single: [
          [/[^\\']+/, "string"],
          [/@escapes/, "string.escape"],
          [/\\./, "string.escape.invalid"],
          [/'/, "string", "@pop"],
        ],
      },
    })

    // Set language configuration
    monaco.languages.setLanguageConfiguration("lua", {
      comments: {
        lineComment: "--",
        blockComment: ["--[[", "]]"],
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      indentationRules: {
        increaseIndentPattern: /^.*(\bdo\b|\bthen\b|\belse\b|elseif|\brepeat\b|\bfunction\b|[({]).*$/,
        decreaseIndentPattern: /^.*(\bend\b|\buntil\b|[)}]).*$/,
      },
    })
  }

  // Initialize icons again for the newly added elements
  lucide.createIcons()
})
