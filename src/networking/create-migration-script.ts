import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {axiosClient} from "@/networking/axios";

export interface CreateMigrationScriptResponse {
    filename: string
}

export function useCreateMigrationScript() {
    return useMutation<CreateMigrationScriptResponse, AxiosError, string>({
        mutationKey: ["create-migration-script"],
        mutationFn: async (envName: string) =>  {
            const response = await axiosClient.post<CreateMigrationScriptResponse>("/api/create-migration-script", {
                envName
            });
            return response.data
        }
    });
}