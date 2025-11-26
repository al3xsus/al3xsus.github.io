---
title: "How I Created a Brain Training Game in React – The Stroop Effect Project"
description: "A deep dive into building a Stroop Effect game using React, TypeScript, and SVG — inspired by cognitive science and dedicated to my late mother."
slug: "brain-train"
created: 2022-03-11
tags:
  [
    "react",
    "typescript",
    "brain-training",
    "stroop-effect",
    "accessibility",
    "svg",
    "semantic-ui",
    "memory",
    "cognitive-app",
    "single-page-application",
    "cognitive-games",
  ]
coverImage: "https://raw.githubusercontent.com/al3xsus/brain-train/refs/heads/main/public/images/brain-train-cover.webp"
canonical: "brain-train-react-ui"
linkedinURL: ""
mediumURL: "https://levelup.gitconnected.com/web-application-for-a-brain-training-23dc567f0315"
project: "brain-train"
---

> I started to work on this a long time ago. It was intended for my mother, but she didn’t use it much, she passed away due to COVID-19 last year. But I still hope that my work could be helpful for many people.

Let’s start by citing UN documents:

> According to data from [World Population Prospects: the 2019 Revision](https://population.un.org/wpp/), by 2050, one in six people in the world will be over age 65 (16%), up from one in 11 in 2019 (9%). By 2050, one in four persons living in Europe and Northern America could be aged 65 or over. In 2018, for the first time in history, persons aged 65 or above outnumbered children under five years of age globally. The number of persons aged 80 years or over is projected to triple, from 143 million in 2019 to 426 million in 2050.

What does that mean for us? We must be prepared to live longer, work harder (since there would be less available manpower, so the state gonna squeeze every penny from workers to let the economy stay afloat), and witness people with mental decline more frequently. Unfortunately, the last one awaits all of us, but we still can do many, to at least stop it from progressing — healthy eating, regular exercise, and brain training. And brain training could be made in form of a game. Game web application! That’s why we’ve come here, innit?

Let’s go step by step and implement just one exercise. For now.

---

## Table of Contents

1. [Game of Words and Colors](#game-of-words-and-colors)
2. [Project Setup](#project-setup)
3. [Defining the Palette](#defining-the-palette)
4. [State Management](#state-management)
5. [Generating Table Data](#generating-table-data)
6. [Rendering the Table](#rendering-the-table)
7. [Game Logic](#game-logic)
8. [Manipulating SVG Elements](#manipulating-svg-elements)
9. [Demo Screenshots](#demo-screenshots)
10. [Wrapping Up](#wrapping-up)

---

## Game of Words and Colors

[![Dancing brain gif](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTZpcHBhOXg0MzdodXQ0ZHQwNjV4Mjdldmd6cjlzbnI2aXNocGxjZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lxN6uqrkziktujpAnH/giphy.gif)](https://giphy.com/gifs/kochstrasse-hannover-agencylife-agenturleben-lxN6uqrkziktujpAnH)

Look at the picture below.

[![Stroop effect](https://i.insider.com/5d38a8fc2516e97a8f23a3ab?width=1000&format=jpeg&auto=webp)](https://www.businessinsider.com/game-shows-words-in-different-colors-stroop-effect-it-2019-7)  
_Stroop effect_

Now try to read and pronounce the **COLOR** of the word, not the word itself. And try to do it fast. Not so easy task, huh? What you’ve seen here is called the [Stroop effect](https://en.wikipedia.org/wiki/Stroop_effect). It is mostly used in various tests and psychological research, but according to various internet sources, it could also keep your mind sharp and slow down the effects of Alzheimer’s disease. Anyway, let’s create a game out of it!

So, let’s get down to business — how we’ll do it? By adding four key points to the main idea:

1.  Random
2.  Configurability
3.  Challenge
4.  Interactive

So, it’s gonna be a playable customizable table with random words and colors, where you need to pronounce the color of the selected word, which changes over time. All others are bells and whistles. Time for code!

## Project Setup

I’ll write this project in React with TypeScript and the Semantic UI React CSS framework. You’re free to use any tool, language, and framework, of course.

First of all, creating the project

```shell
npx create-react-app brain-train --template typescript
```

With your permission, I’m not gonna describe every used package, since it’s gonna transform already boring text into something unreadable. You can always check the list of necessary packages at **package.json** in the repository. The same could be said about every module — [you can see the whole code on GitHub](https://github.com/al3xsus/brain-train).

## Defining the Palette

This is my palette:

```javascript
const Palette = [
  {
    name: "red",
    code: "#ff0000",
  },
  {
    name: "yellow",
    code: "#FFFF00",
  },
  {
    name: "green",
    code: "#00ff00",
  },
  {
    name: "blue",
    code: "#0000FF",
  },
  {
    name: "black",
    code: "#000000",
  },
];
```

![Palette modal](https://cdn-images-1.medium.com/max/800/1*-sT0F5P6BUN1DdZasz1EYQ.png)  
_Palette modal_

## State Management

I built everything using hooks, so this is my “state”:

```javascript
const [rowNum, setRowNum] = React._useState_(4);
const [colNum, setColNum] = React._useState_(4);
const [speed, setSpeed] = React._useState_(0.5);
const [tableData, setTableData] = React._useState_ < any > null;
const [direction, setDirection] = React._useState_("start-to-end");
const [activeCell, setActiveCell] = (React._useState_ < null) | (number > null);
const [gameStatus, setGameStatus] = React._useState_(false);
```

_rowNum and colNum are rows and columns for the table, speed is the game speed, tableData is for randomly generated table data, the direction is for game direction, activeCell is for the currently active cell, and gameStatus is for play/stop._

## Generating Table Data

This is how I generate random data for a table:

```javascript
const prepareData = () => {
  let data: [number, number][][] = [];
  let word = 0;
  let color = 0;
  for (let i = 0; i < rowNum; i++) {
    let row: [number, number][] = [];
    for (let k = 0; k < colNum; k++) {
      word = Math.floor(Math.random() * Palette.length);
      color = Math.floor(Math.random() * Palette.length);
      row.push([word, color]);
    }
    data.push(row);
  }
  return data;
};
```

_It’s a multidimensional array, which consists of rows and columns, and every **cell** inside consists of two numbers — one for the color name, the other for the color code._

## Rendering the Table

This is how I generate and populate the table:

```javascript
const generateTable = () => {
    if (tableData) {
        return tableData.map((row: [number, number][], rowIndex: number) => <Table.Row key={`tr-key-${rowIndex}`}>
            {row.map((cell: [number, number], index: number) => {
                return <Table.Cell key={`td-key-${rowIndex}-${index}`}>
                    <svg viewBox="0 0 100 20" style={{
                        width: "100%",
                        padding: "1vh 1vw",
                        fill: Palette[cell[1]].code
                    }}>
                        <text
                            x="0"
                            y="15"
                            id={`text-${rowIndex}-${index}`}
                        >
                            {t(`colors.${Palette[cell[0]].name}`).toUpperCase()}
                        </text>
                    </svg>
                </Table.Cell>
            })}
        </Table.Row>)
    }
    return null
}
...
<Table basic={"very"} size={"large"} celled={true}>
    <Table.Body>
        {generateTable()}
    </Table.Body>
</Table>
```

_We’re just populating cells inside of columns and rows with `Palette[y].name` SVG text painted in `Palette[x].code`. Why SVG? Because it’s one of the simplest ways to [fit text into the container](https://css-tricks.com/fitting-text-to-a-container/)._

## Game Logic

This is the heart of that game:

```javascript
React._useEffect_(() => {
  let interval: any = null;
  if (gameStatus) {
    if (activeCell === null) {
      interval = _setInterval_(() => {
        if (direction === "start-to-end") {
          setActiveCell(0);
          underlineSVG(0, true);
        } else {
          setActiveCell(rowNum * colNum - 1);
          underlineSVG(rowNum * colNum - 1, true);
        }
      }, speed * 1000);
    } else {
      const cleanUp = () => {
        setActiveCell(null);
        setGameStatus(false);
        underlineSVG(activeCell, false);
      };
      if (direction === "start-to-end") {
        if (activeCell < rowNum * colNum - 1) {
          interval = _setInterval_(() => {
            setActiveCell(activeCell + 1);
            underlineSVG(activeCell + 1, true);
            underlineSVG(activeCell, false);
          }, speed * 1000);
        } else {
          cleanUp();
        }
      } else {
        if (activeCell >= 0) {
          interval = _setInterval_(() => {
            setActiveCell(activeCell - 1);
            underlineSVG(activeCell - 1, true);
            underlineSVG(activeCell, false);
          }, speed * 1000);
        } else {
          cleanUp();
        }
      }
    }
  } else if (!gameStatus && activeCell !== null) {
    _clearInterval_(interval);
  }
  return () => _clearInterval_(interval);
}, [gameStatus, activeCell]);
```

_It’s a timer inside a useEffect hook. If the game is active, we’re setting a new activeCell in the table, highlighting it, and removing the highlight from the previous one, going according to the direction and with a set speed._

## Manipulating SVG Elements

This is how I manipulate SVG:

```javascript
const underlineSVG = (address: number, highlight: boolean) => {
  let [row, col] = [0, 0];
  if (address !== 0) {
    row = Math.floor(address / colNum);
    col = address - row * colNum;
  }
  let elem: null | HTMLElement = document.getElementById(`text-${row}-${col}`);
  if (elem) {
    if (highlight) {
      elem.setAttribute("style", "text-decoration: underline");
    } else {
      elem.setAttribute("style", "");
    }
  }
};
```

_We’re converting a one-dimensional number into a multidimensional array address and then highlighting or removing highlights from the text._

## Demo Screenshots

![Multicolored words table in english](https://cdn-images-1.medium.com/max/800/1*8LLvfnyT29AlmYUZkQh-rg.png)  
_Multicolored words table in English_

![Multicolored words table in Russian](https://cdn-images-1.medium.com/max/800/1*gLDCHgxcr_YYpaC4GTOzog.png)  
_Multicolored words table in Russian_

## Wrapping Up

There is much more in my app — simple routing, informational modals, translation, etc. The full code can be found [here](https://github.com/al3xsus/brain-train). And the working example is [here](https://al3xsus.github.io/brain-train/).

This is not a finished product yet, I’m going to refactor it a bit and add new games and exercises in the future. Stay with me if you wanna see it!

[![Smiling Terminator](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2VhdmdsN251aDNkb3Y0Z2Z4aXdleW5jMmR5MHFjMTFhaDA4cmo3cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YjfAfZyzEoOZi/giphy.gif)](https://giphy.com/gifs/arnold-schwarzenegger-terminator-genisys-the-YjfAfZyzEoOZi)

**Well, thanks for reading!**
