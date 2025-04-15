import { useMeQuery, useUpdateUserAddressMutation, useUpdateUserMutation } from '@/services/api'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { PersonalInfoSection } from '../UserForm/PersonalInfoForm'
import { AddressSection } from '../UserForm/AddressInforForm'
import { toast } from 'sonner'

const UpdateProfile = () => {
  const { data: userData } = useMeQuery()
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation()
  const [updateUserAddress, { isLoading: isUpdatingAddress }] = useUpdateUserAddressMutation()

  // Schema definitions
  const profileSchema = yup.object({
    firstName: yup.string().required('First name is required').trim(),
    lastName: yup.string().required('Last name is required').trim(),
    email: yup.string().required('Email is required').email('Invalid email address').trim(),
    phoneNumber: yup
      .string()
      .nullable()
      .transform((val) => (val === '' ? null : val))
      .matches(/^[0-9+-]*$/, 'Please enter a valid phone number'),
  })

  const addressSchema = yup.object({
    street: yup.string().required('Street address is required').trim(),
    city: yup.string().required('City is required').trim(),
    state: yup.string().required('State is required').trim(),
    country: yup.string().required('Country is required').trim(),
    zipCode: yup.string().required('Zip code is required').trim(),
  })

  const updateSchema = profileSchema.concat(addressSchema)
  type UpdateFormData = yup.InferType<typeof updateSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    trigger,
  } = useForm<UpdateFormData>({
    resolver: yupResolver(updateSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: null,
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  })

  useEffect(() => {
    if (userData?.body.data) {
      const { firstName, lastName, email, phoneNumber, Address } = userData.body.data
      reset({
        firstName,
        lastName,
        email,
        phoneNumber,
        street: Address?.street || '',
        city: Address?.city || '',
        state: Address?.state || '',
        country: Address?.country || '',
        zipCode: Address?.zipCode || '',
      })
    }
  }, [userData, reset])

  const onSubmit = async (data: UpdateFormData) => {
    try {
      const { street, city, state, country, zipCode, ...profileData } = data
      const addressData = { street, city, state, country, zipCode }

      await Promise.all([updateUser(profileData).unwrap(), updateUserAddress(addressData).unwrap()])

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile', error)
    }
  }

  const isSubmittable = isDirty && isValid
  const isLoading = isUpdatingUser || isUpdatingAddress

  return (
    <div className="mx-auto w-full rounded-lg bg-white p-6">
      <h1 className="mb-10 text-3xl font-bold">Update Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <PersonalInfoSection register={register} errors={errors} trigger={trigger} />
          <AddressSection register={register} errors={errors} trigger={trigger} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isSubmittable || isLoading}
            className={`rounded-full px-6 py-3 text-xs font-medium text-white transition-colors ${
              !isSubmittable || isLoading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateProfile
