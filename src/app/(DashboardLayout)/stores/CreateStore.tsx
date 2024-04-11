import { Modal } from '@/components/Modal/Modal';
import styles from '../product/product.module.scss';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { IState, IStore } from '@/types/shared';

export interface ICreateStoreProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  isEditMode: boolean;
  store?: IStore;
}

const CreateStore = ({
  showModal,
  setShowModal,
  isEditMode,
  store,
}: ICreateStoreProps) => {
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [street, setStreet] = useState('');
  const [password, setPassword] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [storeNameError, setStoreNameError] = useState(
    'Store name is required',
  );
  const [contactNameError, setContactNameError] = useState(
    'Contact name is required',
  );
  const [contactPhoneError, setContactPhoneError] = useState(
    'Contact phone is required',
  );
  const [contactEmailError, setContactEmailError] = useState(
    'Contact email is required',
  );
  const [stateError, setStateError] = useState('State is required');
  const [streetError, setStreetError] = useState('Street is required');
  const [passwordError, setPasswordError] = useState('Password is required');
  const [states, setStates] = useState<IState[]>([]);

  // useEffect(() => {
  //   if (subCategory) {
  //     setName(subCategory.name);
  //     setDescription(subCategory.description);
  //     setFeaturedImage(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/${subCategory!.featuredImage}`,
  //     );
  //     setSelectedMainCategory(subCategory.mainCategory.id.toString());
  //     setNameError('');
  //     setDescriptionError('');
  //     setFeaturedImageError('');
  //     setMainCategoryError('');
  //   }
  // }, [subCategory]);

  const fetchStates = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .get(`${ServerRoutes.getStatesData}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setStates(response.data);
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
    fetchStates();
  }, []);

  const handleStatesChange = async (event: any) => {
    event.target.value
      ? setStateError('')
      : setStateError('Main category is required');
    setSelectedState(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (
      !storeNameError &&
      !contactNameError &&
      !contactPhoneError &&
      !contactEmailError &&
      !stateError &&
      !streetError &&
      !passwordError
    ) {
      if (isEditMode) {
        axios
          .put(
            `${ServerRoutes.baseUrl}/edit-store/${store!.id}`,
            {
              storeName,
              contactName,
              contactPhone,
              contactEmail,
            },
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/store`,
            {
              storeName,
              contactName,
              contactPhone,
              contactEmail,
              stateId: +selectedState,
              street,
              password,
              ...(houseNo ? { houseNo } : {}),
              ...(landmark ? { landmark } : {}),
            },
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
        <h2 className={styles.header}>Create Store</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="storeName">Store Name:</label>
            <input
              type="text"
              id="storeName"
              value={storeName}
              onChange={(e) => {
                e.target.value.trim()
                  ? setStoreNameError('')
                  : setStoreNameError('Store name is required');
                setStoreName(e.target.value);
              }}
              style={
                storeNameError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {storeNameError && (
              <span style={{ color: 'red' }}>{storeNameError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contactName">Contact Name:</label>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => {
                e.target.value.trim()
                  ? setContactNameError('')
                  : setContactName('Contact name is required');
                setContactName(e.target.value);
              }}
              style={
                contactNameError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {contactNameError && (
              <span style={{ color: 'red' }}>{contactNameError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contactPhone">Contact Phone:</label>
            <input
              type="text"
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => {
                e.target.value.trim()
                  ? setContactPhoneError('')
                  : setContactPhoneError('Contact phone is required');
                setContactPhone(e.target.value);
              }}
              style={
                contactPhoneError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {contactPhoneError && (
              <span style={{ color: 'red' }}>{contactPhoneError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contactEmail">Contact Email:</label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => {
                e.target.value.trim()
                  ? setContactEmailError('')
                  : setContactEmailError('Contact email is required');
                setContactEmail(e.target.value);
              }}
              style={
                contactEmailError
                  ? { border: '1px solid red', color: 'red' }
                  : {}
              }
            />
            {contactEmailError && (
              <span style={{ color: 'red' }}>{contactEmailError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="state">State:</label>
            <select
              className={styles.customSelect}
              id="state"
              value={selectedState}
              onChange={handleStatesChange}
              style={
                stateError ? { border: '1px solid red', color: 'red' } : {}
              }
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              value={street}
              onChange={(e) => {
                e.target.value.trim()
                  ? setStreetError('')
                  : setStreetError('Street is required');
                setStreet(e.target.value);
              }}
              style={
                streetError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {streetError && <span style={{ color: 'red' }}>{streetError}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="houseNo">House No:</label>
            <input
              type="text"
              id="houseNo"
              value={houseNo}
              onChange={(e) => {
                setHouseNo(e.target.value);
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="landmark">Landmark:</label>
            <input
              type="text"
              id="landmark"
              value={landmark}
              onChange={(e) => {
                setLandmark(e.target.value);
              }}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                e.target.value.trim()
                  ? setPasswordError('')
                  : setPasswordError('Password is required');
                setPassword(e.target.value);
              }}
              style={
                passwordError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {passwordError && (
              <span style={{ color: 'red' }}>{passwordError}</span>
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

export default CreateStore;
