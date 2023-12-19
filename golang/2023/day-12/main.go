package main

import (
	"aoc/basics"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

func parseCountsArray(block *string, regexpForExpectedCountsArray **regexp.Regexp) []int {
	counts := make([]int, 0)
	for _, value := range (*regexpForExpectedCountsArray).FindAllStringSubmatch(*block, -1) {
		intValue, _ := strconv.Atoi(value[0])
		counts = append(counts, intValue)
	}
	return counts
}

func clearMap(mapValue map[[3]int]int) {
	for key := range mapValue {
		delete(mapValue, key)
	}
}

func computeStates(currentStates, newStates *map[[3]int]int, counts *[]int, char byte) {
	for state, count := range *currentStates {
		countIndex, countValue, expectWorking := state[0], state[1], state[2]
		switch {
		case (char == '#' || char == '?') && countIndex < len(*counts) && expectWorking == 0:
			if char == '?' && countValue == 0 {
				(*newStates)[[3]int{countIndex, countValue, expectWorking}] += count
			}
			countValue++
			if countValue == (*counts)[countIndex] {
				countIndex, countValue, expectWorking = countIndex+1, 0, 1
			}
			(*newStates)[[3]int{countIndex, countValue, expectWorking}] += count
		case (char == '.' || char == '?') && countValue == 0:
			expectWorking = 0
			(*newStates)[[3]int{countIndex, countValue, expectWorking}] += count
		}
	}
	currentStates, newStates = newStates, currentStates
	clearMap(*newStates)
}

// Based on https://github.com/ConcurrentCrab/AoC/blob/main/solutions/12-1.go
func countPossible(stringArray *[]byte, counts *[]int) int {
	possibilities := 0
	currentStates := map[[3]int]int{{0, 0, 0}: 1}
	newStates := map[[3]int]int{}

	for _, char := range *stringArray {
		computeStates(&currentStates, &newStates, counts, char)
	}

	for state, value := range currentStates {
		if state[0] == len(*counts) {
			possibilities += value
		}
	}
	return possibilities
}

func repeatString(baseString, joinChar string) string {
	return strings.Join(strings.Split(strings.Repeat(baseString+" ", 5), " ")[:5], joinChar)
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	regexpForExpectedCountsArray := regexp.MustCompile(`\d+`)
	for _, line := range array {
		blocks := strings.Split(line, " ")

		counts := parseCountsArray(&blocks[1], &regexpForExpectedCountsArray)
		byteArray := []byte(blocks[0])
		firstAnswer += countPossible(&byteArray, &counts)

		part2String := repeatString(blocks[1], ",")
		counts = parseCountsArray(&part2String, &regexpForExpectedCountsArray)
		byteArray = []byte(repeatString(blocks[0], "?"))
		secondAnswer += countPossible(&byteArray, &counts)
	}

	fmt.Println("The sum of those counts is", firstAnswer)
	fmt.Println("The new sum of possible arrangement counts is", secondAnswer)
}
