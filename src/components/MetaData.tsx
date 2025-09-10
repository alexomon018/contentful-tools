"use client"

import {use, useEffect, useState} from "react";
import {useCheckProjectReady, CheckReadyResponse} from "@/networking/check-ready";
import {Dialog} from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import {ErrorBox} from "@/components/ErrorBox";

export const MetaData = () => {
    const {
        data: metaData,
        isLoading,
        error
    } = useCheckProjectReady();

    if (error) {
        return (
            <div className="p-4">
                <p>Please make sure you have set your SPACE_ID env var in your .env file<br/>and your CMA_TOKEN in your .env.local file</p>
                <ErrorBox error={error}/>
            </div>
        )
    }
    if (!metaData) return null;
    return (<div>
        <p><b>{metaData?.spaceName}</b></p>
        <p className="text-[10px]">SpaceId: {metaData?.spaceId}</p>
        <p className="text-[10px]">Token: {metaData?.accessToken}</p>
    </div>);
}