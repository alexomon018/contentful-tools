"use client"

import {Button} from "@/components/Button";
import {useState} from "react";
import {
    useCreateMigrationEnvironment
} from "@/networking/create-migration-environment";
import {ErrorBox} from "@/components/ErrorBox";
import {useCreateMigrationScript} from "@/networking/create-migration-script";

export default function Page() {
    const {
        data: migrationResponse,
        mutate: createMigrationEnvironment,
        isPending: createMigrationEnvironmentIsPending,
        error: createMigrationEnvironmentError,
    } = useCreateMigrationEnvironment();

    const {
        data: scriptResponse,
        mutate: createMigrationScript,
        isPending: createMigrationScriptIsPending,
        error: createMigrationScriptError,
    } = useCreateMigrationScript();

    return (
        <div className="flex items-center justify-center w-full">
            <main className="page-container py-4">
                <h1>Create a migration</h1>
                <div>This will allow you to create a migration on a <b><u>Content Type/Content Model</u></b>. In other
                    words
                    to the Contentful schema. This is <b>not</b> changing any copy or imagery
                </div>
                <h2>What does this tool do?</h2>
                <ol>
                    <li>Creates a branch in this repo based on the given name</li>
                    <li>Create a Contentful environment with that given name</li>
                    <li>Waits for you to make changes in that environment</li>
                    <li>Creates the migration script - you can then create a PR!</li>
                </ol>
                <h2>Step 1:</h2>
                <MigrationNameForm isLoading={createMigrationEnvironmentIsPending}
                                   onSubmit={createMigrationEnvironment}/>
                {migrationResponse?.gitBranchCreated && <div>Git branch created</div>}
                {migrationResponse?.contentfulEnvUrl &&
                    <>
                        <div>Contentful Environment created</div>
                        <h2>Step 2: Now go do your content edits!</h2>
                        <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                           target="_blank"
                           href={migrationResponse.contentfulEnvUrl}>{migrationResponse.contentfulEnvUrl}</a>
                        <h2>Step 3: Made all your changes?</h2>
                        <p>If you've made all your changes, click here to generate the migration file</p>
                        <p>(If you click this by accident just delete the migration file and keep editing)</p>
                        <br/>
                        <Button onClick={() => createMigrationScript(migrationResponse?.envName)}
                                isLoading={createMigrationScriptIsPending}>Create Migration</Button>
                        {
                            scriptResponse && <div>
                                <p className="py-4">Congrats! You created a migration file: <a
                                    href={scriptResponse.filename}>{scriptResponse.filename}</a></p>
                                <h2>Step 4: Applying the change</h2>
                                <p>Commit this change and create a PR into the relevant environment branch (probably test).
                                    Once it's approved and merged bitbucket pipelines will apply the migration</p>

                            </div>
                        }
                    </>
                }
                {(createMigrationScriptError || createMigrationEnvironmentError || migrationResponse?.partialError) &&
                    <ErrorBox error={createMigrationScriptError || createMigrationEnvironmentError || migrationResponse?.partialError}/>
                }
            </main>
        </div>
    );
}

function MigrationNameForm({onSubmit, isLoading}: { onSubmit: (value: string) => void, isLoading: boolean }) {
    const [value, setValue] = useState('');
    const prefix = 'migration/';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const filtered = input.replace(/[^a-zA-Z0-9_-]/g, '');
        const truncated = filtered.slice(0, 30);

        setValue(truncated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(value)
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-[400px] flex flex-col gap-3">
            <label htmlFor="migration" className="">
                Enter the name of your migration:
            </label>
            <div className="flex align-center p-4 border rounded-2xl border-primary">
                <span style={{marginRight: 4, color: '#555'}}>{prefix}</span>
                <input
                    id="migration"
                    type="text"
                    value={value}
                    onChange={handleChange}
                    style={{flex: 1, border: 'none', outline: 'none'}}
                    placeholder="my_migration"
                />
            </div>
            <Button className="self-end" type="submit" isLoading={isLoading}>Continue</Button>
        </form>
    );
}