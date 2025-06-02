import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { updateUserProfile } from '../../store/slices/profile/profileSlice';
import { PROFILE_SCHEMA } from '../../schemas/validationSchemas';

export const ProfileDetailsForm = () => {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.profile);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name || '',
      city: profile?.city || '',
      phone: profile?.phone || '',
    },
    validationSchema: PROFILE_SCHEMA,
    onSubmit: async (values) => {
      try {
        await dispatch(updateUserProfile(values)).unwrap();
        toast.success('Профіль оновлено');
      } catch (error: any) {
        toast.error(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <input
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          placeholder="Імʼя"
          className={`w-full mb-2 p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : ''
          }`}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <input
          id="city"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          placeholder="city"
          className={`w-full mb-2 p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : ''
          }`}
        />
        {formik.touched.city && formik.errors.city && (
          <div className="text-red-500 text-sm">{formik.errors.city}</div>
        )}
      </div>

      <div>
        <input
          id="phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          placeholder="Номер телефону"
          className={`w-full mb-2 p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : ''
          }`}
        />
      </div>

      <button type="submit" aria-label=" Оновити профіль" className="btn btn-primary">
        Оновити профіль
      </button>
    </form>
  );
}
