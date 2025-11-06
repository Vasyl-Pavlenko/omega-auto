import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { createTyre } from '../api/api';
import { TyreForm } from '../types/tyre';

import { OverlayLoader, TyreFormComponent } from '../components';
import { useAppSelector } from '../hooks/reduxHooks';
import { Helmet } from 'react-helmet';

export default function AddTyrePage() {
  const [formValues, setFormValues] = useState<TyreForm | null>(null);
  const [initialValues, setInitialValues] = useState<TyreForm>({
    brand: '',
    model: '',
    width: '',
    height: '',
    quantity: '',
    radius: '',
    season: '',
    vehicle: '',
    year: '',
    treadDepth: '',
    treadPercent: '',
    city: '',
    condition: '',
    price: '',
    description: '',
    contact: '',
    name: '',
    images: [],
  });

  const { profile, loading: isProfileLoading } = useAppSelector((state) => state.profile);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!profile) {
        return;
      }

      try {
        setInitialValues((prev) => ({
          ...prev,
          name: profile.name || '',
          contact: profile.phone || '',
          city: profile.city || '',
        }));
      } catch (err) {
        toast.error('Не вдалося отримати профіль');
      }
    };

    fetchUserData();
  }, [profile]);

  useEffect(() => {
    if (showPreview) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [showPreview]);

  const handleSubmit = async (values: TyreForm) => {
    if (!profile?.phoneVerified) {
      toast.warning('Підтвердіть номер телефону перед створенням оголошення');

      return;
    }

    setError('');
    setIsLoading(true);

    try {
      setFormValues(values);
      const res = await createTyre({
        ...values,
        title: `${values.width}/${values.height}/${values.radius}`,
      });

      if (typeof res !== 'string' && 'status' in res && res.status === 201) {
        toast.success('Шину успішно додано ✅');
        navigate('/my');
      } else {
        setError('Не вдалося додати шину. Спробуйте ще раз 😞');

        toast.error('Не вдалося додати шину. Спробуйте ще раз 😞');
      }
    } catch (e) {
      setError('Помилка з’єднання з сервером');

      toast.error('Не вдалося додати шину. Спробуйте ще раз 😞');
    } finally {
      document.body.classList.remove('no-scroll');

      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 4000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleClearError: () => void = () => {
    if (error) {
      setError('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Додати оголошення | Omega Auto</title>
        <meta
          name="description"
          content="Створіть нове оголошення про продаж шин. Швидко та просто на Omega Auto"
        />
      </Helmet>
      <div className="p-4 py-10 my-10 max-w-sm sm:max-w-xl mx-auto bg-white rounded-xl shadow space-y-3 relative">
        <h1 className="text-xl font-bold text-center mb-4">Додати оголошення</h1>

        {(isLoading || isProfileLoading) && <OverlayLoader />}

        {!isLoading && !isProfileLoading && (
          <TyreFormComponent
            title="Додати"
            error={error}
            form={formValues || initialValues}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            clearError={handleClearError}
          />
        )}
      </div>
    </>
  );
}
