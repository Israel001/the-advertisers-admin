import { Modal } from '@/components/Modal/Modal';
import styles from '../product/product.module.scss';
import { Cross1Icon } from '@radix-ui/react-icons';
import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { ICustomer, IState } from '@/types/shared';

export interface ICreateCustomerProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  isEditMode: boolean;
  customer?: ICustomer;
}

const CreateCustomer = ({
  showModal,
  setShowModal,
  isEditMode,
  customer,
}: ICreateCustomerProps) => {
  const router = useRouter();

  const [fullName, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [street, setStreet] = useState('');
  const [password, setPassword] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [fullNameError, setFullNameError] = useState('Full name is required');
  const [phoneError, setPhoneError] = useState('Phone is required');
  const [emailError, setEmailError] = useState('Email is required');
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
      !fullNameError &&
      !phoneError &&
      !emailError &&
      !stateError &&
      !streetError &&
      !passwordError
    ) {
      if (isEditMode) {
        axios
          .put(
            `${ServerRoutes.baseUrl}/edit-customer/${customer!.id}`,
            {
              fullName,
              phone,
              email,
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/customer`,
            {
              fullName,
              phone,
              email,
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
        <h2 className={styles.header}>Create Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => {
                e.target.value.trim()
                  ? setFullNameError('')
                  : setFullNameError('Full name is required');
                setFullname(e.target.value);
              }}
              style={
                fullNameError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {fullNameError && (
              <span style={{ color: 'red' }}>{fullNameError}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => {
                e.target.value.trim()
                  ? setPhoneError('')
                  : setPhoneError('Phone is required');
                setPhone(e.target.value);
              }}
              style={
                phoneError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {phoneError && <span style={{ color: 'red' }}>{phoneError}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                e.target.value.trim()
                  ? setEmailError('')
                  : setEmailError('Email is required');
                setEmail(e.target.value);
              }}
              style={
                emailError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
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
            {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
          </div>
          <div className={styles.btnContainer}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateCustomer;
