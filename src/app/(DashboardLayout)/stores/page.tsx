'use client';

import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../product/product.module.scss';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Table from '@/components/Table/Table';
import { IStore } from '@/types/shared';
import { Modal } from '@/components/Modal/Modal';
import SearchComponent from '@/components/Filter/Filter';
import withStoreContext from './withStoreContext';

const Store = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [storeSelected, setStoreSelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);

  const { setStoreData, storeData } = useAppContext();

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getStoreData}s?pagination[page]=1&pagination[limit]=50`;
    if (searchQuery) {
      url = `${url}&search=${searchQuery}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setStoreData(response.data.data))
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
    setLoading(false);
  }, [searchQuery, forceRefresh]);

  const toggleStoreActivation = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
    await axios
      .post(
        `${ServerRoutes.baseUrl}/store/${storeSelected}/${
          showDeactivateModal ? 'deactivate' : 'activate'
        }`,
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
        console.log(error);
        // if (error.response?.data?.statusCode === 401) {
        //   localStorage.removeItem('accessToken');
        //   localStorage.removeItem('user');
        //   localStorage.removeItem('date');
        //   router.push('/');
        // }
      });
  };

  return (
    <div>
      <h2 className={styles.pageHeader}>Stores</h2>
      <div style={{ marginBottom: '20px' }}>
        <SearchComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className={styles.createBtnContainer}>
        <button
          className={styles.createButton}
          onClick={() => setShowModal(true)}
        >
          <PlusCircledIcon /> Create Store
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
              label: 'Store Name',
            },
            {
              id: 3,
              label: 'Address',
            },
            {
              id: 4,
              label: 'Contact Name',
            },
            {
              id: 5,
              label: 'Contact Phone',
            },
            {
              id: 6,
              label: 'Contact Email',
            },
            {
              id: 7,
              label: 'Created At',
            },
            {
              id: 8,
              label: 'Activated',
            },
            {
              id: 9,
              label: 'Actions',
            },
          ]}
          data={storeData}
          renderRow={(row: IStore, index: number) => {
            return (
              <tr key={index}>
                <td>{row.id}</td>
                <td>{row.storeName}</td>
                <td>{row.address}</td>
                <td>{row.contactName}</td>
                <td>{row.contactPhone}</td>
                <td>{row.contactEmail}</td>
                <td>{row.createdAt}</td>
                <td>{row.deletedAt ? 'false' : 'true'}</td>
                <td>
                  <div>
                    {row.deletedAt ? (
                      <span
                        style={{
                          color: 'blue',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setStoreSelected(row.id);
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
                          setStoreSelected(row.id);
                          setShowDeactivateModal(true);
                        }}
                      >
                        Deactivate
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          }}
        />
      )}
      {/* <CreateCustomer showModal={showModal} setShowModal={setShowModal} /> */}
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
                ? 'Are you sure you want to deactivate this store?'
                : 'Are you sure you want to activate this store?'}
            </h2>
            <div className={styles['button-container']}>
              <button
                className={`${styles.button} ${styles.yes}`}
                onClick={() => {
                  toggleStoreActivation();
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

export default withStoreContext(Store);
