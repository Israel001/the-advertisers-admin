'use client';

import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../product/product.module.scss';
import Table from '@/components/Table/Table';
import { IOrder } from '@/types/shared';
import withOrderContext from './withOrderContext';
import CustomPagination from '@/components/CustomPagination/CustomPagination';
import ViewOrderDetails from './viewOrderDetails';
import { formatWithNaira } from '@/libs/utils';

const Order = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderSelected, setOrderSelected] = useState<number>();
  const [orderSelectedDetails, setOrderSelectedDetails] = useState();
  const [orderStatus, setOrderStatus] = useState('');

  const [forceRefresh, setForceRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(40);
  const { setOrderData, orderData, totalData, setTotalData } = useAppContext();

  useEffect(() => {
    setLoading(true);
    let url = `${ServerRoutes.getOrderData}s?pagination[page]=${page}&pagination[limit]=${limit}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setOrderData(response.data.data);
        setTotalData(response?.data?.pagination?.total);
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
  }, [forceRefresh, page]);

  return (
    <div>
      <h2 className={styles.pageHeader}>Orders</h2>
      {loading ? (
        'Loading....'
      ) : (
        <>
          <Table
            headers={[
              {
                id: 1,
                label: 'Order No',
              },
              {
                id: 2,
                label: 'Date',
              },
              {
                id: 3,
                label: 'Status',
              },
              {
                id: 4,
                label: 'Amount',
              },
              {
                id: 7,
                label: 'Actions',
              },
            ]}
            data={orderData}
            renderRow={(row: IOrder, index: number) => {
              return (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.createdAt.split('T')[0]}</td>
                  <td>{row.status}</td>
                  <td> {formatWithNaira(parseFloat(row.payment?.amount))}</td>
                  <td>
                    <span
                      style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setOrderSelected(row.id);
                        setOrderStatus(row.status);
                        setOrderSelectedDetails(JSON.parse(row?.details));
                        setShowDetailsModal(true);
                      }}
                    >
                      View Details
                    </span>
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
      <ViewOrderDetails
        showModal={showDetailsModal}
        setShowModal={setShowDetailsModal}
        orderDetails={orderSelectedDetails}
        orderId={orderSelected}
        status={orderStatus}
      />
    </div>
  );
};

export default withOrderContext(Order);
