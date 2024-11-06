'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';

const Delivery = () => {
  interface PersonalDetails {
    full_name: string;
    address: string;
    phone: string;
  }

  interface CartItem {
    id: string;
    name: string;
    quantity: number;
    adminUser: {
      id: string;
      email: string;
      fullName: string;
    };
    storeName: string;
  }

  interface Order {
    id: string;
    personalDetails: PersonalDetails;
    details: CartItem[];
    adminUser: {
      id: string;
      email: string;
      fullName: string;
    };
  }

  interface Delivery {
    orderId: string;
    items: {};
    personalDetails: PersonalDetails;
  }

  const router = useRouter();
  const [deliveriesFromStores, setDeliveriesFromStores] = useState<any>([]);
  const [ordersToCustomers, setOrdersToCustomers] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [deliveryAgentId, setDeliveryAgentId] = useState<string | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const userId = userString ? JSON.parse(userString).id : null;
    setDeliveryAgentId(userId);
  }, []);

  useEffect(() => {
    if (!deliveryAgentId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const url = `${ServerRoutes.baseUrl}/deliveries`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        const orders: Order[] = response.data.data;
        console.log(orders);

        const deliveriesToBeReceived = orders
          .filter((order) => order.adminUser?.id === deliveryAgentId)
          .map((order) => ({
            orderId: order.id,
            items:
              typeof order.details === 'string'
                ? JSON.parse(order.details)
                : order.details,
            personalDetails: order.adminUser,
          }));
        console.log(deliveriesToBeReceived, 'deliveriesToBeReceived');

        const ordersToDeliver = orders
          .filter((order: any) => {
            const orderDetails =
              typeof order.details === 'string'
                ? JSON.parse(order.details)
                : order.details;

            return orderDetails.cart.some(
              (product: any) => product.adminUserId === deliveryAgentId,
            );
          })
          .map((order: any) => ({
            id: order.id,
            personalDetails: order.personalDetails,
            adminUser: order.adminUser,
            items:
              typeof order.details === 'string'
                ? JSON.parse(order.details)
                : order.details,
          }));

        console.log(ordersToDeliver, 'ordersToDeliver');
        setDeliveriesFromStores(deliveriesToBeReceived);
        setOrdersToCustomers(ordersToDeliver);

        console.log(deliveriesFromStores, 'deliveriesFromStores');
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

    fetchOrders();
  }, [page, deliveryAgentId]);

  const groupedDeliveries = deliveriesFromStores.reduce(
    (acc: any, order: any) => {
      order.items.cart
        .filter((item: any) => item.adminUserId === deliveryAgentId)
        .forEach((item: any) => {
          const store = item.storeName;
          if (!acc[store]) {
            acc[store] = [];
          }
          acc[store].push(item);
        });
      return acc;
    },
    {},
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
            {Object.keys(groupedDeliveries).length > 0 ? (
              Object.entries(groupedDeliveries).map(
                ([storeName, items]: [string, any]) => (
                  <div key={storeName} className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-blue-600 mb-4">
                        {storeName}
                      </h3>
                      <button className="p-[15px] text-white bg-blue-400 rounded-[20px]">
                        Received from store
                      </button>
                    </div>

                    <div className="space-y-4">
                      {items.map((item: any) => (
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
                          <p className="text-gray-600">
                            Store: {item.storeName}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )
            ) : (
              <p className="text-center text-gray-500">
                No deliveries to receive from stores.
              </p>
            )}
          </section>

          {/* <section>
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              Orders to be Taken to Customers
            </h3>
            {ordersToCustomers.length > 0 ? (
              <div className="space-y-4">
                {ordersToCustomers
                  .filter(
                    (order: any) => order.adminUser?.id === deliveryAgentId,
                  )
                  .map((order: any) => (
                    <div
                      key={order.id}
                      className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                      <p className="font-semibold text-gray-700">
                        Order ID: {order.id}
                      </p>
                      <p className="text-gray-600">
                        Customer: {order.items.personalDetails.full_name}
                      </p>
                      <p className="text-gray-600">
                        Address: {order.items.personalDetails.address}
                      </p>
                      <p className="text-gray-600">
                        Phone Number: +{order.items.personalDetails.phone}
                      </p>
                      <div className="space-y-2 mt-2">
                        {order.items.cart.map((item: any) => (
                          <div
                            key={item.id}
                            className="border-t border-gray-100 pt-2"
                          >
                            <p className="text-gray-700 font-medium">
                              Item: {item.name}
                            </p>
                            <p className="text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-gray-600">
                              Store: {item.storeName}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No orders to take to customers.
              </p>
            )}
          </section> */}
        </>
      )}
    </div>
  );
};

export default Delivery;
