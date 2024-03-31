import { ReactNode, createContext, useContext, useState } from 'react';
import { IAdmin, ICategory, IProductData } from './types/shared';

export interface IAppContext {
  productData: IProductData[];
  setProductData: (streetData: IProductData[]) => void;
  mainCategoryData: ICategory[];
  setMainCategoryData: (categoryData: ICategory[]) => void;
  subCategoryData: ICategory[];
  setSubCategoryData: (categoryData: ICategory[]) => void;
  adminData: IAdmin[];
  setAdminData: (adminData: IAdmin[]) => void;
}

const AppContext = createContext<IAppContext>({} as any);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [productData, setProductData] = useState([] as IProductData[]);
  const [mainCategoryData, setMainCategoryData] = useState([] as ICategory[]);
  const [subCategoryData, setSubCategoryData] = useState([] as ICategory[]);
  const [adminData, setAdminData] = useState([] as IAdmin[]);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { ContextProvider, useAppContext, AppContext };
