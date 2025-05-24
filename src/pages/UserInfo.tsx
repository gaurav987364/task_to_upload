import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiPhone, FiCalendar, FiActivity } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import {zodResolver} from "@hookform/resolvers/zod";
import { UserInfoFormSchema, type UserInfoFormData } from '../schema/FormSchema';
import {useDispatch,useSelector} from "react-redux";
import type { ActionState } from '../store/Store';
import { addData } from '../slices/FormSlice';



const UserInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const storeData = useSelector((state:ActionState)=> state.formRed);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<UserInfoFormData>({
    mode: 'onChange',
    resolver:zodResolver(UserInfoFormSchema),
    defaultValues:{
      firstName:storeData?.userInfo?.firstName || '',
      middleName: storeData?.userInfo?.middleName || '',
      lastName: storeData?.userInfo?.lastName || '',
      mobileNo: storeData?.userInfo?.mobileNo || '',
      email: storeData?.userInfo?.email || '',
      dob: storeData?.userInfo?.dob || '',
      age: storeData?.userInfo?.age || 0,
      bloodGroup: storeData?.userInfo?.bloodGroup || "O-",
      gender: storeData?.userInfo?.gender || 'other',
      height: storeData?.userInfo?.height || "",
      weight: storeData?.userInfo?.weight || "",
      maritalStatus: storeData?.userInfo?.maritalStatus || "widowed",
    }
  });

  // Calculate age based on DOB
  const watchDob = watch('dob');
  React.useEffect(() => {
    if (watchDob) {
      const today = new Date();
      const birthDate = new Date(watchDob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setValue('age', age);
    }
  }, [watchDob, setValue]);

  const onSubmit = async (data:UserInfoFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Form Data:', data);
    dispatch(addData({userInfo:data}));
    navigate('/formlayout/address');
    setIsSubmitting(false);
  };

  const onFormError = (errors:unknown) => {
    console.error("Form errors", errors);
  };

  //data persistence
  useEffect(() => {
    if (storeData && storeData.userInfo) {
      const fields = storeData.userInfo;
      Object.entries(fields).forEach(([key, value]) => {
        setValue(key as keyof UserInfoFormData, value);
      });
    }
  }, [storeData, setValue]);


  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Personal Information
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Please fill in your details to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit,onFormError)} className="space-y-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiUser className="w-5 h-5 mr-2 text-blue-500" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    {...register('firstName', { 
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters required' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Middle Name
                  </label>
                  <input
                    {...register('middleName')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter middle name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName', { 
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters required' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiPhone className="w-5 h-5 mr-2 text-green-500" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    {...register('mobileNo', { 
                      required: 'Mobile number is required',
                      pattern: { value: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter mobile number"
                    type="tel"
                  />
                  {errors.mobileNo && (
                    <p className="mt-1 text-sm text-red-500">{errors.mobileNo.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter email address"
                    type="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiCalendar className="w-5 h-5 mr-2 text-purple-500" />
                Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    {...register('dob', { required: 'Date of birth is required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    type="date"
                  />
                  {errors.dob && (
                    <p className="mt-1 text-sm text-red-500">{errors.dob.message}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type='number'
                    {...register('age',{valueAsNumber:true})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white transition-all duration-300 shadow-sm"
                    placeholder="Auto-calculated"
                    readOnly
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Group *
                  </label>
                  <select
                    {...register('bloodGroup', { required: 'Blood group is required' })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  >
                    <option value="">Select blood group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <p className="mt-1 text-sm text-red-500">{errors.bloodGroup.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiActivity className="w-5 h-5 mr-2 text-red-500" />
                Physical Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Height */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    {...register('height', { 
                      required: 'Height is required',
                      pattern: { value: /^[0-9]+$/, message: 'Please enter height in centimeters' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter height in cm"
                    type="number"
                  />
                  {errors.height && (
                    <p className="mt-1 text-sm text-red-500">{errors.height.message}</p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    {...register('weight', { 
                      required: 'Weight is required',
                      pattern: { value: /^[0-9]+(\.[0-9]+)?$/, message: 'Please enter valid weight' }
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="Enter weight in kg"
                    type="number"
                    step="0.1"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-500">{errors.weight.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gender and Marital Status */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Gender *
                  </label>
                  <div className="space-y-3">
                    {['male', 'female', 'other'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          {...register('gender', { required: 'Gender is required' })}
                          type="radio"
                          value={option}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300 capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="mt-2 text-sm text-red-500">{errors.gender.message}</p>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Marital Status *
                  </label>
                  <div className="space-y-3">
                    {['single', 'married', 'divorced', 'widowed'].map((option) => (
                      <label key={option} className="flex items-center cursor-pointer">
                        <input
                          {...register('maritalStatus', { required: 'Marital status is required' })}
                          type="radio"
                          value={option}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700 dark:text-gray-300 capitalize">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.maritalStatus && (
                    <p className="mt-2 text-sm text-red-500">{errors.maritalStatus.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
               <Link 
                to="/"
                className="w-full sm:w-auto px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
               Next
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;