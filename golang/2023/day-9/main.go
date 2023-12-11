package main

import (
	"aoc/basics"
	"fmt"
	"strconv"
	"strings"
	"sync"
)

func computeHistory(line string) []int {
	historyArray := make([]int, 0)
	for _, str := range strings.Split(line, " ") {
		history, _ := strconv.Atoi(str)
		historyArray = append(historyArray, history)
	}
	return historyArray
}

func isAllZeros(history []int) bool {
	for _, value := range history {
		if value != 0 {
			return false
		}
	}
	return true
}

func recNextHistory(history []int) (int, int) {
	newHistory := make([]int, len(history)-1)

	for index, _ := range history {
		if index >= 1 {
			newHistory[index-1] = history[index] - history[index-1]
		}
	}

	if isAllZeros(newHistory) {
		return 0, 0
	}

	start, end := recNextHistory(newHistory)
	return newHistory[0] - start, newHistory[len(newHistory)-1] + end
}

func computeNextHistory(history []int, result *[2]int, wg *sync.WaitGroup) {
	defer wg.Done()
	start, end := recNextHistory(history)
	(*result)[0] = history[0] - start
	(*result)[1] = history[len(history)-1] + end
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	var wg sync.WaitGroup
	results := make([][2]int, len(array))
	wg.Add(len(results))

	for index, line := range array {
		history := computeHistory(line)
		go computeNextHistory(history, &results[index], &wg)
	}
	wg.Wait()

	for _, result := range results {
		firstAnswer += result[1]
		secondAnswer += result[0]
	}

	fmt.Println("The number of steps are required to reach ZZZ is", firstAnswer)
	fmt.Println("The number of steps are required to reach all nodes ending with Z is", secondAnswer)
}
