import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {axiosClient} from "@/networking/axios";

export interface CreateMigrationEnvironmentResponse {
    envName: string;
    gitBranchCreated: boolean,
    contentfulEnvUrl: string | null,
    partialError: string | null
}

export function useCreateMigrationEnvironment() {
    return useMutation<CreateMigrationEnvironmentResponse, AxiosError, string>({
        mutationKey: ["create-migration-env"],
        mutationFn: async (migrationName: string) =>  {
            const response = await axiosClient.post<CreateMigrationEnvironmentResponse>("/api/create-migration-env", {
                migrationName
            });
            return response.data
        }
    });
}