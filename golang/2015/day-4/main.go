package main

import (
	"aoc/basics"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"regexp"
	"strconv"
)

func main() {
	input := basics.GetFileData("./input.txt")
	firstAnswer := 0
	secondAnswer := 0

	regForFiveZeros := regexp.MustCompile(`^00000.*`)
	regForSixZeros := regexp.MustCompile(`^000000.*`)

	index := 100000
	for {
		hash := md5.Sum([]byte(input + strconv.Itoa(index)))
		hexString := hex.EncodeToString(hash[:])
		if firstAnswer == 0 && regForFiveZeros.Match([]byte(hexString)) {
			firstAnswer = index
		}
		if firstAnswer != 0 && regForSixZeros.Match([]byte(hexString)) {
			secondAnswer = index
			break
		}
		index++
	}

	fmt.Println("The answer is", firstAnswer)
	fmt.Println("The value for six zeros is", secondAnswer)
}
