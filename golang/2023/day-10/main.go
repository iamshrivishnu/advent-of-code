package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"regexp"
	"strings"
	"sync"
)

var pipes map[string][2]string
var gridOfTiles [][]string
var loops [][][]int

func computePrevIndexDirection(prevIndex, index [2]int) string {
	if prevIndex[0]+1 == index[0] && prevIndex[1] == index[1] { // North Direction
		return "N"
	} else if prevIndex[0]-1 == index[0] && prevIndex[1] == index[1] { // South Direction
		return "S"
	} else if prevIndex[0] == index[0] && prevIndex[1]+1 == index[1] { // West Direction
		return "W"
	} else { // East Direction
		return "E"
	}
}

func computeNextValue(index [2]int, direction string) [2]int {
	switch direction {
	case "N":
		return [2]int{index[0] - 1, index[1]}
	case "S":
		return [2]int{index[0] + 1, index[1]}
	case "W":
		return [2]int{index[0], index[1] - 1}
	default:
		return [2]int{index[0], index[1] + 1}
	}
}

func computeNextIndex(prevIndex, index [2]int) ([2]int, bool) {
	pipe := gridOfTiles[index[0]][index[1]]
	prevDirection := computePrevIndexDirection(prevIndex, index)
	var nextDirection string
	if valArray, ok := pipes[pipe]; ok {
		for _, val := range valArray {
			if val != prevDirection {
				nextDirection = val
				break
			}
		}
	}
	if nextDirection == "" {
		return [2]int{0, 0}, true
	}
	nextIndex := computeNextValue(index, nextDirection)
	return nextIndex, false
}

func computePositionValue(loop *[][]int, prevIndex, index [2]int, count int) {
	if index[0] < 0 || index[1] < 0 || index[0] > len(gridOfTiles) || index[1] > len(gridOfTiles[0]) {
		return
	}
	pipe := gridOfTiles[index[0]][index[1]]
	if pipe == "S" {
		(*loop) = append((*loop), index[:])
	}

	if pipe != " " && pipe != "S" {
		(*loop) = append((*loop), index[:])
		newIndex, error := computeNextIndex(prevIndex, index)
		if !error {
			computePositionValue(loop, index, newIndex, count+1)
		}
	}
}

func computeLoop(startIndex []int, index int, direction string, wg *sync.WaitGroup) {
	defer wg.Done()
	computePositionValue(&loops[index], [2]int(startIndex), computeNextValue([2]int(startIndex), direction), 1)
}

func computeStartPipe(largestLoop [][]int, startIndex [2]int, pipes *map[string][2]string) {
	firstPipe, lastPipe := largestLoop[0], largestLoop[len(largestLoop)-2]
	valueMap := [2]string{
		computePrevIndexDirection([2]int(firstPipe), startIndex),
		computePrevIndexDirection([2]int(lastPipe), startIndex),
	}

	for key, value := range *pipes {
		if (value[0] == valueMap[0] && value[1] == valueMap[1]) || (value[0] == valueMap[1] && value[1] == valueMap[0]) {
			gridOfTiles[startIndex[0]][startIndex[1]] = key
		}
	}
}

func generateMap(largestLoop [][]int) int {
	pointsWithinRegion := 0

	replaceMap := map[string]string{
		"|": "│",
		"-": "─",
		"F": "┌",
		"7": "┐",
		"J": "┘",
		"L": "└",
	}

	for _, index := range largestLoop {
		val, _ := replaceMap[gridOfTiles[index[0]][index[1]]]
		gridOfTiles[index[0]][index[1]] = val
	}

	for outerIndex, line := range gridOfTiles {
		str := strings.Join(gridOfTiles[outerIndex], "")
		reg := regexp.MustCompile(`│|─|┌|┐|┘|└`)
		array := reg.FindAllIndex([]byte(str), -1)
		isInside := false
		isCondition1, isCondition2 := false, false
		startIndex := -1
		if len(array) > 0 {
			startIndex = array[0][0]
		}
		for innerIndex, value := range line {
			if value == "│" || value == "─" || value == "┌" || value == "┐" || value == "┘" || value == "└" {
				switch value {
				case "│":
					isInside = !isInside
				case "┌":
					isCondition1 = !isCondition1
				case "┐":
					{
						if isCondition2 {
							isInside = !isInside
							isCondition2 = false
						} else if isCondition1 {
							isCondition1 = false

						}
					}
				case "┘":
					{
						if isCondition1 {
							isInside = !isInside
							isCondition1 = false
						} else if isCondition2 {
							isCondition2 = false

						}
					}
				case "└":
					isCondition2 = !isCondition2
				}
			} else if startIndex <= -1 {
				gridOfTiles[outerIndex][innerIndex] = " "
			} else {
				gridOfTiles[outerIndex][innerIndex] = " "
				if isInside {
					gridOfTiles[outerIndex][innerIndex] = "*"
					pointsWithinRegion++
				}
			}
		}
		// Uncomment this to view the map
		// fmt.Println(strings.Join(gridOfTiles[outerIndex], ""))
	}
	return pointsWithinRegion
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(strings.Replace(input, ".", " ", -1), "\n")
	firstAnswer := math.MinInt64
	secondAnswer := 0

	pipes = map[string][2]string{
		"|": [2]string{"N", "S"},
		"-": [2]string{"E", "W"},
		"L": [2]string{"N", "E"},
		"J": [2]string{"N", "W"},
		"7": [2]string{"S", "W"},
		"F": [2]string{"S", "E"},
	}

	gridOfTiles = make([][]string, 0)
	loops = make([][][]int, 4)
	startIndex := make([]int, 2)

	var wg sync.WaitGroup
	wg.Add(len(loops))

	for outerIndex, line := range array {
		values := strings.Split(line, "")
		gridOfTiles = append(gridOfTiles, values)
		regForStart := regexp.MustCompile(`S`)
		if regForStart.Match([]byte(line)) {
			startIndex[0] = outerIndex
			startIndex[1] = regForStart.FindIndex([]byte(line))[0]
		}
	}

	for index, direction := range [4]string{"N", "S", "W", "E"} {
		go computeLoop(startIndex, index, direction, &wg)
	}

	wg.Wait()

	var largestLoop [][]int

	for _, loop := range loops {
		if len(loop) > 0 {
			lastValue := loop[len(loop)-1]

			if lastValue[0] == startIndex[0] && lastValue[1] == startIndex[1] {
				firstAnswer = int(math.Max(float64(firstAnswer), float64(len(loop))))
				if len(loop) > len(largestLoop) {
					largestLoop = loop
				}
			}
		}
	}

	firstAnswer = int(math.Ceil(float64(firstAnswer) / 2))

	// Need to find value of S and replace
	computeStartPipe(largestLoop, [2]int(startIndex), &pipes)
	secondAnswer = generateMap(largestLoop)

	fmt.Println("The number of steps along the loop does it take to get from the starting position to the point farthest from the starting position is", firstAnswer)
	fmt.Println("The number of tiles are enclosed by the loop is", secondAnswer)
}
