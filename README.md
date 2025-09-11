# Apadmi Contentful Tools

**WARNING: This repo is not production ready and not ready for general consumption. It's provided as is and there's no guarantee of maintenance**

**The setup scripts have not been thoroughly tested and should be used with caution**

The following are the instructions for using this repo, for contributing see CONTRIBUTING.md.

## What is this project

This project aims to plug the gap in Contentful's out of the box offering, that being:

1. CMS as code: Contentful provides all the tools needed in SDKs and CLIs to support CMS as code but none of it "just works". This project pulls those pieces together.
2. Content promotions between environments: This just doesn't really work out of the box.

To achieve this, we use a web based front end since it's easier than scripts.

## Getting Started

(This only needs doing once, if you're reading this from an active project, skip to "Setup the web portal").

### Setup Contentful

1. Create all the environments you need. Remember you always need one environment slot free for migrations.
2. Install the merge app in all your environments https://www.contentful.com/developers/docs/tutorials/general/merge-app/ (you won't use the UI for it, but the script won't run without it)
3. Create a CMA (Content Management aka Access) Token
4. Create a CDA token (Content delivery token)
   - Your CDA token needs access to all environments (so have a separate one to the one you use for prod)

### Setup your repo

cd ..

1. Create a new repo to manage your Contentful environment
2. Clone this repo as a submodule i.e `git submodule add git@github.com:Apadmi-Engineering/contentful-tools.git`
3. Run the setup script _from the root of your new repo_: `./contentful-tools/scripts/setup.sh`
4. Fill in the environment variable templates created (.env and .env.local)
5. Enable bitbucket pipelines and add your CMA token as a secret with the key CMA_TOKEN.
6. Create branches for each of your environments of the form `contentful-environment/<env>`. This will be how you track the migrations applied to environments.

### Put it all together

Commit and push your changes lowest environment branch up. This should trigger the first migration (created for you) in bitbucket pipelines to set up the tracking.

## Setup the web portal

1. Navigate to the submodule `cd contentful-tools`;
2. Run `yarn install`. (Install `yarn` first if you need to https://yarnpkg.com/getting-started/install)
3. Run `yarn dev` and follow the instructions to launch the Webview.
4. If everything is set up correctly you should see your Contentful details in the top right.

## CMS as Code

This project adopts a CMS as code approach for our content model development. This method offers several advantages:

Version Control: Treating CMS configuration as code allows us to use git for tracking changes, collaborating, and easily
rolling back to previous versions. This ensures our CMS configuration remains consistent and manageable over time.

Reproducibility: CMS as Code enables us to replicate the CMS configuration across different environments, eliminating
discrepancies and maintaining consistency.

Automated Deployment: Integrating CMS configuration into the deployment pipeline automates the deployment process.
Changes to the CMS configuration can be automatically deployed to the target environment, saving time and reducing human error.

Infrastructure as Code: CMS as Code aligns with the broader Infrastructure as Code (IaC) concept, where infrastructure
components are defined and managed through code.

### This approach doesn't use gitflow

You should have a branch for each of your main environments in Contentful. So lets say we have the environments

- test
- pre-prod
- production

So to promote the content changes from test to preprod the process is:

1. Merge `contentful-environment/test` into `contentful-environment/pre-prod`
2. This should trigger a bitbucket pipeline job to update `pre-prod` with all the scripts now in that branch.

### Creating a Content Type migration

See above to launch the web tool and follow the on screen instructions to create a migration. It will

1. Create a git branch for your migration
2. Create a Contentful environment
3. Wait for you to make changes in your test environment
4. Create a migration script on disk
5. You can the commit and PR that change and merge it into the appropriate environment.

## Promoting Content

For Content promotions, select the relevant section in the web portal and follow the onscreen instructions.
