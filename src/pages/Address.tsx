import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiHome, FiMapPin, FiNavigation } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { AddressFormSchema, type AddressFormData } from '../schema/FormSchema';
import { zodResolver } from '@hookform/resolvers/zod/src/zod.js';
import { useDispatch, useSelector } from 'react-redux';
import type { ActionState } from '../store/Store';
import { addData } from '../slices/FormSlice';



const AddressInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
   const dispatch = useDispatch();
  const storeData = useSelector((state:ActionState)=> state.formRed);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<AddressFormData>({
    mode: 'onChange',
    resolver:zodResolver(AddressFormSchema),
    defaultValues:{
      addressLine1:storeData?.address?.addressLine1 || '',
      addressLine2:storeData?.address?.addressLine2 || '',
      city: storeData?.address?.city || '',
      pincode:storeData?.address?.pincode || '',
      state: storeData?.address?.state || '',
      country: storeData?.address?.country || '',
    }
  });

  const onSubmit = async (data:AddressFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Address Data:', data);
    dispatch(addData({address:data}));
    setIsSubmitting(false);
    navigate('/formlayout/review');
  };
  const onFormError = (errors : unknown) => {
    console.error("Form errors", errors);
  };

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'Singapore', 'Other'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep'
  ];

  //data persistence
  useEffect(() => {
    if (storeData && storeData.userInfo) {
      const fields = storeData.userInfo;
      Object.entries(fields).forEach(([key, value]) => {
        setValue(key as keyof AddressFormData, value !== undefined && value !== null ? String(value) : '');
      });
    }
  }, [storeData, setValue]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiHome className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Address Information
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Please provide your address details
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit(onSubmit,onFormError)}>
              {/* Street Address */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiNavigation className="w-5 h-5 mr-2 text-blue-500" />
                  Street Address
                </h2>
                
                <div className="space-y-6">
                  {/* Address Line 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      {...register('addressLine1', { 
                        required: 'Address line 1 is required',
                        minLength: { value: 5, message: 'Address must be at least 5 characters long' }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      placeholder="House/Flat No., Building Name, Street Name"
                    />
                    {errors.addressLine1 && (
                      <p className="mt-1 text-sm text-red-500">{errors.addressLine1.message}</p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2
                    </label>
                    <input
                      {...register('addressLine2')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      placeholder="Apartment, Suite, Floor (Optional)"
                    />
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FiMapPin className="w-5 h-5 mr-2 text-green-500" />
                  Location Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { 
                        required: 'City is required',
                        minLength: { value: 2, message: 'City name must be at least 2 characters' }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      placeholder="Enter city name"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pincode *
                    </label>
                    <input
                      {...register('pincode', { 
                        required: 'Pincode is required',
                        pattern: { 
                          value: /^[0-9]{5,6}$/, 
                          message: 'Please enter a valid pincode (5-6 digits)' 
                        }
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
                      placeholder="Enter pincode"
                      type="text"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-sm text-red-500">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* State and Country */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State/Province *
                  </label>
                  <select
                    {...register('state', { required: 'State/Province is required' })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm appearance-none cursor-pointer text-sm sm:text-base"
                    style={{
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select state/province</option>
                    {indianStates.map(state => (
                      <option key={state} value={state} className="py-2 px-4 text-sm sm:text-base text-gray-900 dark:text-white dark:bg-gray-700">
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Country *
                  </label>
                  <select
                    {...register('country', { required: 'Country is required' })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg md:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm appearance-none cursor-pointer text-sm sm:text-base"
                    style={{
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select country</option>
                    {countries.map(country => (
                      <option key={country} value={country} className="text-sm sm:text-base text-gray-900 dark:text-white dark:bg-gray-700">
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                <Link 
                  to="/formlayout/info"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  Back
                </Link>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    Next
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfo;