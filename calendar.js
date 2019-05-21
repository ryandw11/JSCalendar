/**
    Calendar Library
    @author Ryandw11
    Contains Mobile and Desktop mode.

    @version 1.3
    PROTOTYPE ONLY: STILL UNDER DEVELOPMENT
*/

/*
    Standared Variables used in all modes.
*/
//Gets the current Date
var today = new Date();
//Gets the current month
var currentMonth = today.getMonth();
//Gets the current year.
var currentYear = today.getFullYear();
//Gets the calendar div.
var calendarElm = document.getElementById("calendar");
//If it is in mobile mode.
var mobile = false;
//Stores the data of mobile mode. (type, week beginng date, week end date))
var mobileData = ["day", today.getDate() - (today.getDay()), today.getDate() + (6 - today.getDay())];

//The names of the months
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// The name of the days.
var dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// The number of days in each month.
var dayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

//The event array that holds the calendar's events.
var events = [];

/**
 * **API METHOD:** Add an event to the list of overall events. 
 * @param {Number} month The month. Valid Numbers: 0 - 11
 * @param {Number} day The day. Valid Numbers: 1 - 31
 * @param {Number} year The year. Format: yyyy (Ex: 2019)
 * @param {boolean} isLink If the event automatically has a link. (bool)
 * @param {string} link The url that the link will go to. (string)
 * @param {string} content The content of the event. **Supports HTML** (string)
 */
function createEvent(month, day, year, isLink, link, content) {
    events.push([new Date(year, month, day), isLink, link, content]);
}

/*
    Loads the calendar on window load.
*/
if (window.innerWidth > 740) {
    calendarElm.innerHTML = loadCalendar();
    mobile = false;
} else {
    calculateCurrentWeek();
    mobile = true;
}
// Sets the resize event to the function resize.
window.onresize = resize;

function resize() {
    if (window.innerWidth < 740 && !mobile) {
        mobileData[1] = today.getDate() - (today.getDay());
        mobileData[2] = today.getDate() + (6 - today.getDay());
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        calculateCurrentWeek();
        mobile = !mobile;
    } else if (window.innerWidth > 740 && mobile) {
        calendarElm.innerHTML = loadCalendar();
        mobile = !mobile;
    }
}


/*
    ===============================
    Desktop Version of the calendar.
    ===============================
*/

/**
 * Loads the calendar.
 */
function loadCalendar() {
    //Variable that holds the html
    var calendar = "<a onclick='previousMonth()' class='calendarPrev'>&#10094;</a><a onclick='nextMonth()' class='calendarNext'>&#10095;</a>";
    calendar += "<table id='calendarTable'>";
    calendar += getMonthDisplay();
    calendar += createWeekHeader();
    calendar += createWeekRows();
    calendar += "</table>"
    return calendar;
}

/**
 * **API METHOD:** Reloads the calendar after adding new events.
 */
function reloadCalendar() {
    // If the screen is smaller than 740 pixels
    if (window.innerWidth < 740 && mobile) {
        calculateCurrentWeek();
        // If the screen is larger than 740 pixels.
    } else if (window.innerWidth > 740 && !mobile) {
        calendarElm.innerHTML = loadCalendar();
    }
}

/**
 * Calculates the next month.
 */
function nextMonth() {
    // If Desktop
    if (!mobile) {
        // If the next year is reached.
        if (currentMonth === 11) currentYear++;
        // Calculates the next month number.
        currentMonth = currentMonth === 11 ? 0 : currentMonth += 1;
        calendarElm.innerHTML = loadCalendar();
    } else {
        calculateNextWeek();
    }
}
/**
 * Calculates the previous month.
 */
function previousMonth() {
    // If desktop
    if (!mobile) {
        if (currentMonth === 0) {
            currentYear--;
        }
        // Calculates the previous month number.
        currentMonth = currentMonth === 0 ? 11 : currentMonth -= 1;
        calendarElm.innerHTML = loadCalendar();
    } else {
        calculatePreviousWeek();
    }
}

/**
 * @returns {Number} The number of days in the month. (Leap year is accounted for.)
 */
