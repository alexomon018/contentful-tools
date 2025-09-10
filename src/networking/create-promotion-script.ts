import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import { axiosClient } from "./axios";

export function useCreatePromotionScript(envToPromote: string, targetEnv: string) {
    return useMutation<Object, AxiosError>({
        mutationKey: ["create-promotion-script"],
        mutationFn: async () =>  {
            const response = await axiosClient.post<Object>("/api/create-promotion-script", {
                envToPromote,
                targetEnv
            });
            return response.data
        }
    });
}