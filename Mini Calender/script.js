const daysContainer = document.querySelector(".days"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  month = document.querySelector(".month"),
  todayBtn = document.querySelector(".today-btn");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// get current date
const date = new Date();

// get current month
let currentMonth = date.getMonth();

// get current year
let currentYear = date.getFullYear();

// function to render days
// Add new variables for modal handling
const modal = document.getElementById("eventModal");
const closeBtn = document.getElementsByClassName("close")[0];
const eventForm = document.getElementById("eventForm");

// Create events storage
let events = JSON.parse(localStorage.getItem('events')) || {};

// Modify renderCalendar function
function renderCalendar() {
  // get prev month current month and next month days
  date.setDate(1);
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const lastDayIndex = lastDay.getDay();
  const lastDayDate = lastDay.getDate();
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevLastDayDate = prevLastDay.getDate();
  const nextDays = 7 - lastDayIndex - 1;

  // update current year and month in header
  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  // update days html
  let days = "";

  // prev days html
  for (let x = firstDay.getDay(); x > 0; x--) {
    days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  }

  // current month days
  // Modify the current month days generation
  for (let i = 1; i <= lastDayDate; i++) {
      const dateStr = `${currentYear}-${currentMonth+1}-${i}`;
      const hasEvent = events[dateStr] ? 'has-event' : '';
      
      if (
          i === new Date().getDate() &&
          currentMonth === new Date().getMonth() &&
          currentYear === new Date().getFullYear()
      ) {
          days += `<div class="day today ${hasEvent}" data-date="${dateStr}">${i}</div>`;
      } else {
          days += `<div class="day ${hasEvent}" data-date="${dateStr}">${i}</div>`;
      }
  }

  // next MOnth days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next">${j}</div>`;
  }

  // run this function with every calendar render
  hideTodayBtn();
  daysContainer.innerHTML = days;

  // Add click event listeners to days
  setTimeout(() => {
      document.querySelectorAll('.days .day:not(.prev):not(.next)').forEach(day => {
          day.addEventListener('click', () => openModal(day.dataset.date));
      });
  }, 0);
}

// Add new functions for event handling
function openModal(date) {
    modal.style.display = "block";
    eventForm.dataset.date = date;
}

function closeModal() {
    modal.style.display = "none";
    eventForm.reset();
}

function saveEvent(e) {
    e.preventDefault();
    const date = eventForm.dataset.date;
    const eventData = {
        title: document.getElementById('eventTitle').value,
        type: document.getElementById('eventType').value,
        description: document.getElementById('eventDescription').value
    };

    events[date] = events[date] || [];
    events[date].push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
    
    closeModal();
    renderCalendar();
}

// Add event listeners
closeBtn.onclick = closeModal;
eventForm.onsubmit = saveEvent;

window.onclick = (event) => {
    if (event.target == modal) {
        closeModal();
    }
};

// Initialize
renderCalendar();

nextBtn.addEventListener("click", () => {
  // increase current month by one
  currentMonth++;
  if (currentMonth > 11) {
    // if month gets greater that 11 make it 0 and increase year by one
    currentMonth = 0;
    currentYear++;
  }
  // rerender calendar
  renderCalendar();
});

// prev monyh btn
prevBtn.addEventListener("click", () => {
  // increase by one
  currentMonth--;
  // check if let than 0 then make it 11 and deacrease year
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

// go to today
todayBtn.addEventListener("click", () => {
  // set month and year to current
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  // rerender calendar
  renderCalendar();
});

// lets hide today btn if its already current month and vice versa

function hideTodayBtn() {
  if (
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    todayBtn.style.display = "none";
  } else {
    todayBtn.style.display = "flex";
  }
}

// Add at the top with other constants
const tooltip = document.getElementById('eventTooltip');

// Add this function to show tooltip
function showTooltip(date, x, y) {
    const dateEvents = events[date];
    if (!dateEvents || dateEvents.length === 0) return;

    let tooltipContent = '';
    dateEvents.forEach(event => {
        tooltipContent += `
            <div class="event-item">
                <div class="event-title">${event.title}</div>
                <div class="event-type">${event.type}</div>
                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
            </div>
        `;
    });

    tooltip.innerHTML = tooltipContent;
    tooltip.style.display = 'block';
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
}

// Add this function to hide tooltip
function hideTooltip() {
    tooltip.style.display = 'none';
}

// Modify the renderCalendar function where you add click events
setTimeout(() => {
    document.querySelectorAll('.days .day:not(.prev):not(.next)').forEach(day => {
        day.addEventListener('click', () => openModal(day.dataset.date));
        
        // Add mouse events for tooltip
        day.addEventListener('mouseover', (e) => {
            if (events[day.dataset.date]) {
                showTooltip(day.dataset.date, e.pageX, e.pageY);
            }
        });
        
        day.addEventListener('mouseout', () => {
            hideTooltip();
        });
        
        // Update tooltip position on mouse move
        day.addEventListener('mousemove', (e) => {
            if (events[day.dataset.date]) {
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            }
        });
    });
}, 0);