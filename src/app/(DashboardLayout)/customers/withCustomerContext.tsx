/* eslint-disable react/display-name */
import { useAppContext } from '@/app-context';
import { ServerRoutes } from '@/libs/app_routes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withCustomerContext = (Component: () => JSX.Element) => {
  return () => {
    const { setCustomerData } = useAppContext();
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);
    const [limit, setLimit] = useState(40);
    const [page, setPage] = useState(1);
    const getCustomerData = async (accessToken: string) => {
      await axios
        .get(
          `${ServerRoutes.getCustomerData}s?pagination[page]=${page}&pagination[limit]=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .then((response) => setCustomerData(response.data.data))
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
      getCustomerData(accessToken!);
      setLoading(false);
    }, []);

    return isLoading ? 'Loading' : <Component />;
  };
};

export default withCustomerContext;
