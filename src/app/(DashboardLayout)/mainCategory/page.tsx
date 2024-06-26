'use client';

import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../product/product.module.scss';
import SearchComponent from '@/components/Filter/Filter';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import Table from '@/components/Table/Table';
import { ICategory } from '@/types/shared';
import { Modal } from '@/components/Modal/Modal';
import withMainCategoryContext from './withMainCategoryContext';
import CreateMainCategory from './CreateMainCategory';
import CustomPagination from '@/components/CustomPagination/CustomPagination';

const MainCategory = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categorySelected, setCategorySelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [mainCategory, setMainCategory] = useState<ICategory>();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(40);
  const [roleName, setRolename] = useState('');
  const { setMainCategoryData, mainCategoryData, totalData, setTotalData } =
    useAppContext();

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
    let url = `${ServerRoutes.getMainCategoriesData}?pagination[page]=${page}&pagination[limit]=${limit}`;
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
        setMainCategoryData(response.data.data);
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
  }, [searchQuery, page, forceRefresh]);

  const deleteMainCategory = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .delete(`${ServerRoutes.baseUrl}/main-category/${categorySelected}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setPage(1);
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
      <h2 className={styles.pageHeader}>Main Category</h2>
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
            <PlusCircledIcon /> Create Main Category
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
                label: 'Category Id',
              },
              {
                id: 2,
                label: 'Category Name',
              },
              {
                id: 3,
                label: 'Category Image',
              },
              {
                id: 4,
                label: 'Category Description',
              },
              {
                id: 5,
                label: 'Date Created',
              },
              {
                id: 6,
                label: 'Actions',
              },
            ]}
            data={mainCategoryData}
            renderRow={(row: ICategory, index: number) => {
              return (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>
                    {row.name.length > 20
                      ? `${row.name.substring(0, 20)}...`
                      : row.name}
                  </td>
                  <td>
                    {
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${row.featuredImage}`}
                        style={{ height: '50px' }}
                      />
                    }
                  </td>
                  <td>
                    {row.description.length > 20
                      ? `${row.description.substring(0, 20)}...`
                      : row.description}
                  </td>
                  <td>{row.createdAt.split('T')[0]}</td>
                  <td>
                    <div>
                      {roleName !== 'User' && roleName !== 'Simple User' && (
                        <span
                          style={{
                            display: 'inline-block',
                            marginRight: '1rem',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setShowModal(true);
                            setMainCategory(row);
                            setIsEditMode(true);
                          }}
                        >
                          Edit
                        </span>
                      )}
                      {roleName !== 'Editor' &&
                        roleName !== 'User' &&
                        roleName !== 'Simple User' && (
                          <span
                            style={{
                              color: 'red',
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setCategorySelected(row.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </span>
                        )}
                    </div>
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
      <CreateMainCategory
        showModal={showModal}
        setShowModal={setShowModal}
        isEditMode={isEditMode}
        mainCategory={mainCategory}
      />
      <Modal
        isOpen={showDeleteModal}
        onCloseModal={() => setShowDeleteModal(false)}
        text=""
      >
        {showDeleteModal && (
          <div className={styles.pricingApproveModal}>
            <h2>Are you sure you want to delete this category?</h2>
            <h2>
              Note: Deleting this category will cause the system to delete all
              the sub categories and products related to it.
            </h2>
            <div className={styles['button-container']}>
              <button
                className={`${styles.button} ${styles.yes}`}
                onClick={() => {
                  deleteMainCategory();
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

export default withMainCategoryContext(MainCategory);
