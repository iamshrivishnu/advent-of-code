package main

import (
	"aoc/basics"
	"fmt"
	"strconv"
	"strings"
)

type Position struct {
	x, y int
}

func (position *Position) ComputeNewPosition(direction string) {
	switch direction {
	case "^":
		position.y++
		break
	case "v":
		position.y--
		break
	case ">":
		position.x++
		break
	case "<":
		position.x--
	}
	return
}

func (position *Position) ToString() string {
	return strconv.Itoa(position.x) + "," + strconv.Itoa(position.y)
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "")

	currentPosition := Position{
		x: 0,
		y: 0,
	}
	santaCurrentPosition := Position{
		x: 0,
		y: 0,
	}
	robotCurrentPosition := Position{
		x: 0,
		y: 0,
	}

	firstAnswer := 0
	secondAnswer := 0

	housesVisited := make(map[string]int, 0)
	housesVisited[currentPosition.ToString()] = 1

	housesVisitedNextYear := make(map[string]int, 0)
	housesVisitedNextYear[santaCurrentPosition.ToString()] = 1

	for index, direction := range array {
		currentPosition.ComputeNewPosition(direction)
		housesVisited[currentPosition.ToString()] = 1

		if index%2 == 0 {
			santaCurrentPosition.ComputeNewPosition(direction)
			housesVisitedNextYear[santaCurrentPosition.ToString()] = 1
		} else {
			robotCurrentPosition.ComputeNewPosition(direction)
			housesVisitedNextYear[robotCurrentPosition.ToString()] = 1
		}
	}

	firstAnswer = len(housesVisited)
	secondAnswer = len(housesVisitedNextYear)

	fmt.Println("Total number of houses receive at least one present is", firstAnswer)
	fmt.Println("Total number of houses receive at least one present the next year is", secondAnswer)
}
