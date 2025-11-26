---
title: "The Martian Weekday Challenge"
description: "Solving a programming puzzle about Mars' unique calendar with an 8-day week and leap years."
slug: "martian-weekday-challenge"
created: 2025-03-21
tags:
  [
    "JavaScript",
    "Python",
    "algorithms",
    "coding challenge",
    "programming puzzles",
  ]
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

So that was a rather simple assessment, and I failed it. No matter how I tried, my code didn't pass all the tests. So I took the L and went home. In a calmer situation, I have to look at the task again and take some time to think.

![Took the L](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kb9knx0iyb8o40kcnh2i.jpg)

People who spend enough time cracking LeetCode assessments or stuff like that probably already knew what was the core problem. For those who don't get it - since there were no specifications except for Sunday, I assumed that the starting point was year 0, day 0.

![Wrong gif](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iqzja3mxi26nx9y62y2h.gif)

The hint was painfully close, yet I didn't pay attention.

```
Input: [1, 1]
Output: "Sun"
```

That could **ONLY** work if [1, 1] **IS** the starting point.
More so, contrary to initial ideas about calculating offset days, etc, this task is rather simple. We have a **CONSTANTLY-DEFINED** (it's very important) year. That means, the solution is dead simple:

1. Calculate total days passed.
2. Calculate base weekday index (at this moment, treat it as if there are no different weeks).
3. Check if the year is a leap one.
4. If a leap, slightly change the base index and take the 7 days week; else, take it straight from a normal week.

Anyway, we're here to learn from our mistakes. Let's write the code.
Python one.

```python
def get_martian_weekday(date_array):
    year, day = date_array[0], date_array[1]
    total_days_passed = (year - 1) * 668 + day
    base_weekday_index = (total_days_passed - 1) % 8
    is_leap_year = (year % 5 == 0)

    if is_leap_year:
        seven_days_week = ["Sun", "M1", "Tue", "Wed", "Thu", "Fri", "Sat"]
        if base_weekday_index in [0, 1, 2]:
            return seven_days_week[base_weekday_index]
        else:
            adjusted_index = base_weekday_index - 1
            return seven_days_week[adjusted_index]
    else:
        eight_days_week = ["Sun", "M1", "M2", "Tue", "Wed", "Thu", "Fri", "Sat"]
        return eight_days_week[base_weekday_index]
```

Checking:

```python
--- Test Results ---
Input: [1, 1] -> Output: Sun, expected Sun, is correct: True
Input: [2, 1] -> Output: Wed, expected Wed, is correct: True
Input: [5, 2] -> Output: M1, expected M1, is correct: True
Input: [5, 3] -> Output: Tue, expected Tue, is correct: True
Input: [5, 668] -> Output: Tue, expected Tue, is correct: True
Input: [6, 1] -> Output: Wed, expected Wed, is correct: True
Input: [1, 668] -> Output: Tue, expected Tue, is correct: True
Input: [5, 8] -> Output: Sat, expected Sat, is correct: True
```

and JS

```javascript
function getMartianWeekday(dateArray) {
  const [year, day] = dateArray;

  const totalDaysPassed = (year - 1) * 668 + day;

  const baseWeekdayIndex = (totalDaysPassed - 1) % 8;

  const isLeapYear = year % 5 === 0;

  if (isLeapYear) {
    const sevenDaysWeek = ["Sun", "M1", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if ([0, 1, 2].includes(baseWeekdayIndex)) {
      return sevenDaysWeek[baseWeekdayIndex];
    } else {
      const adjustedIndex = baseWeekdayIndex - 1;
      return sevenDaysWeek[adjustedIndex];
    }
  } else {
    const EightDaysWeek = [
      "Sun",
      "M1",
      "M2",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];
    return EightDaysWeek[baseWeekdayIndex];
  }
}
```

Checking:

```javascript
"--- Test Results ---";
"Input: [1, 1]     -> Output: Sun, expected Sun, is correct: true";
"Input: [2, 1]     -> Output: Wed, expected Wed, is correct: true";
"Input: [5, 2]     -> Output: M1, expected M1, is correct: true";
"Input: [5, 3]     -> Output: Tue, expected Tue, is correct: true";
"Input: [5, 668]   -> Output: Tue, expected Tue, is correct: true";
"Input: [6, 1]     -> Output: Wed, expected Wed, is correct: true";
"Input: [1, 668]   -> Output: Tue, expected Tue, is correct: true";
"Input: [5, 8]     -> Output: Sat, expected Sat, is correct: true";
```

Yeah, it's **THAT** simple.

So, what is the moral?

1. Pay attention to the details. They could not be revealed in the main text, but could be available as hints elsewhere.
2. Keep It Stupid Simple (KISS).
3. Train and prepare.
4. Even if we fail, that's just a lesson. Get up and continue.

Gists with test cases are available [here](https://gist.github.com/al3xsus/67721a518256376692129d3f784dcfd4) and [here](https://gist.github.com/al3xsus/9c592667878db6047185a5a2cd900bd2).

Thanks for the attention! Share your opinion in the comments.
