import axios from "axios";

export const makeGraphQlRequest = <T>(env: string, query: string) => {

    return axios.post<T>(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.SPACE_ID}/environments/${env}`,
        {
            query: query,
        },
        {
            headers: {
                "Authorization": `Bearer ${process.env.CDA_TOKEN}`
            }
        }
        )
}