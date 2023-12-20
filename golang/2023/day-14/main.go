package main

import (
	"aoc/basics"
	"fmt"
	"strings"
)

func slideRocks(blocks *[][]byte) {
	for outerIndex := 1; outerIndex < len(*blocks); outerIndex++ {
		for innerIndex := 0; innerIndex < len((*blocks)[outerIndex]); innerIndex++ {
			if (*blocks)[outerIndex][innerIndex] == 'O' {
				for dropIndex := outerIndex - 1; dropIndex >= 0 && (*blocks)[dropIndex][innerIndex] == '.'; dropIndex-- {
					(*blocks)[dropIndex+1][innerIndex], (*blocks)[dropIndex][innerIndex] = (*blocks)[dropIndex][innerIndex], (*blocks)[dropIndex+1][innerIndex]
				}
			}
		}
	}
}

func computeTotalLoad(blocks *[][]byte) (sum int) {
	for outerIndex := 0; outerIndex < len(*blocks); outerIndex++ {
		count := 0
		for innerIndex := 0; innerIndex < len((*blocks)[outerIndex]); innerIndex++ {
			if (*blocks)[outerIndex][innerIndex] == 'O' {
				count++
			}
		}
		sum += (count * (len(*blocks) - outerIndex))
	}
	return
}

// Transforming and then reversing the rows
func rotateArray(blocks *[][]byte) {
	for outerIndex := 0; outerIndex < len(*blocks)-1; outerIndex++ {
		for innerIndex := outerIndex + 1; innerIndex < len(*blocks); innerIndex++ {
			(*blocks)[outerIndex][innerIndex], (*blocks)[innerIndex][outerIndex] = (*blocks)[innerIndex][outerIndex], (*blocks)[outerIndex][innerIndex]
		}
	}

	for outerIndex := 0; outerIndex < len(*blocks); outerIndex++ {
		for i, j := 0, len((*blocks)[outerIndex])-1; i < j; i, j = i+1, j-1 {
			(*blocks)[outerIndex][i], (*blocks)[outerIndex][j] = (*blocks)[outerIndex][j], (*blocks)[outerIndex][i]
		}
	}

}

func completeLoop(blocks *[][]byte) {
	for index := 0; index < 4; index++ {
		slideRocks(blocks)
		rotateArray(blocks)
	}

}

func getKeyOfArray(blocks *[][]byte) string {
	stringArray := make([]string, 0)

	for _, block := range *blocks {
		stringArray = append(stringArray, string(block))
	}
	return strings.Join(stringArray, "")
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0
	totalLoops := 1000000000

	blocks := make([][]byte, 0)
	for _, block := range array {
		blocks = append(blocks, []byte(block))
	}
	slideRocks(&blocks)
	firstAnswer = computeTotalLoad(&blocks)

	for index, block := range array {
		blocks[index] = []byte(block)
	}

	cache := make(map[string]int, 0)
	cache[getKeyOfArray(&blocks)] = 0

	for loopIndex := 1; loopIndex <= totalLoops; loopIndex++ {
		completeLoop(&blocks)
		if index, ok := cache[getKeyOfArray(&blocks)]; ok {
			repeatsAfter := loopIndex - index
			factor := int(float64(totalLoops-loopIndex) / float64(repeatsAfter))
			loopIndex += (repeatsAfter * factor)
		}
		cache[getKeyOfArray(&blocks)] = loopIndex
	}

	secondAnswer = computeTotalLoad(&blocks)

	fmt.Println("The total load on the north support beams is", firstAnswer)
	fmt.Println("The total load on the north support beams after rotations is", secondAnswer)
}
