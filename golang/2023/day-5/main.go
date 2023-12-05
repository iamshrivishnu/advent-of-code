package main

import (
	"aoc/basics"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
	"sync"
)

type ValueMap struct {
	source_start, source_end, destination_start int
}

type SourceDestinationMapper struct {
	map_values []ValueMap
}

func (sourceDestinationMapper *SourceDestinationMapper) findMappedValue(value int) int {
	for _, valueMap := range sourceDestinationMapper.map_values {
		if value >= valueMap.source_start && value <= valueMap.source_end {
			return valueMap.destination_start + (value - valueMap.source_start)
		}
	}
	return value
}

func extractNumberArray(line string) []int {
	regForValues := regexp.MustCompile(`\d+`)
	stringArray := regForValues.FindAllStringSubmatch(line, -1)
	outputArray := make([]int, len(stringArray))
	for index, value := range stringArray {
		outputArray[index], _ = strconv.Atoi(value[0])
	}
	return outputArray
}

func extractSourceDestinationMapper(block string) SourceDestinationMapper {
	result := SourceDestinationMapper{
		map_values: make([]ValueMap, 0),
	}

	lines := strings.Split(block, "\n")[1:]

	for _, line := range lines {
		values := extractNumberArray(line)
		result.map_values = append(result.map_values, ValueMap{
			source_start:      values[1],
			source_end:        values[1] + values[2] - 1,
			destination_start: values[0],
		})
	}

	return result
}

var seedToSoilMap, soilToFertilizerMap, fertilizerToWaterMap, waterToLightMap, lightToTemperatureMap, temperatureToHumidityMap, humidityToLocationMap SourceDestinationMapper

func getLocation(seed int) int {
	return humidityToLocationMap.findMappedValue(temperatureToHumidityMap.findMappedValue(lightToTemperatureMap.findMappedValue(waterToLightMap.findMappedValue(fertilizerToWaterMap.findMappedValue(soilToFertilizerMap.findMappedValue(seedToSoilMap.findMappedValue(seed)))))))
}

func computeValue(result *int, seedStart int, seedEnd int, wg *sync.WaitGroup) {
	defer wg.Done()
	for loopSeedValue := seedStart; loopSeedValue < seedEnd; loopSeedValue++ {
		*result = int(math.Min(float64(*result), float64(getLocation(loopSeedValue))))
	}
}

func main() {
	input := basics.GetFileData("./input.txt")
	array := strings.Split(input, "\n\n")
	firstAnswer := math.MaxInt64
	secondAnswer := math.MaxInt64

	seedValues := extractNumberArray(array[0])
	seedToSoilMap = extractSourceDestinationMapper(array[1])            // seed-to-soil
	soilToFertilizerMap = extractSourceDestinationMapper(array[2])      // soil-to-fertilizer
	fertilizerToWaterMap = extractSourceDestinationMapper(array[3])     // fertilizer-to-water
	waterToLightMap = extractSourceDestinationMapper(array[4])          // water-to-light
	lightToTemperatureMap = extractSourceDestinationMapper(array[5])    // light-to-temperature
	temperatureToHumidityMap = extractSourceDestinationMapper(array[6]) // temperature-to-humidity
	humidityToLocationMap = extractSourceDestinationMapper(array[7])    // humidity-to-location

	var wg sync.WaitGroup
	wg.Add(len(seedValues) / 2)

	results := make([]int, len(seedValues)/2)

	for index, seed := range seedValues {
		firstAnswer = int(math.Min(float64(firstAnswer), float64(getLocation(seed))))
		if index%2 == 1 {
			results[index/2] = math.MaxInt64
			go computeValue(&results[index/2], seedValues[index-1], seedValues[index-1]+seed, &wg)
		}
	}

	wg.Wait()

	for _, val := range results {
		secondAnswer = int(math.Min(float64(secondAnswer), float64(val)))
	}

	fmt.Println("The lowest location number that corresponds to any of the initial seed numbers is", firstAnswer)
	fmt.Println("The new lowest location number that corresponds to any of the initial seed numbers is", secondAnswer)
}
