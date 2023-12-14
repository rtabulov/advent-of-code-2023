import { join } from 'path';

export async function waitForItWithInput() {
  const input = await Bun.file(join(import.meta.dir, 'input.txt')).text();
  return waitForIt(input);
}

function waitForIt(input: string) {
  const { times, records } = parseInput(input);

  let multiple = 1;

  times.forEach((time, idx) => {
    const record = records[idx];
    const minWaitTime = getMinWaitTime(time, record);
    const maxWaitTime = getMaxWaitTime(time, record);
    const totalPossibleTimes = 1 + maxWaitTime - minWaitTime;
    multiple *= totalPossibleTimes;
    console.log({ totalPossibleTimes, minWaitTime, maxWaitTime, time, record });
  });

  return multiple;
}

function getMinWaitTime(time: number, record: number) {
  for (let waitTime = 1; waitTime < time; waitTime++) {
    const timeToRace = time - waitTime;
    const speed = waitTime * 1;
    const distance = timeToRace * speed;
    if (distance > record) {
      return waitTime;
    }
  }
  throw new Error(`Unbeatable time ${time}ms, record ${record}mm`);
}

function getMaxWaitTime(time: number, record: number) {
  for (let waitTime = time - 1; waitTime > 0; waitTime--) {
    const timeToRace = time - waitTime;
    const speed = waitTime * 1;
    const distance = timeToRace * speed;
    if (distance > record) {
      return waitTime;
    }
  }
  throw new Error(`Unbeatable time ${time}ms, record ${record}mm`);
}

function parseInput(input: string) {
  const [timesRaw, recordsRaw] = input.split('\n');

  return {
    times: [Number(timesRaw.match(/\d+/g)!.reduce((a, b) => a + b, ''))],
    records: [Number(recordsRaw.match(/\d+/g)!.reduce((a, b) => a + b, ''))],
  };
}