function daysInMonth() {
    dayCount[1] = 28;
    //revise the days in February for leap years.
    if (currentYear % 4 === 0) {
        if ((currentYear % 100 != 0) || (currentYear % 400 === 0)) {
            dayCount[1] = 29;
        }
    }
    return dayCount[currentMonth];
}

/*

    ===
    Calendar Creation Method.
    ===

*/
/**
    Gets the month display.
    @param weekMode if the system is ok.
*/
function getMonthDisplay(weekMode) {
    return weekMode == null || !weekMode ? "<caption>" + months[currentMonth] + ", " + currentYear + "</caption>" : "<caption>" + months[(currentMonth + 1)] + ", " + currentYear + "</caption>";
}

/**
    Create the week header:  
    |Sun|Mon|Tue|Wed|Thu|Fri|Sat|
*/
function createWeekHeader() {
    var week = "<tr>";
    for (var i = 0; i < dayName.length; i++) {
        week += "<th>" + dayName[i] + "</th>";
    }
    return (week += "</tr>");
}

/**
 * Creates the entire month calendar. (Named as it goes row by row and calculates it.)
 * @returns The html code for the rest of the calendar.
 */
function createWeekRows() {
    var numOfDays = daysInMonth();
    var day = new Date(currentYear, currentMonth, 1);
    var weekDay = day.getDay();

    var endDay = new Date(currentYear, currentMonth, dayCount[currentMonth]);

    var weekRows = "<tr>";
    for (var i = 0; i < weekDay; i++) {
        weekRows += "<td></td>";
    }

    for (var i = 1; i <= numOfDays; i++) {
        day.setDate(i);
        weekDay = day.getDay();

        if (weekDay === 0) weekRows += "<tr>";

        if (i === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
            weekRows += "<td class='calendarDates' id='calendarToday'><div class='calendarNum' id='calendarToday'>" + i + "</div>" + getEventsForDay(i) + "</td>";
        } else {
            weekRows += "<td class='calendarDates'><div class='calendarNum'>" + i + "</div>" + getEventsForDay(i) + "</td>";
        }

        if (day.getDate() === endDay.getDate()) {
            if (endDay.getDay() < 6) {
                for (var j = endDay.getDay(); j < 6; j++) {
                    weekRows += "<td></td>"
                }
            }
        }

        if (weekDay === 6) weekRows += "</tr>";
    }


    return weekRows;
}

/**
 * @param {number} day The day that you want to get the events for. (Starts at 0)
 * @return The html code for the events.
 */
function getEventsForDay(day) {
    var eventToday = callbackEvents(day);
    var html = "<div class='calendarEvents'>";
    for (var i = 0; i < eventToday.length; i++) {
        html += "<p>"
        if (eventToday[i][1]) {
            html += "<a href='" + eventToday[i][2] + "'>" + eventToday[i][3] + "</a>";
        } else {
            html += eventToday[i][3];
        }
        html += "</p>"
    }
    html += "</div>";
    return html;
}

/**
 * Sorts through the list of events.
 * @param {number} dates The day to find the events for.
 * @returns {Array} Array of the events.
 */
function callbackEvents(dates) {
    var day = new Date(currentYear, currentMonth, dates);
    var ev = [];
    for (var i = 0; i < events.length; i++) {
        if (events[i][0].getDate() === day.getDate() && events[i][0].getFullYear() === day.getFullYear() && events[i][0].getMonth() === day.getMonth())
            ev.push(events[i]);
    }
    return ev;
}

/* 
    ================================
    Mobile Version of the Calendar. 
    ================================
*/

/**
 * Gets the week rows with no month change.
 * @param {number} next The starting week day.
 * @param {number} nextF The end week day.
 * @returns Html code for the week rows.
 */
