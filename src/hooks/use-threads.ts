import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts';
import {atom, useAtom} from 'jotai';
export const threadAtom = atom<string | null>(null); 
const useThreads = () => {
    const {data: accounts} = api.account.getAcccount.useQuery();
    const [accountId] = useLocalStorage('accountId','');
    const [tab] = useLocalStorage('curomail-tab','inbox');
    const [done] =useLocalStorage('curomail-done',false);
    const[threadId, setThreadId] = useAtom(threadAtom);

    const {data: threads,isFetching,refetch} = api.account.getThreads.useQuery({
        accountId,
        tab,
        done
    },{
        enabled: !!accountId && !!tab, placeholderData: e => e,refetchInterval: 5000
    });

  return {
    threads,
    isFetching,
    refetch,
    accountId,
    threadId, setThreadId,
    account: accounts?.find(e => e.id === accountId)
  }
}

export default useThreads