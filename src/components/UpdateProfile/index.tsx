import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const UpdateProfile = () => {
  const updateSchema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Invalid email address"),
    phone: yup
      .string()
      .matches(/^[0-9+-]+$/, "Please enter a valid phone number"),
  });

  type UpdateFormData = yup.InferType<typeof updateSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateSchema),
  });

  const onSubmit = (data: UpdateFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-10">Update Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border-b placeholder:text-sm placeholder:font-medium border-gray-300 focus:border-gray-500 focus:outline-none"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              className="w-full px-3 py-2 border-b placeholder:text-sm placeholder:font-medium border-gray-300 focus:border-gray-500 focus:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="sr-only">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Phone number"
            className="w-full px-3 py-2 border-b placeholder:text-sm placeholder:font-medium border-gray-300 focus:border-gray-500 focus:outline-none"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-xs font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
