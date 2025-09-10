"use client"

import {useEffect, useState} from "react";
import {ErrorBox} from "@/components/ErrorBox";
import {Button} from "@/components/Button";
import {useCreateBackportScript} from "@/networking/create-backport-script";
import {useApplyContentScript} from "@/networking/apply-content-script";
import {useCreatePromotionScript} from "@/networking/create-promotion-script";

const EnvName = ({children}: { children: React.ReactElement | string }) => (
    <span className="font-mono text-primary">{children}</span>)

function ApplyContentScript({targetEnv, initialScript, onComplete, sourceEnv, isBackport}: {
    targetEnv: string,
    initialScript: string,
    onComplete: () => void,
    sourceEnv: string,
    isBackport: boolean,
}) {
    const [contentScript, setPromotionScript] = useState<string>(initialScript);

    const {
        data,
        mutate: applyContentScript,
        isPending,
        error,
    } = useApplyContentScript(sourceEnv, targetEnv, isBackport, contentScript ?? "");

    useEffect(() => {
        if (data) {
            onComplete();
        }
    }, [data])
    return (
        <>
            <div className="flex flex-col w-full">
                <textarea value={contentScript}
                          className="w-full bg-gray-600 rounded-md p-2"
                          rows={10}
                          onChange={(e) => setPromotionScript(e.target.value)}/>
                <div><Button className="my-4"
                        onClick={() => applyContentScript()}
                             isLoading={isPending}>Execute Script</Button></div>
                {data && <p>That worked!</p>}
                {error && <ErrorBox error={error}/>}
            </div>
        </>
    )
}


function Step4({envToPromote, targetEnv}: {
    envToPromote: string,
    targetEnv: string,
}) {
    const [promotionCompleted, setPromotionCompleted] = useState<boolean>(false);

    const {
        data: promotionScript,
        mutate: createPromotionScript,
        isPending,
        error,
    } = useCreatePromotionScript(envToPromote, targetEnv);

    return (
        <>
            <div className="flex flex-col w-full">
                <h2>Step 4: Create the promotion script | <EnvName>{envToPromote}</EnvName> -&gt; <EnvName>{targetEnv}</EnvName></h2>
                <div><Button className="my-4"
                        onClick={() => createPromotionScript()}
                             isLoading={isPending}>Create promotion script</Button></div>
                {
                    promotionScript &&
                <ApplyContentScript targetEnv={targetEnv}
                                    sourceEnv={envToPromote}
                                    isBackport={false}
                                    initialScript={JSON.stringify(promotionScript, null, 2)}
                                    onComplete={() => setPromotionCompleted(true)}/>
                }
                { promotionCompleted && <p>Promotion Complete! You're done!</p> }
                {error && <ErrorBox error={error}/>}
            </div>
        </>
    )
}


function Step3({envToPromote, targetEnv, initialBackportScript}: {
    envToPromote: string,
    targetEnv: string,
    initialBackportScript: string
}) {
    const [backportComplete, setBackportComplete] = useState<boolean>(false);
    return (
        <>
            <div className="flex flex-col w-full">
                <h2>Step 3: Review and execute backport</h2>
                <p>Below is your migration script. You can edit this if needed.<br/></p>
                <br/>
                <p>Remember we're backporting <EnvName>{targetEnv}</EnvName> to <EnvName>{envToPromote}</EnvName> here,
                    so this
                    will override changes in <EnvName>{envToPromote}</EnvName>. You may want to manually delete things
                    if correct version is in <EnvName>{envToPromote}</EnvName></p>
                <br/>

                <ApplyContentScript targetEnv={envToPromote}
                                    sourceEnv={targetEnv}
                                    isBackport={true}
                                    initialScript={initialBackportScript}
                onComplete={() => setBackportComplete(true)}/>
            </div>
            {
                backportComplete && <Step4 envToPromote={envToPromote}
                                           targetEnv={targetEnv}/>
            }
        </>
    )
}

function Step2({envToPromote, targetEnv}: { envToPromote: string, targetEnv: string | null }) {
    if (targetEnv == null || envToPromote == targetEnv) {
        return <ErrorBox error={"Check your environment progressions, something's wrong (duplicates?)"}/>
    }

    const {
        data: backportScript,
        mutate: createBackportScript,
        isPending,
        error,
    } = useCreateBackportScript(envToPromote, targetEnv);
    return (
        <>
            <h2>Step 2: Backport <EnvName>{targetEnv}</EnvName> to <EnvName>{envToPromote}</EnvName></h2>
            <p>Changes made to <EnvName>{targetEnv}</EnvName> since it diverged
                from <EnvName>{envToPromote}</EnvName> need to be backported otherwise you'll lose data.</p>
            <p><i>(Don't worry you can discard changes if you want to overwrite them)</i></p>
            <p><b>NOTE: Make sure your CDA token has permission to access all environemnts</b></p>
            <Button className="my-4"
                    onClick={() => createBackportScript()}
                    isLoading={isPending}>Create backport script</Button>
            {
                backportScript && <Step3 envToPromote={envToPromote}
                                         targetEnv={targetEnv}
                                         initialBackportScript={JSON.stringify(backportScript, null, 2)}/>
            }
            {error && <ErrorBox error={error}/>}
        </>
    );
}

export default function Page() {

    const [envToPromote, setEnvToPromote] = useState<string | null>(null);
    const environmentProgression = process.env.NEXT_PUBLIC_ENVIRONMENTS_PROGRESSION?.split(",") ?? [];
    const targetEnv = () => {
        try {
            return environmentProgression[environmentProgression.indexOf(envToPromote || "") + 1];
        } catch (error) {
            return null
        }
    }
    return (
        <div className="flex items-center justify-center w-full">
            <main className="page-container py-4">
                <h1>Promote content</h1>
                {environmentProgression.length == 0 && <ErrorBox
                    error={"Define an environment variable called NEXT_PUBLIC_ENVIRONMENTS_PROGRESSION with a list of your environments in progression order e.g dev,test,prod"}/>}
                <h2>Step 1: Choose your environment to promote</h2>
                <div>
                    <select name="select"
                            defaultValue="-"
                            value={envToPromote ?? undefined}
                            onChange={(it) => setEnvToPromote(it.target.value)}>
                        <option key="empty" disabled>-</option>
                        {environmentProgression.map(env => (
                            <option value={env}
                                    key={env}
                                    disabled={env == environmentProgression[environmentProgression.length - 1]}>{env}</option>))}
                    </select>
                </div>
                {
                    envToPromote && <Step2 envToPromote={envToPromote}
                                           targetEnv={targetEnv()}/>
                }
            </main>
        </div>
    );
}