function getTable(next, nextF) {
    var html = "";
    var weekd = 0;
    for (var i = next; i <= nextF; i++) {
        if (weekd > 6) break;
        html += "<tr> <th><div class='calendarMobileNum'>" + i + "</div>" + dayName[weekd] + "</th></tr>";
        html += "<tr>";
        if (i === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
            html += "<td class='calendarDates' id='calendarToday'>" + getEventsForDay(i) + "</td>";
        } else {
            html += "<td class='calendarDates'>" + getEventsForDay(i) + "</td>";
        }
        html += "</tr>";
        weekd++;
    }

    return html;
}

/**
 * Gets the week rows for a week with a month change.
 * @param {number} next The starting day. (Must be 1 - # of month days)
 * @param {number} nextF The starting day. (Must be 1 - # of month days)
 * @returns The html code for the week rows.
 */
function getTableNextWeek(next, nextF) {
    var weekd = 0;
    var html = "";
    for (var i = next; i <= dayCount[currentMonth]; i++) {
        html += "<tr> <th><div class='calendarMobileNum'>" + ((i + 1 > dayCount[currentMonth]) ? months[currentMonth] : " ") + " " + i + "</div>" + dayName[weekd] + "</th></tr>";
        html += "<tr>";
        if (i === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
            html += "<td class='calendarDates' id='calendarToday'>" + getEventsForDay(i) + "</td>";
        } else {
            html += "<td class='calendarDates'>" + getEventsForDay(i) + "</td>";
        }
        html += "</tr>";
        weekd++;
    }
    if (currentMonth === 11) {
        currentYear++;
    }
    currentMonth = currentMonth === 11 ? 0 : currentMonth += 1;
    for (var i = 1; i <= nextF; i++) {
        html += "<tr> <th>" + "<div class='calendarMobileNum'>" + ((i === 1) ? months[currentMonth] : " ") + " " + +i + "</div>" + dayName[weekd] + "</th></tr>";
        html += "<tr>"
        if (i === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
            html += "<td class='calendarDates' id='calendarToday'>" + getEventsForDay(i) + "</td>";
        } else {
            html += "<td class='calendarDates'>" + getEventsForDay(i) + "</td>";
        }
        html += "</tr>";
        weekd++;
    }
    return html;
}

/**
 * Gets the week rows for a week with a month change.
 * @param {number} next The starting day. (Must be 1 - # of month days)
 * @param {number} nextF The starting day. (Must be 1 - # of month days)
 * @returns The html code for the week rows.
 */
function getTablePrevWeek(next, nextF) {
    var html = "";
    var weekd = 0;
    for (var i = next; i <= dayCount[currentMonth - 1]; i++) {
        html += "<tr> <th><div class='calendarMobileNum'>" + i + "</div>" + dayName[weekd] + "</th></tr>";
        html += "<tr>";
        if (i === today.getDate() && currentYear === today.getFullYear() && (currentMonth - 1) === today.getMonth()) {
            html += "<td class='calendarDates' id='calendarToday'>" + getEventsForDayPrev(i) + "</td>";
        } else {
            html += "<td class='calendarDates'>" + getEventsForDayPrev(i) + "</td>";
        }
        html += "</tr>";
        weekd++;
    }
    if (currentMonth === 0) {
        currentYear--;
    }
    currentMonth = currentMonth === 0 ? 11 : currentMonth -= 1;
    for (var i = 1; i <= nextF; i++) {
        html += "<tr> <th>" + "<div class='calendarMobileNum'>" + i + "</div>" + dayName[weekd] + "</th></tr>";
        html += "<tr>"
        if (i === today.getDate() && currentYear === today.getFullYear() && (currentMonth + 1) === today.getMonth()) {
            html += "<td class='calendarDates' id='calendarToday'>" + getEventsForDay(i) + "</td>";
        } else {
            html += "<td class='calendarDates'>" + getEventsForDay(i) + "</td>";
        }
        html += "</tr>";
        weekd++;
    }
    return html;
}

/**
 * Calculates the table for the current week.  
 * **Note:** the div is set inside of this function. __Returns nothing.__
 */
