'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ServerRoutes } from '@/libs/app_routes';
import { IProductData } from '@/types/shared';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const ProductDetail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<IProductData>();

  const id = searchParams.get('id');

  if (!id) router.push('/product');

  useEffect(() => {
    axios
      .get(`${ServerRoutes.getProductData}s/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setProductData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.data?.statusCode === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.removeItem('date');
          router.push('/');
        }
      });
  }, [id]);

  return loading ? (
    'Loading...'
  ) : (
    <div>
      <div>Name: {productData?.name}</div>
      <br />
      <div>
        Featured Image: <br />{' '}
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${productData?.featuredImage}`}
          style={{ maxHeight: '300px' }}
        />
      </div>
      <br />
      <div>
        Images: <br />{' '}
        <div
          style={{
            width: '800px',
            margin: 'auto',
          }}
        >
          <Slider
            {...{
              dots: true,
              infinite: true,
              speed: 500,
              slidesToShow: 3,
              slidesToScroll: 1,
            }}
          >
            {productData?.images.split(',').map((image, idx) => {
              return (
                <div key={idx}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                    style={{ marginRight: '1rem' }}
                  />
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
      <br />
      <div>
        Description: <br />{' '}
        <div
          dangerouslySetInnerHTML={{
            __html: productData?.description || 'No description',
          }}
        ></div>
      </div>
      <br />
      <div>Quantity: {productData?.quantity}</div>
      <br />
      <div>Out of Stock: {String(productData?.outOfStock)}</div>
      <br />
      <div>Avg Rating: {productData?.avgRating}</div>
      <br />
      <div>Store: {productData?.store.storeName}</div>
      <br />
      <div>Published: {String(productData?.published)}</div>
      <br />
      <div>Brand: {productData?.brand}</div>
      <br />
      <div>Category: {productData?.category.name}</div>
      <br />
      <div>Main Category: {productData?.mainCategory.name}</div>
      <br />
      <div>
        Price:{' '}
        {parseFloat(productData!.discountPrice) > 0 ? (
          <span>
            <span style={{ textDecoration: 'line-through', fontSize: '.8rem' }}>
              {productData!.price}
            </span>{' '}
            <span>{productData?.discountPrice}</span>
          </span>
        ) : (
          productData?.price
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
