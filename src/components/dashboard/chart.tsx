'use client';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
} from 'victory';

export function Chart() {
  const data = [
    { habit: 'Test', responseRate: 0.5 },
    { habit: 'Test 1', responseRate: 0.8 },
    { habit: 'Test 2', responseRate: 0.9 },
    { habit: 'Test 5', responseRate: 0.5 },
    { habit: 'Test 3', responseRate: 1 },
    { habit: 'Test 8', responseRate: 1 },
    { habit: 'Test 7', responseRate: 0.9 },
    { habit: ' Test 6 ', responseRate: 0.8 },
  ];

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={5}
      width={300}
      height={300}
    >
      <VictoryAxis
        tickLabelComponent={
          <VictoryLabel angle={60} dy={-5} textAnchor={'start'} />
        }
      />
      <VictoryAxis dependentAxis tickFormat={(x) => `${x * 100}%`} />
      {/* <VictoryBar data={data} x='habit' y='responseRate' /> */}
      <VictoryScatter data={data} x='habit' y='responseRate' />
    </VictoryChart>
  );
}