function calculateCurrentWeek() {
    var next = mobileData[1];
    var nextF = mobileData[2];
    var changedN = false;
    if (next > nextF) {
        changedN = true;
    }
    var mcal = "<a onclick='previousMonth()' class='calendarPrev'>&#10094;</a><a onclick='nextMonth()' class='calendarNext'>&#10095;</a><table id='calendarTable'>";
    mcal += getMonthDisplay(changedN);
    mcal += (changedN ? getTableNextWeek(next, nextF) : getTable(next, nextF));
    mcal += "</table>";
    calendarElm.innerHTML = mcal;
}

/**
 * Calculates the table for the next week.  
 * **Note:** the div is set inside of this function. __Returns nothing.__
 */
function calculateNextWeek() {
    var next = mobileData[1] + 7;
    var nextF = mobileData[2] + 7;
    var changedN = false;
    if (next > dayCount[currentMonth]) {
        var calc = next - dayCount[currentMonth];
        next = calc;
        changedN = true;
    }
    if (nextF > dayCount[currentMonth]) {
        var calc = nextF - dayCount[currentMonth];
        console.log(dayCount[currentMonth]);
        nextF = calc;
        changedN = true;
    }
    var mcal = "<a onclick='previousMonth()' class='calendarPrev'>&#10094;</a><a onclick='nextMonth()' class='calendarNext'>&#10095;</a><table id='calendarTable'>";
    mcal += getMonthDisplay(changedN);

    mcal += (changedN ? getTableNextWeek(next, nextF) : getTable(next, nextF));
    mcal += "</table>";
    calendarElm.innerHTML = mcal;
    mobileData[1] = changedN ? next - dayCount[currentMonth != 0 ? currentMonth - 1 : 11] : next;
    mobileData[2] = nextF;
}

/**
 * Calculates the table for the previous week.  
 * **Note:** the div is set inside of this function. __Returns nothing.__
 */
function calculatePreviousWeek() {
    var next = mobileData[1] - 7;
    var nextF = mobileData[2] - 7;
    var changedN = false;

    if (next < 0) {
        next = dayCount[currentMonth != 0 ? currentMonth - 1 : 11] + next;
        changedN = true;
    }
    if (nextF < 0) {
        nextF = dayCount[currentMonth != 0 ? currentMonth - 1 : 11] + nextF;
        changedN = true;
    }

    var mcal = "<a onclick='previousMonth()' class='calendarPrev'>&#10094;</a><a onclick='nextMonth()' class='calendarNext'>&#10095;</a><table id='calendarTable'>";
    mcal += "<caption>" + months[changedN ? (currentMonth != 0 ? currentMonth - 1 : currentMonth) : currentMonth] + ", " + currentYear + "</caption>";
    mcal += changedN ? getTablePrevWeek(next, nextF) : getTable(next, nextF);
    mcal += "</table>"
    calendarElm.innerHTML = mcal;
    mobileData[1] = next;
    mobileData[2] = changedN && nextF > 0 ? dayCount[currentMonth != 0 ? currentMonth : 11] + nextF : nextF;
}

/**
 * Returns the events for the days in **Mobile Mode**
 * @param {number} day The day that you want to get the events for. (Starts at 0)
 * @return The html code for the events.
 */
function getEventsForDayPrev(day) {
    var eventToday = callbackEvents(day);
    var html = "<div class='calendarEvents'>";
    for (var i = 0; i < eventToday.length; i++) {
        html += "<p>"
        if (eventToday[i][1]) {
            html += "<a href='" + eventToday[i][2] + "'>" + eventToday[i][3] + "</a>";
        } else {
            html += eventToday[i][3];
        }
        html += "</p>"
    }
    html += "</div>";
    return html;
}

/**
 * Sorts through the list of events. **Mobile Mode Only**
 * @param {number} dates The day to find the events for.
 * @returns {Array} Array of the events.
 */
function callbackEventsPrev(dates) {
    var day = new Date(currentYear, currentMonth === 0 ? currentMonth - 1 : 11, dates);
    var ev = [];
    for (var i = 0; i < events.length; i++) {
        if (events[i][0].getDate() === day.getDate() && events[i][0].getFullYear() === day.getFullYear() && events[i][0].getMonth() === day.getMonth())
            ev.push(events[i]);
    }
    return ev;
}