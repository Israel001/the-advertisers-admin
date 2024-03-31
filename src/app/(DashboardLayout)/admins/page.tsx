'use client';

import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../product/product.module.scss';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Table from '@/components/Table/Table';
import { IAdmin, ICategory } from '@/types/shared';
import { Modal } from '@/components/Modal/Modal';
import withAdminContext from './withAdminContext';
import CreateAdmin from './CreateAdmin';

const Admin = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminSelected, setAdminSelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);

  const { setAdminData, adminData } = useAppContext();

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getAdminData}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setAdminData(response.data))
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
    setLoading(false);
  }, [forceRefresh]);

  const deleteAdmin = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .delete(`${ServerRoutes.baseUrl}/${adminSelected}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setForceRefresh(true);
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

  return (
    <div>
      <h2 className={styles.pageHeader}>Admins</h2>
      <div className={styles.createBtnContainer}>
        <button
          className={styles.createButton}
          onClick={() => setShowModal(true)}
        >
          <PlusCircledIcon /> Create Admin
        </button>
      </div>
      {loading ? (
        'Loading....'
      ) : (
        <Table
          headers={[
            {
              id: 1,
              label: 'Id',
            },
            {
              id: 2,
              label: 'Full Name',
            },
            {
              id: 3,
              label: 'Email',
            },
            {
              id: 4,
              label: 'Created At',
            },
            {
              id: 5,
              label: 'Actions',
            },
          ]}
          data={adminData}
          renderRow={(row: IAdmin, index: number) => {
            return (
              <tr key={index}>
                <td>{row.id}</td>
                <td>{row.fullName}</td>
                <td>{row.email}</td>
                <td>{row.createdAt}</td>
                <td>
                  <div>
                    <span
                      style={{
                        color: 'red',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setAdminSelected(row.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </span>
                  </div>
                </td>
              </tr>
            );
          }}
        />
      )}
      <CreateAdmin showModal={showModal} setShowModal={setShowModal} />
      <Modal
        isOpen={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        text=""
      >
        {showDeleteModal && (
          <div className={styles.pricingApproveModal}>
            <h2>Are you sure you want to delete this admin?</h2>
            <div className={styles['button-container']}>
              <button
                className={`${styles.button} ${styles.yes}`}
                onClick={() => {
                  deleteAdmin();
                  setShowDeleteModal(false);
                }}
                style={{ backgroundColor: '#f44336' }}
              >
                Yes
              </button>
              <button
                className={`${styles.button} ${styles.no}`}
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default withAdminContext(Admin);
