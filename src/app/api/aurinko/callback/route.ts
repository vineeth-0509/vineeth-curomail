// api/aurinko/callback

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req:NextRequest) =>{
    const {userId} = await auth();
    if(!userId) return NextResponse.json({message:"Unauthorized"},{status: 401});
    const params = req.nextUrl.searchParams;
    const status = params.get("status");
    if(status !== "success"){
        return NextResponse.json({message:"Authorization failed"},{status: 400});
    }

    //get the code from the params to exchange for access token
    const code = params.get("code");
    if(!code) return NextResponse.json({message:"Code not found"},{status: 400});
    
    console.log("UserId is :", userId  );
    return NextResponse.json({message:"Hello world"});
}