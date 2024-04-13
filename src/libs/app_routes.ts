export class ServerRoutes {
  static baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`;
  static login = `${this.baseUrl}/auth/login`;
  static getProductData = `${this.baseUrl}/product`;
  static getCategoriesData = `${this.baseUrl}/categories`;
  static getMainCategoriesData = `${this.baseUrl}/main-categories`;
  static getAdminData = `${this.baseUrl}/fetch-admins`;
  static getCustomerData = `${this.baseUrl}/customer`;
  static getStoreData = `${this.baseUrl}/store`;
  static getOrderData = `${this.baseUrl}/order`;
  static getStatesData = `${process.env.NEXT_PUBLIC_BACKEND_URL}/lists/states`;
  static getAllRolesData = `${this.baseUrl}/roles`;
}
