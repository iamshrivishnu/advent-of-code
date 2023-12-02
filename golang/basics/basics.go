package basics

import (
	"fmt"
	"io/ioutil"
	"math"
)

func GetFileData(filename string) string {
	content, err := ioutil.ReadFile(filename) // the file is inside the local directory
	if err != nil {
		fmt.Println("Error reading the file")
		return ""
	}
	return string(content)
}

func GetSmallestOfThree(number1 int, number2 int, number3 int) int {
	intermediateMin := math.Min(float64(number1), float64(number2))
	return int(math.Min(intermediateMin, float64(number3)))
}

func GetLargestOfThree(number1 int, number2 int, number3 int) int {
	intermediateMax := math.Max(float64(number1), float64(number2))
	return int(math.Max(intermediateMax, float64(number3)))
}

func ReverseString(str string) (result string) {
	for _, v := range str {
		result = string(v) + result
	}
	return
}

func ReverseArrayOfStrings(strings []string) []string {
	for i := 0; i < len(strings)/2; i++ {
		j := len(strings) - i - 1
		strings[i], strings[j] = strings[j], strings[i]
	}
	return strings
}

func SumOfValues(array []int) (sum int) {
	for _, value := range array {
		sum += value
	}
	return
}
