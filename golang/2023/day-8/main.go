package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"regexp"
	"strings"
	"sync"
)

func computeSteps(line string) []int {
	strArray := strings.Split(line, "")
	intArray := make([]int, len(strArray))
	for index, str := range strArray {
		if str == "L" {
			intArray[index] = 0
		} else {
			intArray[index] = 1
		}
	}
	return intArray
}

func computePathMap(mapLines string) (map[string][2]string, []string) {
	pathMap := make(map[string][2]string)
	startNodes := make([]string, 0)
	for _, line := range strings.Split(mapLines, "\n") {
		matches := regexp.MustCompile(`^([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)`).FindAllStringSubmatch(line, -1)
		pathMap[matches[0][1]] = [2]string(matches[0][2:])
		if regexp.MustCompile(`^[A-Z]{2}A$`).Match([]byte(matches[0][1])) {
			startNodes = append(startNodes, matches[0][1])
		}
	}
	return pathMap, startNodes
}

func getStepsForNodeWithEndZ(result *int, node string, pathMap *map[string][2]string, steps []int, wg *sync.WaitGroup) {
	defer wg.Done()
	stepIndex := 0
	indexPath := node
	for !regexp.MustCompile(`^[A-Z]{2}Z$`).Match([]byte(indexPath)) {
		indexPath = (*pathMap)[indexPath][steps[stepIndex]]
		*result = (*result) + 1
		stepIndex = (stepIndex + 1) % len(steps)
	}
}

func findLCM(number1 int, number2 int) int {
	lcm := int(math.Max(float64(number1), float64(number2)))
	maxLcm := number1 * number2
	for lcm <= maxLcm {
		if lcm%number1 == 0 && lcm%number2 == 0 {
			return lcm
		}
		lcm += int(math.Max(float64(number1), float64(number2)))
	}
	return maxLcm
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n\n")
	firstAnswer := 0
	secondAnswer := 0

	steps := computeSteps(array[0])
	pathMap, nodes := computePathMap(array[1])
	results := make([]int, len(nodes))
	var wg sync.WaitGroup
	wg.Add(len(results))

	indexPath := "AAA"
	stepIndex := 0

	for indexPath != "ZZZ" {
		indexPath = pathMap[indexPath][steps[stepIndex]]
		firstAnswer++
		stepIndex = (stepIndex + 1) % len(steps)
	}

	for index, node := range nodes {
		go getStepsForNodeWithEndZ(&results[index], node, &pathMap, steps, &wg)
	}
	wg.Wait()

	secondAnswer = results[0]

	for index, result := range results {
		if index >= 1 {
			secondAnswer = findLCM(secondAnswer, result)
		}
	}

	fmt.Println("The number of steps are required to reach ZZZ is", firstAnswer)
	fmt.Println("The number of steps are required to reach all nodes ending with Z is", secondAnswer)
}
