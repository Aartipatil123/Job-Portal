import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/input.jsx';
import { Button } from '../ui/button.jsx';
import { Loader2 } from 'lucide-react';
import { RadioGroup } from '../ui/radio-group.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant.js';
import { setLoading, setUser } from '@/redux/authSlice.js';
const LoginForm = ({ input, changeEventHandler, handleLogin, loading, onFlip }) => (
  <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-2xl p-6 sm:p-8 border-t-4 border-t-[#7209B7] flex flex-col justify-center">
    <h1 className='font-extrabold text-3xl mb-7 text-center text-[#7209B7]'>Login</h1>
    <form onSubmit={handleLogin} className="w-full">
      <div className='my-4'>
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          name="email"
          value={input.email}
          onChange={changeEventHandler}
          placeholder="Enter your email address"
          required
        />
      </div>
      <div className='my-4'>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          name="password"
          value={input.password}
          onChange={changeEventHandler}
          placeholder="Enter your password"
          required
        />
      </div>
      {loading ? (
        <Button className="w-full my-6 bg-[#7209B7]" disabled>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
        </Button>
      ) : (
        <Button type="submit" className="w-full my-6 bg-[#7209B7] hover:bg-[#5a079c] transition-colors duration-200">
          Login
        </Button>
      )}
    </form>
    <p className='text-sm text-center mt-6'>
      Don’t have an account?{' '}
      <button type="button" onClick={() => onFlip('signup')} className="text-[#7209B7] font-semibold hover:underline">
        Signup
      </button>
    </p>
  </div>
);
const SignupForm = ({ input, setInput, submitHandler, loading, onFlip }) => {
  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });
  const changeFileHandler = (e) => setInput({ ...input, file: e.target.files[0] });
  return (
    <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-2xl p-6 sm:p-8 border-t-4 border-t-[#7209B7] transform rotate-y-180">
      <h1 className='font-extrabold text-3xl mb-3 text-center text-[#7209B7]'>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className='grid grid-cols-2 gap-x-4 gap-y-4'>
          <div className='col-span-2 sm:col-span-1'>
            <Label htmlFor="fullname">Full Name</Label>
            <Input type="text" id="fullname" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="Full Name" required />
          </div>
          <div className='col-span-2 sm:col-span-1'>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" required />
          </div>
          <div className='col-span-2 sm:col-span-1'>
            <Label htmlFor="phoneNumber">Contact</Label>
            <Input type="text" id="phoneNumber" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="Contact Number" required />
          </div>
          <div className='col-span-2 sm:col-span-1'>
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Password" required />
          </div>
        </div>
        <div className='flex flex-col sm:flex-row items-start justify-between mt-6 mb-6'>
          <div className='flex flex-col gap-2'>
            <Label className="font-medium text-sm">Select Role</Label>
            <RadioGroup defaultValue="student" className="flex flex-col items-start gap-2">
              {['student', 'recruiter'].map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${role}-role`}
                    name="role"
                    value={role}
                    checked={input.role === role}
                    onChange={changeEventHandler}
                    className="cursor-pointer h-4 w-4 text-[#7209B7] border-gray-300 focus:ring-[#7209B7]"
                    required
                  />
                  <Label htmlFor={`${role}-role`} className="font-normal capitalize">{role}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className='flex flex-col gap-2 mt-4 sm:mt-0'>
            <Label>Profile Picture</Label>
            <Input accept="image}
          <div className='hidden lg:flex lg:w-1/2 bg-[#7209B7] p-8 flex-col justify-center items-center text-center'>
            <h2 className='text-white text-4xl font-extrabold'>Join Our Community</h2>
            <p className='text-white text-lg mt-4'>
              Find your dream job or the perfect candidate today!
            </p>
          </div>
          {}
          <div className='w-full lg:w-1/2 flex items-center justify-center p-0 sm:p-4'>
            <div className="relative w-full max-w-md h-full perspective-1000">
              <div className={`absolute w-full h-full transition-transform duration-700 ease-in-out preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <LoginForm
                  input={input}
                  changeEventHandler={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                  handleLogin={handleLogin}
                  loading={loading}
                  onFlip={handleFlip}
                />
                <SignupForm
                  input={input}
                  setInput={setInput}
                  submitHandler={submitHandler}
                  loading={loading}
                  onFlip={handleFlip}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
