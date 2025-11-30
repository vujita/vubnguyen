import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  dataset: 'production',
  name: 'default',

  plugins: [structureTool(), visionTool()],
  projectId: 'rdpwtge4',

  schema: {
    types: schemaTypes,
  },

  title: 'vubnguyen',
})
