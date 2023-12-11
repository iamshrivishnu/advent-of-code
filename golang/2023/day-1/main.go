package main

import (
	"aoc/basics"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

func textToNumbers(value string, textToNumbersMap map[string]string) string {
	output, ok := textToNumbersMap[value]
	if !ok {
		return value
	}
	return output
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	textToNumbersMap := map[string]string{
		"one":   "1",
		"two":   "2",
		"three": "3",
		"four":  "4",
		"five":  "5",
		"six":   "6",
		"seven": "7",
		"eight": "8",
		"nine":  "9",
	}

	for _, value := range array {

		regForPart1 := regexp.MustCompile(`\d`)
		matchesForCase1 := regForPart1.FindAllString(value, -1)
		numberStringForCase1 := matchesForCase1[0] + matchesForCase1[len(matchesForCase1)-1]

		numberForCase1, _ := strconv.Atoi(numberStringForCase1)
		firstAnswer += numberForCase1

		editedValue := basics.ReverseString(value)
		regForPart2First := regexp.MustCompile(`\d|one|two|three|four|five|six|seven|eight|nine`)
		regForPart2Second := regexp.MustCompile(`\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin`)
		matchesForCase2First := regForPart2First.FindAllString(value, -1)
		matchesForCase2Second := regForPart2Second.FindAllString(editedValue, -1)
		matchesForCase2 := append(matchesForCase2First, basics.ReverseArrayOfStrings(matchesForCase2Second)...)
		numberStringForCase2 := textToNumbers(matchesForCase2[0], textToNumbersMap) + textToNumbers(basics.ReverseString(matchesForCase2[len(matchesForCase2)-1]), textToNumbersMap)
		numberForCase2, _ := strconv.Atoi(numberStringForCase2)
		secondAnswer += numberForCase2
	}

	fmt.Println("The sum of all of the calibration values is", firstAnswer)
	fmt.Println("The new sum of all of the calibration values is", secondAnswer)
}
