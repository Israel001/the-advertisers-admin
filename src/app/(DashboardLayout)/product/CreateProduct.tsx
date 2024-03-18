import { Modal } from '@/components/Modal/Modal';
import styles from '../product/product.module.scss';
import { Cross1Icon } from '@radix-ui/react-icons';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import ToggleSwitch from '@/components/ToggleSwitch/ToggleSwitch';
import { Editor } from '@tinymce/tinymce-react';
import { ICategory } from '@/types/shared';

export interface ICreateProductProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const CreateProduct = ({ showModal, setShowModal }: ICreateProductProps) => {
  const router = useRouter();

  const [productName, setProductName] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [outOfStock, setOutOfStock] = useState(false);
  const [productPrice, setProductPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [mainCategories, setMainCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [featuredImage, setFeaturedImage] = useState<Blob>();
  const [featuredImageForBackend, setFeaturedImageForBackend] =
    useState<Blob>();
  const [images, setImages] = useState([]);
  const [imagesForBackend, setImagesForBackend] = useState<Blob[]>([]);
  const [productNameError, setProductNameError] = useState(
    'Product name is required',
  );
  const [productQuantityError, setProductQuantityError] = useState(
    'Product quantity is required',
  );
  const [productPriceError, setProductPriceError] = useState(
    'Product price is required',
  );
  const [discountPriceError, setDiscountPriceError] = useState('');
  const [brandError, setBrandError] = useState('Brand is required');
  const [categoryError, setCategoryError] = useState('Category is required');
  const [mainCategoryError, setMainCategoryError] = useState(
    'Main category is required',
  );
  const [featuredImageError, setFeaturedImageError] = useState(
    'Featured image is required',
  );
  const [imagesError, setImagesError] = useState('Images are required');

  const fetchCategories = async (categoryId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .get(`${ServerRoutes.getMainCategoriesData}/${categoryId}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setCategories(response.data);
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
    fetchCategories(selectedMainCategory);
  }, [selectedMainCategory]);

  useEffect(() => {
    fetchMainCategories();
  }, []);

  const handleMainCategoryChange = async (event: any) => {
    event.target.value
      ? setMainCategoryError('')
      : setMainCategoryError('Main category is required');
    setSelectedMainCategory(event.target.value);
  };

  const handleSubCategoryChange = async (event: any) => {
    event.target.value
      ? setCategoryError('')
      : setCategoryError('Category is required');
    setSelectedCategory(event.target.value);
  };

  const previewImage = (
    event: ChangeEvent<HTMLInputElement>,
    isFeaturedImage: boolean,
  ) => {
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
          if (isFeaturedImage) {
            setFeaturedImage(images[0]);
            setFeaturedImageForBackend(files[0]);
          } else {
            setImages(images);
            setImagesForBackend(files);
          }
        },
        (error) => console.error(error),
      );
    }
  };

  const editorRef = useRef<{ getContent: () => string } | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      !mainCategoryError &&
      !categoryError &&
      !featuredImageError &&
      !imagesError &&
      !productNameError &&
      !productQuantityError &&
      !productPriceError &&
      !discountPriceError &&
      !brandError
    ) {
      const formData = new FormData();
      formData.append('mainCategoryId', selectedMainCategory);
      formData.append('categoryId', selectedCategory);
      formData.append('featuredImage', featuredImageForBackend!);
      formData.append('name', productName);
      formData.append('quantity', productQuantity);
      formData.append('outOfStock', String(outOfStock));
      formData.append('price', productPrice);
      if (discountPrice) formData.append('discountPrice', discountPrice);
      if (editorRef.current) {
        const desc = editorRef.current.getContent();
        formData.append('description', desc);
      }
      formData.append('brand', brand);
      imagesForBackend.forEach((image) => {
        formData.append('images', image);
      });
      formData.append('published', String(published));
      axios
        .post(ServerRoutes.getProductData, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
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
        <h2 className={styles.header}>Create Product</h2>
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
            <label htmlFor="subCategory">Sub Category:</label>
            <select
              className={styles.customSelect}
              id="state"
              value={selectedCategory}
              onChange={handleSubCategoryChange}
              style={
                categoryError ? { border: '1px solid red', color: 'red' } : {}
              }
            >
              <option value="">Select Sub Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
                previewImage(e, true);
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
          <div className={styles.formGroup}>
            <label htmlFor="images">Images:</label>
            <input
              type="file"
              id="images"
              accept="image/gif,image/jpeg,image/jpg,image/png"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 10) {
                  alert('You can only upload a maximum of 10 images');
                  e.target.value = null as any;
                } else {
                  previewImage(e, false);
                }
                !e.target.files || !e.target.files.length || !e.target.value
                  ? setImagesError('Images are required')
                  : setImagesError('');
              }}
              style={
                imagesError ? { border: '1px solid red', color: 'red' } : {}
              }
              multiple
            />
            {imagesError && (
              <span style={{ color: 'red', display: 'block' }}>
                {imagesError}
              </span>
            )}
            {images.length > 0 ? (
              images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Image ${idx}`}
                  style={{ maxHeight: '200px', marginTop: '1rem' }}
                />
              ))
            ) : (
              <></>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="productName">Name:</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => {
                e.target.value.trim()
                  ? setProductNameError('')
                  : setProductNameError('Product name is required');
                setProductName(e.target.value);
              }}
              style={
                productNameError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {productNameError && (
              <span style={{ color: 'red' }}>{productNameError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="productQuantity">Quantity:</label>
            <input
              type="text"
              id="productQuantity"
              value={productQuantity}
              onChange={(e) => {
                e.target.value.trim()
                  ? setProductQuantityError('')
                  : setProductQuantityError('Product quantity is required');
                setProductQuantity(e.target.value);
              }}
              style={
                productQuantityError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {productQuantityError && (
              <span style={{ color: 'red' }}>{productQuantityError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="productName">Out of Stock:</label>
            <ToggleSwitch
              toggle={outOfStock}
              handler={() => setOutOfStock(!outOfStock)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="productPrice">Price:</label>
            <input
              type="text"
              id="productPrice"
              value={productPrice}
              onChange={(e) => {
                e.target.value.trim()
                  ? setProductPriceError('')
                  : setProductPriceError('Product price is required');
                setProductPrice(e.target.value);
              }}
              style={
                productPriceError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {productPriceError && (
              <span style={{ color: 'red' }}>{productPriceError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="productPrice">Discount Price:</label>
            <input
              type="text"
              id="discountPrice"
              value={discountPrice}
              onChange={(e) => {
                setDiscountPrice(e.target.value);
              }}
              style={
                discountPriceError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {discountPriceError && (
              <span style={{ color: 'red' }}>{discountPriceError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <Editor
              apiKey="dqm17z66vv1e9w7so9efvi8pybxpi8u7qlrvnq9yrt45uyav"
              onInit={(evt, editor) => {
                editorRef.current = editor as any;
              }}
              initialValue={description}
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'code',
                  'help',
                  'wordcount',
                ],
                toolbar:
                  'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="brand">Brand:</label>
            <input
              type="text"
              id="brand"
              value={brand}
              onChange={(e) => {
                e.target.value
                  ? setBrandError('')
                  : setBrandError('Brand is required');
                setBrand(e.target.value);
              }}
              style={
                brandError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {brandError && <span style={{ color: 'red' }}>{brandError}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="published">Published:</label>
            <ToggleSwitch
              toggle={published}
              handler={() => setPublished(!published)}
            />
          </div>
          <div className={styles.btnContainer}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProduct;
