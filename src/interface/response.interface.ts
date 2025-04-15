export interface ResponseSuccess {
  statusCode: number;  // Menambahkan statusCode
  status: string;
  message: string;
  data?: any;
}

export interface ResponsePagination extends ResponseSuccess {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
  };
}
