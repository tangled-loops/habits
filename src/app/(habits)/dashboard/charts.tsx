'use client';

import { useState } from 'react';

import { ResponseRateChart } from '@/components/dashboard/response-rate-chart';
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Charts({
  byResponseRateData,
  byResponseTimeData,
}: {
  byResponseRateData: {
    habit: string;
    responseRate: number;
  }[];
  byResponseTimeData: {
    habit: string;
    respondedAt: Date;
  }[];
}) {
  const [value, setValue] = useState('responseRate');
  const chart = () => {
    switch (value) {
      case 'responseRate':
        return <ResponseRateChart data={byResponseRateData} />;
      case 'responseTime':
        return <ResponseTimeChart data={byResponseTimeData} />;
    }
  };
  return (
    <div className='grid gap-4 rounded-lg border shadow-sm md:grid-cols-3'>
      <div className='col-span-3 md:col-span-1'>
        <div className='w-full'>
          <h1 className='p-4 text-lg font-semibold md:text-center'>
            Chart Options
          </h1>
        </div>
        <h2 className='mb-2 ml-4'>Chart Selection</h2>
        <Select defaultValue='responseRate' onValueChange={setValue}>
          <SelectTrigger className='ml-4 w-[80%]'>
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'responseRate'}>Response Rate</SelectItem>
            <SelectItem value={'responseTime'}>Response Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='col-span-2'>{chart()}</div>
    </div>
  );
}
