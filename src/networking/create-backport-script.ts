import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {axiosClient} from "@/networking/axios";

export function useCreateBackportScript(envToPromote: string, targetEnv: string) {
    return useMutation<Object, AxiosError>({
        mutationKey: ["create-backport-script"],
        mutationFn: async () =>  {
            const response = await axiosClient.post<Object>("/api/create-backport-script", {
                envToPromote,
                targetEnv
            });
            return response.data
        }
    });
}