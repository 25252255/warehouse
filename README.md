# Warehouse
TypeScript, React, NestJS를 익히기 위해 만든 창고 관리 CRUD 학습 프로젝트입니다.

사용자가 React 화면에서 창고 정보를 입력하면 NestJS API가 요청을 받고, TypeORM Repository를 통해 Docker의 MySQL에 저장합니다.

## 개요

- React의 컴포넌트, Props, 상태 관리 학습
- NestJS의 Module, Controller, Service, 의존성 주입 학습
- DTO, Entity, Repository의 역할 구분
- HTTP Method를 사용한 REST API 구현
- Docker로 로컬 MySQL 실행
- TypeORM을 통한 객체와 MySQL 테이블 연결

## 개발 환경 및 기술

| 구분 | 기술 | 프로젝트에서의 역할 |
| --- | --- | --- |
| Language | TypeScript | 프론트엔드와 백엔드 공통 개발 언어 |
| Frontend | React, Vite | 창고 등록·조회·수정·삭제 화면 구성 |
| Backend | NestJS | REST API와 Controller-Service 구조 구성 |
| ORM | TypeORM | Entity와 MySQL 테이블 매핑 및 Repository 제공 |
| Database Driver | mysql2 | Node.js와 MySQL 사이의 실제 통신 처리 |
| Database | MySQL | 창고 데이터 저장 |
| Infrastructure | Docker Compose | 로컬 MySQL 서버 실행 및 데이터 볼륨 관리 |
| Configuration | `@nestjs/config` | `.env`의 DB 접속 정보 로드 |

## 구현 기능

- DB 연결 상태 확인
- 창고 등록
- 등록된 창고 목록 조회
- 창고 위치 수정
- 창고 삭제
- 요청 진행 상태 및 성공·실패 메시지 표시


## 전체 요청 흐름

```text
사용자 입력
  → React 컴포넌트
  → fetch('/api/warehouse')
  → Vite 개발 서버 Proxy
  → NestJS Controller
  → WarehouseService
  → TypeORM Repository<Warehouse>
  → mysql2
  → Docker MySQL
```

개발 환경에서 React는 `5173` 포트, NestJS는 `3000` 포트로 실행됩니다. React가 `/api`로 요청하면 Vite Proxy가 NestJS로 전달합니다.

```text
브라우저: http://localhost:5173
API:      http://localhost:3000/api
MySQL:    localhost:3307 → 컨테이너 3306
```

## NestJS와 TypeORM 연결 흐름

```text
NestFactory.create(AppModule)
  → TypeOrmModule.forRootAsync()
      MySQL 연결 및 DataSource 등록
  → WarehouseModule
  → TypeOrmModule.forFeature([Warehouse])
      Repository<Warehouse> 등록
  → WarehouseService 생성자에 Repository 주입
  → WarehouseController 생성자에 WarehouseService 주입
```

`WarehouseService`에서 TypeORM Repository를 사용해 SQL 작업을 수행합니다.

```ts
repository.find()       // SELECT
repository.create()     // Entity 객체 생성, SQL은 실행하지 않음
repository.save()       // INSERT 또는 UPDATE
repository.findOneBy()  // 조건으로 한 건 SELECT
repository.delete()     // DELETE
```

## Warehouse 데이터 구조

| 필드 | DB 타입 | 설명 |
| --- | --- | --- |
| `warehouseId` | 자동 증가 숫자 | 창고 식별자 |
| `warehouseName` | `varchar(100)` | 창고 이름 |
| `location` | `varchar(200)` | 창고 위치 |
| `isSet` | `boolean` | 창고 사용 설정 여부 |

## API

| Method | Path | 기능 |
| --- | --- | --- |
| `GET` | `/api/warehouse` | 창고 목록 조회 |
| `POST` | `/api/warehouse` | 창고 생성 |
| `PATCH` | `/api/warehouse/:warehouseId` | 창고 위치 수정 |
| `DELETE` | `/api/warehouse/:warehouseId` | 창고 삭제 |
| `GET` | `/api/db-health` | DB 연결 상태 확인 |

### 창고 생성

```http
POST /api/warehouse
Content-Type: application/json
```

```json
{
  "warehouseName": "인천 제1 창고",
  "location": "인천 중구 1동",
  "isSet": true
}
```

### 창고 위치 수정

```http
PATCH /api/warehouse/1
Content-Type: application/json
```

```json
{
  "location": "인천 중구 2동"
}
```

### 창고 삭제

```http
DELETE /api/warehouse/1
```

## 생성 기능의 처리 순서

