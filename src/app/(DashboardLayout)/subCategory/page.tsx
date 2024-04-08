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
import withSubCategoryContext from './withSubCategoryContext';
import CreateSubCategory from './CreateSubCategory';

const SubCategory = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categorySelected, setCategorySelected] = useState<number>();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [subCategory, setSubCategory] = useState<ICategory>();

  const { setSubCategoryData, subCategoryData } = useAppContext();

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getCategoriesData}?pagination[page]=${page}&pagination[limit]=50`;
    if (searchQuery) {
      url = `${url}&search=${searchQuery}`;
    }
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => setSubCategoryData(response.data))
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

  const deleteSubCategory = async () => {
    const accessToken = localStorage.getItem('accessToken');
    await axios
      .delete(`${ServerRoutes.baseUrl}/sub-category/${categorySelected}`, {
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
      <h2 className={styles.pageHeader}>Sub Category</h2>
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
          <PlusCircledIcon /> Create Sub Category
        </button>
      </div>
      {loading ? (
        'Loading....'
      ) : (
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
              label: 'Main Category Name',
            },
            {
              id: 4,
              label: 'Category Image',
            },
            {
              id: 5,
              label: 'Category Description',
            },
            {
              id: 6,
              label: 'Date Created',
            },
            {
              id: 7,
              label: 'Actions',
            },
          ]}
          data={subCategoryData}
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
                  {row.mainCategory.name.length > 20
                    ? `${row.mainCategory.name.substring(0, 20)}...`
                    : row.mainCategory.name}
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
                <td>{row.createdAt}</td>
                <td>
                  <div>
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
                        setSubCategory(row);
                        setIsEditMode(true);
                      }}
                    >
                      Edit
                    </span>
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
                  </div>
                </td>
              </tr>
            );
          }}
        />
      )}
      <CreateSubCategory
        showModal={showModal}
        setShowModal={setShowModal}
        isEditMode={isEditMode}
        subCategory={subCategory}
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
              the products related to it.
            </h2>
            <div className={styles['button-container']}>
              <button
                className={`${styles.button} ${styles.yes}`}
                onClick={() => {
                  deleteSubCategory();
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

export default withSubCategoryContext(SubCategory);
