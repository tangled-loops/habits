'use client';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
} from 'victory';

interface ResponseTimeChartOpts {
  data: {
    habit?: string;
    respondedAt: number;
  }[];
}

export function ResponseTimeChart({ data }: ResponseTimeChartOpts) {
  return (
    <div className='z-50'>
      <VictoryChart
        theme={{
          scatter: {
            style: {
              data: {},
              labels: { fontSize: 7 },
            },
          },
          ...VictoryTheme.material,
        }}
        domainPadding={8}
        width={300}
        height={300}
      >
        <VictoryAxis
          tickLabelComponent={
            <VictoryLabel angle={10} dy={-5} textAnchor={'start'} />
          }
        />
        <VictoryAxis
          dependentAxis
          tickValues={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23.99]}
          tickFormat={(value) =>
            new Date(new Date(new Date().setHours(value)).setMinutes(0))
              .toLocaleTimeString('en-US', {
                hourCycle: 'h12',
              })
              .split(' ')
              .reduce((n: string[], p, i) => {
                if (i === 0) {
                  const time = p.split(':');
                  const nosec = `${time[0]}:${time[1]}`;
                  n.push(nosec);
                  return n;
                }
                n.push(p);
                return n;
              }, [])
              .join(' ')
          }
          tickLabelComponent={
            <VictoryLabel angle={15} dx={-13} textAnchor={'middle'} />
          }
        />
        <VictoryScatter data={data} x='habit' y='respondedAt' />
      </VictoryChart>
    </div>
  );
}