```text
1. WarehouseCreateForm이 useState로 입력값 관리
2. Form 제출 시 onCreate({ warehouseName, location, isSet }) 호출
3. Props로 받은 onCreate가 WarehousePage의 handleCreate 실행
4. handleCreate가 객체를 fetch body에 JSON으로 담아 POST 요청
5. Controller의 @Body()가 요청 본문을 createWarehouseDto로 받음
6. Service가 repository.create()로 Entity 객체 생성
7. repository.save()가 INSERT 실행
8. 성공 후 목록을 다시 조회하여 화면 갱신
```

## 프로젝트 구조

```text
warehouse/
├─ backend/
│  ├─ src/
│  │  ├─ warehouse/
│  │  │  ├─ dto/
│  │  │  │  ├─ create-warehouse.dto.ts
│  │  │  │  └─ update-warehouse.dto.ts
│  │  │  ├─ warehouse.controller.ts
│  │  │  ├─ warehouse.entity.ts
│  │  │  ├─ warehouse.module.ts
│  │  │  └─ warehouse.service.ts
│  │  ├─ app.module.ts
│  │  ├─ db-health.controller.ts
│  │  └─ main.ts
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ WarehouseCreateForm.tsx
│  │  │  └─ WarehouseTable.tsx
│  │  ├─ pages/
│  │  │  └─ WarehousePage.tsx
│  │  └─ types/
│  │     └─ warehouse.ts
│  └─ vite.config.ts
├─ docker-compose.yml
└─ package.json
```

## 실행 방법

### 준비 사항

- Node.js와 npm
- Docker Desktop 또는 Docker Engine

### 1. 저장소 복제 및 패키지 설치

```bash
git clone https://github.com/25252255/warehouse.git
cd warehouse
npm install
```

루트의 `postinstall` 스크립트가 `frontend`와 `backend` 패키지를 함께 설치합니다.

### 2. 백엔드 환경변수 생성

PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

기본 예제 값은 `docker-compose.yml`의 로컬 MySQL 설정과 일치합니다.

### 3. MySQL 실행

```bash
npm run db:up
```

### 4. 백엔드 실행

```bash
npm run dev:backend
```

### 5. 프론트엔드 실행

새 터미널에서 실행합니다.

```bash
npm run dev:frontend
```

브라우저에서 `http://localhost:5173`에 접속합니다.

### 6. MySQL 종료

```bash
npm run db:down
```

`db:down`은 컨테이너를 종료하지만 `mysql_data` 볼륨은 유지하므로 저장된 데이터는 남습니다.

## 주요 npm 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run db:up` | MySQL 컨테이너 실행 및 Health Check 대기 |
| `npm run db:down` | MySQL 컨테이너 종료 |
| `npm run db:logs` | MySQL 로그 확인 |
| `npm run dev:backend` | NestJS 개발 서버 실행 |
| `npm run dev:frontend` | React 개발 서버 실행 |
| `npm run build` | 백엔드와 프론트엔드 빌드 |
| `npm run test:backend` | 백엔드 테스트 실행 |

## Java Spring MVC와 비교

| NestJS | Spring Boot |
| --- | --- |
| `@Controller()` | `@RestController` |
| `@Injectable()` Service | `@Service` |
| `@Get()`, `@Post()` | `@GetMapping`, `@PostMapping` |
| `@Body()` | `@RequestBody` |
| `@Param()` | `@PathVariable` |
| TypeORM Entity | JPA Entity |
| `Repository<Warehouse>` | Spring Data JPA Repository |
| NestJS DI Container | Spring IoC Container |

## 학습한 핵심 개념

- TypeScript의 타입, 객체, 매개변수와 인자
- 함수 참조와 함수 호출의 차이
- `async`, `await`, `Promise`
- React Props를 이용한 부모·자식 컴포넌트 통신
- `useState`, `useEffect`, `useCallback`
- 컴포넌트 분리와 이벤트 처리
- NestJS의 Module, Controller, Service 구조
- 생성자 주입과 DI 컨테이너
- DTO, Entity, Repository의 역할 차이
- HTTP Method와 Path를 이용한 REST API 구성
- Docker 컨테이너와 `.env` 접속 정보의 역할 차이

## 현재 학습 단계에서 확인할 점

- 현재 `CreateWarehouseDto`에는 `location`이 없지만 프론트엔드는 `location`을 전송하고 Entity에는 해당 컬럼이 있습니다.
- 아직 전역 `ValidationPipe`와 `class-validator` 검증 데코레이터가 적용되지 않아 DTO 타입만으로 요청값이 검증되거나 불필요한 속성이 제거되지 않습니다.
- TypeORM의 `synchronize: true`는 학습용 설정입니다. 운영 환경에서는 `false`로 변경하고 Migration을 사용해야 합니다.
- 현재 Docker Compose는 MySQL만 실행합니다. React와 NestJS는 로컬 Node.js 환경에서 각각 실행합니다.
