// http://localhost:5000/api/user

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "../prisma";

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