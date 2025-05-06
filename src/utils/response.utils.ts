/* eslint-disable prettier/prettier */
import { ResponsePagination, ResponseSuccess } from "src/interface";

class BaseResponse {

    _succes(message: string, data?: any, statusCode: number = 200): ResponseSuccess {
        return {
          status: "success",
          message: message,
          data: data || {},
          statusCode: statusCode, // Add the statusCode field
        };
      }
      
  _pagination(
    message: string,
    data: any,
    total: number,
    page: number,
    pageSize: number,
    statusCode: number = 200 // Add statusCode here with a default value of 200
  ): ResponsePagination {
    return {
      status: "success",
      message: message,
      data: data || {},
      pagination: {
        total: total,
        page: page,
        pageSize: pageSize,
        totalPage: Math.ceil(total / pageSize),
      },
      statusCode: statusCode, // Add the statusCode field
    };
  }
}

export default BaseResponse;
