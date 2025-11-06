import { string, ref, object, number } from "yup";

export const NAME_SCHEMA = string().min(2, 'Мінімум 2 символи').trim().required("Будь ласка, введіть ім'я");

export const EMAIL_SCHEMA = string()
  .trim()
  .email('Невалідна адреса')
  .required('Будь ласка, введіть email');

export const CITY_SCHEMA = string().min(4, 'Мінімум 4 символи').trim().required('Місто обов’язкове');

export const NEW_PASSWORD_SCHEMA = string()
  .min(6, 'Мінімум 6 символів')
  .matches(/[a-z]/, 'Повинен містити малу літеру')
  .matches(/[A-Z]/, 'Повинен містити велику літеру')
  .matches(/\d/, 'Повинен містити цифру')
  .matches(/[^a-zA-Z0-9]/, 'Повинен містити спеціальний символ')

export const PASSWORD_SCHEMA = NEW_PASSWORD_SCHEMA;

export const CONFIRM_PASSWORD_SCHEMA = (refKey: string) =>
  string()
    .oneOf([ref(refKey)], 'Паролі не співпадають')
    .required('Підтвердження обов’язкове');

export const LOGIN_SCHEMA = object({
  email: EMAIL_SCHEMA,
  password: string().required('Пароль обовʼязковий'),
});

export const REGISTER_SCHEMA = object({
  name: NAME_SCHEMA,
  email: EMAIL_SCHEMA,
  password: PASSWORD_SCHEMA.required('Пароль обовʼязковий'),
  confirmPassword: CONFIRM_PASSWORD_SCHEMA('password'),
});

export const FORGOT_PASSWORD_SCHEMA = object({
  email: EMAIL_SCHEMA,
});

export const PASSSWORD_CHANGE_SCHEMA = object({
  currentPassword: string().required('Поточний пароль обов’язковий'),
  newPassword: NEW_PASSWORD_SCHEMA.required('Новий пароль обовʼязковий'),
  confirmPassword: CONFIRM_PASSWORD_SCHEMA('newPassword'),
});

export const PROFILE_SCHEMA = object({
  name: NAME_SCHEMA,
  city: CITY_SCHEMA,
  phone: string(),
});

export const TYRE_ADD_SCHEMA = object()
  .shape({
    brand: string().required('Обов’язкове поле'),
    model: string(),
    year: number()
      .required('Обов’язкове поле')
      .min(1900, 'Занадто рано')
      .max(new Date().getFullYear(), 'Невірний рік'),
    treadDepth: number().min(0, 'Мінімум 0').max(12, 'Максимум 12').nullable(),
    treadPercent: number().min(0, 'Мінімум 0%').max(100, 'Максимум 100%').nullable(),
    width: number().required('Обов’язкове поле'),
    height: number().required('Обов’язкове поле'),
    radius: number().required('Обов’язкове поле'),
    quantity: number()
      .required('Обов’язкове поле')
      .positive('Кількість повинна бути більшою за нуль'),
    season: string().required('Обов’язкове поле'),
    vehicle: string().required('Обов’язкове поле'),
    condition: string().required('Обов’язкове поле'),
    city: string().required('Обов’язкове поле'),
    price: number().required('Обов’язкове поле').positive('Ціна повинна бути більшою за нуль'),
    contact: number().required('Обов’язкове поле'),
    description: string().required('Обов’язкове поле'),
  })
  .test(
    'tread-check',
    'Потрібно вказати або глибину протектора, або його відсоток',
    function (value) {
      return !!value.treadDepth || !!value.treadPercent;
    },
  );
