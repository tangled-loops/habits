'use client';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
} from 'victory';

interface ResponseRateChartOpts {
  data: {
    habit: string;
    responseRate: number;
  }[];
}

export function ResponseRateChart({ data }: ResponseRateChartOpts) {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={8}
      width={300}
      height={300}
    >
      <VictoryAxis
        tickLabelComponent={
          <VictoryLabel angle={10} dy={-5} textAnchor={'start'} />
        }
      />
      <VictoryAxis dependentAxis tickFormat={(x) => `${x * 100}%`} />
      <VictoryScatter data={data} x='habit' y='responseRate' />
    </VictoryChart>
  );
}
