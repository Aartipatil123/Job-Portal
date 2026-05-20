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

const LoginForm = ({
  input,
  changeEventHandler,
  handleLogin,
  loading,
  onFlip
}) => (
  <div className="w-full bg-white rounded-lg shadow-2xl p-6 sm:p-8 border-t-4 border-t-[#7209B7]">

    <h1 className='font-extrabold text-3xl mb-7 text-center text-[#7209B7]'>
      Login
    </h1>

    <form onSubmit={handleLogin} className="w-full">

      <div className='my-4'>
        <Label>Email</Label>

        <Input
          type="email"
          name="email"
          value={input.email}
          onChange={changeEventHandler}
          placeholder="Enter your email address"
          required
        />
      </div>

      <div className='my-4'>
        <Label>Password</Label>

        <Input
          type="password"
          name="password"
          value={input.password}
          onChange={changeEventHandler}
          placeholder="Enter your password"
          required
        />
      </div>

      {
        loading ? (
          <Button className="w-full my-6 bg-[#7209B7]" disabled>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full my-6 bg-[#7209B7] hover:bg-[#5a079c]"
          >
            Login
          </Button>
        )
      }

    </form>

    <p className='text-sm text-center mt-6'>
      Don’t have an account?{' '}

      <button
        type="button"
        onClick={() => onFlip('signup')}
        className="text-[#7209B7] font-semibold hover:underline"
      >
        Signup
      </button>
    </p>

  </div>
);

const SignupForm = ({
  input,
  setInput,
  submitHandler,
  loading,
  onFlip
}) => {

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files[0]
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-2xl p-6 sm:p-8 border-t-4 border-t-[#7209B7]">

      <h1 className='font-extrabold text-3xl mb-4 text-center text-[#7209B7]'>
        Sign Up
      </h1>

      <form onSubmit={submitHandler}>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

          <div>
            <Label>Full Name</Label>

            <Input
              type="text"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              placeholder="Full Name"
              required
            />
          </div>

          <div>
            <Label>Email</Label>

            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Email"
              required
            />
          </div>

          <div>
            <Label>Phone Number</Label>

            <Input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="Phone Number"
              required
            />
          </div>

          <div>
            <Label>Password</Label>

            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="Password"
              required
            />
          </div>

        </div>

        <div className='mt-5'>

          <Label>Select Role</Label>

          <RadioGroup
            defaultValue="student"
            className="flex gap-6 mt-2"
          >

            {
              ['student', 'recruiter'].map((role) => (
                <div
                  key={role}
                  className="flex items-center space-x-2"
                >

                  <input
                    type="radio"
                    id={role}
                    name="role"
                    value={role}
                    checked={input.role === role}
                    onChange={changeEventHandler}
                    className="cursor-pointer"
                    required
                  />

                  <Label htmlFor={role}>
                    {role}
                  </Label>

                </div>
              ))
            }

          </RadioGroup>

        </div>

        <div className='mt-5'>

          <Label>Profile Picture</Label>

          <Input
            accept="image/*"
            type="file"
            onChange={changeFileHandler}
            className="cursor-pointer"
          />

        </div>

        {
          loading ? (
            <Button
              className="w-full mt-6 bg-[#7209B7]"
              disabled
            >
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full mt-6 bg-[#7209B7] hover:bg-[#5a079c]"
            >
              Signup
            </Button>
          )
        }

      </form>

      <p className='text-sm text-center mt-6'>

        Already have an account?{' '}

        <button
          type="button"
          onClick={() => onFlip('login')}
          className="text-[#7209B7] font-semibold hover:underline"
        >
          Login
        </button>

      </p>

    </div>
  );
};

const Login = () => {

  const [isSignup, setIsSignup] = useState(false);

  const [input, setInput] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'student',
    file: null
  });

  const { loading, user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFlip = (form) => {
    setIsSignup(form === 'signup');
  };

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        {
          email: input.email,
          password: input.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (res.data.success) {

        dispatch(setUser(res.data.user));

        toast.success(res.data.message);

        navigate('/');

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || 'Login Failed'
      );

    } finally {

      dispatch(setLoading(false));

    }
  };

  const submitHandler = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('password', input.password);
    formData.append('role', input.role);

    if (input.file) {
      formData.append('file', input.file);
    }

    try {

      dispatch(setLoading(true));

      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      if (res.data.success) {

        toast.success(res.data.message);

        setIsSignup(false);

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || 'Signup Failed'
      );

    } finally {

      dispatch(setLoading(false));

    }
  };

  useEffect(() => {

    if (user) {
      navigate('/');
    }

  }, [user, navigate]);

  return (
    <div>

      <Navbar />

      <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>

        <div className='w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row'>

          <div className='hidden lg:flex lg:w-1/2 bg-[#7209B7] p-8 flex-col justify-center items-center text-center'>

            <h2 className='text-white text-4xl font-extrabold'>
              Welcome
            </h2>

            <p className='text-white text-lg mt-4'>
              Find your dream job or hire the best talent.
            </p>

          </div>

          <div className='w-full lg:w-1/2 flex items-center justify-center p-6'>

            <div className="w-full max-w-md">

              {
                isSignup ? (
                  <SignupForm
                    input={input}
                    setInput={setInput}
                    submitHandler={submitHandler}
                    loading={loading}
                    onFlip={handleFlip}
                  />
                ) : (
                  <LoginForm
                    input={input}
                    changeEventHandler={changeEventHandler}
                    handleLogin={handleLogin}
                    loading={loading}
                    onFlip={handleFlip}
                  />
                )
              }

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;