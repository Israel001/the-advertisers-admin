import { Modal } from '@/components/Modal/Modal';
import styles from '../product/product.module.scss';
import { Cross1Icon } from '@radix-ui/react-icons';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { ICategory } from '@/types/shared';

export interface ICreateSubCategoryProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  isEditMode: boolean;
  subCategory?: ICategory;
}

const CreateSubCategory = ({
  showModal,
  setShowModal,
  isEditMode,
  subCategory,
}: ICreateSubCategoryProps) => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [nameError, setNameError] = useState('Category name is required');
  const [descriptionError, setDescriptionError] = useState(
    'Category description is required',
  );
  const [featuredImage, setFeaturedImage] = useState<
    Blob | string | undefined
  >();
  const [featuredImageForBackend, setFeaturedImageForBackend] =
    useState<Blob>();
  const [featuredImageError, setFeaturedImageError] = useState(
    'Featured image is required',
  );
  const [mainCategoryError, setMainCategoryError] = useState(
    'Main category is required',
  );
  const [mainCategories, setMainCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
      setDescription(subCategory.description);
      setFeaturedImage(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${subCategory!.featuredImage}`,
      );
      setSelectedMainCategory(subCategory.mainCategory.id.toString());
      setNameError('');
      setDescriptionError('');
      setFeaturedImageError('');
      setMainCategoryError('');
    }
  }, [subCategory]);

  const fetchMainCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .get(`${ServerRoutes.getMainCategoriesData}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setMainCategories(response.data);
      })
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
  };

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const handleMainCategoryChange = async (event: any) => {
    event.target.value
      ? setMainCategoryError('')
      : setMainCategoryError('Main category is required');
    setSelectedMainCategory(event.target.value);
  };

  const previewImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      Promise.all(
        files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', (ev) => {
              resolve(ev.target!.result);
            });
            reader.addEventListener('error', reject);
            reader.readAsDataURL(file);
          });
        }),
      ).then(
        (images: any) => {
          setFeaturedImage(images[0]);
          setFeaturedImageForBackend(files[0]);
        },
        (error) => console.error(error),
      );
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      !nameError &&
      !descriptionError &&
      !featuredImageError &&
      !mainCategoryError
    ) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (featuredImageForBackend)
        formData.append('featuredImage', featuredImageForBackend!);
      if (isEditMode) {
        axios
          .put(
            `${ServerRoutes.baseUrl}/category/${subCategory!.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          )
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response?.data?.statusCode === 401) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              localStorage.removeItem('date');
              router.push('/');
            } else {
              alert(error.response?.data?.message);
            }
          });
      } else {
        axios
          .post(
            `${ServerRoutes.baseUrl}/category/${selectedMainCategory}/subCategory`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            },
          )
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            if (error.response?.data?.statusCode === 401) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              localStorage.removeItem('date');
              router.push('/');
            } else {
              alert(error.response?.data?.message);
            }
          });
      }
    }
  };

  return (
    <Modal isOpen={showModal} onCloseModal={() => setShowModal(false)} text="">
      <div
        className={styles.formModal}
        style={{ maxHeight: '500px', width: '700px', overflowY: 'scroll' }}
      >
        <button className={styles.close} onClick={() => setShowModal(false)}>
          <Cross1Icon />
        </button>
        <h2 className={styles.header}>Create Main Category</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="mainCategory">Main Category:</label>
            <select
              className={styles.customSelect}
              id="state"
              value={selectedMainCategory}
              onChange={handleMainCategoryChange}
              style={
                mainCategoryError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoryName">Name:</label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => {
                e.target.value.trim()
                  ? setNameError('')
                  : setNameError('Category name is required');
                setName(e.target.value);
              }}
              style={nameError ? { border: '1px solid red', color: 'red' } : {}}
            />
            {nameError && <span style={{ color: 'red' }}>{nameError}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoryDescription">Description:</label>
            <input
              type="text"
              id="categoryDescription"
              value={description}
              onChange={(e) => {
                e.target.value.trim()
                  ? setDescriptionError('')
                  : setDescriptionError('Category description is required');
                setDescription(e.target.value);
              }}
              style={
                descriptionError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {descriptionError && (
              <span style={{ color: 'red' }}>{descriptionError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="featuredImage">Featured Image:</label>
            <input
              type="file"
              id="featuredImage"
              accept="image/gif,image/jpeg,image/jpg,image/png"
              onChange={(e) => {
                !e.target.files || !e.target.files.length
                  ? setFeaturedImageError('Featured image is required')
                  : setFeaturedImageError('');
                previewImage(e);
              }}
              style={
                featuredImageError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {featuredImageError && (
              <span style={{ color: 'red', display: 'block' }}>
                {featuredImageError}
              </span>
            )}
            {featuredImage && (
              <img
                src={featuredImage as any}
                alt="Featured Image"
                style={{ maxHeight: '200px', marginTop: '1rem' }}
              />
            )}
          </div>
          <div className={styles.btnContainer}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateSubCategory;
