import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import { useAppDispatch } from '../../hooks/reduxHooks';
import { changePassword } from '../../store/slices/profile/profileSlice';
import { PASSSWORD_CHANGE_SCHEMA } from '../../schemas/validationSchemas';

export const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: PASSSWORD_CHANGE_SCHEMA,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(changePassword(values)).unwrap();
        toast.success('Пароль змінено');
        resetForm();
      } catch (error: any) {
        toast.error(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword">Поточний пароль</label>
        
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          className="input"
        />
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <div className="text-red-500 text-sm">{formik.errors.currentPassword}</div>
        )}
      </div>

      <div>
        <label htmlFor="newPassword">Новий пароль</label>

        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          className="input"
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className="text-red-500 text-sm">{formik.errors.newPassword}</div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Підтвердіть пароль</label>

        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          className="input"
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary" aria-label='Змінити пароль'>
        Змінити пароль
      </button>
    </form>
  );
}
