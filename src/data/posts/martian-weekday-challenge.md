---
title: "The Martian Weekday Challenge"
description: "Solving a programming puzzle about Mars' unique calendar with an 8-day week and leap years."
slug: "martian-weekday-challenge"
created: 2025-03-21
tags: ["JavaScript", "algorithms", "coding challenge", "programming puzzles"]
coverImage: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fpkj883zlqfa54g431g4u.jpg"
canonical: ""
project: ""
linkedinURL: ""
devtoURL: ""
mediumURL: ""
---

Imagine you're on Mars. One Martian year takes 668 Martian days to complete one circle around the sun. There is an 8-day week - due to 2 moons, Mars has Monday1 and Monday2, so the week looks like that: _Sun, M1, M2, Tue, Wed, Thu, Fri, Sat_.

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yee1b3t0uooove9vir7h.gif" alt="Monday mood gif" title="Monday mood"/>
<figcaption>Two Mondays, Jesus Christ</figcaption>
</figure>

But fear not! Sometimes (every 5th year) there is a special leap year, where the second Monday does not exist!

<figure>
<img src="https://dev-to-uploads.s3.amazonaws.com/uploads/articles/91oo71yu1dw0o1mily0r.gif" alt="Thank you gif" title="Thank you"/>
<figcaption>Thank you, universe</figcaption>
</figure>

It still takes 668 days, though. And we know that the Martian date system started on Sunday. Your task is to create a script that will take an array of format `[year, day]` on input and return the weekday string.
For example,

```
Input: [1, 1]
Output: "Sun"

Input: [2, 1]
Output: "Wed"

Input: [5, 2]
Output: "M1"
```

So that was a rather simple assessment, and I failed it. No matter how I tried, my code didn't pass all the tests. So I took the L and went home. In a more calm situation, I have to look at the task again and a time to think.

![Took the L](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kb9knx0iyb8o40kcnh2i.jpg)

People, who spend enough time cracking LeetCode assessments or stuff like that probably already knew, what was the core problem. For those, who don't get it - since there were no specifications except for Sunday, I assumed, that starting point was year 0, day 0.

![Wrong gif](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iqzja3mxi26nx9y62y2h.gif)

The hint was painfully close yet I didn't pay attention.

```
Input: [1, 1]
Output: "Sun"
```

That could **ONLY** work if [1, 1] **IS** the starting point.
Anyway, we're here to learn from our mistakes. Let's write the proper code, clean and refined.
Starting from constants:

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
const REGULAR_YEAR_OFFSET = DAYS_IN_YEAR % REGULAR_YEAR_WEEK.length; // 668 % 8 = 4
const LEAP_YEAR_OFFSET = DAYS_IN_YEAR % LEAP_YEAR_WEEK.length; // 668 % 7 = 3
```

I think it's self-explanatory at this point, offsets are how many days the weekday shifts each year.

Next, helper functions:

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

And finally, the main function:

```javascript
function getMartianWeekday([targetYear, targetDay]) {
  // Edge case: Year 1 (Direct lookup)
  if (targetYear === 1) {
    return REGULAR_YEAR_WEEK[(targetDay - 1) % REGULAR_YEAR_WEEK.length];
  }

  let currentWeekdayIndex = 0; // Starts at 'Sun'

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

Simulating test cases:

```javascript
// Test Cases
console.log(getMartianWeekday([1, 1]) === "Sun");
console.log(getMartianWeekday([2, 1]) === "Wed");
console.log(getMartianWeekday([5, 2]) === "M1");
```

And got the right results:

```
true
true
true
```

Yeah, it's **THAT** simple.

So, what is the moral?

1. Pay attention to the details. They could be not revealed in the main text, but be available as hints somewhere else.
2. Train and prepare.
3. Even if we fail, that's just a lesson. Get up and continue.

Thanks for the attention! Share your opinion in the comments.
