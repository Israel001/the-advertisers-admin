import { ReactNode, createContext, useContext, useState } from 'react';
import {
  IAdmin,
  ICategory,
  ICustomer,
  IProductData,
  IStore,
  IOrder,
} from './types/shared';

export interface IAppContext {
  productData: IProductData[];
  setProductData: (streetData: IProductData[]) => void;
  mainCategoryData: ICategory[];
  setMainCategoryData: (categoryData: ICategory[]) => void;
  subCategoryData: ICategory[];
  setSubCategoryData: (categoryData: ICategory[]) => void;
  adminData: IAdmin[];
  setAdminData: (adminData: IAdmin[]) => void;
  customerData: ICustomer[];
  setCustomerData: (customerData: ICustomer[]) => void;
  storeData: IStore[];
  setStoreData: (storeData: IStore[]) => void;
  orderData: IOrder[];
  setOrderData: (orderData: IOrder[]) => void;
  totalData?: number;
  setTotalData: (totalData: number) => void;
  userRoleData?: string;
  setUserRoleData: (userRoleData: string) => void;
}

const AppContext = createContext<IAppContext>({} as any);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [productData, setProductData] = useState([] as IProductData[]);
  const [mainCategoryData, setMainCategoryData] = useState([] as ICategory[]);
  const [subCategoryData, setSubCategoryData] = useState([] as ICategory[]);
  const [adminData, setAdminData] = useState([] as IAdmin[]);
  const [customerData, setCustomerData] = useState([] as ICustomer[]);
  const [storeData, setStoreData] = useState([] as IStore[]);
  const [orderData, setOrderData] = useState([] as IOrder[]);
  const [totalData, setTotalData] = useState<number>();
  const [userRoleData, setUserRoleData] = useState("");

  return (
    <AppContext.Provider
      value={{
        productData,
        setProductData,
        mainCategoryData,
        setMainCategoryData,
        subCategoryData,
        setSubCategoryData,
        adminData,
        setAdminData,
        customerData,
        setCustomerData,
        storeData,
        setStoreData,
        orderData,
        setOrderData,
        totalData,
        setTotalData,
        userRoleData,
        setUserRoleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { ContextProvider, useAppContext, AppContext };
