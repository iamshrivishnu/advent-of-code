package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"
)

type Hand struct {
	value, score int
	line         string
}

func max(number1, number2 int) int {
	return int(math.Max(float64(number1), float64(number2)))
}

func pow(number, power int) int {
	return int(math.Pow(float64(number), float64(power)))
}

func square(number int) int {
	return pow(number, 2)
}

func computeHandMap(line string) map[string]int {
	handMap := make(map[string]int)
	for _, char := range strings.Split(line, "") {
		if _, ok := handMap[char]; ok {
			handMap[char]++
		} else {
			handMap[char] = 1
		}
	}
	return handMap
}

func computeTypeValue(handMap *map[string]int, part int) (value int) {
	maxValue := math.MinInt64
	for key, val := range *handMap {
		if !(part == 2 && key == "J") {
			maxValue = max(maxValue, val)
		}
		value += square(val)
	}
	if val, ok := (*handMap)["J"]; ok && part == 2 && maxValue > math.MinInt64 {
		value = value - (square(maxValue) + square(val)) + square(maxValue+val)
	}
	return
}

func computeWeightValue(line string, weightMap *map[string][2]int, part int) (value int) {
	lineLength := len(line)

	valIndex := 0
	if part == 2 {
		valIndex = 1
	}

	for index, char := range strings.Split(line, "") {
		charValue, _ := (*weightMap)[char]
		value += pow(16, lineLength-(index+1)) * charValue[valIndex]
	}
	return
}

func computeValue(line string, weightMap *map[string][2]int, part int) (value int) {
	value = computeWeightValue(line, weightMap, part)
	handMap := computeHandMap(line)
	typeValue := computeTypeValue(&handMap, part)
	value += pow(16, 5) * typeValue
	return
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0
	hands1 := make([]Hand, 0)
	hands2 := make([]Hand, 0)

	weightMap := map[string][2]int{
		"A": [2]int{12, 12},
		"K": [2]int{11, 11},
		"Q": [2]int{10, 10},
		"J": [2]int{9, 0},
		"T": [2]int{8, 9},
		"9": [2]int{7, 8},
		"8": [2]int{6, 7},
		"7": [2]int{5, 6},
		"6": [2]int{4, 5},
		"5": [2]int{3, 4},
		"4": [2]int{2, 3},
		"3": [2]int{1, 2},
		"2": [2]int{0, 1},
	}

	for index, line := range array {
		blocks := strings.Split(line, " ")
		value, _ := strconv.Atoi(blocks[1])

		hands1 = append(hands1, Hand{
			score: value,
			value: computeValue(blocks[0], &weightMap, 1),
			line:  blocks[0],
		})

		hands2 = append(hands2, Hand{
			score: value,
			value: computeValue(blocks[0], &weightMap, 2),
			line:  blocks[0],
		})

		if index >= 1 {
			sort.SliceStable(hands1, func(i, j int) bool {
				return hands1[i].value < hands1[j].value
			})
			sort.SliceStable(hands2, func(i, j int) bool {
				return hands2[i].value < hands2[j].value
			})
		}
	}

	for index, _ := range hands1 {
		firstAnswer += (hands1[index].score * (index + 1))
		secondAnswer += (hands2[index].score * (index + 1))
	}

	fmt.Println("The total winnings is", firstAnswer)
	fmt.Println("The new total winnings is", secondAnswer)
}
