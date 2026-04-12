import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Globe } from 'lucide-react';
import { Badge } from './ui/badge.jsx';
import { Label } from './ui/label.jsx';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialogue from './UpdateProfileDialogue';
import { useSelector } from 'react-redux';
import useGetAllAppliedJobs from '@/hooks/useGetAllAppliedJobs';
import useGetAllSavedJobs from '@/hooks/useGetAllSavedJobs';
import SavedJobTable from './SavedJobTable';
const Profile = () => {
  useGetAllAppliedJobs();
  useGetAllSavedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { companies } = useSelector((store) => store.company);
  const isStudent = user?.role === 'student';
  const isRecruiter = user?.role === 'recruiter';
  const recruiterCompanies =
    isRecruiter && companies?.filter((company) => company.userId === user?._id);
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl text-gray-500 mx-44 font-bold my-5">
        {isStudent ? 'Student Profile /' : 'Recruiter Profile /'}
      </h1>
      {}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex flex-col gap-4">
            {}
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  className="w-20 h-20 rounded-full object-cover"
                  src={user?.profile?.profilePhoto || '/default-user.png'}
                  alt="profile"
                />
              </Avatar>
              <h1 className="font-medium text-3xl">
                {user?.fullname ||
                  (isRecruiter ? 'Recruiter Name' : 'Student Name')}
              </h1>
            </div>
            {}
            <p className="text-gray-600">
              {user?.profile?.bio ||
                (isRecruiter
                  ? 'Recruiter bio not added.'
                  : 'Student bio not added.')}
            </p>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            <Pen />
          </Button>
        </div>
        {}
        {isRecruiter && (
          <div className="my-5 border-t pt-5 border-gray-200">
            <h1 className="font-semibold text-lg text-gray-700 mb-2">
              Recruiter Contact Info
            </h1>
            <div className="flex items-center gap-3 my-2">
              <Mail />
              <span>{user?.email}</span>
            </div>
            {user?.phoneNumber && (
              <div className="flex items-center gap-3 my-2">
                <Contact />
                <span>{user?.phoneNumber}</span>
              </div>
            )}
          </div>
        )}
        {}
        {isRecruiter && (
          <div className="my-5 border-t pt-5 border-gray-200">
            <h1 className="font-semibold text-[#7209B7] text-xl mb-4">
              Your Companies
            </h1>
            {recruiterCompanies?.length > 0 ? (
              <div className="space-y-8">
                {recruiterCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    {}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar>
                        <AvatarImage
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          src={company.logo || '/default-company.png'}
                          alt="company logo"
                        />
                      </Avatar>
                      <div className="flex flex-col w-full">
                        <h2 className="font-semibold text-2xl text-gray-800">
                          {company.name || 'No company name'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {company.description ||
                            'No company description available'}
                        </p>
                      </div>
                    </div>
                    {}
                    {company.website && (
                      <div className="flex items-center gap-3 my-2">
                        <Globe />
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    {}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700">
                      <p>
                        <strong>Location:</strong>{' '}
                        {company.location || 'Not specified'}
                      </p>
                      <p>
                        <strong>Industry:</strong>{' '}
                        {company.industry || 'Not specified'}
                      </p>
                      <p>
                        <strong>Size:</strong>{' '}
                        {company.size
                          ? `${company.size} employees`
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No companies created yet. Please create one from the dashboard.
              </p>
            )}
          </div>
        )}
        {}
        {isStudent && (
          <>
            {}
            <div className="my-5 border-t pt-5 border-gray-200">
              <h1 className="font-semibold text-lg text-gray-700 mb-2">
                Contact Info
              </h1>
              <div className="flex items-center gap-3 my-2">
                <Mail />
                <span>{user?.email}</span>
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center gap-3 my-2">
                  <Contact />
                  <span>{user?.phoneNumber}</span>
                </div>
              )}
            </div>
            {}
            <div className="my-5 border-t pt-5 border-gray-200">
              <h1 className="my-2 font-semibold">Skills</h1>
              <div className="flex flex-wrap gap-2">
                {user?.profile?.skills?.length ? (
                  user.profile.skills.map((item, index) => (
                    <Badge key={index}>{item}</Badge>
                  ))
                ) : (
                  <span>N.A</span>
                )}
              </div>
            </div>
            {}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="text-md font-bold">Resume</Label>
              {user?.profile?.resume ? (
                <a
                  target="_blank"
                  href={user.profile.resume}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  {user.profile.resumeOriginalName}
                </a>
              ) : (
                <span>N.A</span>
              )}
            </div>
          </>
        )}
      </div>
      {}
      {isStudent && (
        <>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl">
            <h1 className="my-5 font-bold text-[#7209B7] text-lg">
              All Applied Jobs:
            </h1>
            <AppliedJobTable />
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl">
            <h1 className="my-5 font-bold text-green-600 text-lg">
              All Saved Jobs:
            </h1>
            <SavedJobTable />
          </div>
        </>
      )}
      <UpdateProfileDialogue open={open} setOpen={setOpen} />
    </div>
  );
};
export default Profile;
