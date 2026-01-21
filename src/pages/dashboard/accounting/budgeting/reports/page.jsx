import BudgetHeader from '@/components/dashboard/accounting/budgeting/shared/budget-header';
import VarianceCard from '@/components/dashboard/accounting/budgeting/reports/variance-card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartArea, ChartColumn } from 'lucide-react';
import { useEffect, useState } from 'react';
import ColorPicker from '@/components/ui/color-picker';
import AreaMetricCard from '@/components/dashboard/area-metric-card';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import ReportSkeleton from '@/components/dashboard/accounting/budgeting/reports/reports-skeleton';

export default function BudgetingAnalytics() {
  const [isLoading, setIsLoading] = useState(true)
  const [chartType, setChartType] = useState('areaChart')
  const [period, setPeriod] = useState('yearly')
  const [metric, setMetric] = useState('budgetVsActual')

  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const sampleChartData = [
    { date: '2024-01-01', revenue: 10000, expenses: 5000 },
    { date: '2024-02-01', revenue: 9700, expenses: 97000 },
    { date: '2024-03-01', revenue: 1600, expenses: 15000 },
    { date: '2024-04-01', revenue: 24200, expenses: 10000 },
    { date: '2024-05-01', revenue: 37300, expenses: 40000 },
    { date: '2024-06-01', revenue: 30100, expenses: 35000 },
    { date: '2024-07-01', revenue: 245, expenses: 180 },
  ];

  const sampleChartConfig = {
    revenue: {
      label: 'Actual',
      color: '#6FD195',
    },
    expenses: {
      label: 'Budget',
      color: '#7086FD',
    },
  };

useEffect(() => {
  setTimeout(() => {
    setIsLoading(false)
  }, 2000)
}, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <BudgetHeader />
        { isLoading && <div className='mt-10'><ReportSkeleton /></div> }
        { !isLoading && <>
          <div className="relative mt-10 bg-white p-6 rounded-2xl">
            <h3 className='mb-4 font-medium text-xl'>Variance Alerts</h3>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-2'>
              <VarianceCard title="Marketing Budget Overrun" description="6.25% over budget ($50K excess)" className="bg-[#830000]/10  text-[#830000]" />
              <VarianceCard title="HR Budget On Track" description="2.22% under budget, excellent performance" className="bg-[#254C00]/10  text-[#254C00]"  />
              <VarianceCard title="Sales Budget Warning" description="Approaching 90% of budget limit" className="bg-[#FFAE4C]/10  text-[#FFAE4C]"  />
            </div>
          </div>
          { chartType === 'areaChart' && <AreaMetricCard
            className={'h-full w-full mt-10'}
            title={'Budget Vs-Actual - Bar Chart'}
            description={'Monthly comparison over the past year'}
            chartData={sampleChartData}
            chartConfig={sampleChartConfig}
          /> }
          { chartType === 'barChart' && <BarChartOverview
              title="Budget Vs-Actual - Bar Chart"
              description={'Monthly comparison over the past year'}
              chartConfig={sampleChartConfig}
              chartData={sampleChartData}
              numberOfBars={2}
              showLegend={true}
              className={'h-full w-full mt-10'}
            /> }
          <div className="relative mt-10 bg-white p-6 rounded-2xl">
            <h3 className='mb-4 font-medium text-xl'>Budget Analytics & Visualization</h3>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
              <div className='w-full flex flex-col gap-2 [&>span]:font-medium'>
                <span>Chart Type</span>
                <Select defaultValue={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="barChart"><ChartColumn /> Bar Chart</SelectItem>
                      <SelectItem value="areaChart"><ChartArea /> Area Chart</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='w-full flex flex-col gap-2 [&>span]:font-medium'>
                <span>Period</span>
                <Select defaultValue={period}  onValueChange={setPeriod}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Period</SelectLabel>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='w-full flex flex-col gap-2 [&>span]:font-medium'>
                <span>Metric</span>
                <Select defaultValue={metric} onValueChange={setMetric}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="budgetVsActual">Budget vs Actual</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='w-full flex flex-col gap-2 [&>span]:font-medium'>
                <span>Color scheme</span>
                <ColorPicker
                  showTitle={false}
                  selectedColor={selectedColor}
                  onColorChange={(color) => {
                    setSelectedColor(color);
                  }}
                />
              </div>
            </div>
          </div>
        </> }
      </>
    </div>
  );
}
