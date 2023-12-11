package main

import (
	"aoc/basics"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type Number struct {
	start_x, start_y, end_x, end_y, value int
	has_adjacent_symbol                   bool
}

type Symbol struct {
	min_x, min_y, max_x, max_y int
	symbol                     string
	adjacent_numbers           []Number
}

func extractValues(array []string) (numbers []Number, symbols []Symbol) {
	for index_y, value := range array {
		cleanedLine := strings.ReplaceAll(value, ".", " ")
		reg := regexp.MustCompile(`\d+`)
		stringMatches := reg.FindAllString(cleanedLine, -1)
		stringIndexMatches := reg.FindAllStringIndex(cleanedLine, -1)

		for index_x, number_str := range stringMatches {
			number, _ := strconv.Atoi(number_str)
			numbers = append(numbers, Number{
				start_x: stringIndexMatches[index_x][0],
				start_y: index_y,
				end_x:   stringIndexMatches[index_x][1] - 1,
				end_y:   index_y,
				value:   number,
			})
		}

		regForSymbol := regexp.MustCompile(`[^\d ]`)
		symbolMatches := regForSymbol.FindAllString(cleanedLine, -1)
		symbolIndexMatches := regForSymbol.FindAllStringIndex(cleanedLine, -1)

		for index_x, indexArray := range symbolIndexMatches {
			symbols = append(symbols, Symbol{
				min_x:            indexArray[0] - 1,
				min_y:            index_y - 1,
				max_x:            indexArray[0] + 1,
				max_y:            index_y + 1,
				symbol:           symbolMatches[index_x],
				adjacent_numbers: make([]Number, 0),
			})
		}
	}
	return
}

func isSymbolNextToNumber(number Number, symbol Symbol) bool {
	return (symbol.min_x <= number.start_x &&
		symbol.max_x >= number.start_x &&
		symbol.min_y <= number.start_y &&
		symbol.max_y >= number.start_y) ||
		(symbol.min_x <= number.end_x &&
			symbol.max_x >= number.end_x &&
			symbol.min_y <= number.end_y &&
			symbol.max_y >= number.end_y)
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n")
	firstAnswer := 0
	secondAnswer := 0

	numbers, symbols := extractValues(array)

	for _, number := range numbers {
		for symbol_index, symbol := range symbols {
			if isSymbolNextToNumber(number, symbol) {
				number.has_adjacent_symbol = true
				symbols[symbol_index].adjacent_numbers = append(symbol.adjacent_numbers, number)
			}
		}
		if number.has_adjacent_symbol {
			firstAnswer += number.value
		}
	}

	for _, symbol := range symbols {
		if symbol.symbol == "*" && len(symbol.adjacent_numbers) == 2 {
			secondAnswer += (symbol.adjacent_numbers[0].value * symbol.adjacent_numbers[1].value)
		}
	}

	fmt.Println("The sum of all of the part numbers in the engine schematic is", firstAnswer)
	fmt.Println("The sum of all of the gear ratios in your engine schematic is", secondAnswer)
}
