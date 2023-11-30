package main

import (
	"aoc/basics"
	"fmt"
	"strings"
)

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "")
	firstAnswer := 0
	secondAnswer := 0

	for index, value := range array {

		if value == "(" {
			firstAnswer++
		} else if value == ")" {
			firstAnswer--
		}

		if firstAnswer == -1 && secondAnswer == 0 {
			secondAnswer = index + 1
		}

	}

	fmt.Println("The floor is", firstAnswer)
	fmt.Println("The position that causes him to enter the basement is", secondAnswer)
}
