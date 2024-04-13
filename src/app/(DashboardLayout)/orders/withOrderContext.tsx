/* eslint-disable react/display-name */
import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withOrderContext = (Component: () => JSX.Element) => {
  return () => {
    const { setOrderData } = useAppContext();
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(40);
    const getOrderData = async (accessToken: string) => {
      await axios
        .get(
          `${ServerRoutes.getOrderData}s?pagination[page]=${page}&pagination[limit]=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then((response) => setOrderData(response.data.data))
        .catch((error) => {
          if (error.response?.data?.statusCode === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            localStorage.removeItem('date');
            router.push('/');
          }
        });
      return true;
    };

    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      const date = localStorage.getItem('date');
      const expiredToken = date && new Date().getTime() - +date > 3.6e6;
      if (!accessToken || !user || expiredToken !== false) router.push('/');
      getOrderData(accessToken!);
      setLoading(false);
    }, []);

    return isLoading ? 'Loading' : <Component />;
  };
};

export default withOrderContext;
