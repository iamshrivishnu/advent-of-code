package main

import (
	"aoc/basics"
	"fmt"
	"strings"
)

func parseBlock(block []string) [][]byte {
	result := make([][]byte, len(block))
	for index, line := range block {
		result[index] = []byte(line)
	}
	return result
}

func transformArray(byteArray [][]byte) [][]byte {
	result := make([][]byte, len(byteArray[0]))

	for index, _ := range result {
		result[index] = make([]byte, len(byteArray))
	}

	for outerIndex, _ := range byteArray {
		for innerIndex, _ := range byteArray[outerIndex] {
			result[innerIndex][outerIndex] = byteArray[outerIndex][innerIndex]
		}
	}
	return result
}

func isArraySame(firstArray, secondArray []byte, isSmudgeUsed *bool) bool {
	if len(firstArray) != len(secondArray) {
		return false
	}
	for index, _ := range firstArray {
		if firstArray[index] != secondArray[index] {
			if *isSmudgeUsed {
				return false
			} else {
				*isSmudgeUsed = true
			}
		}
	}
	return true
}

func findMirrorPosition(blockArray [][]byte, allowSmudge *bool) int {
	for index, _ := range blockArray {
		if index < len(blockArray)-1 {
			isSmudgeUsed := false
			if !(*allowSmudge) {
				isSmudgeUsed = true
			}
			if isArraySame(blockArray[index], blockArray[index+1], &isSmudgeUsed) {
				isMirror := true
				for loopIndex := 1; index-loopIndex >= 0 && (index+1)+loopIndex < len(blockArray); loopIndex++ {
					if !isArraySame(blockArray[index-loopIndex], blockArray[(index+1)+loopIndex], &isSmudgeUsed) {
						isMirror = false
						break
					}
				}
				if isMirror && (*allowSmudge && isSmudgeUsed || !(*allowSmudge)) {
					return index + 1
				}
			}
		}
	}
	return -1
}

func computeValue(block *string, allowSmudge bool) int {
	blockArray := parseBlock(strings.Split(*block, "\n"))
	blockArray = transformArray(blockArray)

	mirrorPosition := findMirrorPosition(blockArray, &allowSmudge)

	if mirrorPosition != -1 {
		return mirrorPosition
	}

	blockArray = transformArray(blockArray)
	mirrorPosition = findMirrorPosition(blockArray, &allowSmudge)
	return mirrorPosition * 100
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n\n")
	firstAnswer := 0
	secondAnswer := 0

	for _, block := range array {
		firstAnswer += computeValue(&block, false)
		secondAnswer += computeValue(&block, true)
	}

	fmt.Println("The number we get after summarizing all of the notes is", firstAnswer)
	fmt.Println("The number we get after summarizing the new reflection line in each pattern in the notes is", secondAnswer)
}
