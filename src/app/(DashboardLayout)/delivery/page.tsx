'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const Delivery = () => {
  interface CartItem {
    id: string;
    name: string;
    quantity: number;
    agentId: number;
  }

  interface OrderItem {
    orderId: number;
    details: CartItem[];
    status: string;
    storeName: string;
    storePhone: string;
    storeAddress: string;
    storeId: string;
    id: string;
    reference: string;
  }

  const router = useRouter();
  const [deliveriesFromStores, setDeliveriesFromStores] = useState<
    Record<string, OrderItem[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [deliveryAgentId, setDeliveryAgentId] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>('');
  const [toggledStores, setToggledStores] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const userId = userString ? JSON.parse(userString).id : null;
    setDeliveryAgentId(userId);
  }, []);

  const toggleStore = (storeName: string) => {
    setToggledStores((prev) => ({
      ...prev,
      [storeName]: !prev[storeName],
    }));
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = `${ServerRoutes.baseUrl}/deliveries`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      console.log('Response:', response.data);
      const orders: any = response.data.flatMap((order: any) => {
        return order.cartItems.map((item: any) => {
          return {
            orderId: order.orderId,
            reference: order.referenceNumber,
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            storeName: item.storeName,
            storePhone: item.storePhone,
            storeAddress: item.storeAddress,
            status: item.status,
          };
        });
      });

      console.log(orders);
      const groupedDeliveries: Record<any, any> = {};
      orders?.forEach((item: any) => {
        const store = item.storeName;
        if (!groupedDeliveries[store]) {
          groupedDeliveries[store] = [];
        }
        groupedDeliveries[store].push(item);
      });

      console.log('Grouped deliveries:', groupedDeliveries);

      setDeliveriesFromStores({...groupedDeliveries});
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('date');
        router.push('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!deliveryAgentId) return;

    fetchOrders();
  }, [page, deliveryAgentId]);

  const handleReceiveFromStore = async (
    orderId: number,
    products: number[],
    storeId: number,
  ) => {
    try {
      // Call the API to collect the product from the store
      await axios.post(
        `${ServerRoutes.baseUrl}/order/${orderId}/collect-product-from-seller`,
        { products, storeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      setButtonText('Dropped at Distribution Center');
      alert('Product collected from store');
    } catch (error) {
      console.error('Error collecting product from store:', error);
    }
  };

  const handleDropAtDistributionCenter = async (
    orderId: number,
    products: number[],
    storeId: number,
  ) => {
    try {
      // Call the API to drop the product at the distribution center
      await axios.post(
        `${ServerRoutes.baseUrl}/order/${orderId}/drop-product-at-distribution-center`,
        { products, storeId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      fetchOrders();
    } catch (error) {
      console.error('Error dropping product at distribution center:', error);
    }
  };

  const renderButton = useCallback(
    (status: string, orderId: number, products: number[], storeId: number) => {
      switch (status) {
        case 'Given to courier':
          return (
            <button
              onClick={() => handleReceiveFromStore(orderId, products, storeId)}
              className="p-[15px] text-white bg-blue-600 rounded-[20px]"
            >
              {buttonText !== '' ? buttonText : 'Receive from Store'}
            </button>
          );
        case 'PRODUCT_COLLECTED_FROM_SELLER_BY_DELIVERY_AGENT':
          return (
            <button
              onClick={() => handleDropAtDistributionCenter(orderId, products, storeId)}
              className="p-[15px] text-white bg-blue-600 rounded-[20px]"
            >
              {buttonText !== ''
                ? buttonText
                : 'Dropped at distribution center'}
            </button>
          );
        case 'PRODUCT_DROPPED_AT_DISTRIBUTION_CENTER_BY_DELIVERY_AGENT':
          return (
            <span className="text-gray-500">
              {buttonText !== ''
                ? buttonText
                : 'Product dropped at distribution center'}
            </span>
          );
        default:
          return null;
      }
    },
    [buttonText],
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Deliveries</h2>

      {loading ? (
        <p className="text-center text-lg text-gray-500">Loading...</p>
      ) : (
        <>
          <section className="mb-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                Deliveries to be Received from Stores
              </h3>
            </div>
            {Object.keys(deliveriesFromStores).length > 0 ? (
              Object.entries(deliveriesFromStores).map(([storeName, items]) => {
                // Group items by orderId
                const itemsByOrder: Record<string, typeof items> = items.reduce(
                  (acc: any, item: any) => {
                    acc[item.orderId] = acc[item.orderId] || [];
                    acc[item.orderId].push(item);
                    return acc;
                  },
                  {},
                );

                return (
                  <div key={storeName} className="mb-8">
                    <div>
                      <div
                        className="flex items-center justify-between mb-4 p-2 hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md"
                        onClick={() => toggleStore(storeName)}
                      >
                        <div className="flex items-center space-x-2">
                          {toggledStores[storeName] ? (
                            <FaChevronDown className="text-gray-500" />
                          ) : (
                            <FaChevronRight className="text-gray-500" />
                          )}
                          <h3 className="text-lg font-semibold text-blue-600">
                            {storeName}
                          </h3>
                        </div>
                      </div>
                      <div className="text-gray-600 mb-2">
                        <p>Phone: {items[0]?.storePhone}</p>
                        <p>Address: {items[0]?.storeAddress}</p>
                      </div>
                    </div>

                    {toggledStores[storeName] && (
                      <>
                        {Object.entries(itemsByOrder).map(
                          ([orderId, orderItems]) => (
                            <div key={orderId} className="mb-8">
                              <div className="flex justify-between align-center items-center py-[30px]">
                                <h4 className="text-md font-semibold text-gray-700 mb-2">
                                  Reference: {orderItems[0].reference}
                                </h4>
                                <div className="mt-4">
                                  {renderButton(
                                    orderItems[0].status,
                                    orderItems[0].orderId,
                                    orderItems.map((i) => Number(i.id)),
                                    Number(orderItems[0].storeId),
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                {orderItems.map((item: any) => (
                                  <div
                                    key={item.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                                  >
                                    <p className="text-gray-700 font-medium">
                                      Item: {item.name}
                                    </p>
                                    <p className="text-gray-600">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">
                No deliveries to receive from stores.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Delivery;
