// Get the list container element from the DOM
const listContainer = document.getElementById('list-container');
// Get the new task button element from the DOM
const taskButton = document.getElementById('new-task-button');
// Get the appointment time element from the DOM
const apptTime = document.getElementById('appt-time');
// Get the task input element from the DOM
const taskInput = document.getElementById('inlineFormInput');

// Function to create a new task element
let createTaskElement = function (task, day, date, time, month, year) {
  // Using jQuery to create the HTML for the task element
  return jQuery(`
        <div class="p-2">
            <div class="row col no-gutters m-0 pt-1 pb-1 rounded d-flex flex-sm-column flex-lg-row justify-content-between" style="background-color: #e4f0ff">
                <h3 class="col overflow-auto">${task}</h3>
                <div class="row col d-flex flex-sm-column flex-lg-row text-center">
                    <h3 class="col">By ${day}</h3>
                    <div class="col d-flex flex-column">
                        <div>
                            <span>${month} ${date},</span>
                            <span>${year}</span>
                        </div>
                        <div>
                            <span>${time}</span>
                        </div>
                    </div>
                    <div>
                        <div class="btn bi-check-circle-fill btn-lg p-2"></div>
                        <div class="btn bi-trash3-fill btn-lg p-2"></div>
                    </div>
                </div>
            </div>
        </div>
    `)[0];
};

// Class to handle time-related operations
class Time {
  constructor(date) {
    this.date = date;
    this.daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  }

  // Get the formatted time string
  getTime() {
    let timeParts = this.date.toString().split(' ')[4].split(':');
    let hours = Number(timeParts[0]);
    let minutes = timeParts[1];
    let period = undefined;

    if (hours > 12) {
      period = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      period = 'AM';
    } else {
      period = 'PM';
    }

    return `${hours}:${minutes} ${period}`;
  }

  // Format the date with appropriate suffix
  formatDate = () => {
    let lastDigit = this.date.getDate() % 10;
    let suffix = undefined;

    switch (lastDigit) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }
    if (lastDigit == 13) {
      suffix = 'th';
    }

    return `${this.date.getDate()}${suffix}`;
  };

  // Create a task element using the provided values
  createTask() {
    return createTaskElement(
      taskInput.value,
      this.daysOfWeek[this.date.getDay()],
      this.formatDate(),
      this.getTime(),
      this.monthsOfYear[this.date.getMonth()],
      this.date.getFullYear()
    );
  }
}

// Event listener for the new task button click
taskButton.addEventListener('click', (e) => {
  // Get the date from the appointment time input
  const selectedDate = new Time(new Date(apptTime.value));
  // Get the current date
  const currentDate = new Date();
  // Get the trimmed value of the task input
  const taskValue = taskInput.value.trim();

  // Check if the task value is empty
  if (taskValue.length === 0) {
    // Alert the user to enter a valid task
    alert('Task name is invalid; please try again.');
    // Return from the function without appending a new task
    return;
  }

  // Check if the selected date is invalid or in the past
  if (Number.isNaN(selectedDate.getTime()) || selectedDate.getTime() < currentDate.getTime()) {
    // Alert the user to enter a valid date
    alert('Task date is invalid; please try again.');
    // Return from the function without appending a new task
    return;
  }

  // Append the newly created task element to the list container
  listContainer.append(selectedDate.createTask());

  // Clear the input fields
  taskInput.value = '';
  apptTime.value = '';

  // Add a click event listener to the list container
  listContainer.addEventListener('click', (event) => {
    // Check if the target element has the class 'bi-check-circle-fill'
    if (event.target.classList.contains('bi-check-circle-fill')) {
      // Change the background color of the parent element to green
      event.target.parentElement.parentElement.parentElement.style.backgroundColor = '#90EE90';
    }

    // Check if the target element has the class 'bi-trash3-fill'
    if (event.target.classList.contains('bi-trash3-fill')) {
      // Remove the parent element from the DOM
      event.target.parentElement.parentElement.parentElement.parentElement.remove();
    }
  });
});
