'use client';

import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from 'victory';

export function ResponseRateChart() {
  const data = [
    {
      habit: 'Test',
      responseRate: 0.45,
    },
    {
      habit: 'Test 1',
      responseRate: 0.25,
    },
    {
      habit: 'Test 2',
      responseRate: 0.67,
    },
    {
      habit: 'Test 5',
      responseRate: 0.0,
    },
    {
      habit: 'Test 3',
      responseRate: 0.3,
    },
    {
      habit: 'Test 8',
      responseRate: 0.75,
    },
    {
      habit: 'Test 7',
      responseRate: 0.15,
    },
    {
      habit: ' Test 6 ',
      responseRate: 0.25,
    },
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
      <VictoryBar data={data} x='habit' y='responseRate' />
      {/* <VictoryScatter data={data} x='habit' y='responseRate' /> */}
    </VictoryChart>
  );
}
