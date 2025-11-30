import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    dataset: 'production',
    projectId: 'rdpwtge4',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  },
})
