import { Modal } from '@/components/Modal/Modal';
import styles from '../product/product.module.scss';
import { Cross1Icon } from '@radix-ui/react-icons';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { ICategory, IRoles } from '@/types/shared';

export interface ICreateAdminProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const CreateAdmin = ({ showModal, setShowModal }: ICreateAdminProps) => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('Full name is required');
  const [emailError, setEmailError] = useState('Email is required');
  const [passwordError, setPasswordError] = useState('Password is required');
  const [phoneError, setPhoneError] = useState('Phone Number is required');
  const [rolesError, setRolesError] = useState('Role is required');
  const [phone, setPhone] = useState('');
  const [allRoles, setAllRoles] = useState<IRoles[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!nameError && !emailError && !passwordError && !rolesError && !phoneError) {
      axios
        .post(
          `${ServerRoutes.baseUrl}`,
          { fullName: name, email, password, roleId: Number(selectedRole), phone },
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
  };

  const fetchAllRoles = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .get(`${ServerRoutes.getAllRolesData}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response: { data: SetStateAction<IRoles[]> }) => {
        setAllRoles(response.data);
      })
      .catch((error: { response: { data: { statusCode: number } } }) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  return (
    <Modal isOpen={showModal} onCloseModal={() => setShowModal(false)} text="">
      <div
        className={styles.formModal}
        style={{ maxHeight: '500px', width: '700px', overflowY: 'scroll' }}
      >
        <button className={styles.close} onClick={() => setShowModal(false)}>
          <Cross1Icon />
        </button>
        <h2 className={styles.header}>Create Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={name}
              onChange={(e) => {
                e.target.value.trim()
                  ? setNameError('')
                  : setNameError('Full name is required');
                setName(e.target.value);
              }}
              style={nameError ? { border: '1px solid red', color: 'red' } : {}}
            />
            {nameError && <span style={{ color: 'red' }}>{nameError}</span>}
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
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                e.target.value.trim()
                  ? setPasswordError('')
                  : setPasswordError('Email is required');
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
          <div className={styles.formGroup}>
            <label htmlFor="password">Roles:</label>
            <select
              className={styles.customSelect}
              id="roles"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                e.target.value.trim()
                  ? setRolesError('')
                  : setRolesError('Roles is required');
              }}
              style={
                rolesError ? { border: '1px solid red', color: 'red' } : {}
              }
            >
              <option value="">Select Role</option>
              {allRoles.map((role, index) => (
                <option key={index} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {rolesError && <span style={{ color: 'red' }}>{rolesError}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => {
                e.target.value.trim()
                  ? setPhoneError('')
                  : setPhoneError('Phone Number is required');
                setPhone(e.target.value);
              }}
              style={
                phoneError ? { border: '1px solid red', color: 'red' } : {}
              }
            />
            {phoneError && (
              <span style={{ color: 'red' }}>{phoneError}</span>
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

export default CreateAdmin;
