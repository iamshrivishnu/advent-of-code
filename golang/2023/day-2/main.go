package main

import (
	"aoc/basics"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type GameAndCubeCount struct {
	gameNo                          int
	redCubes, greenCubes, blueCubes []int
}

func getCubes(line string, color string) (cubes []int) {
	regForCubes := regexp.MustCompile("(\\d+) " + color)
	matchesForCubes := regForCubes.FindAllStringSubmatch(line, -1)
	for _, cubeMatch := range matchesForCubes {
		number, _ := strconv.Atoi(cubeMatch[1])
		cubes = append(cubes, number)
	}
	return
}

func getGameAndCubesCount(line string) *GameAndCubeCount {
	regForGameId := regexp.MustCompile(`^Game (\d+)`)
	gameId, _ := strconv.Atoi(regForGameId.FindAllStringSubmatch(line, -1)[0][1])

	redCubes := getCubes(line, "red")
	blueCubes := getCubes(line, "blue")
	greenCubes := getCubes(line, "green")

	output := GameAndCubeCount{
		gameNo:     gameId,
		redCubes:   redCubes,
		blueCubes:  blueCubes,
		greenCubes: greenCubes,
	}

	return &output
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	for _, value := range array {
		gameAndCubeCount := getGameAndCubesCount(value)

		redMax := basics.MaxInArray(gameAndCubeCount.redCubes)
		greenMax := basics.MaxInArray(gameAndCubeCount.greenCubes)
		blueMax := basics.MaxInArray(gameAndCubeCount.blueCubes)

		if redMax <= 12 && greenMax <= 13 && blueMax <= 14 {
			firstAnswer += gameAndCubeCount.gameNo
		}

		secondAnswer += redMax * greenMax * blueMax
	}

	fmt.Println("The sum of the IDs of those games is", firstAnswer)
	fmt.Println("The sum of the power of the sets is", secondAnswer)
}
