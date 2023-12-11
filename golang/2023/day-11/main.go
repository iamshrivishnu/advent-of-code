package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"regexp"
	"strings"
)

type Galaxy struct {
	xIndex, yIndex, rowCorrectionFactor, columnCorrectionFactor int
}

func (galaxy *Galaxy) getPoint(expansionFactor int) [2]int {
	point := [2]int{
		galaxy.xIndex + (galaxy.rowCorrectionFactor * expansionFactor),
		galaxy.yIndex + (galaxy.columnCorrectionFactor * expansionFactor),
	}
	return point
}

func shortestDistance(point1, point2 [2]int) int {
	return int(math.Abs(float64(point1[0]-point2[0])) + math.Abs(float64(point1[1]-point2[1])))
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	galaxies := make([]Galaxy, 0)
	regexpForGalaxy := regexp.MustCompile(`#`)
	rowCorrectionFactor := 0
	columnCorrectionFactor := 0
	columnValues := make(map[int]int, 0)

	for xIndex, line := range array {
		matchIndexes := regexpForGalaxy.FindAllIndex([]byte(line), -1)
		if len(matchIndexes) == 0 {
			rowCorrectionFactor++
		} else {
			for _, indexes := range matchIndexes {
				galaxies = append(galaxies, Galaxy{
					xIndex:                 xIndex,
					yIndex:                 indexes[0],
					rowCorrectionFactor:    rowCorrectionFactor,
					columnCorrectionFactor: 0,
				})
				columnValues[indexes[0]] = 0
			}
		}
	}

	for yIndex, _ := range array[0] {
		if _, ok := columnValues[yIndex]; !ok {
			columnCorrectionFactor++
		}
		columnValues[yIndex] = columnCorrectionFactor
	}

	for index, _ := range galaxies {
		correction, _ := columnValues[galaxies[index].yIndex]
		galaxies[index].columnCorrectionFactor = correction
	}

	for outerIndex := 0; outerIndex < len(galaxies); outerIndex++ {
		for innerIndex := outerIndex + 1; innerIndex < len(galaxies); innerIndex++ {
			firstAnswer += shortestDistance(galaxies[outerIndex].getPoint(1), galaxies[innerIndex].getPoint(2-1))
			secondAnswer += shortestDistance(galaxies[outerIndex].getPoint(1000000-1), galaxies[innerIndex].getPoint(1000000-1))
		}
	}
	fmt.Println("The sum of these lengths is", firstAnswer)
	fmt.Println("The new sum of these lengths is", secondAnswer)
}
