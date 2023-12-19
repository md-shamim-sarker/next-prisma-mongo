# Next Prisma Mongo

1. npx create-next-app@latest
2. npm install prisma --save-dev
3. npx prisma init
4. /prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```
5. /.env
```env
DATABASE_URL="mongodb+srv://shamim-sarker:CY4XdDG06ii3Rm1k@cluster1.8nju2by.mongodb.net/prisma"
```
6. /prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  name      String?
  role      Role
  address   Address?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  slug      String    @unique
  title     String
  body      String
  authorId  String    @db.ObjectId
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  comment   String
  postId    String   @db.ObjectId
  post      Post     @relation(fields: [postId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

type Address {
  street String
  city   String
  state  String
  zip    String
}

enum Role {
  SuperAdmin
  Admin
  NormalUser
  Operator
}
```
7. Run this command
```bash
npx prisma db push
```
8. /src/app/api/user/route.ts
```ts
// http://localhost:5000/api/user

import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({msg: "success from get"});
    } catch (error) {
        return NextResponse.json({msg: "error"});
    }
}

export async function POST(req: Request) {
    try {
        return NextResponse.json({msg: "success from post"});
    } catch (error) {
        return NextResponse.json({msg: "error"});
    }
}
```
8. /src/app/api/user/[id]/route.ts
```ts
// http://localhost:5000/api/user/1

import { NextResponse } from "next/server";

export async function PUT(req: Request, context: any) {
    try {
        return NextResponse.json({msg: "success from put"});
    } catch (error) {
        return NextResponse.json({ msg: "error" });
    }
}

export async function DELETE(req: Request, context: any) {
    try {
        return NextResponse.json({msg: "success from delete"});
    } catch (error) {
        return NextResponse.json({ msg: "error" });
    }
}
```
9. /src/app/api/prisma.ts
```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient;
```
10. /src/app/api/user/route.ts (create function)
```ts
/*.....*/
export async function POST(req: Request) {
    try {
        const result = await prisma.user.create({
            data: {
                name: 'Rich',
                email: 'hello2@prisma.com',
                role: 'SuperAdmin',
                address: {
                    set: {
                        street: 'streat',
                        city: 'city',
                        state: 'state',
                        zip: '5510'
                    }
                },
                posts: {
                    create: {
                        title: 'My first post',
                        body: 'Lots of really interesting stuff',
                        slug: 'my-first-post 2',
                    },
                },
            },
        });
        return NextResponse.json({msg: "success from post", data: result});
    } catch (error) {
        return NextResponse.json({msg: "error"});
    }
}
/*.....*/
```
11. /src/app/api/user/route.ts (createMany function)
```ts
/*.....*/
export async function POST(req: Request) {
    try {
        const result = await prisma.user.createMany({
            data: [
                {
                    name: 'Rich',
                    email: 'hello4@prisma.com',
                    role: 'Admin',
                    address: {
                        set: {
                            street: 'streat',
                            city: 'city',
                            state: 'state',
                            zip: '5510'
                        }
                    }
                },
                {
                    name: 'Rich',
                    email: 'hello5@prisma.com',
                    role: 'Admin',
                    address: {
                        set: {
                            street: 'streat',
                            city: 'city',
                            state: 'state',
                            zip: '5510'
                        }
                    }
                },
                {
                    name: 'Rich',
                    email: 'hello6@prisma.com',
                    role: 'Admin',
                    address: {
                        set: {
                            street: 'streat',
                            city: 'city',
                            state: 'state',
                            zip: '5510'
                        }
                    }
                },
            ]
        });
        return NextResponse.json({msg: "success from post", data: result});
    } catch (error) {
        return NextResponse.json({msg: "error"});
    }
}
/*.....*/
```
12.  npx prisma studio
13.  /src/app/api/user/route.ts (create function using body)
```ts
/*.....*/
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = await prisma.user.create({
            data: body
        });
        return NextResponse.json({msg: "success from post", data: result});
    } catch (error) {
        return NextResponse.json({msg: "error", data: error});
    }
}
/*.....*/
```
14.   /src/app/api/user/route.ts (find function)
```ts
/*.....*/
export async function GET() {
    try {
        // const result = await prisma.user.findMany();

        /* const result = await prisma.user.findMany({
            where: { role: "SuperAdmin" },
            where: { name: {contains: "Md."} },
            select: {id: true, name: true}
            orderBy: { id: "asc" },
            skip: 2,
            take: 1
        }); */

        // const result = await prisma.user.findFirst();

        // const result = await prisma.user.findFirst({ orderBy: {id: 'desc'} });

       /*  const result = await prisma.user.findUnique({
            where: { id: '6581103f6c8fe69e260a4ea3'}
        }); */

        const result = await prisma.user.findMany({
            select: {
                id: true,
                address: { select: { city: true } },
                name: true
            }
        });

        return NextResponse.json({ msg: "success from get", data: result});
    } catch (error) {
        return NextResponse.json({msg: "error", data: error});
    }
}
/*.....*/
```
15.   /src/app/api/user/route.ts (update with searchParams)
```ts
/*.....*/
export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = String(searchParams.get('id'));
        const body = await req.json();
        const result = await prisma.user.update({
            where: { id },
            data: body
        });
        return NextResponse.json({ msg: "success from put", data: result });
    } catch (error) {
        return NextResponse.json({ msg: "error" });
    }
}
/*.....*/
```
16.    /src/app/api/user/route.ts (delete with searchParams)
```ts
/*.....*/
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = String(searchParams.get("id"));
        const result = await prisma.user.delete({
            where: {id}
        });
        return NextResponse.json({ msg: "success from delete", data: result });
    } catch (error) {
        return NextResponse.json({ msg: "error" });
    }
}
/*.....*/
```
17.    /src/app/api/user/[id]/route.ts (update using context params)
```ts
/*.....*/
export async function PUT(req: Request, context: any) {
    try {
        const id = context.params.id;
        const body = await req.json();
        const result = await prisma.user.update({
            where: { id },
            data: body
        });
        return NextResponse.json({ msg: "success from put", data: result });
    } catch (error) {
        return NextResponse.json({ msg: "error", data: error });
    }
}
/*.....*/
```
18. /src/app/api/user/[id]/route.ts (delete using context params)
```ts
/*.....*/
export async function DELETE(req: Request, context: any) {
    try {
        const id = context.params.id;
        const result = await prisma.user.delete({
            where: {id}
        });
        return NextResponse.json({ msg: "success from delete", data: result });
    } catch (error) {
        return NextResponse.json({ msg: "error", data: error });
    }
}
/*.....*/
```