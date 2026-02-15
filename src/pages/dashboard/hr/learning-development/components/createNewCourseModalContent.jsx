import { useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import CourseOverview from './courseOverview';
import CourseContent from './courseContent';
import CourseSettings from './courseSettings';

const moduleTypeEnum = z.enum([
  'reading-material',
  'video-lessons',
  'interactive-quiz',
  'assignment',
]);

const courseCategoryEnum = z.enum([
  'technical-skills',
  'soft-skills',
  'compliance',
  'leadership',
  'management',
]);

const courseFormatEnum = z.enum(['online', 'in-person', 'hybrid']);

const createNewCourseSchema = z.object({
  title: z.string().trim().min(1, 'Course title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  category: courseCategoryEnum,
  format: courseFormatEnum,
  thumbnail: z.any().nullable().optional(),
  modules: z
    .array(
      z.object({
        type: moduleTypeEnum,
        title: z.string().trim().min(1, 'Module title is required'),
        description: z.string().optional(),
        duration: z.string().trim().min(1, 'Duration is required'),
        order: z.coerce
          .number({ invalid_type_error: 'Order must be a number' })
          .int('Order must be a whole number')
          .min(1, 'Order must be at least 1'),
        file: z.any().nullable().optional(),
      })
    )
    .min(1, 'Add at least one module'),
  settings: z.object({
    isMandatory: z.boolean().default(false),
    issueCertificate: z.boolean().default(false),
  }),
});

const CreateNewCourseModalContent = forwardRef((props, ref) => {
  const form = useForm({
    resolver: zodResolver(createNewCourseSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'technical-skills',
      format: 'online',
      thumbnail: null,
      modules: [
        {
          type: 'reading-material',
          title: '',
          description: '',
          duration: '',
          order: 1,
          file: null,
        },
      ],
      settings: {
        isMandatory: false,
        issueCertificate: false,
      },
    },
    mode: 'onTouched',
  });

  // Expose method to get course data
  useImperativeHandle(ref, () => ({
    getCourseData: async (status = 'draft') => {
      const isValid = await form.trigger();
      if (!isValid) return null;

      const values = createNewCourseSchema.parse(form.getValues());
      return { ...values, status };
    },
  }));

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <CourseOverview />
        <CourseContent />
        <CourseSettings />
      </form>
    </Form>
  );
});

CreateNewCourseModalContent.displayName = 'CreateNewCourseModalContent';

export default CreateNewCourseModalContent;
