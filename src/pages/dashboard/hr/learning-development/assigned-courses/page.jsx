import { useState } from 'react';

import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import CoursesSection from './components/assignedCourseSection';
import CourseDetails from './components/courseDetails';

const AssignedCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (selectedCourse) {
    return (
      <CourseDetails
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Assigned Courses"
        description="Stay on track with courses assigned to support your growth."
      ></Header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <Card>
        <CoursesSection onSelectCourse={setSelectedCourse} />
      </Card>
    </div>
  );
};

export default AssignedCourses;

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Assigned Courses',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'In Progress',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Completed',
    value: 40,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Expiring Soon',
    value: 16,
    percentage: 2,
    chartData: sampleChartData,
  },
];
