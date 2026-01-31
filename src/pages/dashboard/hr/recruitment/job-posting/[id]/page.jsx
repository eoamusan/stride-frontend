import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyJobRequests } from '../../job-requests';
import { MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import { useParams } from 'react-router';

export default function JobDetails() {
  const { id } = useParams();
  const job = dummyJobRequests.find((job) => job.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Job not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <p className="text-lg text-gray-600">{job.department}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Posted {job.postedDate}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {job.openings} openings
                  </div>
                </div>
              </div>
              <Badge
                variant={
                  job.status === 'Approved'
                    ? 'default'
                    : job.status === 'Pending'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button>Apply Now</Button>
              <Button variant="outline">Save Job</Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-gray-700">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-gray-600">{job.type}</p>
                </div>
                <div>
                  <p className="font-medium">Deadline</p>
                  <p className="text-gray-600">{job.deadline}</p>
                </div>
                <div>
                  <p className="font-medium">Applications</p>
                  <p className="text-gray-600">{job.application}</p>
                </div>
                <div>
                  <p className="font-medium">Requested By</p>
                  <p className="text-gray-600">{job.requestedBy}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Join our innovative team and help build the future. We offer
                  competitive salaries, great benefits, and opportunities for
                  growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
