package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
)

type Card struct {
	card_id                      int
	winning_numbers, our_numbers map[int]bool
}

func (card *Card) fetchMatching() (intersection []int) {
	for key, _ := range card.our_numbers {
		if _, ok := card.winning_numbers[key]; ok {
			intersection = append(intersection, key)
		}
	}
	return
}

func generateHashMap(series string) map[int]bool {
	regForNumbers := regexp.MustCompile(`\d+`)
	array := regForNumbers.FindAllStringSubmatch(series, -1)
	hashMap := make(map[int]bool, 0)
	for _, value := range array {
		intValue, _ := strconv.Atoi(value[0])
		hashMap[intValue] = true
	}
	return hashMap
}

func extractCardValues(line string) Card {
	regForCardId := regexp.MustCompile(`^Card +(\d+):`)
	cardText := regForCardId.FindStringSubmatch(line)[0]
	cardId, _ := strconv.Atoi(regForCardId.FindStringSubmatch(line)[1])
	splitArrays := strings.Split(strings.Replace(line, cardText, "", -1), "|")
	return Card{
		card_id:         cardId,
		winning_numbers: generateHashMap(splitArrays[0]),
		our_numbers:     generateHashMap(splitArrays[1]),
	}
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0
	additionalCardsCount := make([]int, len(array))

	for index, line := range array {
		currentCard := extractCardValues(line)
		intersection := currentCard.fetchMatching()
		firstAnswer += int(math.Pow(float64(2), float64(len(intersection)-1)))
		for loopIndex := 1; loopIndex <= len(intersection); loopIndex++ {
			additionalCardsCount[index+loopIndex] = additionalCardsCount[index+loopIndex] + (additionalCardsCount[index] + 1)
		}
		secondAnswer += additionalCardsCount[index] + 1
	}

	fmt.Println("The total worth of points is", firstAnswer)
	fmt.Println("The total numbers of cards we end up with is", secondAnswer)
}
