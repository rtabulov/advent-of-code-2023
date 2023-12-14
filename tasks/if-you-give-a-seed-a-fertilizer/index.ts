import { join } from 'node:path';

export async function fertilizerWithInput() {
  const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
  return ifYouGiveASeedAFertilizer(input);
}

export function ifYouGiveASeedAFertilizer(input: string) {
  const { seeds, ...res } = parseInput(input);
  // const locations = res.seeds
  //   .map(res.seedToSoilMap)
  //   .map(res.soilToFertilizerMap)
  //   .map(res.fertilizerToWaterMap)
  //   .map(res.waterToLightMap)
  //   .map(res.lightToTemperatureMap)
  //   .map(res.temperatureToHumidityMap)
  //   .map(res.humidityToLocationMap);
  // return Math.min(...locations);
  // return res.seeds;
  let min = Infinity;

  for (let i = 0; i < seeds.length; i += 2) {
    const seed = seeds[i];
    const offset = seeds[i + 1];
    for (let currentSeed = seed; currentSeed < seed + offset; currentSeed++) {
      let temp = currentSeed;

      temp = res.seedToSoilMap(temp);
      temp = res.soilToFertilizerMap(temp);
      temp = res.fertilizerToWaterMap(temp);
      temp = res.waterToLightMap(temp);
      temp = res.lightToTemperatureMap(temp);
      temp = res.temperatureToHumidityMap(temp);
      temp = res.humidityToLocationMap(temp);

      if (temp < min) {
        min = temp;
      }
    }
  }
  return min;
}

function parseInput(input: string) {
  const lines = input.split('\n');
  const [_, seedsRaw] = lines[0].split(': ');
  const seeds = seedsRaw.split(' ').map(Number);

  const seedToSoilMapIdx = lines.indexOf('seed-to-soil map:') + 1;
  const soilToFertilizerMapIdx = lines.indexOf('soil-to-fertilizer map:') + 1;
  const fertilizerToWaterMapIdx = lines.indexOf('fertilizer-to-water map:') + 1;
  const waterToLightMapIdx = lines.indexOf('water-to-light map:') + 1;
  const lightToTemperatureMapIdx =
    lines.indexOf('light-to-temperature map:') + 1;
  const temperatureToHumidityMapIdx =
    lines.indexOf('temperature-to-humidity map:') + 1;
  const humidityToLocationMapIdx =
    lines.indexOf('humidity-to-location map:') + 1;

  return {
    seeds,
    seedToSoilMap: parseMap(
      lines.slice(seedToSoilMapIdx, soilToFertilizerMapIdx - 2),
    ),
    soilToFertilizerMap: parseMap(
      lines.slice(soilToFertilizerMapIdx, fertilizerToWaterMapIdx - 2),
    ),
    fertilizerToWaterMap: parseMap(
      lines.slice(fertilizerToWaterMapIdx, waterToLightMapIdx - 2),
    ),
    waterToLightMap: parseMap(
      lines.slice(waterToLightMapIdx, lightToTemperatureMapIdx - 2),
    ),
    lightToTemperatureMap: parseMap(
      lines.slice(lightToTemperatureMapIdx, temperatureToHumidityMapIdx - 2),
    ),
    temperatureToHumidityMap: parseMap(
      lines.slice(temperatureToHumidityMapIdx, humidityToLocationMapIdx - 2),
    ),
    humidityToLocationMap: parseMap(lines.slice(humidityToLocationMapIdx)),
  };
}

function parseMap(map: string[]) {
  const ranges = map.map((str) => str.split(' ').map(Number));

  return (num: number) => {
    for (let i = 0; i < ranges.length; i++) {
      const [destStart, sourceStart, len] = ranges[i];
      if (num >= sourceStart && num < sourceStart + len) {
        return destStart - sourceStart + num;
      }
    }

    return num;
  };
}
