import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { fetchTyreById, updateTyre } from '../api/api';
import { TyreForm } from '../types/tyre';

import { OverlayLoader, TyreFormComponent } from '../components';
import { useAppSelector } from '../hooks/reduxHooks';
import { Helmet } from 'react-helmet';

export default function EditTyrePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<TyreForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { profile } = useAppSelector((state) => state.profile);

  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTyreById(id!);

        if (typeof response === 'string') {
          throw new Error(response);
        }

        const tyre = response.data;

        setInitialValues({
          ...tyre,
          contact: profile?.phone || '',
          name: profile?.name || '',
        });
      } catch (err) {
        setError('Помилка під час завантаження даних');
        toast.error('Не вдалося завантажити дані');
      }
    };

    fetchData();
  }, [id, profile]);

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
      toast.warning('Підтвердіть номер телефону перед редагуванням оголошення');
      return;
    }

    setIsLoading(true);

    try {
      const res = await updateTyre(id!, {
        ...values,
        title: `${values.width}/${values.height}/${values.radius}`,
      });

      if (typeof res !== 'string' && 'status' in res && res.status === 200) {
        toast.success('Оголошення оновлено ✅');
        navigate('/my');
      } else {
        setError('Помилка під час оновлення оголошення');
        toast.error('Не вдалося оновити оголошення 😞');
      }
    } catch (e) {
      setError('Помилка під час оновлення оголошення');
      toast.error('Помилка під час оновлення оголошення 😞');
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

  if (!initialValues) {
    if (!profile) {
      return null;
    }

    return <OverlayLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Редагувати оголошення | Omega Auto</title>
        <meta
          name="description"
          content="Відредагуйте ваше оголошення про шини, оновіть інформацію або фотографії."
        />
      </Helmet>
      
      <div className="p-4 py-10 my-10 max-w-sm sm:max-w-xl mx-auto bg-white rounded-xl shadow space-y-3 relative">
        <h1 className="text-xl font-bold text-center mb-4">Редагувати оголошення</h1>

        {(!profile || !initialValues) && <OverlayLoader />}

        {profile && initialValues && !isLoading && (
          <TyreFormComponent
            title="Оновити"
            error={error}
            form={initialValues}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            clearError={handleClearError}
          />
        )}

        {isLoading && <OverlayLoader />}
      </div>
    </>
  );
}
