import React, { useState } from 'react';
import { DialogTitle, Dialog, DialogContent, DialogHeader, DialogFooter } from './ui/dialog.jsx';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Switch } from './ui/switch.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant.js';
import { setUser } from '@/redux/authSlice.js';
const UpdateProfileDialogue = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [isUserForm, setIsUserForm] = useState(true);
  const [studentInput, setStudentInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    file: null,
  });
  const [companyInput, setCompanyInput] = useState({
    name: user?.company?.name || '',
    description: user?.company?.description || '',
    location: user?.company?.location || '',
    industry: user?.company?.industry || '',
    size: user?.company?.size || '',
    website: user?.company?.website || '',
    logo: null,
  });
  const handleStudentChange = (e) =>
    setStudentInput({ ...studentInput, [e.target.name]: e.target.value });
  const handleCompanyChange = (e) =>
    setCompanyInput({ ...companyInput, [e.target.name]: e.target.value });
  const handleFileChange = (e, type) => {
    if (type === 'resume') setStudentInput({ ...studentInput, file: e.target.files[0] });
    else if (type === 'logo') setCompanyInput({ ...companyInput, logo: e.target.files[0] });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isUserForm) {
        const formData = new FormData();
        Object.entries(studentInput).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        const res = await axios.put(`${USER_API_END_POINT}/profile/update`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          toast.success('User profile updated successfully');
          setOpen(false);
        }
      } else {
        const formData = new FormData();
        Object.entries(companyInput).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        const res = await axios.put(`${COMPANY_API_END_POINT}/update/${user?.company?._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success('Company updated successfully');
          setOpen(false);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isUserForm ? 'Update User Profile' : 'Update Company Profile'}</DialogTitle>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isUserForm ? 'font-semibold' : ''}`}>User</span>
              <Switch
                checked={!isUserForm}
                onCheckedChange={(val) => setIsUserForm(!val ? true : false)}
              />
              <span className={`text-sm ${!isUserForm ? 'font-semibold' : ''}`}>Company</span>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">
            {}
            {isUserForm && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullname" className="text-right">Name</Label>
                  <Input
                    id="fullname"
                    name="fullname"
                    value={studentInput.fullname}
                    onChange={handleStudentChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={studentInput.email}
                    onChange={handleStudentChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">Phone</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={studentInput.phoneNumber}
                    onChange={handleStudentChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bio" className="text-right">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={studentInput.bio}
                    onChange={handleStudentChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="skills" className="text-right">Skills</Label>
                  <Input
                    id="skills"
                    name="skills"
                    value={studentInput.skills}
                    onChange={handleStudentChange}
                    placeholder="e.g. React, Node, MongoDB"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">Resume</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'resume')}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
            {}
            {!isUserForm && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={companyInput.name}
                    onChange={handleCompanyChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={companyInput.description}
                    onChange={handleCompanyChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={companyInput.location}
                    onChange={handleCompanyChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="industry" className="text-right">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={companyInput.industry}
                    onChange={handleCompanyChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="size" className="text-right">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={companyInput.size}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 50 employees"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={companyInput.website}
                    onChange={handleCompanyChange}
                    placeholder="https://yourcompany.com"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="logo" className="text-right">Logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="col-span-3"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateProfileDialogue;
