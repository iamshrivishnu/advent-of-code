package main

import (
	"aoc/basics"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type Lens struct {
	label  string
	number int
}

func computeHash(byteArray []byte) (result int) {
	for _, byteValue := range byteArray {
		result = ((result + int(byteValue)) * 17) % 256
	}
	return
}

func processLens(byteArray *[]byte, boxMap *map[int][]Lens) {
	operandIndex := regexp.MustCompile(`\-|=`).FindAllSubmatchIndex(*byteArray, -1)[0][0]
	label, operation := string((*byteArray)[:operandIndex]), (*byteArray)[operandIndex]
	var lensNumber int

	if operation == '=' {
		lensNumber, _ = strconv.Atoi(string((*byteArray)[operandIndex+1:]))
	}

	hashValue := computeHash([]byte(label))
	if _, ok := (*boxMap)[hashValue]; !ok {
		(*boxMap)[hashValue] = make([]Lens, 0)
	}

	index := 0
	for ; index < len((*boxMap)[hashValue]); index++ {
		if (*boxMap)[hashValue][index].label == label {
			if operation == '-' {
				(*boxMap)[hashValue] = append((*boxMap)[hashValue][:index], (*boxMap)[hashValue][index+1:]...)
			} else if operation == '=' {
				(*boxMap)[hashValue][index].number = lensNumber
			}
			break
		}
	}

	if operation == '=' && index == len((*boxMap)[hashValue]) {
		(*boxMap)[hashValue] = append((*boxMap)[hashValue], Lens{
			label:  label,
			number: lensNumber,
		})
	}
}

func computePower(boxMap *map[int][]Lens) (result int) {
	for key, array := range *boxMap {
		for index, lens := range array {
			result += ((key + 1) * (index + 1) * lens.number)
		}
	}
	return
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, ",")
	firstAnswer := 0
	secondAnswer := 0

	boxMap := make(map[int][]Lens, 0)
	for _, stringValue := range array {
		byteArray := []byte(stringValue)
		firstAnswer += computeHash(byteArray)
		processLens(&byteArray, &boxMap)
	}
	secondAnswer = computePower(&boxMap)

	fmt.Println("The sum of the results is", firstAnswer)
	fmt.Println("The focusing power of the resulting lens configuration is", secondAnswer)
}
