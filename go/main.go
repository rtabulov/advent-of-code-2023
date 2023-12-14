package main

import (
	"math"
	"os"
	"slices"
	"strconv"
	"strings"
)

func main() {
	dat, err := os.ReadFile("./input.txt")
	if err != nil {
		panic(err)
	}
	res := ifYouGiveASeedAFertilizer(string(dat))
	println(res)
}

func ifYouGiveASeedAFertilizer(input string) int {
	res := parseInput(input)

	min := math.MaxInt32

	for i := 0; i < len(res.seeds); i += 2 {
		seed := res.seeds[i]
		offset := res.seeds[i+1]
		for currentSeed := seed; currentSeed < seed+offset; currentSeed++ {
			temp := currentSeed

			temp = res.seedToSoilMap(temp)
			temp = res.soilToFertilizerMap(temp)
			temp = res.fertilizerToWaterMap(temp)
			temp = res.waterToLightMap(temp)
			temp = res.lightToTemperatureMap(temp)
			temp = res.temperatureToHumidityMap(temp)
			temp = res.humidityToLocationMap(temp)

			if temp < min {
				min = temp
			}
		}
	}
	return min
}

func parseInput(input string) ParsedInput {
	lines := strings.Split(input, "\n")
	seedsRaw := strings.Split(lines[0], ": ")[1]
	seeds := mapToInt(strings.Split(seedsRaw, " "))

	seedToSoilMapIdx := slices.Index(lines, "seed-to-soil map:") + 1
	soilToFertilizerMapIdx := slices.Index(lines, "soil-to-fertilizer map:") + 1
	fertilizerToWaterMapIdx := slices.Index(lines, "fertilizer-to-water map:") + 1
	waterToLightMapIdx := slices.Index(lines, "water-to-light map:") + 1
	lightToTemperatureMapIdx := slices.Index(lines, "light-to-temperature map:") + 1
	temperatureToHumidityMapIdx := slices.Index(lines, "temperature-to-humidity map:") + 1
	humidityToLocationMapIdx := slices.Index(lines, "humidity-to-location map:") + 1
	return ParsedInput{
		seeds: seeds,
		seedToSoilMap: parseMap(
			lines[seedToSoilMapIdx : soilToFertilizerMapIdx-2],
		),
		soilToFertilizerMap: parseMap(
			lines[soilToFertilizerMapIdx : fertilizerToWaterMapIdx-2],
		),
		fertilizerToWaterMap: parseMap(
			lines[fertilizerToWaterMapIdx : waterToLightMapIdx-2],
		),
		waterToLightMap: parseMap(
			lines[waterToLightMapIdx : lightToTemperatureMapIdx-2],
		),
		lightToTemperatureMap: parseMap(
			lines[lightToTemperatureMapIdx : temperatureToHumidityMapIdx-2],
		),
		temperatureToHumidityMap: parseMap(
			lines[temperatureToHumidityMapIdx : humidityToLocationMapIdx-2],
		),
		humidityToLocationMap: parseMap(
			lines[humidityToLocationMapIdx:],
		),
	}
}

func parseMap(mapInput []string) func(n int) int {
	// const ranges = mapInput.map((str) => str.split(' ').map(Number));
	ranges := Map(mapInput, func(slc string) []int {
		nums := strings.Split(slc, " ")
		return Map(nums, atoi)
	})

	return func(num int) int {
		for i := 0; i < len(ranges); i++ {
			asd := ranges[i]
			destStart := asd[0]
			sourceStart := asd[1]
			length := asd[2]

			if num >= sourceStart && num < sourceStart+length {
				return destStart - sourceStart + num
			}
		}

		return num
	}
}

func mapToInt(strs []string) []int {
	res := make([]int, len(strs))
	for i, str := range strs {
		res[i], _ = strconv.Atoi(str)
	}
	return res
}

func atoi(str string) int {
	res, _ := strconv.Atoi(str)
	return res
}

func Map[T, U any](ts []T, f func(T) U) []U {
	us := make([]U, len(ts))
	for i := range ts {
		us[i] = f(ts[i])
	}
	return us
}

type ParsedInput struct {
	seeds                    []int
	seedToSoilMap            func(n int) int
	soilToFertilizerMap      func(n int) int
	fertilizerToWaterMap     func(n int) int
	waterToLightMap          func(n int) int
	lightToTemperatureMap    func(n int) int
	temperatureToHumidityMap func(n int) int
	humidityToLocationMap    func(n int) int
}
