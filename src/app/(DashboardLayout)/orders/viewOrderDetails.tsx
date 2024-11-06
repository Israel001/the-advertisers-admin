import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/Modal/Modal';
import { Cross1Icon } from '@radix-ui/react-icons';
import { formatWithNaira } from '@/libs/utils';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { useRouter } from 'next/navigation';

export interface IOrderViewDetailsProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  orderDetails: any;
  orderId?: number;
  status: string;
}

function ViewOrderDetails({
  showModal,
  setShowModal,
  orderDetails,
  orderId,
  status,
}: IOrderViewDetailsProps) {
  const router = useRouter();
  const [courers, setCourers] = useState([]);
  const [selectedCourers, setSelectedCourers] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${ServerRoutes.baseUrl}/fetch-admins`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          'pagination[page]': 1,
          'pagination[limit]': 40,
        },
      });
      const filteredAdmins = response.data.data.filter(
        (admin: any) => admin.role?.id === 6,
      );
      console.log('Admins:', filteredAdmins);
      setCourers(filteredAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleAssignCourer = (
    event: any,
    storeId: string,
    orderDetails: any,
  ) => {
    const selectedAgentId = event.target.value;
    setSelectedCourers((prev) => ({
      ...prev,
      [storeId]: selectedAgentId,
    }));
    assignShopToCourier(storeId, selectedAgentId);
    console.log('Assigned Admin ID for storeId', storeId, ':', selectedAgentId);
  };

  const assignShopToCourier = async (storeId: any, agentId: any) => {
    console.log('Unique Stores:', uniqueStores);
    try {
      const response = await axios.post(
        `${ServerRoutes.getOrderData}/${orderId}/store/${storeId}/assign-to-agent/${agentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            id: orderId,
            storeId: storeId,
            agentId: agentId,
          },
        },
      );
      console.log('Assigned:', response);
    } catch (error) {
      console.error('Error assigning agent to store:', error);
    }
  };

  const uniqueStores = Array.from(
    new Map(
      orderDetails?.cart?.map((item: any) => [
        item.storeName,
        {
          storeName: item.storeName,
          storeId: item.storeId,
        },
      ]),
    ).values(),
  );

  return (
    <Modal
      isOpen={showModal}
      onCloseModal={() => setShowModal(false)}
      text=""
      width="xl"
    >
      <div
        className="px-[40px] py-[30px]"
        style={{ maxHeight: '700px', width: '100%', overflowY: 'scroll' }}
      >
        <button
          style={{
            position: 'absolute',
            cursor: 'pointer',
            right: '20px',
            top: '20px',
            background: 'none',
            border: 'none',
            outline: 'none',
          }}
          onClick={() => setShowModal(false)}
        >
          <Cross1Icon />
        </button>
        <div className="checkout-main-content w-full">
          <div className="container-x mx-auto">
            <div className="w-full  ">
              <div className=" w-full">
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                  Personal Details
                </h1>

                <div className="form-area">
                  <form>
                    <div className="sm:flex sm:space-x-5 items-center mb-6">
                      <div className="sm:w-1/2  mb-5 sm:mb-0">
                        <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                          First Name{' '}
                        </h1>
                        <div className="w-full h-[50px] appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none mb-2">
                          {
                            orderDetails?.personalDetails?.full_name?.split(
                              ' ',
                            )[0]
                          }
                        </div>
                      </div>
                      <div className="flex-1">
                        <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                          Last Name{' '}
                        </h1>
                        <div className="w-full h-[50px] appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none mb-2">
                          {
                            orderDetails?.personalDetails?.full_name?.split(
                              ' ',
                            )[1]
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-5 items-center mb-6">
                      <div className="w-1/2">
                        <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                          Email Address{' '}
                        </h1>
                        <div className="w-full h-[50px] appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none mb-2">
                          {orderDetails?.personalDetails?.email}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                          Phone Number{' '}
                        </h1>
                        <div className="w-full h-[50px] appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none mb-2">
                          {orderDetails?.personalDetails?.phone}
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                        Address{' '}
                      </h1>
                      <div className="w-full h-[50px] appearance-none block w-full bg-gray-200 text-gray-500 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none mb-2">
                        {orderDetails?.personalDetails?.address}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                    Order Summary
                  </h1>
                  {orderDetails?.cart?.every(
                    (c: any) =>
                      c.status !==
                      'Mark order as packed, waiting for courier...',
                  ) ? (
                    status === 'SENT_FOR_DELIVERY' ? (
                      <span style={{ color: 'green' }}>Sent for Delivery</span>
                    ) : (
                      <button
                        style={{
                          fontSize: '15px',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '10px',
                          backgroundColor: '#0056b3',
                          outline: 'none',
                          marginLeft: '15px',
                          width: '220px',
                        }}
                        onClick={(event) => {
                          event.preventDefault();
                          axios
                            .put(
                              `${ServerRoutes.getOrderData}/${orderId}/${
                                status === 'PACKED_AND_READY_TO_SEND'
                                  ? 'SENT_FOR_DELIVERY'
                                  : 'PACKED_AND_READY_TO_SEND'
                              }`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    'accessToken',
                                  )}`,
                                },
                              },
                            )
                            .then(() => location.reload())
                            .catch((error) => {
                              if (error.response?.data?.statusCode === 401) {
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('user');
                                localStorage.removeItem('date');
                                router.push('/');
                              }
                            });
                        }}
                      >
                        {status === 'PACKED_AND_READY_TO_SEND'
                          ? 'Mark order as sent for delivery'
                          : 'Mark order as packed and ready to send'}
                      </button>
                    )
                  ) : (
                    <></>
                  )}
                </div>

                <hr className="mb-[40px]" />

                <div className="product-list w-full mb-[30px]">
                  {uniqueStores.map((store: any, idx) => (
                    <div key={idx} className="mb-6">
                      <h2 className="text-[25px] text-left text-qblack mb-2.5">
                        {store.storeName}
                      </h2>
                      Status:{' '}
                      {orderDetails.cart.find(
                        (c: any) => c.storeId === store.storeId,
                      ).status || 'PENDING'}
                      <div className="relative group mb-3">
                        {orderDetails.cart.find(
                          (c: any) => c.storeId === store.storeId,
                        ).status ? (
                          <select
                            id={`adminSelect-${store.storeName}`}
                            value={
                              orderDetails.cart.find(
                                (c: any) => c.storeId === store.storeId,
                              ).agentId || ''
                            }
                            onChange={(event) =>
                              handleAssignCourer(
                                event,
                                store?.storeId,
                                orderDetails,
                              )
                            }
                            className="block w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="">
                              Assign courier for {store.storeName}
                            </option>
                            {courers.length > 0 ? (
                              courers.map((courer: any) => (
                                <option key={courer?.id} value={courer.id}>
                                  {courer.fullName}
                                </option>
                              ))
                            ) : (
                              <option disabled>No couriers found</option>
                            )}
                          </select>
                        ) : (
                          <>
                          </>
                        )}
                      </div>
                      <ul className="flex flex-col space-y-5">
                        {orderDetails?.cart
                          ?.filter(
                            (item: any) => item.storeName === store.storeName,
                          )
                          .map((item: any, idx: any) => (
                            <li
                              key={idx}
                              className="flex justify-between items-center gap-14"
                            >
                              <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`}
                                  alt="product"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="text-[15px] text-left text-qblack mb-2.5">
                                  {item.name}{' '}
                                  <sup className="text-[13px] text-qgray ml-2">
                                    x{item.quantity}
                                  </sup>
                                </h4>
                              </div>
                              <div className="flex items-center">
                                <span className="text-[15px] text-qblack font-medium">
                                  {formatWithNaira(parseFloat(item.price))}
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                      <hr className="mx-[20px] my-[50px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ViewOrderDetails;
