import axios from "axios";
import type { EmailMessage, SyncResponse, SyncUpdatedResponse } from "./types";
export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync(daysWithin: number): Promise<SyncResponse> {
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );
    return response.data;
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    const params: Record<string, string> = {};
    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;
    const response = await axios.get<SyncUpdatedResponse>(
      "https://api.aurinko.io/v1/email/sync/updated",
      {
        params,
        headers:{Authorization:`Bearer ${this.token}`}
      },
    );
    return response.data;
  }

  async performEmailSync() {
    try {
      //start the sync process
      const daysWithin = 3;
      let syncResponse = await this.startSync(daysWithin);
      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        syncResponse = await this.startSync(daysWithin);
      }

      //get the bookmark delta token
      let storeDeltaToken: string = syncResponse.syncUpdatedToken;

      // get the email messages using the delta token
      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storeDeltaToken,
      });
      if (updatedResponse.nextDeltaToken) {
        //sync has completed
        storeDeltaToken = updatedResponse.nextDeltaToken;
      }
      let allEmails: EmailMessage[] = updatedResponse.records;
      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = allEmails.concat(updatedResponse.records);
        if (updatedResponse.nextDeltaToken) {
          //sync has ended
          storeDeltaToken = updatedResponse.nextDeltaToken;
        }
      }
      console.log(
        "intial sync completed, we have synced",
        allEmails.length,
        "emails",
      );
      //store the latest delta token for the future incremental syncs.
      return {
        emails: allEmails,
        deltaToken: storeDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during sync:",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error("Error during sync:", error);
      }
    }
  }
}
