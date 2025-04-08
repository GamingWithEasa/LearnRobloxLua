document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide
  lucide.createIcons()

  // Get unit ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const unitId = Number.parseInt(urlParams.get("unitId"))

  if (!unitId) {
    window.location.href = "index.html"
    return
  }

  // Set back link
  document.getElementById("back-to-unit").href = `unit.html?id=${unitId}`

  // Get test data
  const testData = window.unitTests[unitId]

  if (!testData) {
    window.location.href = `unit.html?id=${unitId}`
    return
  }

  // Initialize test state
  let currentQuestion = 0
  const answers = {}
  const codingAnswers = {}
  const codingResults = {}
  let submitted = false

  // Render test
  renderTest()

  function renderTest() {
    const testContainer = document.getElementById("test-container")
    const question = testData.questions[currentQuestion]
    const totalQuestions = testData.questions.length

    testContainer.innerHTML = `
      <div class="mb-6">
        <h1 class="text-3xl font-bold mb-2">Unit Test: ${testData.unitTitle}</h1>
        <div class="test-progress">
          <div class="test-progress-bar">
            <div class="progress-container" style="flex: 1;">
              <div class="progress-bar" style="width: ${(currentQuestion / totalQuestions) * 100}%"></div>
            </div>
            <span class="text-sm whitespace-nowrap">
              Question ${currentQuestion + 1} of ${totalQuestions}
            </span>
          </div>
        </div>
      </div>
      
      <div class="card mb-6">
        <div class="card-header">
          <div class="card-title">
            Question ${currentQuestion + 1}
            ${question.type === "coding" ? ": Coding Challenge" : ""}
          </div>
          <div class="card-description">
            ${question.type === "multiple-choice" ? question.question : "Write code to solve the following problem:"}
          </div>
        </div>
        <div class="card-content">
          ${renderQuestionContent(question)}
        </div>
        <div class="card-footer flex justify-between">
          <button id="prev-question" class="button outline" ${currentQuestion === 0 ? "disabled" : ""}>
            Previous
          </button>
          
          ${
            currentQuestion < totalQuestions - 1
              ? `
            <button id="next-question" class="button primary" ${!isQuestionAnswered(question) ? "disabled" : ""}>
              Next
            </button>
          `
              : `
            <button id="submit-test" class="button primary" ${!allQuestionsAnswered() ? "disabled" : ""}>
              Submit Test
            </button>
          `
          }
        </div>
      </div>
      
      <div class="test-navigation">
        ${Array.from({ length: totalQuestions })
          .map(
            (_, i) => `
          <button class="button test-nav-button ${i === currentQuestion ? "primary" : isQuestionAnswered(testData.questions[i]) ? "outline" : ""}" data-question="${i}">
            ${i + 1}
          </button>
        `,
          )
          .join("")}
      </div>
    `

    // Add event listeners
    if (question.type === "multiple-choice") {
      const options = document.querySelectorAll(".question-option")
      options.forEach((option) => {
        option.addEventListener("click", () => {
          const value = option.getAttribute("data-value")
          answers[question.id] = value

          // Update UI
          options.forEach((opt) => {
            opt.classList.remove("selected")
            if (opt.getAttribute("data-value") === value) {
              opt.classList.add("selected")
            }
          })

          // Enable next button
          const nextButton = document.getElementById("next-question")
          if (nextButton) nextButton.disabled = false

          // Enable submit button if on last question
          const submitButton = document.getElementById("submit-test")
          if (submitButton && allQuestionsAnswered()) {
            submitButton.disabled = false
          }
        })
      })
    } else if (question.type === "coding") {
      // Initialize Monaco Editor
      require(["vs/editor/editor.main"], () => {
        // Configure Lua language
        configureLuaLanguage()

        // Create editor
        const editor = monaco.editor.create(document.getElementById("monaco-editor"), {
          value: codingAnswers[question.id] || question.initialCode,
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

        // Run tests button
        document.getElementById("run-tests").addEventListener("click", () => {
          const code = editor.getValue()
          codingAnswers[question.id] = code

          // Run tests
          const results = runCode(question.id, code, question.testCases)
          codingResults[question.id] = results

          // Update UI
          renderTestResults(question, results)

          // Enable next/submit button if all tests pass
          if (results.every((r) => r)) {
            const nextButton = document.getElementById("next-question")
            if (nextButton) nextButton.disabled = false

            const submitButton = document.getElementById("submit-test")
            if (submitButton && allQuestionsAnswered()) {
              submitButton.disabled = false
            }
          }
        })
      })
    }

    // Navigation buttons
    document.getElementById("prev-question")?.addEventListener("click", () => {
      if (currentQuestion > 0) {
        currentQuestion--
        renderTest()
      }
    })

    document.getElementById("next-question")?.addEventListener("click", () => {
      if (currentQuestion < totalQuestions - 1) {
        currentQuestion++
        renderTest()
      }
    })

    document.getElementById("submit-test")?.addEventListener("click", () => {
      // Run any unexecuted coding questions
      testData.questions.forEach((q) => {
        if (q.type === "coding" && codingAnswers[q.id] && !codingResults[q.id]) {
          codingResults[q.id] = runCode(q.id, codingAnswers[q.id], q.testCases)
        }
      })

      submitted = true
      renderResults()
    })

    // Question navigation
    document.querySelectorAll(".test-nav-button").forEach((button) => {
      button.addEventListener("click", () => {
        currentQuestion = Number.parseInt(button.getAttribute("data-question"))
        renderTest()
      })
    })

    // Initialize icons again for the newly added elements
    lucide.createIcons()
  }

  function renderQuestionContent(question) {
    if (question.type === "multiple-choice") {
      return `
        <div class="space-y-2">
          ${question.options
            .map(
              (option, index) => `
            <div class="question-option ${answers[question.id] === option ? "selected" : ""}" data-value="${option}">
              <div class="flex items-center gap-2">
                <div class="option-indicator">${String.fromCharCode(65 + index)}</div>
                <div>${option}</div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      `
    } else if (question.type === "coding") {
      return `
        <div>
          <p class="mb-4">${question.question}</p>
          
          <div id="monaco-editor" style="height: 300px; border: 1px solid #ccc; margin-bottom: 1rem;"></div>
          
          <button id="run-tests" class="button primary">Run Tests</button>
          
          <div id="test-results" class="mt-4 ${codingResults[question.id] ? "" : "hidden"}">
            ${codingResults[question.id] ? renderTestResultsHTML(question, codingResults[question.id]) : ""}
          </div>
        </div>
      `
    }

    return ""
  }

  function renderTestResults(question, results) {
    const testResultsEl = document.getElementById("test-results")
    testResultsEl.classList.remove("hidden")
    testResultsEl.innerHTML = renderTestResultsHTML(question, results)
  }

  function renderTestResultsHTML(question, results) {
    const allPassed = results.every((r) => r)

    return `
      <div class="test-results ${allPassed ? "passed" : "failed"}">
        <h3 class="font-medium mb-2">Test Results:</h3>
        <div class="space-y-2">
          ${question.testCases
            .map(
              (testCase, index) => `
            <div class="flex items-center justify-between">
              <div>Test ${index + 1}: Input = ${JSON.stringify(testCase.input)}</div>
              <div class="${results[index] ? "text-green-500" : "text-red-500"} font-medium">
                ${results[index] ? "Passed" : "Failed"}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  }

  function renderResults() {
    const testContainer = document.getElementById("test-container")
    testContainer.classList.add("hidden")

    const resultsContainer = document.getElementById("results-container")
    resultsContainer.classList.remove("hidden")

    // Calculate score
    let correctAnswers = 0
    const totalQuestions = testData.questions.length

    testData.questions.forEach((question) => {
      if (question.type === "multiple-choice") {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++
        }
      } else if (question.type === "coding") {
        if (codingResults[question.id] && codingResults[question.id].every((r) => r)) {
          correctAnswers++
        }
      }
    })

    const score = correctAnswers
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = percentage >= 70

    resultsContainer.innerHTML = `
      <div class="test-results ${passed ? "passed" : "failed"}">
        <div class="test-score">${score}/${totalQuestions}</div>
        <div class="test-percentage">${percentage}%</div>
        <div class="test-status ${passed ? "passed" : "failed"}">
          <i data-lucide="${passed ? "check-circle" : "x-circle"}" class="h-6 w-6"></i>
          <span>${passed ? "Passed" : "Failed"}</span>
        </div>
      </div>
      
      <div class="test-summary">
        <h3>Question Summary</h3>
        
        <div class="space-y-2 mt-4">
          ${testData.questions
            .map((question, index) => {
              let isCorrect = false

              if (question.type === "multiple-choice") {
                isCorrect = answers[question.id] === question.correctAnswer
              } else if (question.type === "coding") {
                isCorrect = codingResults[question.id] && codingResults[question.id].every((r) => r)
              }

              return `
              <div class="test-question-summary">
                <div>Question ${index + 1}</div>
                <div class="${isCorrect ? "text-green-500" : "text-red-500"} font-medium">
                  ${isCorrect ? "Correct" : "Incorrect"}
                </div>
              </div>
            `
            })
            .join("")}
        </div>
      </div>
      
      <div class="flex justify-center mt-6">
        <a href="unit.html?id=${unitId}" class="button primary">
          Return to Unit
        </a>
      </div>
    `

    // Initialize icons again for the newly added elements
    lucide.createIcons()
  }

  function isQuestionAnswered(question) {
    if (question.type === "multiple-choice") {
      return !!answers[question.id]
    } else if (question.type === "coding") {
      return codingResults[question.id] && codingResults[question.id].every((r) => r)
    }

    return false
  }

  function allQuestionsAnswered() {
    return testData.questions.every((question) => isQuestionAnswered(question))
  }

  function runCode(questionId, code, testCases) {
    // Simple simulation of running the code
    if (unitId === 6) {
      // Control Structures unit
      if (questionId === 3) {
        // Check if the code correctly implements the checkScore function
        if (
          code.includes("function checkScore") &&
          code.includes("score >= 70") &&
          code.includes('return "Pass"') &&
          code.includes('return "Fail"')
        ) {
          return testCases.map(() => true)
        }
      }
    }

    // Default to failing all tests
    return testCases.map(() => false)
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
  }
})

// Declare monaco
var monaco
