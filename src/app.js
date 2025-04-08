document.addEventListener("DOMContentLoaded", () => {
  // Import Lucide icons
  import * as lucide from "lucide";

  // Mock units data (replace with actual data fetching)
  const units = [
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Learn the basics of programming concepts.",
      lessons: [
        { id: 1, title: "Variables", completed: true },
        { id: 2, title: "Data Types", completed: true },
        { id: 3, title: "Operators", completed: false },
      ],
    },
    {
      id: 2,
      title: "Web Development Fundamentals",
      description: "Explore the fundamentals of web development.",
      lessons: [
        { id: 1, title: "HTML", completed: true },
        { id: 2, title: "CSS", completed: false },
        { id: 3, title: "JavaScript", completed: false },
      ],
    },
  ]

  // Initialize Lucide icons
  lucide.createIcons()

  // Render units on the home page
  const unitsContainer = document.getElementById("units-container")

  if (unitsContainer) {
    renderUnits()
  }

  function renderUnits() {
    units.forEach((unit) => {
      const completedLessons = unit.lessons.filter((lesson) => lesson.completed).length
      const progressPercentage = (completedLessons / unit.lessons.length) * 100

      const unitCard = document.createElement("div")
      unitCard.className = "card"
      unitCard.innerHTML = `
        <div class="card-header">
          <div class="card-title">
            Unit ${unit.id}: ${unit.title}
            ${completedLessons === unit.lessons.length ? '<i data-lucide="check-circle" class="text-green-500"></i>' : ""}
          </div>
          <div class="card-description">${unit.description}</div>
        </div>
        <div class="card-content">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <i data-lucide="book-open" class="h-4 w-4"></i>
              <span>${unit.lessons.length} Lessons</span>
            </div>
            <div class="flex items-center gap-2">
              <i data-lucide="code" class="h-4 w-4"></i>
              <span>${unit.lessons.length} Challenges</span>
            </div>
          </div>
          <div class="progress-container mt-4">
            <div class="progress-bar" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="text-xs text-right mt-1">
            ${completedLessons}/${unit.lessons.length} completed
          </div>
        </div>
        <div class="card-footer">
          <a href="unit.html?id=${unit.id}" class="button primary full-width">
            ${completedLessons === 0 ? "Start Unit" : "Continue Unit"}
            <i data-lucide="chevron-right" class="ml-2 h-4 w-4"></i>
          </a>
        </div>
      `

      unitsContainer.appendChild(unitCard)
    })

    // Initialize icons again for the newly added elements
    lucide.createIcons()
  }
})
