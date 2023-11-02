'use client';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryScatter,
  VictoryTheme,
} from 'victory';

export function ResponseTimeChart() {
  const data = [
    {
      habit: 'Test',
      respondedAt: new Date('10/31/2023 00:00'),
    },
    {
      habit: 'Test',
      respondedAt: new Date('10/31/2023 01:00'),
    },
    {
      habit: 'Test',
      respondedAt: new Date('10/31/2023 14:00'),
    },
    {
      habit: 'Test 1',
      respondedAt: new Date('10/31/2023 06:00'),
    },
    {
      habit: 'Test 2',
      respondedAt: new Date('10/31/2023 16:00'),
    },
    {
      habit: 'Test 5',
      respondedAt: new Date('10/31/2023 12:00'),
    },
    {
      habit: 'Test 3',
      respondedAt: new Date('10/31/2023 02:00'),
    },
    {
      habit: 'Test 8',
      respondedAt: new Date('10/31/2023 02:00'),
    },
    {
      habit: 'Test 7',
      respondedAt: new Date('10/31/2023 08:00'),
    },
    {
      habit: ' Test 6 ',
      respondedAt: new Date('10/31/2023 06:00'),
    },
  ];

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={0}
      width={500}
      height={400}
    >
      <VictoryAxis
        tickLabelComponent={
          <VictoryLabel angle={60} dy={-5} textAnchor={'start'} />
        }
      />
      <VictoryAxis
        dependentAxis
        tickValues={[
          new Date('10/31/2023 00:00'),
          new Date('10/31/2023 02:00'),
          new Date('10/31/2023 04:00'),
          new Date('10/31/2023 06:00'),
          new Date('10/31/2023 08:00'),
          new Date('10/31/2023 10:00'),
          new Date('10/31/2023 12:00'),
          new Date('10/31/2023 14:00'),
          new Date('10/31/2023 16:00'),
          new Date('10/31/2023 18:00'),
          new Date('10/31/2023 20:00'),
          new Date('10/31/2023 22:00'),
          new Date('10/31/2023 23:59'),
        ]}
        tickFormat={(x) =>
          new Date(x)
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
  );
}
