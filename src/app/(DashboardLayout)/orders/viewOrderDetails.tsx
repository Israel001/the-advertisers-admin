import React from 'react';
import { Modal } from '@/components/Modal/Modal';
import { Cross1Icon } from '@radix-ui/react-icons';
import { formatWithNaira } from '@/libs/utils';

export interface IOrderViewDetailsProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  orderDetails: any;
}

function ViewOrderDetails({
  showModal,
  setShowModal,
  orderDetails,
}: IOrderViewDetailsProps) {
  console.log('sdzcs', orderDetails);

  return (
    <Modal isOpen={showModal} onCloseModal={() => setShowModal(false)} text="">
      <div
        className="px-[40px] py-[30px]"
        style={{ maxHeight: '500px', width: '800px', overflowY: 'scroll' }}
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
                <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
                  Order Summary
                </h1>

                <div className="w-full px-10 py-[30px] border border-[#EDEDED]">
                  <div className="sub-total mb-6">
                    <div className=" flex justify-between mb-5">
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        product
                      </p>
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        total
                      </p>
                    </div>
                    <div className="w-full h-[1px] bg-[#EDEDED]"></div>
                  </div>
                  <div className="product-list w-full mb-[30px]">
                    <ul className="flex flex-col space-y-5">
                      {orderDetails?.cart?.map((x: any, idx: any) => (
                        <a
                          key={idx}
                          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/single-product/${x.id}`}
                        >
                          <li>
                            <div className="flex justify-between items-center gap-14">
                              <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED]">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${x.image}`}
                                  alt="product"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="text-[15px] text-left text-qblack mb-2.5 flex items-center">
                                  <span className="w-[250px] whitespace-nowrap overflow-hidden overflow-ellipsis block">
                                    {x?.name}
                                  </span>

                                  <sup className="text-[13px] text-qgray ml-2 mt-2">
                                    x{x.quantity}
                                  </sup>
                                </h4>
                              </div>
                              <div className="flex items-center">
                                <span className="text-[15px] text-qblack font-medium">
                                  {formatWithNaira(parseFloat(x.price))}
                                </span>
                                <button
                                  style={{
                                    fontSize: '11px',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '10px',
                                    backgroundColor: '#0056b3',
                                    outline: 'none',
                                    marginLeft: '15px',
                                    width: '120px',
                                  }}
                                >
                                  Mark order as packed and <br /> ready to send
                                </button>
                              </div>
                            </div>
                          </li>
                        </a>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full h-[1px] bg-[#EDEDED]"></div>

                  <div className="mt-[30px]">
                    <div className=" flex justify-between mb-5">
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        SUBTOTAL
                      </p>
                      <p className="text-[15px] font-medium text-qblack uppercase">
                        {formatWithNaira(
                          parseFloat(
                            orderDetails?.cart?.reduce(
                              (prev: any, cur: { total: any }) =>
                                prev + cur.total,
                              0,
                            ),
                          ),
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="w-full mt-[30px]">
                    <div className="flex justify-between sub-total mb-6">
                      <span className="text-[15px] font-medium text-qblack mb-[18px] block">
                        Shipping (
                        {`${orderDetails?.shipping?.type
                          .split('_')
                          .map(
                            (s: string) =>
                              s.charAt(0).toUpperCase() + s.slice(1),
                          )
                          .join(' ')}`}
                        )
                      </span>
                      <span className="text-[15px] text-normal text-qgraytwo">
                        {formatWithNaira(
                          parseFloat(orderDetails?.shipping?.amount),
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-[30px]">
                    <div className=" flex justify-between mb-5">
                      <p className="text-[13px] font-medium text-qblack uppercase">
                        TOTAL
                      </p>
                      <p className="text-[15px] font-medium text-qblack uppercase">
                        {formatWithNaira(
                          parseFloat(
                            orderDetails?.cart?.reduce(
                              (prev: any, cur: { total: any }) =>
                                prev + cur.total,
                              0,
                            ) + orderDetails?.shipping?.amount,
                          ),
                        )}
                      </p>
                    </div>
                  </div>
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
