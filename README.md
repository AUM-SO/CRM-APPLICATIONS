# EXO CRM Application

ระบบ CRM แบบ full-stack ที่พัฒนาด้วย Next.js และ NestJS ภายใต้ monorepo ที่ใช้ Bun ในการจัดการแพ็กเกจและรันคำสั่งต่าง ๆ

README นี้สรุปสิ่งสำคัญที่ต้องรู้เพื่อเริ่มใช้งานโปรเจกต์ได้เร็วที่สุด ได้แก่

- วิธีติดตั้งระบบ
- วิธีรันระบบ
- เทคโนโลยีที่ใช้
- โครงสร้างและพฤติกรรมของ Backend/API
- วิธีสร้าง mock data
- สมมติฐานและข้อจำกัดของระบบ

---

## ภาพรวมระบบ

โปรเจกต์นี้แบ่งออกเป็น 2 ส่วนหลัก

- Frontend อยู่ที่ `apps/web` พัฒนาด้วย Next.js
- Backend อยู่ที่ `apps/api` พัฒนาด้วย NestJS

การทำงานหลักคือ

1. ผู้ใช้เข้าใช้งานหน้าเว็บจากฝั่ง Frontend
2. Frontend เรียก API ผ่าน route proxy ของตัวเอง
3. Proxy จะส่งต่อ request ไปยัง NestJS API
4. Backend ตอบกลับข้อมูลลูกค้าและข้อมูลสำหรับเข้าสู่ระบบ

ระบบนี้ใช้ข้อมูลจำลองในหน่วยความจำ ไม่ได้เชื่อมต่อฐานข้อมูลจริง

---

## เทคโนโลยีที่ใช้

### Monorepo และเครื่องมือหลัก

| เครื่องมือ | เวอร์ชัน |
| ---------- | -------- |
| Bun | 1.3.9 |
| Turborepo | 2.8.17 |
| TypeScript | 5.9.3 |

### Frontend `apps/web`

| เทคโนโลยี | เวอร์ชัน |
| ---------- | -------- |
| Next.js (Turbopack) | 16.1.6 |
| React | 19.2.4 |
| Tailwind CSS | 4.1.18 |
| shadcn/ui + Radix UI | - |
| Lucide React | 1.8.0 |

### Backend `apps/api`

| เทคโนโลยี | เวอร์ชัน |
| ---------- | -------- |
| NestJS | 10.4.15 |
| class-validator / class-transformer | 0.14 / 0.5 |
| Nodemon + ts-node | 3.1 / 10.9 |

### Shared Packages `packages/`

- `packages/ui` สำหรับ shared UI components
- `packages/typescript-config` สำหรับ shared TypeScript config
- `packages/eslint-config` สำหรับ shared ESLint config

---

## วิธีติดตั้ง (Setup)

### สิ่งที่ต้องมีในเครื่องก่อน

- Bun เวอร์ชัน 1.3 ขึ้นไป
- Node.js เวอร์ชัน 20 ขึ้นไป

ดาวน์โหลด Bun ได้จาก <https://bun.sh>

### ขั้นตอนติดตั้ง

```bash
git clone <repo-url>
cd CRM-APPLICATIONS
bun install
```

คำสั่ง `bun install` จะติดตั้ง dependency ทั้งหมดของ monorepo รวมถึงฝั่ง frontend, backend และ shared packages

### การตั้งค่า Environment Variables

สร้างไฟล์ `apps/web/.env.local` แล้วใส่ค่า:

```bash
NEST_API_URL=http://localhost:4000/api
```

สำหรับฝั่ง backend สามารถกำหนด environment variable เพิ่มได้ ถ้าไม่กำหนดจะใช้ค่า default ดังนี้

