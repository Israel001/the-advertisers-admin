'use client';

import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../product/product.module.scss';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Table from '@/components/Table/Table';
import { ICustomer } from '@/types/shared';
import { Modal } from '@/components/Modal/Modal';
import withCustomerContext from './withCustomerContext';
import SearchComponent from '@/components/Filter/Filter';
import CreateCustomer from './CreateCustomer';
import CustomPagination from '@/components/CustomPagination/CustomPagination';

const Customer = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [customerSelected, setCustomerSelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customer, setCustomer] = useState<ICustomer>();
  const [limit, setLimit] = useState(40);
  const [page, setPage] = useState(1);
  const { setCustomerData, customerData, totalData, setTotalData } =
    useAppContext();
  const [roleName, setRolename] = useState('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      const roleName = user.role.name;
      setRolename(roleName);
    } else {
      console.error('User data not found in local storage');
    }
  }, [roleName]);

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getCustomerData}s?pagination[page]=${page}&pagination[limit]=${limit}`;
    if (searchQuery) {
      url = `${url}&search=${searchQuery}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setTotalData(response?.data?.pagination?.total);
        setCustomerData(response.data.data);
      })
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
    setLoading(false);
    setForceRefresh(false);
  }, [searchQuery, forceRefresh]);

  const toggleCustomerActivation = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .post(
        `${ServerRoutes.baseUrl}/${
          showDeactivateModal ? 'deactivate' : 'activate'
        }-customer/${customerSelected}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
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
      <h2 className={styles.pageHeader}>Customers</h2>
      <div style={{ marginBottom: '20px' }}>
        <SearchComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      {roleName !== 'User' && roleName !== 'Simple User' && (
        <div className={styles.createBtnContainer}>
          <button
            className={styles.createButton}
            onClick={() => setShowModal(true)}
          >
            <PlusCircledIcon /> Create Customer
          </button>
        </div>
      )}

      {loading ? (
        'Loading....'
      ) : (
        <>
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
                label: 'Phone',
              },
              {
                id: 5,
                label: 'Created At',
              },
              {
                id: 6,
                label: 'Activated',
              },
              {
                id: 7,
                label: 'Actions',
              },
            ]}
            data={customerData}
            renderRow={(row: ICustomer, index: number) => {
              return (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.fullName}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{row.createdAt.split('T')[0]}</td>
                  <td>{row.deletedAt ? 'false' : 'true'}</td>
                  <td>
                    {roleName !== 'User' && roleName !== 'Simple User' && (
                      <div>
                        {row.deletedAt ? (
                          <span
                            style={{
                              color: 'blue',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setCustomerSelected(row.id);
                              setShowActivateModal(true);
                            }}
                          >
                            Activate
                          </span>
                        ) : (
                          <span
                            style={{
                              color: 'red',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setCustomerSelected(row.id);
                              setShowDeactivateModal(true);
                            }}
                          >
                            Deactivate
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            }}
          />
          <CustomPagination
            totalItems={totalData}
            currentPage={page}
            itemsPerPage={limit}
            onPageChange={(page: number) => setPage(page)}
          />
        </>
      )}
      <CreateCustomer
        showModal={showModal}
        setShowModal={setShowModal}
        isEditMode={isEditMode}
        customer={customer}
      />
      <Modal
        isOpen={showDeactivateModal || showActivateModal}
        onCloseModal={() => {
          setShowDeactivateModal(false);
          setShowActivateModal(false);
        }}
        text=""
      >
        {showDeactivateModal || showActivateModal ? (
          <div className={styles.pricingApproveModal}>
            <h2>
              {showDeactivateModal
                ? 'Are you sure you want to deactivate this customer?'
                : 'Are you sure you want to activate this customer?'}
            </h2>
            <div className={styles['button-container']}>
              <button
                className={`${styles.button} ${styles.yes}`}
                onClick={() => {
                  toggleCustomerActivation();
                  setShowDeactivateModal(false);
                  setShowActivateModal(false);
                }}
                style={{ backgroundColor: '#f44336' }}
              >
                Yes
              </button>
              <button
                className={`${styles.button} ${styles.no}`}
                onClick={() => {
                  setShowDeactivateModal(false);
                  setShowActivateModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  );
};

export default withCustomerContext(Customer);
