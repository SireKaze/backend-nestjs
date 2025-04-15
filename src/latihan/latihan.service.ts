import { Injectable } from '@nestjs/common';

@Injectable()
export class LatihanService {
    findAll(query : any){
        return {
            msg : 'latihan service',
            params : query
        }
    }


    findDetail(id : string , name : string) {
        return {
            method : 'get',
            id : id,
            name : name
        }
    }

    register(payload : any){
        return{
            method : 'get',
            payload : payload
        }
    }
}
