import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEmail, Matches, Length , max , min , length} from 'class-validator';

export class SiswaDto {
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString()

  nama: string;

  @IsNotEmpty({ message: 'Tempat lahir tidak boleh kosong' })
  @IsString()
  tempat_lahir: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format Tanggal Lahir salah' })
  tanggal_lahir: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 100, { message: 'NISN harus terdiri dari 10 karakter' })
  nisn: string;

  @IsNotEmpty()
  @IsString()
  @Length(16,100,{ message: 'NIK harus terdiri dari 16 karakter' })
  nik: string;


  @IsEmail({}, { message: 'Format email salah, harap masukkan email yang valid' })
  email: string;


  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  @IsString()
  alamat: string;
}