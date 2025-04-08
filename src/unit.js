import { createIcons } from "lucide"
import { units } from "./data.js"

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  lucide.createIcons = createIcons
  lucide.createIcons()

  // Get unit ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const unitId = Number.parseInt(urlParams.get("id"))

  if (!unitId) {
    window.location.href = "index.html"
    return
  }

  // Find the unit data
  const unit = units.find((u) => u.id === unitId)

  if (!unit) {
    window.location.href = "index.html"
    return
  }

  // Render unit header
  const unitHeader = document.getElementById("unit-header")
  const completedLessons = unit.lessons.filter((lesson) => lesson.completed).length
  const progressPercentage = (completedLessons / unit.lessons.length) * 100

  unitHeader.innerHTML = `
    <h1>Unit ${unit.id}: ${unit.title}</h1>
    <p>${unit.description}</p>
    
    <div class="flex items-center gap-4 mb-2">
      <div class="progress-container" style="flex: 1;">
        <div class="progress-bar" style="width: ${progressPercentage}%"></div>
      </div>
      <span class="text-sm whitespace-nowrap">
        ${completedLessons}/${unit.lessons.length} completed
      </span>
    </div>
    
    ${
      completedLessons === unit.lessons.length
        ? `
      <a href="test.html?unitId=${unitId}" class="button outline mt-2">
        Take Unit Test
        <i data-lucide="chevron-right" class="ml-2 h-4 w-4"></i>
      </a>
    `
        : ""
    }
  `

  // Render lessons
  const lessonsContainer = document.getElementById("lessons-container")

  unit.lessons.forEach((lesson, index) => {
    const lessonCard = document.createElement("div")
    lessonCard.className = `lesson-card ${lesson.completed ? "completed" : ""}`

    lessonCard.innerHTML = `
      <div class="lesson-card-header">
        <div class="lesson-card-title">
          Lesson ${index + 1}: ${lesson.title}
          ${lesson.completed ? '<i data-lucide="check-circle" class="text-green-500"></i>' : ""}
        </div>
      </div>
      <div class="lesson-card-footer">
        <a href="lesson.html?unitId=${unitId}&lessonId=${lesson.id}" class="button ${lesson.completed ? "outline" : "primary"} full-width">
          ${lesson.completed ? "Review Lesson" : "Start Lesson"}
          <i data-lucide="chevron-right" class="ml-2 h-4 w-4"></i>
        </a>
      </div>
    `

    lessonsContainer.appendChild(lessonCard)
  })

  // Initialize icons again for the newly added elements
  lucide.createIcons()
})
