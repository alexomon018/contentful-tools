import {ContentfulMetaData} from "@/networking/generic-models";

import axios, {AxiosError} from 'axios';
import {useQuery} from "@tanstack/react-query";
import {axiosClient} from "@/networking/axios";

export interface CheckReadyResponse {
    spaceId: string;
    accessToken: string;
    spaceName: string;
}

export function useCheckProjectReady() {
    return useQuery<CheckReadyResponse, AxiosError>({
        queryKey: ["check-project-ready"],
        queryFn: async () =>  {
            const response = await axiosClient.get<CheckReadyResponse>('/api/check-ready');
            return response.data
        }
    });
}