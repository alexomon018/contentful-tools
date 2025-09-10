import Link from "next/link";

const OperationCard = (
    {
        title,
        body,
        route
    }: {
        title: string,
        body: React.ReactElement,
        route: string
    }) =>
    <div
        className="rounded-2xl border border-primary p-6 shadow-sm transition hover:shadow-md flex flex-col justify-between">
        <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-white mb-4">{body}</p>
        </div>
        <Link
            href={route}
            className="inline-block rounded-xl bg-primary px-4 py-2 text-black hover:bg-primary-dark transition self-end"
        >Start</Link>
    </div>

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <h1 className="px-6">Contentful Tools</h1>
                <div className="grid gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
                    <OperationCard title="Create migration" route="/create-migration" body={
                        (<>This is for migrating content <u><b>types</b></u>. So modifying the schema in Contentful</>)
                    }/>
                    <OperationCard title="Re-point Aliases" route="/create-migration" body={
                        (<>Re-point environment aliases - Coming soon!!</>)
                    }/>
                    <OperationCard title="Promote Content" route="/promote-content" body={
                        (<>Push Content from a lower environment to a higher environment</>)
                    }/>
                </div>
            </main>
        </div>
    );
}
