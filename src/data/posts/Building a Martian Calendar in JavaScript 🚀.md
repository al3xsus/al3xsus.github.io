---
title: "The Martian Weekday Challenge"
description: "Solving a programming puzzle about Mars' unique calendar with an 8-day week and leap years."
slug: "martian-weekday-challenge"
date: 2025-08-08
updated: 2025-08-08
tags: ["JavaScript", "algorithms", "coding challenge", "programming puzzles"]
coverImage: "/images/posts/martian-weekdays.jpg"
canonical: ""
project: ""
linkedinURL: ""
devtoURL: ""
mediumURL: ""
---

# The Martian Weekday Challenge 🚀🪐

Imagine you're on Mars. One Martian year takes **668 Martian days** to orbit the Sun. There’s an **8-day week** — due to two moons, Mars has **Monday1** and **Monday2**, so the week looks like this:

```
Sun, M1, M2, Tue, Wed, Thu, Fri, Sat
```

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yee1b3t0uooove9vir7h.gif" alt="Two Mondays reaction gif" title="Monday mood"/>
<figcaption>Two Mondays. Jesus Christ.</figcaption>
</figure>

But every **5th year** is special — a leap year where **the second Monday doesn’t exist**. The week then has 7 days.

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/91oo71yu1dw0o1mily0r.gif" alt="Relief thank you gif" title="Thank you, universe"/>
<figcaption>Thank you, universe.</figcaption>
</figure>

It’s still **668 days long**, and the Martian calendar starts on a Sunday.

---

## 📑 Table of Contents

- [The Task](#the-task)
- [My Mistake](#my-mistake)
- [Constants](#constants)
- [Helper Functions](#helper-functions)
- [Main Function](#main-function)
- [Testing](#testing)
- [Lessons Learned](#lessons-learned)

---

## 🧩 The Task

You’re given `[year, day]` and must return the weekday string.

**Examples:**

```plaintext
Input: [1, 1] → "Sun"
Input: [2, 1] → "Wed"
Input: [5, 2] → "M1"
```

---

## ❌ My Mistake

I failed this in a timed assessment. I assumed **year 0, day 0** as the starting point, but the clue was in the example:

```plaintext
[1, 1] → "Sun"
```

That **only works** if `[1, 1]` _is_ the start.

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iqzja3mxi26nx9y62y2h.gif" alt="Wrong assumption gif" title="Wrong assumption"/>
<figcaption>The hint was right there, and I missed it.</figcaption>
</figure>

---

## 📦 Constants

```javascript
const REGULAR_YEAR_WEEK = [
  "Sun",
  "M1",
  "M2",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];
const LEAP_YEAR_WEEK = ["Sun", "M1", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAYS_IN_YEAR = 668;
const REGULAR_YEAR_OFFSET = DAYS_IN_YEAR % REGULAR_YEAR_WEEK.length; // 4
const LEAP_YEAR_OFFSET = DAYS_IN_YEAR % LEAP_YEAR_WEEK.length; // 3
```

Offsets are how many days the weekday shifts each year.

---

## 🛠 Helper Functions

```javascript
function isLeapYear(year) {
  return year % 5 === 0;
}

function getWeekForYear(year) {
  return isLeapYear(year) ? LEAP_YEAR_WEEK : REGULAR_YEAR_WEEK;
}

function getYearlyOffset(year) {
  return isLeapYear(year) ? LEAP_YEAR_OFFSET : REGULAR_YEAR_OFFSET;
}
```

---

## 🧮 Main Function

```javascript
function getMartianWeekday([targetYear, targetDay]) {
  // Year 1 shortcut
  if (targetYear === 1) {
    return REGULAR_YEAR_WEEK[(targetDay - 1) % REGULAR_YEAR_WEEK.length];
  }

  let currentWeekdayIndex = 0; // 'Sun'

  // Step 1: Advance through past years
  for (let y = 1; y < targetYear; y++) {
    currentWeekdayIndex =
      (currentWeekdayIndex + getYearlyOffset(y)) % getWeekForYear(y).length;
  }

  // Step 2: Calculate weekday for the target year
  const currentWeek = getWeekForYear(targetYear);
  currentWeekdayIndex =
    (currentWeekdayIndex + (targetDay - 1)) % currentWeek.length;

  return currentWeek[currentWeekdayIndex];
}
```

---

## 🧪 Testing

```javascript
console.log(getMartianWeekday([1, 1]) === "Sun");
console.log(getMartianWeekday([2, 1]) === "Wed");
console.log(getMartianWeekday([5, 2]) === "M1");
```

Results:

```
true
true
true
```

---

## 📚 Lessons Learned

1. **Read carefully** — the example `[1, 1]` was the key.
2. **Prepare** — practice small logical challenges often.
3. **Failure is feedback** — adjust and try again.

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kb9knx0iyb8o40kcnh2i.jpg" alt="Person accepting defeat" title="Took the L"/>
<figcaption>Sometimes you just take the L and move on — but learn from it.</figcaption>
</figure>

---

_Thanks for reading! Share your thoughts in the comments._
