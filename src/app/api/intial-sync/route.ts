// /api/initial-sync.

import { Account } from "@/lib/account";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
  const { accountId, userId } = await req.json();
  if (!accountId || !userId) {
    return NextResponse.json({
      message: "Account Id or the userId is missing!",
    });
  }
  const dbAccount = await db.account.findUnique({
    where: {
      id: accountId,
      userId,
    },
  });
  if (!dbAccount) {
    return NextResponse.json(
      { message: "Account not found!" },
      { status: 404 },
    );
  }
  //perform initial sync of emails
  const account = new Account(dbAccount?.accessToken);
  const response = await account.performEmailSync();
  if (!response) {
    return NextResponse.json(
      { error: "failed to perform initial sync" },
      { status: 500 },
    );
  }
  const { emails, deltaToken } = response;
  console.log('emails', emails);
//   await db.account.update({
//     where: {
//       id: accountId,
//     },
//     data: {
//       nextDeltaToken: deltaToken,
//     },
//   });

//   await syncEmailToDatabase(email, dbAccount.id);
  console.log("Syn completed ", deltaToken);
  return NextResponse.json({success: true},{status: 200});
};

