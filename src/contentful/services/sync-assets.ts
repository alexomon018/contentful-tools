import {Environment, Space} from "contentful-management";
import {makeGraphQlRequest} from "@/contentful/services/graphql";
import {traverseJson} from "@/contentful/utils/json-utils";
import {delay} from "@/contentful/utils/utils";
import {logger} from "@/contentful/services/logger-provider";

export const syncAssets = async (
    sourceEnv: Environment,
    targetEnv: Environment,
    script: string
): Promise<void> => {
    const items = JSON.parse(script).items;

    if (!items) {
        throw Error("No items found in migration script")
    }

    const assetIds = traverseJson(
        items, (key, value) =>
            key == "sys"
            && value != null
            && (value as any).linkType == "Asset"
            && (value as any).id != null
    ).map((it) => (it as any).id as string);

    const assetIdsAlreadyInTargetEnv = await getExistingAssetIds(targetEnv, assetIds);
    const assetIdsToTransfer = [...new Set(assetIds).difference(new Set(assetIdsAlreadyInTargetEnv))];

    if (assetIdsToTransfer.length == 0) {
        logger.info("No assets to transfer, skipping");
        return ;
    }

    logger.debug(`Assets already in target ${assetIdsAlreadyInTargetEnv}`);
    logger.debug(`Assets to transfer ${assetIdsToTransfer}`);
    logger.info(`Transferring ${assetIdsToTransfer.length} assets`)
    for (const assetId of assetIdsToTransfer) {
        logger.info(`Creating asset ${assetId}`)
        const sourceAsset = await sourceEnv.getAsset(assetId);

        const newAsset = await targetEnv
            .createAssetWithId(assetId, sourceAsset).catch((e) => {
                // Might be that the asset already exists in draft form, so check that
                logger.info(`Failed to create asset: ${assetId}. Checking if it already exists:`);
                return targetEnv.getAsset( assetId);
            });
        await newAsset.publish();

        await delay(300) // Avoid contentful rate limits
    }
}

// Returns a subset of the given assetIDs that exist in the given environemnt
async function getExistingAssetIds(env: Environment, assetIds: string[]): Promise<string[]> {
    const result = await makeGraphQlRequest<{
        data: {
            assetCollection: {
                items: [{
                    sys: {
                        id: string
                    }
                }]
            }
        }
    }>(env.name, `
        query {
          assetCollection(where: { sys: { id_in: ${JSON.stringify(assetIds)} } }) {
            items {
              sys {
                id
              }
            }
          }
        }
        `
    );

    return result.data.data.assetCollection.items.map(item => item.sys.id);
}
