import { Injectable } from '@nestjs/common';
import { filter } from 'rxjs';


@Injectable()
export class TugasService {
    tugas(){
        return {
            msg : 'success',
            filter : {
                page : 10,
                page_size : 1
            }            
        }
    }
    
    tugas2( id : string){
        return {
            status:'success',
            msg :`user dengan id ${id} berhasil ditemukan`
        }
    }

    tugas3(payload : any){
        return{
            status : 'success',
            msg : 'berhasil disimpan',
            payload : payload
        }
    }

    tugas4( id : string){
        return {
            status:'success',
            msg :`user dengan id ${id} berhasil dihapus`
        }
    }

}
