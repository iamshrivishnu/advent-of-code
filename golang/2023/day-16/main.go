package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"strings"
)

type State struct {
	point     [2]int
	direction byte
}

func (state *State) isPointWithinLayoutMap(layoutMap *[][]byte) bool {
	return state.point[0] >= 0 && state.point[0] < len(*layoutMap) && state.point[1] >= 0 && state.point[1] < len((*layoutMap)[0])
}

func (state *State) updateNewDirection(direction byte) {
	state.direction = direction
	switch direction {
	case 'O':
		{
			state.point = [2]int{-1, -1}
		}
	case 'L':
		{
			state.point[1]--
		}
	case 'R':
		{
			state.point[1]++
		}
	case 'U':
		{
			state.point[0]--
		}
	case 'D':
		{
			state.point[0]++
		}
	}
}

func computePaths(layoutMap *[][]byte, states *[]State, cache *map[State]bool, cells *map[[2]int]bool) {
	for len(*states) > 0 {
		currentState := (*states)[0]
		*states = (*states)[1:]

		if !currentState.isPointWithinLayoutMap(layoutMap) {
			continue
		} else if _, ok := (*cache)[currentState]; !ok {
			(*cache)[currentState] = true
			(*cells)[currentState.point] = true
		} else {
			continue
		}

		for {
			char := (*layoutMap)[currentState.point[0]][currentState.point[1]]
			newDirection, _ := directionMap[[2]byte{char, currentState.direction}]

			if newDirection == 'O' {
				if char == '-' {
					(*states) = append((*states), State{point: [2]int{currentState.point[0], currentState.point[1] - 1}, direction: 'L'}) // Left State
					(*states) = append((*states), State{point: [2]int{currentState.point[0], currentState.point[1] + 1}, direction: 'R'}) // Right State
				} else {
					(*states) = append((*states), State{point: [2]int{currentState.point[0] - 1, currentState.point[1]}, direction: 'U'}) // Up State
					(*states) = append((*states), State{point: [2]int{currentState.point[0] + 1, currentState.point[1]}, direction: 'D'}) // Down State
				}
			}

			currentState.updateNewDirection(newDirection)
			if !currentState.isPointWithinLayoutMap(layoutMap) {
				break
			} else if _, ok := (*cache)[currentState]; !ok {
				(*cache)[currentState] = true
				(*cells)[currentState.point] = true
			} else {
				break
			}
		}
	}
}

func getEnergizedTiles(layoutMap *[][]byte, state State) (count int) {
	states := []State{state}
	cache := make(map[State]bool, 0)
	cells := make(map[[2]int]bool, 0)
	computePaths(layoutMap, &states, &cache, &cells)
	return len(cells)
}

var directionMap map[[2]byte]byte

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := math.MinInt64

	layoutMap := make([][]byte, 0)
	for _, stringValue := range array {
		layoutMap = append(layoutMap, []byte(stringValue))
	}

	directionMap = map[[2]byte]byte{
		// For the char .
		[2]byte{'.', 'R'}: 'R',
		[2]byte{'.', 'L'}: 'L',
		[2]byte{'.', 'U'}: 'U',
		[2]byte{'.', 'D'}: 'D',
		// For the char /
		[2]byte{'/', 'R'}: 'U',
		[2]byte{'/', 'L'}: 'D',
		[2]byte{'/', 'U'}: 'R',
		[2]byte{'/', 'D'}: 'L',
		// For the char \
		[2]byte{'\\', 'R'}: 'D',
		[2]byte{'\\', 'L'}: 'U',
		[2]byte{'\\', 'U'}: 'L',
		[2]byte{'\\', 'D'}: 'R',
		// For the char -
		[2]byte{'-', 'R'}: 'R',
		[2]byte{'-', 'L'}: 'L',
		[2]byte{'-', 'U'}: 'O',
		[2]byte{'-', 'D'}: 'O',
		// For the char |
		[2]byte{'|', 'R'}: 'O',
		[2]byte{'|', 'L'}: 'O',
		[2]byte{'|', 'U'}: 'U',
		[2]byte{'|', 'D'}: 'D',
	}

	// Left Column
	for index := 0; index < len(layoutMap); index++ {
		value := getEnergizedTiles(&layoutMap, State{point: [2]int{index, 0}, direction: 'R'})
		if index == 0 {
			firstAnswer = value
		}
		secondAnswer = int(math.Max(float64(secondAnswer), float64(value)))
	}
	// Top Row
	for index := 0; index < len(layoutMap[0]); index++ {
		secondAnswer = int(math.Max(float64(secondAnswer), float64(getEnergizedTiles(&layoutMap, State{point: [2]int{0, index}, direction: 'D'}))))
	}
	// Right Column
	for index := 0; index < len(layoutMap); index++ {
		secondAnswer = int(math.Max(float64(secondAnswer), float64(getEnergizedTiles(&layoutMap, State{point: [2]int{index, len(layoutMap[0]) - 1}, direction: 'L'}))))
	}
	// Bottom Row
	for index := 0; index < len(layoutMap[0]); index++ {
		secondAnswer = int(math.Max(float64(secondAnswer), float64(getEnergizedTiles(&layoutMap, State{point: [2]int{len(layoutMap) - 1, index}, direction: 'U'}))))
	}

	fmt.Println("The number of tiles end up being energized is", firstAnswer)
	fmt.Println("The max number of tiles end up being energized is", secondAnswer)
}
