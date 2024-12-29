import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import path from 'path'
import { promises as fs } from 'fs'

export default class Repository extends BaseCommand {
  static commandName = 'make:repository'
  static description = 'Create a new repository class'

  static options: CommandOptions = {}

  @args.string({
    argumentName: 'name',
    description: 'Name of the repository'
  })
  declare name: string

  /**
   * Capitalize the first letter of the repository name
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  async run() {
    // Define paths
    const repositoryDir = path.join('./app/', 'repositories')
    const repositoryFile = path.join(repositoryDir, `${this.name}_repository.ts`)
    const repoName =  this.capitalizeFirstLetter(this.name)

    try {
      // Ensure the directory exists
      await fs.mkdir(repositoryDir, { recursive: true })

      // Check if the repository file already exists
      try {
        await fs.access(repositoryFile)
        this.logger.error(`Repository ${this.name} already exists at ${repositoryFile}. Skipping creation.`)
        return
      } catch (err) {
        // If the file doesn't exist, proceed with creation
        if (err.code !== 'ENOENT') {
          throw err
        }
      }

      // Repository file content
      const content = 
      `import ${repoName} from '#models/${this.name.toLowerCase()}'
     
export default class ${repoName}Repository {
}`
      
      // Write the repository file
      await fs.writeFile(repositoryFile, content, 'utf-8')

      this.logger.success(`Repository created: app/repositories/${this.name}_repository.ts`)
    } catch (error) {
      this.logger.error(`Failed to create repository: ${error.message}`)
    }
  }
}