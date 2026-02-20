import { useState, useRef } from 'react';
import PlusIcon from '@/assets/icons/plus.svg';
import Header from '@/components/customs/header';
import { CustomButton } from '@/components/customs';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import CoursesSection from './components/coursesSection';
import CustomDialog from '@/components/customs/dialog';
import CreateNewCourseModalContent from './components/createNewCourseModalContent';
import ViewCourseDetails from './components/viewCourseDetails';

export default function LearningAndDevelopment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const courseFormRef = useRef(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveDraft = () => {
    if (!courseFormRef.current) return;
    const courseData = courseFormRef.current.getCourseData('draft');
    console.log('Saving draft:', courseData);
    // TODO: Add API call to save draft
    handleCloseModal();
  };

  const handlePublish = () => {
    if (!courseFormRef.current) return;
    const courseData = courseFormRef.current.getCourseData('active');
    console.log('Publishing course:', courseData);
    // TODO: Add API call to publish course
    handleCloseModal();
  };

  if (selectedCourse) {
    return (
      <div className="my-5">
        <ViewCourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onEdit={() => console.log('Edit course:', selectedCourse.id)}
          onDelete={() => console.log('Delete course:', selectedCourse.id)}
        />
      </div>
    );
  }

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Course Catalogue"
        description="Manage and organize courses training programs"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={handleOpenModal}
        >
          <img src={PlusIcon} alt="create new course" className="mr-1" />
          Create New Course
        </CustomButton>
      </Header>

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

      <Card className="mt-2 w-full border-0 shadow-none">
        <CoursesSection onViewCourse={setSelectedCourse} />
      </Card>

      <CustomDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Course"
        description="Create or save new course as draft"
        outlineBtnText="Save as Draft"
        defaultBtnText="Publish Course"
        onOutlineBtnClick={handleSaveDraft}
        onDefaultBtnClick={handlePublish}
      >
        <CreateNewCourseModalContent ref={courseFormRef} />
      </CustomDialog>
    </div>
  );
}

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Total Courses',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Active Courses',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Enrolled Employees',
    value: 4,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Average Completion',
    value: 78,
    percentage: 2,
    chartData: sampleChartData,
  },
];