```bash
PORT=4000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## วิธีรันระบบ

### รันทั้งระบบพร้อมกัน

```bash
bun run dev
```

คำสั่งนี้จะรันทั้ง frontend และ backend พร้อมกันผ่าน Turbo

| ส่วนของระบบ | URL |
| ------------ | --- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |

### รันแยกทีละส่วน

```bash
bun run dev:web
bun run dev:api
```

- `bun run dev:web` ใช้รัน Next.js อย่างเดียว
- `bun run dev:api` ใช้รัน NestJS อย่างเดียว

### คำสั่งสำหรับ build

```bash
bun run build
bun run build:web
bun run build:api
```

### คำสั่งที่ใช้บ่อยอื่น ๆ

```bash
bun run lint
bun run format
bun run typecheck
```

---

## อธิบาย Backend/API

### Base URL

Backend ให้บริการที่:

```text
http://localhost:4000/api
```

### รูปแบบ response กลางของระบบ

response ปกติจะถูกห่อด้วยโครงสร้างมาตรฐานแบบนี้

```json
{
  "statusCode": 200,
  "data": {},
  "timestamp": "2026-04-17T10:00:00.000Z"
}
```

ตัวอย่าง response กรณีเกิด error

```json
{
  "statusCode": 404,
  "timestamp": "2026-04-17T10:00:00.000Z",
  "path": "/api/customers/999",
  "message": "Customer with id 999 not found"
}
```

### Authentication

ระบบมี endpoint สำหรับ login ดังนี้

| Method | Endpoint | หน้าที่ |
| ------ | -------- | ------- |
| `POST` | `/api/login` | รับ email และ password เพื่อเข้าสู่ระบบ |

ตัวอย่าง request body

```json
{
  "email": "user@example.com",
  "password": "anypassword"
}
```

ตัวอย่าง response

```json
{
  "access_token": "mock-token-...",
  "user": {
    "email": "user@example.com",
    "name": "CRM User"
  }
}
```

หมายเหตุสำคัญ:

- ระบบ login นี้เป็น mock
- ถ้า email และ password ไม่ว่าง จะถือว่า login สำเร็จ
- ยังไม่มีการตรวจสอบผู้ใช้จริงจากฐานข้อมูล

### การทำงานของ Frontend Proxy

ฝั่ง Next.js มี API route สำหรับเป็นตัวกลางก่อนส่ง request ไปที่ backend จริง โดยมีหน้าที่หลักดังนี้

- รับ request จากหน้าเว็บ
- ดึง token จาก cookie
- ใส่ `Authorization: Bearer <token>` ให้โดยอัตโนมัติ
- ส่งต่อ request ไปยัง NestJS API

route ที่เกี่ยวข้องมีดังนี้

| Route | หน้าที่ |
| ----- | ------- |
| `POST /api/login` | proxy ไป backend แล้วเซ็ต cookie `crm_token` |
| `POST /api/logout` | ลบ cookie `crm_token` |
| `ANY /api/[...path]` | proxy request อื่น ๆ ไปยัง backend |

### Customers API

endpoint ที่เกี่ยวข้องกับข้อมูลลูกค้ามีดังนี้

| Method | Endpoint | หน้าที่ |
| ------ | -------- | ------- |
| `GET` | `/api/customers` | ดึงรายการลูกค้าแบบแบ่งหน้า |
| `GET` | `/api/customers/:id` | ดึงข้อมูลลูกค้ารายคน |

query parameters ของ `GET /api/customers`

| Parameter | Type | ค่าเริ่มต้น | คำอธิบาย |
| --------- | ---- | ----------- | --------- |
| `page` | number | `1` | เลขหน้าที่ต้องการ |
| `limit` | number | `20` | จำนวนรายการต่อหน้า สูงสุด 100 |
| `search` | string | - | ค้นหาจากชื่อบริษัท ชื่อลูกค้า หรือ salesperson |
| `sortBy` | string | - | เรียงตาม `name`, `total_spend`, `number_of_purchases`, `status`, `last_activity` |
| `order` | string | - | ลำดับ `asc` หรือ `desc` |

ตัวอย่าง response ของรายการลูกค้า

```json
{
  "data": [],
  "total": 1000,
  "page": 1,
  "limit": 20,
  "totalPages": 50
}
```

โครงสร้างข้อมูลลูกค้าโดยสรุป

```typescript
{
  id: number
  name: string
  company: string
  initials: string
  active_since: string
  email: string
  phone: string
  salesperson: string
  credit_status: string
  status: string
  total_spend: number
  number_of_purchases: number
  last_activity: string
  recent_activity: Array<{
    action: string
    time: string
  }>
}
```

---

## อธิบายการสร้าง Mock Data

ระบบนี้ไม่ใช้ฐานข้อมูลจริง แต่สร้างข้อมูลลูกค้าแบบจำลองขึ้นมาใน memory

ตำแหน่งของโค้ดที่เกี่ยวข้องอยู่ที่:

`apps/api/src/shared/mock-data/`

### หลักการทำงาน

1. ตอน backend เริ่มทำงาน ระบบจะสร้างข้อมูลลูกค้า 1,000 รายการ
2. ข้อมูลทั้งหมดจะถูกเก็บไว้ในหน่วยความจำของแอป
3. เมื่อมีการค้นหา เรียงลำดับ หรือแบ่งหน้า ระบบจะทำงานกับ array นี้โดยตรง

### ทำไมข้อมูลถึงเหมือนเดิมทุกครั้งที่เปิดระบบ

โปรเจกต์นี้ใช้ seeded random generator คือ Mulberry32 โดยกำหนด seed = 42

ผลลัพธ์คือ

- ทุกครั้งที่เริ่มระบบใหม่ จะได้ชุดข้อมูลเดิม
- เหมาะกับการทดสอบ เพราะข้อมูล reproducible
- ไม่ต้องพึ่งฐานข้อมูลภายนอก

### ข้อมูลที่ระบบสร้างให้

ระบบจะสุ่มข้อมูลสำคัญ เช่น

| Field | รายละเอียด |
| ----- | ---------- |
| `name` | สุ่มจากชุดชื่อและนามสกุล |
| `company` | สุ่มจากชุดชื่อบริษัท |
| `email` | สร้างจากชื่อและบริษัท |
| `phone` | เบอร์โทรรูปแบบไทย |
| `salesperson` | สุ่มจากรายชื่อ salesperson |
| `status` | Active, Inactive, Pending |
| `credit_status` | Good, No, Bad, Excellent Credit |
| `total_spend` | สุ่มยอดใช้จ่าย |
| `number_of_purchases` | สุ่มจำนวนครั้งที่ซื้อ |
| `active_since` | วันที่เริ่มเป็นลูกค้า |
| `last_activity` | วันเวลาที่มีกิจกรรมล่าสุด |
| `recent_activity` | รายการกิจกรรมล่าสุดย้อนหลัง |

---

## สมมติฐาน ข้อจำกัด และ Trade-offs

ข้อสมมติฐานและข้อจำกัดหลักของระบบนี้มีดังนี้

1. การเข้าสู่ระบบเป็นแบบ mock เท่านั้น แค่กรอก email และ password ที่ไม่ว่างก็ผ่าน
2. ไม่มีฐานข้อมูลจริง ข้อมูลทั้งหมดอยู่ใน memory
3. ไม่มีการบันทึกข้อมูลถาวร ปิด backend แล้วข้อมูลจะถูกสร้างใหม่
4. token ที่ได้ไม่ใช่ JWT จริง ไม่มีการ verify และไม่มีระบบหมดอายุ
5. ปุ่ม Google Sign-In เป็นเพียง UI placeholder ยังไม่ได้เชื่อม OAuth
6. CORS ถูกตั้งไว้สำหรับ localhost เป็นหลัก ถ้าจะใช้โดเมนอื่นต้องแก้ `CORS_ORIGINS`
7. ระบบมีแค่การอ่านข้อมูลลูกค้า ยังไม่มี create, update, delete
8. รูปแบบเบอร์โทรเป็นเบอร์ไทยโดยสมมติ
9. มูลค่า `total_spend` ใช้สกุลเงินบาท
10. API จำกัด `limit` สูงสุดที่ 100 รายการต่อครั้ง
11. การตั้งชื่อผู้ใช้หลัง login ใช้ส่วนหน้าของ email แทน profile จริงของผู้ใช้
12. การค้นหา เรียงลำดับ และแบ่งหน้า ทำงานใน application layer กับข้อมูลใน memory ไม่ได้อิงพฤติกรรมของ database จริง
13. หาก deploy หลาย instance ข้อมูลในแต่ละ instance จะไม่แชร์สถานะร่วมกัน เพราะไม่มี storage กลาง
14. ชุดข้อมูล mock ถูกออกแบบมาเพื่อ demo การแสดงผลและ flow การใช้งาน ไม่ได้สะท้อน edge case ของข้อมูล production ครบทุกแบบ

### Trade-offs ที่เลือกใช้ในโปรเจกต์นี้

1. โปรเจกต์เลือกใช้ mock authentication เพื่อให้สามารถพัฒนาและทดสอบ flow การเข้าสู่ระบบได้อย่างรวดเร็ว แต่แนวทางนี้ยังไม่รองรับการยืนยันตัวตนและการกำหนดสิทธิ์สำหรับการใช้งานจริง
2. โปรเจกต์ใช้ Next.js API route ร่วมกับ `httpOnly` cookie เพื่อช่วยจัดการ token อย่างเป็นระบบและลดการเปิดเผยข้อมูลสำคัญบน client-side แต่ทำให้โครงสร้างการรับส่ง request และการตรวจสอบปัญหามีความซับซ้อนเพิ่มขึ้น
3. โปรเจกต์เลือกใช้ in-memory mock data แทนฐานข้อมูลจริง เพื่อลดความซับซ้อนของการติดตั้งและทำให้เริ่มต้นใช้งานได้ทันที แต่ไม่รองรับการทดสอบด้าน persistence, transaction และประสิทธิภาพของ query ในสภาพแวดล้อมจริง
4. โปรเจกต์ใช้ seeded random data เพื่อให้ข้อมูลที่สร้างขึ้นมีความคงที่และตรวจสอบซ้ำได้ง่าย ซึ่งเหมาะกับการสาธิตและการทดสอบ แต่มีข้อจำกัดด้านความหลากหลายของข้อมูลเมื่อเทียบกับระบบ production
5. โปรเจกต์แยก frontend และ backend ออกเป็นคนละแอปภายใน monorepo เพื่อให้โครงสร้างระบบชัดเจนและรองรับการขยายในอนาคตได้ดีขึ้น แต่ต้องดูแลการตั้งค่า environment, port และการเชื่อมต่อระหว่างบริการให้สอดคล้องกันตลอดเวลา

---

## สรุปสั้น ๆ

ถ้าต้องการเริ่มใช้งานโปรเจกต์นี้แบบเร็วที่สุด ให้ทำตามลำดับนี้

1. ติดตั้ง Bun และ Node.js
2. รัน `bun install`
3. สร้างไฟล์ `apps/web/.env.local`
4. รัน `bun run dev`
5. เปิดเว็บที่ `http://localhost:3000`

โปรเจกต์นี้เหมาะสำหรับใช้เป็นตัวอย่างระบบ CRM แบบ full-stack ที่มี frontend, backend, proxy API และ mock dataset ครบสำหรับการพัฒนาและทดสอบเบื้องต้น
