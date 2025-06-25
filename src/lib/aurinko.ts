"use server";
import axios from "axios";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365",
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not found");
    }
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found in database");
    const params = new URLSearchParams({
      clientId: process.env.AURINKO_CLIENTID!,
      serviceType,
      scopes: "Mail.Read Mail.Send Mail.ReadWrite Mail.Drafts Mail.All",
      responseType: "code",
      returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
    });
    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
  } catch (error) {
    console.log("Error in getAurinkoAuthUrl:", error);
    throw new Error("Failed to generate Aurinko auth URL");
  }
};

//function to get the access tokenn from aurinko using the code
export const getAurinkoAccessToken = async (code: string)=>{
  try {
    const response = await axios.post(
      "https://api.aurinko.io/v1/auth/token",{},{
        auth:{
          username: process.env.AUTINKO_CLIENTID!,
          password: process.env.AURINKO_CLIENTSECRET!,
        }
      })
      return response.data as {
        accountId: number,
        accessToken:string,
        userId: string,
        userSession:string
      }
  } catch (error) {
    if(axios.isAxiosError(error)){
      console.error("Axios error in getAurinkoAccessToken:", error.response?.data);
      throw new Error(`Failed to get access token: ${error.response?.data}`);
    }
    console.error(error);
  }
}
