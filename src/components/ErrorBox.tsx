import {AxiosError} from "axios";

export const ErrorBox = ({error}: { error: any | null }) => (
    <div>
        <p className="py-4">Something went wrong:</p>
        <div className="rounded-2xl border border-red-500 font-mono p-4">
            { error.toString() }
            <br/>
            {
                error?.response?.data ? JSON.stringify(error?.response?.data) : ""
            }
        </div>
    </div>
)