// http://localhost:5000/api/user/1

import { NextResponse } from "next/server";
import { prisma } from "../../prisma";

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