import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {axiosClient} from "@/networking/axios";

export function useApplyContentScript(sourceEnv: string, targetEnv: string, isBackport: boolean, script: string) {
    return useMutation<Object, AxiosError>({
        mutationKey: ["apply-content-script"],
        mutationFn: async () =>  {
            const response = await axiosClient.post<Object>("/api/apply-content-script", {
                sourceEnv,
                targetEnv,
                isBackport,
                script
            });
            return response.data
        }
    });
}