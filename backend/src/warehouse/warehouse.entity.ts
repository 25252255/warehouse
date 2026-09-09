import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity('warehouse')
export class Warehouse {
    @PrimaryGeneratedColumn()
    warehouseId: number;

    @Column({type: 'varchar', length: 100})
    warehouseName: string;

    @Column({type: 'varchar', length: 200})
    location: string;

    @Column({type: 'boolean', default: false})
    isSet: boolean;

}

// 1. Entity 작성
// 2. DTO 작성 (DTO는 클라이언트가 보내는 요청 데이터의 형태)
// 3. Warehouse 모듈 작성 (일반 객체를 Warehouse Entity 객체로 만드는 작업)
//     TypeOrmModule.forFeature([Warehouse]) 가 하는 일
//     3-1. Warehouse Entity를 TypeORM에 등록
//     3-2. Repository<Warehouse>를 생성 및 NestJS DI 컨테이너에 등록
// 4. Service 작성
// 5. Controller 작성
// 6. AppModule에 등록

// 연결되는 과정은 다음과 같습니다.
// AppModule
// → WarehouseModule 불러오기
// → TypeOrmModule.forFeature([Warehouse])
// → Warehouse Entity 등록
// → Repository<Warehouse> 생성 및 DI 등록
// → WarehouseService에 Repository 주입
// → WarehouseController에 WarehouseService 주입