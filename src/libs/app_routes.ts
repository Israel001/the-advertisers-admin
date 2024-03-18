export class ServerRoutes {
  static baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`;
  static login = `${this.baseUrl}/auth/login`;
  static getProductData = `${this.baseUrl}/product`;
  static getCategoriesData = `${this.baseUrl}/categories`;
  static getMainCategoriesData = `${this.baseUrl}/main-categories`;
}
