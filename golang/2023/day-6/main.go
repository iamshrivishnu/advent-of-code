package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
	"sync"
)

func computeValue(result *int, time int, distance int, wg *sync.WaitGroup) {
	defer wg.Done()
	*result = 0
	distance++
	determinant := math.Sqrt(math.Pow(float64(time), 2) - float64(4*distance))
	point1, point2 := int(math.Ceil((float64(time)-determinant)/2)), int((float64(time)+determinant)/2)
	*result = point2 - point1 + 1
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 1
	secondAnswer := 0
	var wg sync.WaitGroup

	regForDigits := regexp.MustCompile(`\d+`)
	timeStringArray := regForDigits.FindAllString(array[0], -1)
	distanceStringArray := regForDigits.FindAllString(array[1], -1)

	results := make([]int, len(timeStringArray)+1)
	wg.Add(len(results))

	for index, timeString := range timeStringArray {
		time, _ := strconv.Atoi(timeString)
		distance, _ := strconv.Atoi(distanceStringArray[index])
		go computeValue(&results[index], time, distance, &wg)
	}

	newTimeString := regForDigits.FindAllString(strings.Replace(array[0], " ", "", -1), -1)
	newDistanceString := regForDigits.FindAllString(strings.Replace(array[1], " ", "", -1), -1)

	newTime, _ := strconv.Atoi(newTimeString[0])
	newDistance, _ := strconv.Atoi(newDistanceString[0])
	go computeValue(&results[len(results)-1], newTime, newDistance, &wg)

	wg.Wait()

	for index, val := range results {
		if index < len(results)-1 {
			firstAnswer *= val
		}
	}
	secondAnswer = results[len(results)-1]

	fmt.Println("The multiples of these values is", firstAnswer)
	fmt.Println("The numbers of ways to beat the score is", secondAnswer)
}
