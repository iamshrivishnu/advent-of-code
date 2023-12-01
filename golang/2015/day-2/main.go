package main

import (
	"aoc/basics"
	"fmt"
	"strconv"
	"strings"
)

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	for _, line := range array {
		value := strings.Split(line, "x")

		length, _ := strconv.Atoi(value[0])
		width, _ := strconv.Atoi(value[1])
		height, _ := strconv.Atoi(value[2])

		area1 := length * width
		area2 := width * height
		area3 := height * length
		sumOfSides := length + width + height
		volume := length * width * height

		smallestArea := basics.GetSmallestOfThree(area1, area2, area3)
		smallestPerimeter := 2 * (sumOfSides - basics.GetLargestOfThree(length, width, height))

		totalAreaNeeded := 2*(area1+area2+area3) + smallestArea
		totalLengthNeeded := smallestPerimeter + volume

		firstAnswer += totalAreaNeeded
		secondAnswer += totalLengthNeeded

	}

	fmt.Println("Total square feet of wrapping paper that should be ordered is", firstAnswer)
	fmt.Println("The total feet of ribbon needed is", secondAnswer)
}
