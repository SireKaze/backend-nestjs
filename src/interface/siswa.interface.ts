export interface ResponseSuccess {
    status: string;
    message: string;
    data?: any;
}

// export interface ResponsePagination extends ResponseSuccess {
//   pagination : {
//     total : number ,
//     page : number ,
//     pageSize : number,
//     totalPage : number,

//   }
// }
export interface ResponsePagination {
  status: string;
  message: string;
  data: any;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    total_page: number;
    nextPage?: number ; 
    previosPage?: number; 
  };
}