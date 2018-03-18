const month = document.getElementById("month");
const calendar = document.getElementById("days");
const checkIn = document.getElementById("checkIn");
const checkInInput = document.getElementById("checkInInput");
const checkOut = document.getElementById("checkOut");
const checkOutInput = document.getElementById("checkOutInput");
const stayLength = document.getElementById("stayLength");
const stayLengthInput = document.getElementById("stayLengthInput");
const bookButton = document.getElementById("bookButton");
const guestName = document.getElementById("guestName");
const divider = document.getElementById("stay__date--divider");
const stayCost = document.getElementById("stayCost");

const selectedDays = [];
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
  "December"
];

// gets todays date and creates a date object used for browsing the calendar
const dateTime = new Date(
  Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1, 14, 0, 0, 0)
);
const browseDateTime = new Date(
  Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1, 14, 0, 0, 0)
);

async function showBooking(e) {
  const bookingId = e.target.dataset.bookingid;
  const data = await (await fetch("/bookings/" + bookingId)).json();
  guestName.innerHTML = data.booking.guestName;
}

// renders the calendar on page load
renderCalendar(dateTime);

// sets the month at the top of the calendar
function setMonth(date) {
  month.innerHTML = months[date.getMonth()] + " " + date.getFullYear();
}

// gets the number of days in the current month
function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

// renders the calendar for the selected month
function renderCalendar(date) {
  const renderDate = new Date(browseDateTime.toString());
  const days = getDaysInMonth(date.getMonth(), date.getFullYear());
  month.innerHTML = months[date.getMonth()] + " " + date.getFullYear();
  const cells = Array.from(new Array(days), (val, index) => index + 1);
  const dayCells = cells.map(cell => {
    renderDate.setDate(cell);
    return `
            <div id="${renderDate.getTime()}" class="day">
              <div class="date">${cell}</div>
            </div>
          `;
  });
  dayCells[0] = `<div id="${browseDateTime.getTime()}" class="day" style="grid-column: ${date.getDay() +
    1} / ${date.getDay() + 2}"><div class="date">1</div></div>`;
  calendar.innerHTML = dayCells.join("");
  const cw = $(".day").width();
  $(".day").css({ height: cw + "px" });
  let counter = 2;
  myBookings.forEach(booking => {
    const days = document.querySelectorAll(".day");
    const dayList = Array.from(days, day => day.id);
    const bookedDays = dayList.filter(day => {
      return day >= booking.checkInTime && day <= booking.checkOutTime;
    });
    bookedDays.forEach(bookedDay => {
      const bookingDay = document.getElementById(bookedDay);
      bookingDay.innerHTML = bookingDay.innerHTML + booking.guestName;
      bookingDay.setAttribute("data-bookingId", booking._id);
      bookingDay.addEventListener("click", showBooking);
      bookingDay.classList.add(
        counter % 2 === 0 ? "day--booked" : "day--booked--odd"
      );
    });
    counter++;
  });
}

// changes the month forward and backward
function changeMonth(direction) {
  if (direction === "forward") {
    if (browseDateTime.getMonth() < 11) {
      browseDateTime.setMonth(browseDateTime.getMonth() + 1);
    } else {
      browseDateTime.setMonth(0);
      browseDateTime.setFullYear(browseDateTime.getFullYear() + 1);
    }
    renderCalendar(browseDateTime);
  } else {
    if (
      dateTime.getMonth() === browseDateTime.getMonth() &&
      dateTime.getFullYear() === browseDateTime.getFullYear()
    ) {
    } else if (browseDateTime.getMonth() > 0) {
      browseDateTime.setMonth(browseDateTime.getMonth() - 1);
    } else {
      browseDateTime.setMonth(11);
      browseDateTime.setFullYear(browseDateTime.getFullYear() - 1);
    }
    renderCalendar(browseDateTime);
  }
}
